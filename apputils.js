const fs = require('fs');
const path = require('path');

function cleanOldLogFiles(logDirectory, maxAgeInMonths) {
    const currentDate = new Date();
    const maxAgeInMillis = maxAgeInMonths * 30 * 24 * 60 * 60 * 1000; // Convert months to milliseconds
    const files = fs.readdirSync(logDirectory);

    files.forEach((file) => {
        const filePath = path.join(logDirectory, file);
        const fileStat = fs.statSync(filePath);
        const fileAgeInMillis = currentDate - fileStat.ctime;

        if (fileAgeInMillis > maxAgeInMillis) {
            fs.unlinkSync(filePath); // Delete the file
            console.log(`Deleted old log file: ${file}`);
        }
    });
}

module.exports = cleanOldLogFiles;
