import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js'
import User from '../models/User.js';

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

     const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }


    const path = request.file?.filename || null;

    const { name, price, category_id, offer} = request.body;

    const product = await Product.create({
      name,
      price,
      category_id,
      offer,
       path,
    });

    return response.status(201).json(product);
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

     const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const {id} = request.params;

    const product = await Product.findByPk(id);

    if (! product){
      return response.status(400).json({ error: 'Make sure your product ID is correct'})
    }

    let path;
    if (request.file){
      path = request.file.filename
    }

    const { name, price, category_id, offer} = request.body;

   await Product.update({
      name,
      price,
      category_id,
      path,
      offer,
    },
  {
  where: {
  id,
}
  },
);

    return response.status(201).json(product);

}   
async updateImage(request, response) {
  const { admin: isAdmin } = await User.findByPk(request.userId);

  if (!isAdmin) {
    return response.status(401).json();
  }

  const { id } = request.params;

  const product = await Product.findByPk(id);

  if (!product) {
    return response.status(400).json({
      error: 'Make sure your product ID is correct',
    });
  }

  if (!request.file) {
    return response.status(400).json({
      error: 'Image is required',
    });
  }

  await Product.update(
    { path: request.file.filename },
    { where: { id } }
  );

  return response.json({
    message: 'Image updated successfully',
  });
}


  
  async index(request, response) {
    const products = await Product.findAll({
      include: [ {  
        model: Category,
        as : 'category',
        attributes: ['id', 'name', 'path' ]
        }
      ]
    });

  const productsWithUrl = products.map(product => {
    const productJson = product.toJSON();

    if (productJson.path) {
      productJson.url = `http://localhost:3001/product-file/${productJson.path}`;
    }
    
    if (productJson.category) {
      productJson.category.url = `http://localhost:3001/category-file/${productJson.category.path}`;
    }

    return {
      ...productJson,
      currencyValue: (productJson.price / 100).toFixed(2)  
    };
  });
    return response.status(200).json(productsWithUrl);
  }
}

export default new ProductController();
