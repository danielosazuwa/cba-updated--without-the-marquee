const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');
const authenticate = require('../middlewares/authenticate')
const authenticateAdmin = require('../middlewares/authenticateAdmin');

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

router.post('/create', authenticateAdmin(['SUPER_ADMIN']), async (req, res, next) => {
    try {
        const newAdmin = await adminService.create(req.body)
        console.log(newAdmin)

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

// router.get('/users', authenticateAdmin, async (req, res, next) => {
//     const users = await adminService.list();
//     res.render('admin/users', { users });
// });

// router.get('/cases', authenticateAdmin, async (req, res, next) => {
//     try {
//         const cases = await caseService.list({ include: { model: Admin, attributes: ['fullname'] } });
//         res.render('admin/cases', { cases });
//     } catch (err) {
//         next(err);
//     }
// });

// router.get('/new-case', authenticateAdmin, async (req, res, next) => {
//     try {
//         const [categories, agencies] = await Promise.all([
//             caseService.getCategories(),
//             caseService.getAgencies()
//         ]);
//         res.render('admin/new-case', { agencies, categories, case_statuses: CASE_STATUSES });
//     } catch (err) {
//         next(err);
//     }
// });

// router.get('/edit-case/:id', authenticateAdmin, async (req, res, next) => {
//     try {
//         const [_case, categories, agencies] = await Promise.all([
//             caseService.view({ where: { id: req.params.id } }),
//             caseService.getCategories(),
//             caseService.getAgencies()
//         ]);
//         res.render('admin/edit-case', { _case, categories, agencies, case_statuses: CASE_STATUSES });
//     } catch (err) {
//         next(err);
//     }
// });

// router.post('/cases', authenticateAdmin, async (req, res, next) => {
//     try {
//         await caseService.save({ ...req.body, AdminId: req.session.admin.id }, req.files);
//         const cases = await caseService.list({ include: { model: Admin, attributes: ['fullname'] } });
//         res.render('admin/cases', { cases });
//     } catch (err) {
//         next(err);
//     }
// });

// router.delete('/delete-case/:id', authenticateAdmin, async (req, res, next) => {
//     try {
//         await caseService.deleteCase(req.params.id);
//         res.status(200).json({ status: true });
//     } catch (err) {
//         next(err);
//     }
// });


module.exports = router;
