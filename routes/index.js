//routes use express, express router, and
//then they export the router to app.js
const express = require('express');
const router = express.Router();
router.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader("Access-Control-Allow-Methods", "*");
    // res.end()

    next();

})
router.get('/', (req, res) => {
    let date = new Date;
    console.log(`${date}, ${process.env.API_KEY}`);
    res.render('index', {
        title: "CryptoAPI"
    })
})

// This is commented out because of how the functionality is 
// in the dashboard.
// router.get('/api', (req, res) => {
//     axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest', {
//             headers: {
//                 'X-CMC_PRO_API_KEY': process.env.API_KEY
//             },
//             params: {
//                 convert: 'USD'
//             }
//         })
//         .then(response => {
//             res.send(response.data);
//             console.log('API data sent to client')
//         })
//         .catch(err => {
//             console.log(`Error ${err.response.data.statusCode}`);
//             res.send(`Error ${err.response.data.statusCode}`)
//         })
// })
module.exports = router;