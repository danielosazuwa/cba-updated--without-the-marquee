const createError = require("http-errors");
const express = require("express");
const path = require("path");
require("dotenv").config();
const session = require("express-session");
const fileUpload = require("express-fileupload");
const formatView = require("./middlewares/formatView");
const { connect } = require("./prismaService");
const { LoggerService } = require("./customLogger");
const indexRouter = require("./routes/index");
const config = require("./config/config");
const { http } = require("winston");
const MemoryStore = require("memorystore")(session);

// const usersRouter = require('./routes/users');
const adminRouter = require("./routes/admin");
const courseRouter = require("./routes/course");

// Handling uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.log(`Error: ${err.message}`);
  logger.log(`shutting down due to uncaught exception`);
  process.exit(1);
});

process.on("SIGINT", async () => {
  logger.warn("Shutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

var app = express();
const logger = new LoggerService("app");
const port = process.env.PORT || 8000;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("view engine", "ejs");

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

app.use(
  session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: true,
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    cookie: {
      httpOnly: true,
      // sameSite: 'strict',
      secure: false,
      // maxAge: 1000 * 60 * 60 * 24 // 1 day,
      checkPeriod: 86400000, // prune expired entries every 24h
    },
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(formatView);
app.use("/", indexRouter);
// app.use('/users', authenticate, usersRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

// Start server and connect to Prisma
const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
      logger.info(`listening at port ${port} in ${config.node_env}😁😁😁😁`);
    });
  } catch (error) {
    logger.error("Failed to start the server 🔥🔥🔥🔥🔥🔥:", error);
  }
};
startServer();

// Handling unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  logger.log(`Error: ${err.message}`);
  logger.log(`Shutting down the server due to Unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
