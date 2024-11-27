const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ErrorHandler } = require('../helpers/errorHandler');
const prisma = new PrismaClient();
const {LoggerService}  =  require('../customLogger')
const logger = new LoggerService();
const slugify = require('slugify')


const getAll = async()=>{
    const courses = await prisma.course.findMany({
        where:{},
        include:{
            Module:true
        }
    });

    console.log(`list if courses: ${courses}`)
    return courses
}

const getOne = async(criteria)=>{
    return await prisma.course.findFirst({
        where:{
         ...criteria
        }
    });
}

const viewOne = async(slug)=>{
    const course = await getOne({slug:slug, isDeleted: false});
    if(!course)console.log('Admin account already exist');
    if(!course) throw new ErrorHandler(400, 'Admin account already exist');

    console.log(course);
    return course;
}

const create = async(adminId, payload) =>{
    const slug = slugify(`${payload.title}`);

    const newCourse = await prisma.course.create({
        data: {
            title: payload.title,
            slug: slug,
            description: payload.description,
            why_list:payload.why_list,
            who_list: payload.who_list,
            price: payload.price,
            duration:payload.duration
        }
    })
}

module.exports = {
    getAll,
    getOne,
    viewOne
}