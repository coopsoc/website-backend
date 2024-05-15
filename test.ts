
const stripe = require("stripe")(
  "sk_test_51PGdg7HTy0Cdu2FbkJXV5jx5ghPbjmLpPPvVVd1CSR5IbyovazKdB7BwGPiwJu1GPXTWyrEuIYbgTroYdWbJ7Sb900GztJ4miW"
);
async function getProducts() {
    const products = await stripe.products.list().then(products=>{return products});
}

console.log(getProducts());
