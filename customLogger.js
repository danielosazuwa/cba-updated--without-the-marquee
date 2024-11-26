const winston = require ('winston');

const LoggerService = class {
    constructor(moduleName) {
        this.logger = winston.createLogger({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({ filename: 'combined.log' })
            ],
        });
        this.moduleName = moduleName;
    }

    log(level, message) {
        this.logger.log(level, message, { module: this.moduleName });
    }

    info(message) {
        this.log('info', message);
    }

    warn(message) {
        this.log('warn', message);
    }

    error(message) {
        this.log('error', message);
    }

    debug(message) {
        this.log('debug', message);
    }
};

module.exports= { LoggerService };