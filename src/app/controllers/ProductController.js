import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { uploadMultipleImages } from '../../utils/uploadToSupabase.js';
import { deleteMultipleImages } from '../../utils/deleteFromSupabase.js';
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
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const user = await User.findByPk(request.userId);

    if (!user || !user.admin) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

   
    if (request.files && request.files.length > 5) {
  return response.status(400).json({
    error: 'Maximum of 5 images per product',
  });
}

 let imageUrls = [];

 if (request.files && request.files.length > 0) {
  imageUrls = await uploadMultipleImages(request.files);
}
    const product = await Product.create({
      ...request.body,
      images: imageUrls,
    });

    return response.status(201).json(product);
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

  let imageUrls = product.images || [];

  if (!imageUrls.includes(imageUrl)) {
    return response.status(400).json({
      error: 'Image not found in this product',
    });
  }

  // remove da lista
  const updatedImages = imageUrls.filter(img => img !== imageUrl);

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


  async update(request, response) {
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

    let imageUrls = product.images || [];
 

if (request.files && request.files.length > 0) {

  if (imageUrls.length + request.files.length > 5) {
    return response.status(400).json({
      error: 'Maximum of 5 images per product',
    });
  }

  const newImages = await uploadMultipleImages(request.files);
  imageUrls = [...imageUrls, ...newImages];
}
    await product.update({
      ...request.body,
      images: imageUrls,
    });

    return response.json(product);
  }


  async index(request, response) {
    const products = await Product.findAll({
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

      return {
        ...productJson,
        currencyValue: (productJson.price / 100).toFixed(2),
      };
    });

    return response.status(200).json(formattedProducts);
  }

}

export default new ProductController();