const { PrismaClient } = require("@prisma/client");
const { ErrorHandler } = require("../helpers/errorHandler");
const { LoggerService } = require("../customLogger");
const logger = new LoggerService();
const userService = require("./userService");
const courseService = require("./courseService");
const prisma = new PrismaClient();
const emailService = require("./emailService");
const paymentService = require("../helpers/paymentService");
const UtilityFeature = require("../helpers/utilityFeature");

const getSingleEnrollment = async (criteria) => {
  return await prisma.singleCourseEnrollment.findFirst({
    where: { ...criteria },
  });
};

const singleEnrollment = async (courseId, payload) => {
  const isCourse = await courseService.getOne({ id: courseId });
  const isUserExist = await userService.getOne({ email: payload.email });

  if (!isCourse) throw new ErrorHandler(404, "Course Not Found!");

  let userId;

  if (!isUserExist) {
    const newUser = await userService.create(payload);
    userId = newUser.id;
  } else {
    userId = isUserExist.id;
  }

  const userDetails = await userService.getOne({ id: userId });
  const { password, ...userWithOutPassword } = userDetails;

  //   check if user already enrolled and has paid
  const enrollment = await getSingleEnrollment({
    userId: userId,
    courseId: courseId,
  });

  if (enrollment && enrollment.paymentId == null) {
    return { enrollment, userWithOutPassword };
  } else if(!enrollment) {
    // enroll the existing user for the course
    const enrollment = await prisma.singleCourseEnrollment.create({
      data: {
        courseId: isCourse.id,
        userId: userId,
      },
    });

    return { enrollment, userWithOutPassword };
  }

  return new ErrorHandler(400, `You've enrolled for this course already!`)


};

const chargeCard = async (userId, payload) => {
  const userDetails = await userService.getOne({
    id: userId,
    isDeleted: false,
  });
  if (!userDetails) throw new ErrorHandler(404, "User Not Found");

  const { firstName, lastName, email, phone } = userDetails;
  const fullname = `${firstName} ${lastName}`;

  const tx_ref = UtilityFeature.generateUniqueValue();
  console.log(tx_ref);

  const payload2 = {
    ...payload,
    pin: payload.pin,
    tx_ref,
    fullname,
    email,
    phone_number: phone,
    enckey: process.env.FLW_SECRET_HASH,
  };

  const {pin, ...withOutPin} = payload2
  console.log("payload2:", payload2)

  try {
    const payment = await paymentService.chargeCard(withOutPin);
    
    // console.log(payment.meta.authorization.mode);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  singleEnrollment,
  chargeCard,
};
