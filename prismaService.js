const { PrismaClient } = require('@prisma/client');
const {LoggerService}  =  require('./customLogger')

const prisma = new PrismaClient();
const logger = new LoggerService('app');



const connect = async () => {
    try {
        await prisma.$connect();
        logger.info("Connected to the database successfully 😁😁!");
    } catch (error) {
        logger.error("Failed to connect to the database 🔥🔥🔥:", error);
        throw error;
    }
};

module.exports = { prisma, connect };