const { ErrorHandler } = require('./errorHandler');

const uploadFile = (files) => {
    if (!files || Object.keys(files).length === 0) {
        throw new ErrorHandler(400, 'No files were uploaded.');
    }
    const uploadedFiles = Array.isArray(files.evidences) ? [...files.evidences] : [files.evidences];
    return uploadedFiles.map(file => {
        // check file type
        const ext = file.name.split('.').pop();
        const photoName = `case_files/${process.hrtime()[1]}.${ext}`;
        const uploadPath = require('path').resolve(__dirname, '../public/', photoName);
        file.mv(uploadPath);
        return photoName;
    });
}

module.exports = {
    uploadFile
}