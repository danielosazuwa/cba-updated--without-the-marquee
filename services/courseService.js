const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ErrorHandler } = require('../helpers/errorHandler');
const prisma = new PrismaClient();
const {LoggerService}  =  require('../customLogger')
const logger = new LoggerService();
const slugify = require('slugify')
// const fs = require('fs');
const fs = require('fs').promises;
const path = require('path');

const getAll = async(criteria = {})=>{
    const courses = await prisma.course.findMany({
        where:{
            ...criteria,
            isDeleted: false
        },
        include:{
            Modules:true
        }
    });

    console.log(`list if courses: courses`)
    return courses
}


const getOne = async(criteria)=>{
    return await prisma.course.findUnique({
        where:{
         ...criteria
        },
        include: {
            admin:{
                select:{
                    firstName:true,
                    lastName:true,
                    email:true,
                    isActive:true,
                    role: true
                }
            }
        }

    });
}

const viewOne = async(criteria)=>{

    const course = await prisma.course.findUnique({
        where:{slug:criteria},
        include:{
            admin:{
                select:{
                    id: true,
                    firstName:true,
                    lastName:true,
                    email:true
                }
            },
            Modules:{
                where:{isDeleted: false},
                include:{
                    lessons: true
                }
                
            }
            
        }
    //    include:{
    //     admin:{
    //         select:{
    //             id: true,
    //             firstName:true,
    //             lastName:true,
    //             email:true
    //         },
    //         modules:{
    //             orderBy:{order:'asc'},
    //             where:{isDeleted: false},
    //             // include:{
    //             //     lessons:{
    //             //         orderBy:{order: 'asc'},
    //             //         where:{
    //             //             isDeleted:false
    //             //         }
    //             //     }
    //             // }
    //         }
    //     }
    //    }
    });

    if(!course)console.log('Course Not found!');
    if(!course) throw new ErrorHandler(404, 'Course Not found');
    return course;
}


const create = async(adminId, payload) =>{
    console.log(payload)
    const slug = slugify(`${payload.title}`, {lower: true, replacement: '_'});

    const newCourse = await prisma.course.create({
        data: {
            title: payload.title,
            slug: slug,
            description: payload.description,
            why_list:payload.why_list,
            who_list: payload.who_list,
            amount: payload.amount,
            duration:payload.duration,
            adminId: adminId
        }
    });

    console.log(newCourse)
    return newCourse;

}

const uploadImage = async(courseId, imagePath) =>{
    const course = await getOne({id: courseId});
            console.log(imagePath)

    if(!course) throw new ErrorHandler(404, 'Course Not found'); 

        if (course.image) {
        const imagePath =  course.image;
        fs.unlink(imagePath, (err) => {
            if (err) {
                logger.log(`Failed to delete image: ${err.message}`);
                
            } else {
                logger.log(`Successfully deleted image: ${deletedCourse.image}`);
            }
        });
    }


    const updatedCourse = await prisma.course.update({
        where:{
            id: courseId
        },
        data: {
            image:imagePath
        }
    });

    console.log(updatedCourse)
    return updatedCourse;

}

const updateCourse = async(courseId, payload) =>{
    const course = await getOne({id: courseId});
        console.log(course)

    if(!course) throw new ErrorHandler(404, 'Course Not found'); 
    // const imagePath = `courseAvatar/${imagePath}`;

    const slug = slugify(`${payload.title}`, {lower: true, replacement: '_'});
    const updatedCourse = await prisma.course.update({
        where:{
            id: courseId
        },
        data: {
            title: payload.title,
            slug: slug,
            description: payload.description,
            why_list:payload.why_list,
            who_list: payload.who_list,
            amount: payload.amount,
            duration:payload.duration
        }
    });

    console.log(updatedCourse)
    return updatedCourse;

}

const trash = async()=>{
    const deletedCourses = await prisma.course.findMany({
        where:{
            isDeleted: true
        }
    });

    // console.log(deletedCourses);

    return deletedCourses;
}

const softDeleteCourse = async(courseId)=>{
    const deletedCourse = await getOne({id: courseId, isDeleted: false})
    if(!deletedCourse) throw new ErrorHandler(404, 'Course not found')

    const removeCourse = await prisma.course.update({
        where:{
            id:courseId
        },
        data:{
            isDeleted: true
        }
    });

    console.log(removeCourse)

    return removeCourse;
}

const restoreCourse = async(courseId)=>{
    const deletedCourse = await getOne({id: courseId, isDeleted: true})
    if(!deletedCourse) throw new ErrorHandler(404, 'Course not found')

    const removeCourse = await prisma.course.update({
        where:{
            id:courseId
        },
        data:{
            isDeleted: false
        }
    });

    console.log(removeCourse)

    return removeCourse;
}


// const permanentDeleteCourse = async (courseId) => {

//     const deletedCourse = await getOne({ id: courseId, isDeleted: true });
//     console.log(deletedCourse)
//     if (!deletedCourse) throw new ErrorHandler(404, 'Course not found');
    

//     if (deletedCourse.image) {
//         const imagePath =  deletedCourse.image;
//         fs.unlink(imagePath, (err) => {
//             if (err) {
//                 logger.log(`Failed to delete image: ${err.message}`);
                
//             } else {
//                 logger.log(`Successfully deleted image: ${deletedCourse.image}`);
//             }
//         });
//     }

//     const removeCourse = await prisma.course.delete({
//         where: {
//             id: courseId,
//         },
//     });

//     console.log(removeCourse);
//     return removeCourse;
// };


const permanentDeleteCourse = async (courseId) => {
    
    const deletedCourse = await prisma.course.findUnique({
        where: { id: courseId, isDeleted: true },
        include: {
            Modules: { 
                select: {
                    id: true,
                    lessons: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });

    if (!deletedCourse) throw new ErrorHandler(404, 'Course not found');

    if (deletedCourse.image) {
        try {
            await fs.unlink(deletedCourse.image);
            logger.log(`Successfully deleted image: ${deletedCourse.image}`);
        } catch (err) {
            logger.log(`Failed to delete image: ${err.message}`);
        }
    }

   
    const modules = deletedCourse.Modules || [];
    if (modules.length === 0) {
        const removeCourse = await prisma.course.delete({
            where: { id: courseId },
        });
        logger.log(`Deleted course with ID: ${removeCourse.id}`);
        return removeCourse;
    }

    const deletePromises = [];

    for (const module of modules) {
        const lessonIds = module.lessons.map(lesson => lesson.id);
        
        if (lessonIds.length > 0) {
            deletePromises.push(
                prisma.lesson.deleteMany({ where: { id: { in: lessonIds } } })
            );
            logger.log(`Prepared to delete lessons with IDs: ${lessonIds.join(', ')}`);
        }

        deletePromises.push(
            prisma.module.delete({ where: { id: module.id } })
        );
        logger.log(`Prepared to delete module with ID: ${module.id}`);
    }

    await Promise.all(deletePromises);

    const removeCourse = await prisma.course.delete({
        where: { id: courseId },
    });

    logger.log(`Deleted course with ID: ${removeCourse.id}`);
    return removeCourse;
};

module.exports = {
    getAll,
    getOne,
    viewOne,
    create,
    uploadImage,
    updateCourse,
    trash,
    softDeleteCourse,
    restoreCourse,
    permanentDeleteCourse
}