const { PrismaClient } = require("@prisma/client");
const { ErrorHandler } = require('../helpers/errorHandler');
const prisma = new PrismaClient();
const {LoggerService}  =  require('../customLogger')
const logger = new LoggerService();
const slugify = require('slugify')
const courseService = require('./courseService')

const getAll = async()=>{
    const results = await prisma.module.findMany({
        where:{
            isDeleted: false
        }
    });

    console.log(`Module data: `, results);

    return results
}

const getOne = async (criteria)=>{
    await prisma.module.findUnique({
        where:{...criteria}
    });
}

const viewOne = async (id)=>{
    const module = await getOne({id});
    
    if(!module) throw new ErrorHandler(404, 'Module Not Found!');

    console.log(module);
    return module;
}

const createModule = async(courseId, payload, adminId)=>{
    const course = await courseService.getOne({id: courseId});
    if(!course) throw new ErrorHandler(404, 'Course Not found!');

    const slug = slugify(`${payload.title}`, {lower: true, replacement: '_'});

    const newModule = await prisma.module.create({
        data:{
            title: payload.title,
            slug: slug,
            description: payload.description,
            courseId: courseId,
            adminId: adminId,
        }
    });

    console.log(`new module`, newModule);

    return newModule
}

const updateModule = async(moduleId, payload)=>{
    const module = await getOne({id: moduleId});
    if(!module) throw new ErrorHandler(404, 'Course Not found!');

    const slug = slugify(`${payload.title}`, {lower: true, replacement: '_'});

    const updatedModule = await prisma.module.update({
        where: {
            id: moduleId,
            isDeleted:false
        },
        data:{
            title: payload.title,
            slug: slug,
            description: payload.description,
            courseId: courseId,
            adminId: adminId,
        }
    });

    console.log(`updated Module:`, updatedModule);

    return updatedModule

}

module.exports = {
    getAll,
    getOne,
    viewOne,
    createModule,
    updateModule
}