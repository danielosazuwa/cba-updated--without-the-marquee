module.exports = (req, res, next) => {

    const authenticatedUserId = req.params.id;
        if (req.session.adminId !== authenticatedUserId) { 
            console.log('You cant perform this operation');
            return next(new Error('You don\'t have permission to perform this operation')); 
        }

        res.locals.user = req.session; 
        next()
    };

