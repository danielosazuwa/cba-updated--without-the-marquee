const { PrismaClient } = require("@prisma/client");
const { ErrorHandler } = require('../helpers/errorHandler');
const prisma = new PrismaClient();
const {LoggerService}  =  require('../customLogger')
const logger = new LoggerService();
const slugify = require('slugify')
const moduleService = require('./moduleService')

const getAll = async(moduleId)=>{
    const results = await prisma.lesson.findMany({
        where:{
            moduleId: moduleId,
            isDeleted: false
        }
    });

    return results
}

const getOne = async (criteria)=>{
    return await prisma.lesson.findUnique({
        where:{...criteria}
    });
}

const viewOne = async (id)=>{
    const result = await getOne({ id });

    if (!result) throw new ErrorHandler(404, 'Module Not Found!');

    const lesson = await prisma.lesson.findUnique({
        where: { id },
        include: {
            module:{
                select:{
                    id: true,
                    title: true,
                    slug: true,
                    description: true,
                    isDeleted: true,

                }
            },
            admin: {
                select:{
                    id:true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });

    return lesson; 
}

const createLesson = async(moduleId, payload, adminId)=>{
    const module = await moduleService.getOne({id: moduleId});
    if(!module) throw new ErrorHandler(404, 'Module Not found!');

    const slug = slugify(`${payload.title}`, {lower: true, replacement: '_'});

    const newLesson = await prisma.lesson.create({
        data:{
            title: payload.title,
            slug: slug,
            description: payload.description,
            moduleId: moduleId,
            adminId: adminId,
        }
    });

    console.log(`new lesson`, newLesson);

    return newLesson
}

const updateLesson = async(lessonId, payload)=>{
    const result = await getOne({id: lessonId});
    if(!result) throw new ErrorHandler(404, 'Lesson Not found!');

    const slug = slugify(`${payload.title}`, {lower: true, replacement: '_'});

    const updatedLesson = await prisma.lesson.update({
        where: {
            id: lessonId,
            isDeleted:false
        },
        data:{
            title: payload.title,
            slug: slug,
            description: payload.description,
        }
    });

    return updatedLesson

}

const softDeleteLesson = async(lessonId)=>{
    const lesson = await getOne({id: lessonId, isDeleted: false});

    if(!lesson) throw new ErrorHandler(404, `Lesson not found`);

    const deleteLesson= await prisma.lesson.update({
        where: {
            id:lessonId
        },
        data:{
            isDeleted: true
        }
    });

    return deleteLesson;
}

const restoreDeletedLesson = async(lessonId)=>{
    const lesson = await getOne({id: lessonId, isDeleted: true});

    if(!lesson) throw new ErrorHandler(404, `Lesson not found`);

    const restoreLesson= await prisma.lesson.update({
        where: {
            id:lessonId
        },
        data:{
            isDeleted: false
        }
    });

    return restoreLesson;
}

const viewTrash = async()=>{
    const result = await prisma.lesson.findMany({
        where:{
            isDeleted: true
        }
    });

    console.log(`lesson trash data: `, result);

    return results
}

const permanentDelete = async (lessonId) => {
    const lesson = await getOne({id: lessonId, isDeleted: true});

    if(!lesson) throw new ErrorHandler(404, `Lesson not found`);
    
    // Delete the module itself
    const deletedLesson = await prisma.lesson.delete({
        where: { id: lessonId }
    });

    console.log(`Lesson with ID ${lessonId} has been permanently deleted.`);
    return deletedLesson;
};

module.exports = {
    getAll,
    getOne,
    viewOne,
    createLesson,
    updateLesson,
    softDeleteLesson,
    restoreDeletedLesson,
    viewTrash,
    permanentDelete
}