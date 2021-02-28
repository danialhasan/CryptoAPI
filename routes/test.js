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

/**
 * NOTE: When using route files to modularize routing, use
 * app.use('/route',) and not app.get('/route',)
 */

router.get('/', (req, res) => {
    res.render('test', {
        title: 'Hello World'
    });
    console.log("Hello World!")
})



module.exports = router;