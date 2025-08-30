/**
 * store => Cadrastro/Adicional
 * index => Listar varios
 * show => Listar apenas um
 * update => Atualizar
 * Delete => Deletar
 */

import { v4 } from 'uuid';

import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(request, response) {
    console.log('BODY RECEBIDO:', request.body);

    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      admin: Yup.boolean()
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = request.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return response.status(409).json({ error: 'User already exists' });
    }

   try{
     const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
   
    });

    return response.status(201).json({
      id: user.id,
      name,
      email,
      admin,
    });
    } catch (error) {
  console.error('Erro ao criar usuário:', error);
  return response.status(500).json({ error: error.message });
}
  }
}

export default new UserController();
