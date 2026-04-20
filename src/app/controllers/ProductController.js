import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { uploadMultipleImages } from '../../utils/uploadToSupabase.js';
import { deleteMultipleImages } from '../../utils/deleteFromSupabase.js';


function sanitizeImages(images) {
  try {
    if (typeof images === 'string') {
      images = JSON.parse(images);
    }

    if (!Array.isArray(images)) return [];

    return images
      .map((img) => {
        if (typeof img === 'string') {
          return {
            full: img || null,
            medium: img || null,
            thumb: img || null,
          };
        }

        if (typeof img === 'object' && img !== null) {
          const full = img.full || img.url || null;

          return {
            full,
            medium: img.medium || full,
            thumb: img.thumb || full,
          };
        }

        return null;
      })
      .filter((img) => img && img.full); // 🔥 REMOVE imagens inválidas
  } catch {
    return [];
  }
}

class ProductController {
async store(request, response) {
  const schema = Yup.object({
    name: Yup.string().required(),
    price: Yup.number().required(),
    category_id: Yup.number().required(),
    offer: Yup.boolean(),
  });

  try {
    schema.validateSync(request.body, { abortEarly: false });

    const user = await User.findByPk(request.userId);

    if (!user || !user.admin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    console.log('BODY:', request.body);
    console.log('FILES:', request.files);

    if (!request.files || request.files.length === 0) {
      return response.status(400).json({
        error: 'A imagem é obrigatória',
      });
    }

    if (request.files.length > 5) {
      return response.status(400).json({
        error: 'Maximum of 5 images per product',
      });
    }

    const imageUrls = await uploadMultipleImages(request.files);

    console.log('IMAGE URLS:', imageUrls);

    const formattedImages = sanitizeImages(imageUrls);

    const product = await Product.create({
      ...request.body,
      images: formattedImages,
    });

    return response.status(201).json(product);

  } catch (error) {
    console.log('❌ ERRO REAL:', error);
    return response.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}

  async deleteImage(request, response) {
    const { id } = request.params;
    const { imageUrl } = request.body;

    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(400).json({
        error: 'Make sure your product ID is correct',
      });
    }

    const user = await User.findByPk(request.userId);

    if (!user || !user.admin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    let imageUrls = sanitizeImages(product.images);

    const updatedImages = imageUrls.filter((img) => {
      if (typeof img === 'string') return img !== imageUrl;
      return img.full !== imageUrl;
    });

    // remove do supabase
    await deleteMultipleImages([imageUrl]);

    // salva no banco
    await product.update({
      images: updatedImages,
    });

    return response.json({
      message: 'Image deleted successfully',
      images: updatedImages,
    });
  }

  async delete(request, response) {
    const { id } = request.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(400).json({
        error: 'Make sure your product ID is correct',
      });
    }

    const user = await User.findByPk(request.userId);

    if (!user || !user.admin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    const imageUrls = product.images || [];

    if (imageUrls.length > 0) {
      await deleteMultipleImages(imageUrls);
    }

    await product.destroy();

    return response.json({ message: 'Product deleted successfully' });
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { id } = request.params;

    const product = await Product.findByPk(id);

    if (!product) {
      return response.status(400).json({
        error: 'Make sure your product ID is correct',
      });
    }

    const user = await User.findByPk(request.userId);

    if (!user || !user.admin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    let imageUrls = sanitizeImages(product.images);


    if (request.files?.length) {
      if (imageUrls.length + request.files.length > 5) {
        return response.status(400).json({
          error: 'Maximum of 5 images per product',
        });
      }

      const newImages = await uploadMultipleImages(request.files);

      imageUrls = sanitizeImages([...imageUrls, ...newImages]);
    }

    await product.update({
      ...request.body,
      images: imageUrls,
    });

    return response.json(
      await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      }),
    );
  }

  async index(request, response) {
    const products = await Product.findAll({
      order: [['id', 'DESC']],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    const formattedProducts = products.map(product => {
  const productJson = product.toJSON();

  let images = [];

 images = sanitizeImages(productJson.images);

  return {
    ...productJson,
    images,
   image: images.find(img => img.full)?.full || null,
    currencyValue: (productJson.price / 100).toFixed(2),
  };
});

    return response.json(formattedProducts);
  }
}

export default new ProductController();

  

