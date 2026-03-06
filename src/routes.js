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

routes.get('/categories',  CategoryController.index);
routes.get('/products', ProductController.index);

routes.use(authMiddleware);
routes.post('/products', upload.array('images', 5), ProductController.store);
routes.put('/products/:id', upload.array('images', 5), ProductController.update);

routes.delete('/products/:id', ProductController.delete);
routes.delete('/products/image/:id', ProductController.deleteImage);

routes.post('/categories', upload.single('file'), CategoryController.store);

routes.put('/categories/:id', upload.single('file'), CategoryController.update);

routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);
routes.put('/orders/:id', OrderController.update);

routes.post('/create-payment-intent', CreatePaymentIntentController.store);

export default routes;

// request -> middleware -> controller -> model -> database -> response
