const express = require('express');
const router = express.Router();
const User = require('../models').User;

/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/dashboard', async (req, res, next) => {
    try {
        const user = await User.findByPk(req.session.user.id);

        res.render('user/dashboard', {});
    } catch (err) {
        next(err);
    }
});


module.exports = router;
