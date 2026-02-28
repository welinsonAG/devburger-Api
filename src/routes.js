import { Router } from 'express';

import upload from './config/multer.js';

import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import authMiddleware from './app/middlewares/auth.js';
import CategoryController from './app/controllers/CategoryController.js';
import OrderController from './app/controllers/OrderController.js';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js';

const routes = new Router();



routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.get('/categories', (req, res) => CategoryController.index(req, res));
routes.get('/products', ProductController.index);

routes.use(authMiddleware);
routes.post('/products', upload.single('file'), ProductController.store);

routes.patch('/products/image/:id',upload.single('file'),ProductController.updateImage,);
routes.put('/products/:id', upload.single('file'), ProductController.update);



routes.post('/categories', upload.single('file'), CategoryController.store);

routes.put('/categories/:id', upload.single('file'), CategoryController.update);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

routes.post('/create-payment-intent', CreatePaymentIntentController.store);

export default routes;

// request -> middleware -> controller -> model -> database -> response
