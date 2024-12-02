const express = require('express');
const router = express.Router();
const moduleService = require('../services/moduleService');
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { xss } = require('express-xss-sanitizer');

router.get('/course/:courseId',xss(),
    async (req, res, next) => {
        const {courseId} = req.params;
        try {
            const module = await moduleService.getAll(courseId);
            // console.log(module);
        } catch (err) {
            next(err);
        }
   // res.render('admin/users', { users });
});

router.get('/trash', authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
        try {
            const modules = await moduleService.viewTrash();
            console.log(modules);
        } catch (err) {
            next(err);
        }
   // res.render('admin/users', { users });
});

router.get('/:moduleId',xss(), //authenticateAdmin,
     async (req, res, next) => {
        const {moduleId} = req.params;

        try{
            const module = await moduleService.viewOne(moduleId);
            console.log(module)
            // res.render('admin/users', { users });
        }catch(err){
            console.log(err)
            next(err);
        }
  
});



router.post('/course/:courseId/create', xss(),authenticateAdmin(['SUPER_ADMIN','ADMIN']), async (req, res, next) => {
    try {
        const {courseId} = req.params
        const adminId = req.session.adminId;

        const newModule = await moduleService.createModule(courseId,req.body,adminId)
        console.log(newModule)

        // return res.render('create', newAdmin)
        // res.redirect('/admin/login');

    } catch (err) {
        next(err);
    }
});

router.put('/:moduleId/update',xss(), authenticateAdmin(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
     async (req, res, next) => {
    try {
        const {moduleId} = req.params
        const module =  await moduleService.updateModule(moduleId,req.body);
        // res.render('dashboard', {admin})
        // const user = req.session.user = admin;
        // if(req.session.authorize){
        //     res.render('admin', {username: user.firstName})
        // }else{
        //     res.render('login')
        // }5c349899-f3b1-4ef4-abc5-bb3196d6f952
        // res.redirect('/admin/cases');
        console.log(module)
    } catch (err) {
        console.log(err)
        next(err);
    }
});

router.patch('/:moduleId/soft-delete', xss(),  authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
   try {
       const {moduleId} = req.params
       const module =  await moduleService.softDeleteModule(moduleId);
       
       // res.send('/admin/cases');
       console.log(module)
   } catch (err) {
    console.log(err)
       next(err);
   }
});

router.patch('/:moduleId/restore-module', xss(), authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
   try {
       const {moduleId} = req.params
       const module =  await moduleService.restoreDeletedModule(moduleId);
       
       // res.send('/admin/cases');
       console.log(module)
   } catch (err) {
    console.log(err)
       next(err);
   }
});


router.delete('/:moduleId/permanent-delete-module', xss(),  authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
   try {
       const {moduleId} = req.params
       const course =  await moduleService.permanentDelete(moduleId);
       
       // res.send('/admin/cases');
       console.log(course)
   } catch (err) {
    console.log(err)
       next(err);
   }
});


module.exports = router;
