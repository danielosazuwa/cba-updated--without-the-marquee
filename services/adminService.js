const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ErrorHandler } = require('../helpers/errorHandler');
const prisma = new PrismaClient();
const {LoggerService}  =  require('../customLogger');
const emailService = require('../services/emailService')

const logger = new LoggerService()

const getAll = async () => {

    const [admins, count] = await Promise.all([
        prisma.admin.findMany({
            where:{
                isActive:true
            },
            select:{
                id: true,
                firstName: true,
                lastName:true,
                email: true,
            }
        }),
        prisma.admin.count()
    ]);

    // const sanitizeResult = admins.map(admin =>{
    // const {password, ...withoutPassword} = admin;
    // return withoutPassword;
//   });

    console.log(`count: ${count}`)

    return {
        admins,
        count
    }
}

const getOne = async (criteria)=>{
    return await prisma.admin.findFirst({
        where:{
            ...criteria
        }
    });
}

const viewOne = async (id)=>{
    const foundAdmin = await getOne({id:id});

    if(!foundAdmin) throw new ErrorHandler(404, 'Admin not found');

    const {password, ...adminWithOutPassword} = foundAdmin;

    return adminWithOutPassword;
}

const create = async (payload) => {

    const isAdmin = await getOne({email: payload.email});
    if(isAdmin) console.log(isAdmin)
        
    if(isAdmin) throw new ErrorHandler(409, 'Admin account already exist');

    const passwordHash = await bcrypt.hash(payload.password, saltRounds);

    const newAdmin = await prisma.admin.create({
        data:{
            password: passwordHash,
            firstName:payload.firstName,
            lastName:payload.lastName,
            email:payload.email,
            role:payload.role
        }
    });

    const{email, firstName, role} = newAdmin;

    const subject = `${role} Access Granted`
    const message = `Hi ${firstName}, 
    You've been given an ${role} privilege. Kindly find below your login credentials:
    email: ${email},
    password: ${payload.password}`

    const {password, ...adminWithOutPassword} = newAdmin;
    logger.log(`created admin: ${adminWithOutPassword}`)
    try{
        emailService.newAdmin(email, subject, message);
    }catch(err){
        logger.warn(err)
    }


    return adminWithOutPassword;
}




const login = async (payload, isActive = true) => {

    const foundAdmin = await getOne({email: payload.email, isActive});
    if (!foundAdmin) throw new ErrorHandler(404, 'Email or password is incorrect');

    const match = await bcrypt.compare(payload.password, foundAdmin.password);
    if (!match) throw new ErrorHandler(400, 'Email and password doesn\'t match');

    const {password, ...adminWithOutPassword} = foundAdmin;


    return adminWithOutPassword;

}

const updateAdmin=  async ( id, payload)=>{
    const isAdmin = await getOne({id:id});
    if(!isAdmin) throw new ErrorHandler(404, 'Admin not found');

    const updatedAmin = await prisma.admin.update({
        where: {
            id: id
        },
        data:{
            firstName: payload.firstName,
            lastName: payload.lastName,
        }
    });

    const { password, ...adminWithoutPassword } = updatedAmin;
    logger.log(`updated admin: ${adminWithoutPassword}`)

    return adminWithoutPassword;
}

const viewTrash = async(id)=>{

    const deletedAdmin = await getOne({id: id, isActive:false});
    if(!deletedAdmin) throw new ErrorHandler(404, 'Admin not found');

    const {password, ...adminWithOutPassword} = deletedAdmin;

    return(adminWithOutPassword)
}

const softDeleteAdmin = async(id)=>{
    const admin = await getOne({id: id, isActive: true});
    if(!admin) throw new ErrorHandler(404, 'Admin not found');

    await prisma.admin.update({
        where: {
            id:id
        },
        data:{
            isActive:false
        }
    });

    return 'Admin account suspended successfully...'

}

const restoreDeleteAdmin = async(id)=>{
    const admin = await getOne({id: id, isActive: false});
    if(!admin) throw new ErrorHandler(404, 'Admin not found');

    await prisma.admin.update({
        where: {
            id:id
        },
        data:{
            isActive:true
        }
    });

    return 'Admin account restored successfully...'
}



module.exports = {
    create,
    login,
    viewOne,
    getAll,
    updateAdmin,
    viewTrash,
    softDeleteAdmin,
    restoreDeleteAdmin
}