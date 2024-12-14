const { PrismaClient } = require("@prisma/client");
const { ErrorHandler } = require("../helpers/errorHandler");
const prisma = new PrismaClient();
const { LoggerService } = require("../customLogger");
const logger = new LoggerService();
const slugify = require("slugify");
const courseService = require("./courseService");
const emailService = require("./emailService");

const getAll = async () => {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: false,
    },
    orderBy: {
      firstName: 'asc',
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      ipAddress: true,
      city: true,
      region: true,
      countryCode: true,
      country: true,
      createdAt: true,
      updatedAt: true,
      SingleCourseEnrollment: {
        select: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
      CourseInstallments: {
        select: {
          id: true,
          targetRepeat: true,
          currentRepeat: true,
          course: {
            select: {
              id: true,
              title: true,
              amount_in_GBP: true,
              amount_in_NGN: true,
              amount_in_USD: true,
            },
          },
        },
      },
    },
  });

  return users;
};

const getOne = async (criteria) => {
  return await prisma.user.findFirst({
    where: { ...criteria },
  });
};

const viewOne = async (id) => {
  const user = await getOne({ id: id });
  if (!user) console.log("User Not Found!");
  if (!user) throw new ErrorHandler(404, "User Not Found!");

  const { password, ...withOutPassword } = user;
  return withOutPassword;
};

const create = async (payload) => {
  const user = await getOne({ email: payload.email });

  if (!user) {
    const newUser = await prisma.user.create({
      data: {
        ...payload,
      },
    });

    const subject = `Welcome To DCBA`;
    const message = `Hi ${newUser.firstName},
    You are welcome to DeCareer Builder's Academy. 
    Feel free to enroll for any course of choice.`;

    try {
      emailService.newUSer(newUser.email, subject, message);
    } catch (error) {
      logger.warn(error);
    }

    const { password, ...withOutPassword } = newUser;
    console.log(withOutPassword);

    return withOutPassword;
  }
  {
    const { password, ...withOutPassword } = user;
    return withOutPassword;
  }
};

const updateUser = async (id, payload) => {
  const user = await getOne({ id: id, isDeleted:false });
  if (!user) throw new ErrorHandler(404, "User Not Found!");

  const updateUser = await prisma.user.update({
    where: { id: id },
    data: {
      ...payload, 
    },
  });

  const { password, ...withOutPassword } = updateUser;
  return withOutPassword;
};

const softDeleteUser = async (id) => {
  const user = await getOne({ id: id });
  if (!user) throw new ErrorHandler(404, "User Not Found!");

  const deleteUser = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      isDeleted: true,
    },
  });
  return deleteUser;
};

const Trash = async () => {
  const users = await prisma.user.findMany({
    where: {
      isDeleted: true,
    },
  });

  console.log(users);
  return users;
};

const restoreUser = async (id) => {
  const user = await getOne({ id: id, isDeleted: true });
  if (!user) throw new ErrorHandler(404, "User Not Found!");

  const restoredUser = await prisma.user.update({
    where: {
      id: id,
      isDeleted: true,
    },
  });

  const { password, ...withOutPassword } = restoredUser;

  return withOutPassword;
};

const permanentDelete = async (id) => {
  const user = await getOne({ id: id });
  if (!user) throw new ErrorHandler(404, "User Not Found!");

  const deleteUser = await prisma.user.delete({
    where: {
      id: id,
      isDeleted: true,
    },
  });

  return deleteUser;
};
const login = async () => {};

module.exports = {
  getAll,
  getOne,
  viewOne,
  create,
  updateUser,
  softDeleteUser,
  Trash,
  restoreUser,
  permanentDelete,
};
