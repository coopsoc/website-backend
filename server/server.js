require('dotenv').config()//loads all environment variables
const express = require('express')//initialize express
const app = express()
const cors = require('cors')
app.use(express.json())
app.use(cors({
  //only accept requests from
  origin: "http://localhost:5500"
}))

const stripe = require("stripe")(
  process.env.STRIPE_PRIVATE_KEY
);

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



