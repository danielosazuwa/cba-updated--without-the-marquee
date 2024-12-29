const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const userValidation = require("../validation/userValidation");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

// ==> GET ALL USERS {{domain}}/users/
router.get(
  "/",
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
  async (req, res, next) => {
    const result = await userService.getAll();
    console.log(result);
    // res.send('respond with a resource');
  }
);

// ==> VIEW TRASH {{domain}}/users/trash
router.get(
  "/trash",
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
  async (req, res, next) => {
    const result = await userService.Trash();
    console.log(result);
    // res.send('respond with a resource');
  }
);

// ==> VIEW USER {{domain}}/users/:userId
router.get(
  "/:id",
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await userService.viewOne(id);
      console.log(user);

      // res.render('user/dashboard', {});
    } catch (err) {
      next(err);
    }
  }
);

// ==> CREATE NEW USER {{domain}}/users/create
router.post("/create", userValidation.userVal, async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    console.log(user);
    // res.render('user/dashboard', {});
  } catch (err) {
    next(err);
  }
});

// ==> UPDATE USER {{domain}}/users/:userId/update
router.put(
  "/:id/update",
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
  userValidation.userVal,
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const user = await userService.updateUser(id, req.body);
      console.log(user);

      // res.render('user/dashboard', {});
    } catch (err) {
      next(err);
    }
  }
);

// ==> SOFT DELETE A USER {{domain}}/users/:userId/soft-delete
router.patch("/:id/soft-delete",
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
   async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.softDeleteUser(id);
    console.log(user);

    // res.render('user/dashboard', {});
  } catch (err) {
    next(err);
  }
});

// ==> DELETE A USER {{domain}}/users/:userId/delete
router.delete("/:id/delete", 
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
  async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.permanentDelete(id);
    console.log(user);

    // res.render('user/dashboard', {});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
