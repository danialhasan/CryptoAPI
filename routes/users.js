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
    console.log(process.env.API_KEY);
    res.render('login', {
        title: "CryptoAPI"
    })
})
module.exports = router;