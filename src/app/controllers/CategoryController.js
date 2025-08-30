import * as Yup from 'yup';
import Category from '../models/Category';
import User from '../models/User';

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

    const { filename: path } = request.file;
    const { name } = request.body;

    const categoryExists = await Category.findOne({
      where: { name },
    });

    if (categoryExists) {
      return response.status(400).json({ error: 'Category already exists' });
    }

    const { id } = await Category.create({ name, path });

    return response.status(201).json({ id, name });
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
    if (name) dataToUpdate.name = name;
    if (file) dataToUpdate.path = file.filename;

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
