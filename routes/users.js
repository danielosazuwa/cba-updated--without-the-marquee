const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const userValidation = require("../validation/userValidation");
const authenticateAdmin = require("../middlewares/authenticateAdmin");

router.get(
  "/",
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
  async (req, res, next) => {
    const result = await userService.getAll();
    console.log(result);
    // res.send('respond with a resource');
  }
);

router.get(
  "/trash",
  authenticateAdmin(["SUPER_ADMIN", "ADMIN"]),
  async (req, res, next) => {
    const result = await userService.Trash();
    console.log(result);
    // res.send('respond with a resource');
  }
);

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

router.post("/create", userValidation.userVal, async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    console.log(user);
    // res.render('user/dashboard', {});
  } catch (err) {
    next(err);
  }
});

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

router.patch("/:id/soft-delete", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.updateUser(id, req.body);
    console.log(user);

    // res.render('user/dashboard', {});
  } catch (err) {
    next(err);
  }
});

router.delete("/:id/soft-delete", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await userService.updateUser(id, req.body);
    console.log(user);

    // res.render('user/dashboard', {});
  } catch (err) {
    next(err);
  }
});

module.exports = router;
