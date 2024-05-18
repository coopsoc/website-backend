const button = document.getElementById('checkoutBtn');
button.addEventListener('click', () => {
    //fetch is a Promise, reject if network error not http errors
    fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'

        },
        body: JSON.stringify({
            items: [
                {id:'hoodie-sm', quantity:3}
            ]
        })
        //redirect user if successful request
    }).then(response => {
        //if response is ok(checking for http errors)
        if(response.ok) return response.json()//goes into next then
            return response.json().then(json => Promise.reject(json))//goes into catch

    }).then(({url}) =>{
        //url is json attached with repsonse
        window.location = url//send user to url
    }).catch(e => {
        console.error(e.error)
    })
})