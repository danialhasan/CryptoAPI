const express = require('express');
const router = express.Router();
const {
    default: axios
} = require("axios");

const TEST_API_KEY = 'b54bcf4d-1bca-4e8e-9a24-22ff2c3d462c';
const TEST_ENV = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const TEST_ENV_MAP = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/map';
const ENV = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const ENV_MAP = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/map';
const API_KEY = process.env.API_KEY;

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
    console.log(`test API key: ${TEST_API_KEY}`);
    res.render('dashboard', {
        title: "CryptoAPI"
    })
})
router.get('/map', (req, res) => { //sandbox env
    axios.get(TEST_ENV_MAP, {
            headers: {
                'X-CMC_PRO_API_KEY': TEST_API_KEY
            },
            params: {
                sort: 'id'
            }
        })
        .then(response => {
            console.log(response.data.data);
            res.send(response.data.data)
        })
        .catch(err => res.send(err))
})

router.get('/api', (req, res) => {
    cmcID = req._parsedOriginalUrl.query;
    console.log(req._parsedOriginalUrl.query);
    cmcID = cmcID.split('=')[1];

    /**
     * split the original string, 'id=[cryptocurrency]' into
     * an array of 2 elements and pick the latter one.
     * The array looks like this:
     * ['id', '[cryptocurrency]']
     * We split it into those, and take the latter indice. 
     */

    console.log(`User requested: ${cmcID}`);

    axios.get(TEST_ENV, {
            headers: {
                'X-CMC_PRO_API_KEY': TEST_API_KEY
            },
            params: {
                id: cmcID
            }
        })
        .then(response => {
            res.send(response.data.data);
            console.log('test API data sent to client')
        })
        .catch(err => {
            console.log(`Error ${err.response.data.statusCode}`);
            res.send(`Error ${err.response.data.statusCode}, ${err}`)
        })
})
module.exports = router;