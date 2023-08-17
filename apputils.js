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

function isValidAmount(amount) {
    if (typeof amount !== 'string') {
        return false;
    }

    // Use regular expression to check if the string consists of digits and an optional decimal point
    if (!/^\d+(\.\d{1,2})?$/.test(amount)) {
        return false;
    }

    // Convert the string to a number and check if it's a valid numerical value
    const numericValue = parseFloat(amount);
    if (isNaN(numericValue) || numericValue <= 0) {
        return false;
    }

    return true;
}

// logger middleware
// app.use((req, res, next) => {
//     infoAsync(`Received request: ${req.method} ${req.originalUrl}`);
//     const startTime = new Date();

//     const originalSend = res.send;
//     res.send = function (data) {
//         const endTime = new Date();
//         const responseTime = endTime - startTime;
//         infoAsync(`Sent response: ${req.method} ${req.originalUrl} - ${res.statusCode} (${responseTime} ms)`);
//         originalSend.call(this, data);
//     };

//     const originalJson = res.json;
//     res.json = function (data) {
//         if (res.statusCode >= 400) {
//             errorAsync(`Error in response: ${req.method} ${req.originalUrl} - ${res.statusCode}`);
//         }
//         originalJson.call(this, data);
//     };

//     const originalEnd = res.end;
//     res.end = function (data) {
//         if (res.statusCode >= 400) {
//             errorAsync(`Error in response: ${req.method} ${req.originalUrl} - ${res.statusCode}`);
//         }
//         originalEnd.call(this, data);
//     };

//     next();
// });

module.exports = {
    isValidAmount: isValidAmount
};
