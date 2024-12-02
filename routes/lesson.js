const express = require('express');
const router = express.Router();
const lessonService = require('../services/lessonService');
const authenticate = require('../middlewares/authenticate')
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const { xss } = require('express-xss-sanitizer');

router.get('/module/:moduleId',xss(),
    async (req, res, next) => {
        const {moduleId} = req.params;
        try {
            const lesson = await lessonService.getAll(moduleId);
            console.log(lesson);
        } catch (err) {
            console.log(err)
            next(err);
        }
   // res.render('admin/users', { users });
});

router.get('/trash', authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
        try {
            const lessons = await lessonService.viewTrash();
            console.log(lessons);
        } catch (err) {
            next(err);
        }
   // res.render('admin/users', { users });
});

router.get('/:lessonId',xss(),async (req, res, next) => {
    const {lessonId} = req.params;

    try{
        const lesson = await lessonService.viewOne(lessonId);
        console.log(lesson)
        // res.render('admin/users', { users });
    }catch(err){
        console.log(err)
        next(err);
    }
  
});



router.post('/module/:moduleId/create', xss(),authenticateAdmin(['SUPER_ADMIN','ADMIN']), async (req, res, next) => {
    try {
        const {moduleId} = req.params
        const adminId = req.session.adminId;

        const newLesson = await lessonService.createLesson(moduleId,req.body,adminId)
        console.log(newLesson)

        // return res.render('create', newAdmin)
        // res.redirect('/admin/login');

    } catch (err) {
        console.log(err)
        next(err);
    }
});

router.put('/:lessonId/update',xss(), authenticateAdmin(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
     async (req, res, next) => {
    try {
        const {lessonId} = req.params
        const lesson =  await lessonService.updateLesson(lessonId,req.body);
        // res.render('dashboard', {admin})
        // const user = req.session.user = admin;
        // if(req.session.authorize){
        //     res.render('admin', {username: user.firstName})
        // }else{
        //     res.render('login')
        // }5c349899-f3b1-4ef4-abc5-bb3196d6f952
        // res.redirect('/admin/cases');
        console.log(lesson)
    } catch (err) {
        console.log(err)
        next(err);
    }
});

router.patch('/:lessonId/soft-delete', xss(),  authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
   try {
       const {lessonId} = req.params
       const lesson =  await lessonService.softDeleteLesson(lessonId);
       
       // res.send('/admin/cases');
       console.log(lesson)
   } catch (err) {
    console.log(err)
       next(err);
   }
});

router.patch('/:lessonId/restore-lesson', xss(), authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
   try {
       const {lessonId} = req.params
       const lesson =  await lessonService.restoreDeletedLesson(lessonId);
       
       // res.send('/admin/cases');
       console.log(lesson)
   } catch (err) {
    console.log(err)
       next(err);
   }
});


router.delete('/:lessonId/permanent-delete-lesson', xss(),  authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
   try {
       const {lessonId} = req.params
       const course =  await lessonService.permanentDelete(lessonId);
       
       // res.send('/admin/cases');
       console.log(course)
   } catch (err) {
    console.log(err.message)
       next(err);
   }
});


module.exports = router;
