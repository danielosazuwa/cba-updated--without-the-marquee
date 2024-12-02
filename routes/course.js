const express = require('express');
const router = express.Router();
const courseService = require('../services/courseService');
const authenticate = require('../middlewares/authenticate')
const authenticateAdmin = require('../middlewares/authenticateAdmin');
const CourseUpload = require('../helpers/fileUpload')
const { default: slugify } = require('slugify');
const { xss } = require('express-xss-sanitizer');

router.get('/',
    async (req, res, next) => {
        const { courses } = req.query; 
        let criteria = {};

        if (courses) {
            const normalizedSlug = slugify(courses, { lower: true, replacement: '_' });
            const keywords = courses.toLowerCase().split(/\s+/);
            criteria = {
                OR: [
                    { slug: { contains: normalizedSlug, mode: 'insensitive' } },
                    { slug: { contains: normalizedSlug.replace(/_/g, '-'), mode: 'insensitive' } },
                ],
            };
        }

        try {
            const courses = await courseService.getAll(criteria);
            console.log(courses);
        } catch (err) {
            next(err);
        }
   // res.render('admin/users', { users });
});

router.get('/trash', authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
        try {
            const courses = await courseService.trash();
            console.log(courses);
        } catch (err) {
            next(err);
        }
   // res.render('admin/users', { users });
});

router.get('/:slug',xss(), //authenticateAdmin,
     async (req, res, next) => {
        const {slug} = req.params;
        const normalizedSlug = slugify(`${slug}`, {lower: true, replacement:'_'});

        try{
            const course = await courseService.viewOne(normalizedSlug);
            console.log(course)
            // res.render('admin/users', { users });
        }catch(err){
            next(err);
        }
  
});



router.post('/create', authenticateAdmin(['SUPER_ADMIN','ADMIN']), async (req, res, next) => {
    try {
        const adminId = req.session.adminId;

        const newCourse = await courseService.create(adminId, req.body)
        console.log(newCourse)

        // return res.render('create', newAdmin)
        // res.redirect('/admin/login');

    } catch (err) {
        next(err);
    }
});

router.patch('/:courseId/img-upload',xss(),
    authenticateAdmin(['SUPER_ADMIN', 'ADMIN', 'EDITOR']), 
    CourseUpload.single('image'),
    async (req, res, next) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No image file was uploaded.' });
            }

            const imagePath = `courseBanner/${req.file.filename}`;

            const { courseId } = req.params;

            const updatedCourse = await courseService.uploadImage(courseId, imagePath);
            console.log(updatedCourse);

            // res.status(200).json({ message: 'Image uploaded successfully!', updatedCourse });
        } catch (err) {
            next(err);
        }
    }
);

router.put('/:courseId/update-course', xss(), authenticateAdmin(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
     async (req, res, next) => {
    try {
        const {courseId} = req.params
        const course =  await courseService.updateCourse(courseId,req.body);
        // res.render('dashboard', {admin})
        // const user = req.session.user = admin;
        // if(req.session.authorize){
        //     res.render('admin', {username: user.firstName})
        // }else{
        //     res.render('login')
        // }
        // res.redirect('/admin/cases');
        console.log(course)
    } catch (err) {
        next(err);
    }
});

router.patch('/:courseId/soft-delete',  xss(), authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
   try {
       const {courseId} = req.params
       const course =  await courseService.softDeleteCourse(courseId);
       
       // res.send('/admin/cases');
       console.log(course)
   } catch (err) {
       next(err);
   }
});

router.patch('/:courseId/restore-course',  xss(), authenticateAdmin(['SUPER_ADMIN', 'ADMIN']),
    async (req, res, next) => {
   try {
       const {courseId} = req.params
       const course =  await courseService.restoreCourse(courseId);
       
       // res.send('/admin/cases');
       console.log(course)
   } catch (err) {
       next(err);
   }
});


router.delete('/:courseId/permanent-delete',  xss(), authenticateAdmin(['SUPER_ADMIN']),
    async (req, res, next) => {
   try {
       const {courseId} = req.params
       const course =  await courseService.permanentDeleteCourse(courseId);
       
       // res.send('/admin/cases');
       console.log(course)
   } catch (err) {
    console.log(err)
       next(err);
   }
});


module.exports = router;
