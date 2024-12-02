const { PrismaClient } = require("@prisma/client");
const { ErrorHandler } = require('../helpers/errorHandler');
const prisma = new PrismaClient();
const {LoggerService}  =  require('../customLogger')
const logger = new LoggerService();
const slugify = require('slugify')
const courseService = require('./courseService')

const getAll = async(courseId)=>{
    const results = await prisma.module.findMany({
        where:{
            courseId: courseId,
            isDeleted: false
        }
    });

    console.log(`Module data: `, results);

    return results
}

const getOne = async (criteria)=>{
    return await prisma.module.findUnique({
        where:{...criteria}
    });
}

const viewOne = async (id)=>{
    const module = await getOne({ id });

    if (!module) throw new ErrorHandler(404, 'Module Not Found!');

    const moduleWithLessons = await prisma.module.findUnique({
        where: { id },
        include: {
            lessons: true
        }
    });

    return moduleWithLessons; 
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
        }
    });

    return updatedModule

}

const softDeleteModule = async(moduleId)=>{
    const module = await getOne({id: moduleId, isDeleted: false});

    if(!module) console.log('not found')
    if(!module) throw new ErrorHandler(404, `Module not found`);

    const deleteModule = await prisma.module.update({
        where: {
            id:moduleId
        },
        data:{
            isDeleted: true
        }
    });

    return deleteModule;
}

const restoreDeletedModule = async(moduleId)=>{
    const module = await getOne({id: moduleId, isDeleted: true});

    if(!module) console.log('not found')
    if(!module) throw new ErrorHandler(404, `Module not found`);

    const restoreModule = await prisma.module.update({
        where: {
            id:moduleId
        },
        data:{
            isDeleted: false
        }
    });

    return restoreModule;
}

const viewTrash = async()=>{
    const results = await prisma.module.findMany({
        where:{
            isDeleted: true
        }
    });

    console.log(`Module data: `, results);

    return results
}

const permanentDelete = async (moduleId) => {
   
    const module = await prisma.module.findUnique({
        where: {
            id: moduleId,
            isDeleted: true
        },
        include: {
            lessons: {
                select: {
                    id: true
                }
            }
        }
    });

    if (!module) {
        throw new ErrorHandler(404, `Module not found`);
    }

    const lessonIds = module.lessons.map(lesson => lesson.id);
    if (lessonIds.length > 0) {
        await prisma.lesson.deleteMany({
            where: {
                id: { in: lessonIds }
            }
        });
        console.log(`Deleted lessons with IDs: ${lessonIds.join(', ')}`);
    }

    // Delete the module itself
    await prisma.module.delete({
        where: { id: moduleId }
    });

    console.log(`Module with ID ${moduleId} has been permanently deleted.`);
};

module.exports = {
    getAll,
    getOne,
    viewOne,
    createModule,
    updateModule,
    softDeleteModule,
    restoreDeletedModule,
    viewTrash,
    permanentDelete
}