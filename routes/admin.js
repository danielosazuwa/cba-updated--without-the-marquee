const express = require("express");
const router = express.Router();
const adminService = require("../services/adminService");
const authenticate = require("../middlewares/authenticate");
const authenticateAdmin = require("../middlewares/authenticateAdmin");
const { xss } = require("express-xss-sanitizer");
const { authAdminVal, createAdminVal } = require("../validation/adminValidtion");

// ==> VIEW ALL ADMIN {{domain}}/admin/all-admins
router.get(
  "/all-admins",
  authenticateAdmin(["SUPER_ADMIN"]),
  async (req, res, next) => {
    const admin = await adminService.getAll();
    console.log(admin);
    // res.render('admin/users', { users });
  }
);

// ==> VIEW ADMIN {{domain}}/admin/:adminId/get-admin
router.get(
  "/:id/get-admin",
  xss(), //authenticateAdmin,
  async (req, res, next) => {
    const id = req.params.id;
    const admin = await adminService.viewOne(id);
    console.log(admin);
    // res.render('admin/users', { users });
  }
);

// ==> RESTORE DELETED ADMIN {{domain}}/admin/:adminId/trash
router.get(
  "/:id/trash",
  xss(),
  authenticateAdmin(["SUPER_ADMIN"]),
  async (req, res, next) => {
    const id = req.params.id;
    const deletedAdmin = await adminService.viewTrash(id);
    console.log(deletedAdmin);
    // res.render('admin/users', { users });
  }
);


// ==> NEW ADMIN {{domain}}/admin/create
router.post(
  "/create",
  authenticateAdmin(["SUPER_ADMIN"]),
  createAdminVal,
  async (req, res, next) => {
    // console.log(req.body)

    try {
      const newAdmin = await adminService.create(req.body);
      console.log(newAdmin);
      // return res.render('create', newAdmin)
      // res.redirect('/admin/login');
    } catch (err) {
      next(err);
    }
  }
);

//==> LOGIN {{domain}}/admin/login
router.post("/login", authAdminVal, async (req, res, next) => {
  try {
    const admin = await adminService.login(req.body);
    req.session.adminId = admin.id;
    req.session.firstName = admin.firstName;
    req.session.lastName = admin.lastName;
    req.session.email = admin.email;
    req.session.role = admin.role;

    //     res.render('admin', {status: user.firstName})
    res.json({
      status: "Logged in successfully",
      session: req.session, // Send back the session data for verification
    });
  } catch (err) {
    next(err);
  }
});

// ==> UPDATE ADMIN {{domain}}/admin/:adminId/update
router.put("/:id/update", xss(), authenticate, async (req, res, next) => {
  try {
    const id = req.params.id;
    const admin = await adminService.updateAdmin(id, req.body);
    // res.render('dashboard', {admin})
    // const user = req.session.user = admin;
    // if(req.session.authorize){
    //     res.render('admin', {username: user.firstName})
    // }else{
    //     res.render('login')
    // }
    // res.redirect('/admin/cases');
    console.log(admin);
  } catch (err) {
    next(err);
  }
});

// ==>SOFT DELETE {{domain}}/admin/:adminId/soft-delete
router.patch(
  "/:id/soft-delete",
  xss(),
  authenticateAdmin(["SUPER_ADMIN"]),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const admin = await adminService.softDeleteAdmin(id);
      // res.render('dashboard', {admin})
      // const user = req.session.user = admin;
      // if(req.session.authorize){
      //     res.render('admin', {username: user.firstName})
      // }else{
      //     res.render('login')
      // }
      // res.redirect('/admin/cases');
      console.log(admin);
    } catch (err) {
      next(err);
    }
  }
);

// ==> RESTORE DELETED ADMIN {{domain}}/admin/:adminId/restore-admin
router.patch(
  "/:id/restore-admin",
  xss(),
  authenticateAdmin(["SUPER_ADMIN"]),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const admin = await adminService.restoreDeleteAdmin(id);
      // res.render('dashboard', {admin})
      // const user = req.session.user = admin;
      // if(req.session.authorize){
      //     res.render('admin', {username: user.firstName})
      // }else{
      //     res.render('login')
      // }
      // res.redirect('/admin/cases');
      console.log(admin);
    } catch (err) {
      next(err);
    }
  }
);

// ==> RESTORE DELETED ADMIN {{domain}}/admin/logout
router.delete("/logout", (req, res) => {
  req.session.destroy((err) => {
    console.log("destroyed");
    if (err) {
      return res.status(500).send("Could not log out.");
    }
    res.clearCookie("connect.sid");
    // res.redirect("{{domain}}/admin/login");
  });
});

module.exports = router;
