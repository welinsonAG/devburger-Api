import * as Yup from 'yup';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import User from '../models/User.js';


class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          }),
        ),
    });
     
 
    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;

    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
      where: {
        id: productsIds,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });

    const formattedProducts = findProducts.map((product) => {
      const productIndex = products.findIndex((item) => item.id === product.id);

      const newProduct = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.image?.full ||
        product.images?.[0]?.full ||
        product.images?.[0]?.medium ||
        product.images?.[0]?.thumb || null,
        quantity: products[productIndex].quantity,
      };
      return newProduct;
    });

    const order = {
      user_data: {
        id: request.userId,
        name: request.userName,
      },
      products: formattedProducts,
      status: 'Pedido realizado',
    };

    const createdOrder = await Order.create(order);

    return response.status(201).json(createdOrder);
  }

async index(request, response) {
  try {
    const orders = await Order.findAll();

    return response.json(orders);
  } catch (error) {
    console.error('ERRO AO BUSCAR PEDIDOS:', error);
    return response.status(500).json({
      error: 'Erro ao buscar pedidos',
      details: error.message,
    });
  }
}
  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
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
    const { status } = request.body;

    try {
      await Order.update( { status }, { where: { id } });
      } catch (err) {
         return response.status(400).json({ error: err.message });
     
    }
    
    return response.json({ message: 'Status updated  sucessfully '})
  }
}

export default new OrderController();
