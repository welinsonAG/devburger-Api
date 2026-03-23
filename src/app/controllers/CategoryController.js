import * as Yup from 'yup';
import Category from '../models/Category.js';
import User from '../models/User.js';
import { uploadMultipleImages } from '../../utils/uploadToSupabase.js';
class CategoryController {
  async index(req, res) {
    try {
      const categories = await Category.findAll({
        order: [['id', 'ASC']],
      });

    

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to load categories' });


    }
  }

async store(request, response) {
  console.log('BODY:', request.body);
  const schema = Yup.object({
    name: Yup.string().required(),
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

  const { name } = request.body;

  const categoryExists = await Category.findOne({
    where: { name },
  });

  if (categoryExists) {
    return response.status(400).json({ error: 'Category already exists' });
  }

  let imageUrl = null;

  if (request.file) {
    try {
      const [image] = await uploadMultipleImages([request.file]);

      console.log('UPLOAD RESULT:', image);

      imageUrl = image.full;
    } catch (error) {
      console.error('UPLOAD ERROR:', error);
      return response.status(500).json({ error: 'Upload failed' });
    }
  }

  try {
    const category = await Category.create({
      name,
      path: imageUrl,
    });

    console.log('CATEGORY CREATED:', category);

    return response.status(201).json(category);
  } catch (error) {
    console.error('SEQUELIZE ERROR:', error);
    return response.status(500).json({
      error: error.message,
      details: error.parent,
    });
  }
}
  
  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
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

    const { id } = request.params;
    const categoryExists = await Category.findByPk(id);

    if (!categoryExists) {
      return response.status(400).json({ message: 'Make sure your category ID is correct' });
    }

    const { name } = request.body;
    const { file } = request;

    if (name) {
      const categoryNameExists = await Category.findOne({ where: { name } });

      if (
        categoryNameExists &&
        String(categoryNameExists.id).trim() !== String(id).trim()
      ) {
        return response.status(400).json({ error: 'Category already exists' });
      }
    }

    const dataToUpdate = {};
   
    if (file) {
      const [image] = await uploadMultipleImages([file]);

      dataToUpdate.path = image.full;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return response.status(400).json({ error: 'No data provided to update' });
    }

    try {
      await Category.update(dataToUpdate, { where: { id } });
    } catch (error) {
      return response.status(500).json({ error: 'Database update failed' });
    }

    return response.status(200).json({ message: 'Category updated successfully' });
  }
}

export default new CategoryController();
