// module.exports = (req, res, next) => {
//     if (req.session.adminId && req.session.adminId) {
//         res.locals.user = req.session.user;
//         return next();
//     }
//     console.log(req.session.adminId)
//     // console.log(res.locals.user)

//     next(new Error('You don\'t have permission to view this page'));
// }
const { ErrorHandler } = require('../helpers/errorHandler');



// module.exports = (req, res, next) => {
//     console.log('Session Data:', req.session); // Log session data for debugging
//     console.log('Route Parameters:', req.params); // Log route parameters

//     if (req.session && req.session.adminId === req.params.id) { 
//         res.locals.user = req.session; 
//         console.log('Authenticated user:', res.locals.user);
//         return next(); 
//     }

//     console.log(`You don't have permission to view this page`);
//     return next(new ErrorHandler(403, `You don't have permission to view this page`)); 
// };

module.exports = (req, res, next) => {

    const authenticatedUserId = req.params.id;
        if (req.session.adminId !== authenticatedUserId) { 
            console.log('You cant perform this operation');
            return next(new Error('You don\'t have permission to perform this operation')); 
        }

        res.locals.user = req.session; 
        next()

        
    };

