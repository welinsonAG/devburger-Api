import Stripe from 'stripe';
import * as Yup from 'yup';
import 'dotenv/config';

const stripe = new Stripe( 
  process.env.STRIPE_SECRET_KEY='sk_test_51RUUG3LWEeAwvbWdwnCOcyOz0Ue0yVq7Aj5TArjKGntMSJduLShMUqWIycINwrbs7Hh2TUkrHJrQUyhaNXBqavM3008a7T9zJ3')
  
    

  

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return current.price * current.quantity + acc;
  }, 0);

  return total; 
};

class CreatePaymentIntentController {
  async store(request, response) {
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            price: Yup.number().required(),
          }),
        ),
    });

    try {
      await schema.validate(request.body, { abortEarly: false }); // Validação assíncrona
    } catch (err) {
      
      return response.status(400).json({ error: err.errors });
    }

    const { products } = request.body;

    const amount = calculateOrderAmount(products);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
       
        amount,
        currency: 'brl',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      console.log('🔐 PaymentIntent:', paymentIntent);
      console.log('🔐 client_secret enviado:', paymentIntent.client_secret);

      return response.json({
        clientSecret: paymentIntent.client_secret,
        dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
      });
    } catch (error) {
      console.log('Erro ao criar o Payment Intent');
      return response
        .status(500)
        .json({
          error: 'Erro ao criar o Payment Intent',
          details: error.message,
        });
    }
  }
}

export default new CreatePaymentIntentController();
