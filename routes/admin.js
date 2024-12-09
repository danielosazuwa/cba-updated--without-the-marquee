const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const authenticate = require('../middlewares/authenticate')
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { xss } = require('express-xss-sanitizer');

router.get('/all-admins', authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
   const admin = await adminService.getAll();
   console.log(admin)
   // res.render('admin/users', { users });
});


router.get('/:id/get-admin', xss(),//authenticateAdmin,
     async (req, res, next) => {
        const id = req.params.id;
    const admin = await adminService.viewOne(id);
    console.log(admin)
    // res.render('admin/users', { users });
});

router.get('/:id/trash', xss(), authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
       const id = req.params.id;
   const deletedAdmin = await adminService.viewTrash(id);
   console.log(deletedAdmin)
   // res.render('admin/users', { users });
});

router.post('/create', 
    authenticateAdmin(['SUPER_ADMIN']), 
    async (req, res, next) => {
        // console.log(req.body)

    try {

        const newAdmin = await adminService.create(req.body)
        // return res.render('create', newAdmin)
        // res.redirect('/admin/login');

    } catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {

    try {
        const admin=  await adminService.login(req.body);

        req.session.adminId = admin.id;
        req.session.firstName = admin.firstName;
        req.session.lastName = admin.lastName;
        req.session.email = admin.email;
        req.session.role = admin.role;

  
        //     res.render('admin', {status: user.firstName})
        res.json({
            status: 'Logged in successfully',
            session: req.session // Send back the session data for verification
        });
    } catch (err) {
        next(err);
    }
});

router.put('/:id/update', xss(),authenticate,
     async (req, res, next) => {
    try {
        const id = req.params.id
        const admin =  await adminService.updateAdmin(id,req.body);
        // res.render('dashboard', {admin})
        // const user = req.session.user = admin;
        // if(req.session.authorize){
        //     res.render('admin', {username: user.firstName})
        // }else{
        //     res.render('login')
        // }
        // res.redirect('/admin/cases');
        console.log(admin)
    } catch (err) {
        next(err);
    }
});

router.patch('/:id/soft-delete', xss(), authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
   try {
       const id = req.params.id
       const admin =  await adminService.softDeleteAdmin(id);
       // res.render('dashboard', {admin})
       // const user = req.session.user = admin;
       // if(req.session.authorize){
       //     res.render('admin', {username: user.firstName})
       // }else{
       //     res.render('login')
       // }
       // res.redirect('/admin/cases');
       console.log(admin)
   } catch (err) {
       next(err);
   }
});

router.patch('/:id/restore-admin', xss(), authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
   try {
       const id = req.params.id
       const admin =  await adminService.restoreDeleteAdmin(id);
       // res.render('dashboard', {admin})
       // const user = req.session.user = admin;
       // if(req.session.authorize){
       //     res.render('admin', {username: user.firstName})
       // }else{
       //     res.render('login')
       // }
       // res.redirect('/admin/cases');
       console.log(admin)
   } catch (err) {
       next(err);
   }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        console.log('destroyed')
        if (err) {
            return res.status(500).send('Could not log out.');
        }
        res.clearCookie('connect.sid'); 
        res.redirect('/admin/login'); 
    });
});

module.exports = router;
