import Stripe from "stripe";
import dotenv from "dotenv";

//config
dotenv.config();

//stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//create PaymentIntent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents/paise
      currency: "inr",
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
