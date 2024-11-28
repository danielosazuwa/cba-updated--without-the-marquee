const express = require('express');
const router = express.Router();
const courseService = require('../services/courseService');
const authenticate = require('../middlewares/authenticate')
const authenticateAdmin = require('../middlewares/authenticateAdmin');

router.get('/courses',
    async (req, res, next) => {
   const course = await courseService.getAll();
   console.log(course)
   // res.render('admin/users', { users });
});


router.get('/:id/get-admin', //authenticateAdmin,
     async (req, res, next) => {
        const id = req.params.id;
    const admin = await adminService.viewOne(id);
    console.log(admin)
    // res.render('admin/users', { users });
});

router.get('/:id/trash', authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
       const id = req.params.id;
   const deletedAdmin = await adminService.viewTrash(id);
   console.log(deletedAdmin)
   // res.render('admin/users', { users });
});

router.post('/create', authenticateAdmin(['SUPER_ADMIN','ADMIN']), async (req, res, next) => {
    try {
        console.log()
        const adminId = req.session.adminId;
        const newCourse = await courseService.create(adminId, req.body)
        console.log(newCourse)

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

        // console.log('Session after login:', req.session);

        // return req.session.id
        // res.render('dashboard', {admin})
        // const user = req.session.user = admin;
        // if(req.session.authorize){
        //     res.render('admin', {username: user.firstName})
        // }else{
        //     res.render('login')
        // }
        // res.redirect('/admin/cases');

        res.json({
            status: 'Logged in successfully',
            session: req.session // Send back the session data for verification
        });
    } catch (err) {
        next(err);
    }
});

router.put('/:id/update', authenticate,
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

router.patch('/:id/soft-delete',  authenticateAdmin(['SUPER_ADMIN']),
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

router.patch('/:id/restore-admin',  authenticateAdmin(['SUPER_ADMIN']),
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
