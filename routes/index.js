const express = require("express");
const router = express.Router();
const emailService = require("../services/emailService");
// const authenticate = require('../middlewares/authenticate');
// const userService = require('../services/userService');
const faq = require("../public/array/faq-questions");
const testimonials = require("../public/array/testimonials");
const successStories = require("../public/array/success-stories");

router.get("/", async (req, res, next) => {
  try {
    res.render("index", {
      title: "Home",
      testimonialsContent: testimonials,
      stories: successStories,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/about", (req, res) => {
  res.render("about", { title: "About Us" });
});

router.get("/our-academy", (req, res) => {
  res.render("our-academy", { title: "Our Academy" });
});

router.get("/business-analysis", (req, res) => {
  res.render("business-analysis", {
    title: "Business Analysis",
    url: "/business-analysis",
  });
});

router.get("/data-analysis", (req, res) => {
  res.render("data-analysis", {
    title: "Data Analysis",
    url: "/data-analysis",
  });
});

router.get("/ui-ux-design", (req, res) => {
  res.render("ui-ux-designer", { title: "UI/UX Design", url: "/ui-ux-design" });
});

router.get("/digital-marketing", (req, res) => {
  res.render("digital-marketing", {
    title: "Digital Marketing",
    url: "/digital-marketing",
  });
});

router.get("/professional-product-owner", (req, res) => {
  res.render("professional-product-owner", {
    title: "Professional Product Owner",
    url: "/professional-product-owner",
  });
});

router.get("/professional-scrum-master", (req, res) => {
  res.render("professional-scrum-master", {
    title: "Professional Scrum Master",
    url: "/professional-scrum-master",
  });
});

router.get("/business-process-modeling", (req, res) => {
  res.render("business-process-model", {
    title: "Business Process Model",
    url: "/business-process-modeling",
  });
});

router.get("/product-development", (req, res) => {
  res.render("product-development", {
    title: "Product Development",
    url: "/product-development",
  });
});

router.get("/services", (req, res) => {
  res.render("our-services", { title: "Our Services" });
});

router.get("/resources", (req, res) => {
  res.render("resources", { title: "Resources" });
});

router.get("/testimonials", (req, res) => {
  res.render("testimonials", { title: "Testimonials" });
});

router.get("/partnership", (req, res) => {
  res.render("partnership", { title: "Partnership" });
});

router.get("/consultancy", (req, res) => {
  res.render("consultancy", { title: "Consultancy" });
});

router.get("/linkedin-optimization", (req, res) => {
  res.render("linkedin-opt", { title: "Linkedin Optimization" });
});

router.get("/cv-revamp", (req, res) => {
  res.render("cv-rv", { title: "CV Revamp" });
});

router.get("/tech-training", (req, res) => {
  res.render("tech-training", { title: "Tech-Training" });
});

router.get("/become-a-partner", (req, res) => {
  res.render("partnership-form", { title: "Partnership Form" });
});

router.get("/book-consultation", (req, res) => {
  res.render("consultancy-form"), { title: "Consultancy Form" };
});

router.get("/enrol", (req, res) => {
  res.render("tech-enroll", { title: "Enrol" });
});

router.get("/work-experience-signup", (req, res) => {
  res.render("work-experience", { title: "Work Experience Signup" });
});

router.get("/work-experience", (req, res) => {
  res.render("work-experience-a", { title: "work Experience" });
});

router.get("/success", (req, res) => {
  res.render("success", { title: "Success" });
});

router.get("/failed", (req, res) => {
  res.render("failed", { title: "failed" });
});

router.get("/payment-page", (req, res) => {
  res.render("payment-page");
});

router.get("/payment-success", (req, res) => {
  res.render("payment-success");
});

router.get("/payment-decline", (req, res) => {
  res.render("payment-decline");
});

router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us" });
});

router.get("/faq", (req, res) => {
  const faqQuestions = faq;
  res.render("faq", {
    title: "Frequently Asked Questions",
    faqData: faqQuestions,
  });
});

router.get("/login", (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/send-email", (req, res, next) => {
  try {
    const subject = {
      enroll: "I want to enroll for a course",
      consultancy: "I want to consult on Tech",
      partnership: "I want to partner with CBA",
    };
    const {
      email: sender_email,
      phone: sender_phone,
      fname,
      lname = "",
      message,
      category,
    } = req.body;
    emailService.emailCBA({
      sender_name: `${fname} ${lname}`,
      sender_email,
      sender_phone,
      subject: subject[category],
      message,
    });
    //res.status(200).json({ status: 'success' });
    res.render("confirmation", { title: "Message Sent" });
  } catch (err) {
    next(err);
  }
});

router.post("/send-contact-email", (req, res, next) => {
  try {
    const {
      email: sender_email,
      phone: sender_phone,
      name: sender_name,
      subject,
      message,
    } = req.body;
    emailService.emailCBA({
      sender_name,
      sender_email,
      sender_phone,
      subject,
      message,
    });
    //res.status(200).json({ status: 'success' });
    res.render("confirmation", { title: "Message Sent" });
  } catch (err) {
    next(err);
  }
});

// router.post('/login', async (req, res, next) => {
//     try {
//         req.session.user = await userService.login(req.body);
//         res.redirect('/users/dashboard');
//     } catch (err) {
//         next(err);
//     }
// });

module.exports = router;
