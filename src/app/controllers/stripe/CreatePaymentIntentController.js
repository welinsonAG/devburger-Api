import Stripe from 'stripe';
import * as Yup from 'yup';
import 'dotenv/config'
const stripe = new Stripe(process.env.STRIPE_KEI_SECRET);

const calculateOrderAmount = (items) => {
  const total = items.reduce((acc, current) => {
    return current.price * current.quantity + acc;
  }, 0);

  return total * 100;
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
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }
     
    const { products } = request.body;

    const amount = calculateOrderAmount(products);

    const paymantIntent = await Stripe.paymantIntent.creat({
        amount,
        currency: "brl",

        automatic_payment_methods: {
            enabled: true,
        },
    });

    response.json({
        clientSecret: paymantIntent.client_secret,
        dpmCheckerLink:`https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymantIntent.id} `,
    });
  }
}

export default new CreatePaymentIntentController();
