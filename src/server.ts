import "dotenv-defaults/config";
import cors from "cors";
import express, { json, Request, Response } from "express";

// For type narrowing
const envVars = ["IP", "PORT", "CLIENT_URL", "STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY"];
if (envVars.some((e) => process.env[e] === undefined)) {
  throw "Environment variables not set, see .env.example"
}

const app = express();
app.use(json());
app.use(cors({
  // Only accept requests from
  origin: process.env.CLIENT_URL
}));

const stripe = require("stripe")(
  process.env.STRIPE_PRIVATE_KEY
);

const PORT: number = parseInt(process.env.PORT);
const HOST: string = process.env.IP;

//Item map for store items
const storeItems = new Map([
  ["hoodie-sm", { priceInCents: 50000, name: "Small Hoodie" }],
  ["hoodie-lg", { priceInCents: 50000, name: "Large Hoodie" }],
]);

//handling create checkout request
app.post('/create-checkout-session', async (request, response) => {
  try{
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode:'payment',
      line_items: request.body.items.map(item=>{
        const storeItem= storeItems.get(item.id)
        return {
          price_data: {
            currency: 'aud',
            product_data: {
              name: storeItem.name,
          },
          unit_amount: storeItem.priceInCents
        },
        quantity: item.quantity

      }}),
      success_url: `${process.env.CLIENT_URL}/success.html`,
      cancel_url: `${process.env.CLIENT_URL}/cancel.html`
    })
    console.log(session.url);
    response.json({url: session.url})
  }
  catch(e){
    response.status(500).json({error: e.message})
  }
})
app.listen(3000)



// const session = await stripe.checkout.sessions.create({
//   payment_method_types: ["card"],
//   mode: "payment",
//   success_url: "http://www.google.com",
//   cancel_url: "http://www.google.com",
// });
// console.log(session.url)
// async function getProducts() {
//     const products = await stripe.products.list().then(products=>{return products});
// }



