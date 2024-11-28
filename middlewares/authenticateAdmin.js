const {LoggerService}  =  require('../customLogger')




module.exports = (allowedRoles) => {

    const logger = new LoggerService()
    return (req, res, next) => {

        if (req.session && req.session.adminId) { 
            res.locals.user = req.session; 

            if (allowedRoles.includes(res.locals.user.role)) {
                return next(); 
            } else {
                logger.warn('User does not have admin permissions:', res.locals.user.role);
                return next(new Error('You don\'t have permission to perform this operation')); 
            }
        }

        logger.log('No adminId found in session:', req.session.adminId ? req.session.adminId : 'undefined');
        return next(new Error('You don\'t have permission to perform this operation')); 
    };
};