const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const { ErrorHandler } = require('../helpers/errorHandler');
const prisma = new PrismaClient();
const {LoggerService}  =  require('../customLogger')
const logger = new LoggerService()

const getAll = async () => {
    return prisma.admin.findMany()
}

const getOne = async (criteria)=>{
    return await prisma.admin.findFirst({
        where:{
            ...criteria,
            // isActive:true
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
    
    if(isAdmin) throw new ErrorHandler(400, 'Admin account already exist');

    const passwordHash = await bcrypt.hash(payload.password, saltRounds);

    const newAdmin = await prisma.admin.create({
        data:{
            password: passwordHash,
            firstName:payload.firstName,
            lastName:payload.lastName,
            email:payload.email
        }
    });



    const {password, ...adminWithOutPassword} = newAdmin;
    logger.log(`created admin: ${adminWithOutPassword}`)


    return withOutPassword;
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

const viewTrash = async(id, isActive=false)=>{

    const deletedAdmin = await getOne({id: id, isActive});
    const {password, ...adminWithOutPassword} = deletedAdmin;

    return(adminWithOutPassword)
}



module.exports = {
    create,
    login,
    viewOne,
    getAll,
    updateAdmin,
    viewTrash
}