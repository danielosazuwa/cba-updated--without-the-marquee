const express = require("express");
const router = express.Router();
const courseService = require("../services/courseService");
const authenticate = require("../middlewares/authenticate");
const authenticateAdmin = require("../middlewares/authenticateAdmin");
const CourseUpload = require("../helpers/fileUpload");
const { default: slugify } = require("slugify");
const { xss } = require("express-xss-sanitizer");
const { courseVal } = require("../validation/courseValidation");
const enrollmentService = require("../services/enrollmentService");

router.post("/:courseId", async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const Enrollment = await enrollmentService.singleEnrollment(
      courseId,
      req.body
    );
    const { enrollment, userWithOutPassword } = Enrollment;
    const { id, firstName, lastName, email } = userWithOutPassword;

    req.session.userId = id;
    req.session.enrollmentId = enrollment.id;
    req.session.firstName = firstName;
    req.session.lastName = lastName;
    req.session.email = email;

    console.log(req.session)
    return enrollment;

    // return res.render('create', newAdmin)
    // res.redirect('/admin/login');
  } catch (err) {
    next(err);
  }
});

router.patch("/:enrollmentId/card-details", authenticate, async (req, res, next) => {
  try {
    const { userId } = req.session;

    const payment = await enrollmentService.chargeCard(userId, req.body);
    console.log(payment);
   
    // return res.render('create', newAdmin)
    // res.redirect('/admin/login');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
