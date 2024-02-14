const fs = require('fs-extra');
const { exec } = require('child_process');

function isFileReadOnly(filePath) {
    try {
        const stats = fs.statSync(filePath);
        const isReadOnly = !(stats.mode & parseInt('0200', 8));
        return isReadOnly;
    } catch (error) {
        return false;
    }
}

function deleteLogsAndSetReadOnly(pythonPath) {
    try {
        if (!isFileReadOnly(pythonPath)) {
            fs.truncateSync(pythonPath, 0);
            fs.chmodSync(pythonPath, 0o444);
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

function runGame(executablePath) {
    const pythonPath = executablePath.replace('WorldOfTanks.exe', 'python.log');
    deleteLogsAndSetReadOnly(pythonPath);
    exec(executablePath, (error, stderr) => {
        if (error) {
            return false;
        }
        if (stderr) {
            return false;
        }
    });
}



module.exports = { runGame };
