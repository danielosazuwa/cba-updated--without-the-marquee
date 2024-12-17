module.exports = (req, res, next) => {
    if (req.session || req.session.userId) {
        res.locals.user = req.session;
    }

    next();
}