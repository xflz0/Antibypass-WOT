const fs = require('fs-extra');
const path = require('path');

const startPaths = ['C:\\', 'D:\\'];
const processName = 'WorldOfTanks.exe';
const excludedDirectories = new Set(['Windows', 'ProgramData']);

async function isExcludedDirectory(directory) {
    return excludedDirectories.has(directory.toLowerCase());
}

async function isAccessible(filePath) {
    try {
        await fs.access(filePath, fs.constants.F_OK);
        return true;
    } catch (error) {
        return false;
    }
}

async function searchFile(startPath, fileName) {
    try {
        const stack = [startPath];

        while (stack.length > 0) {
            const currentPath = stack.pop();
            const dir = await fs.opendir(currentPath);

            for await (const dirent of dir) {
                const filePath = path.join(currentPath, dirent.name);

                if (dirent.isDirectory() &&
                    !(await isExcludedDirectory(dirent.name)) &&
                    await isAccessible(filePath)) {
                    stack.push(filePath);
                } else if (dirent.isFile() &&
                    dirent.name.toLowerCase() === fileName.toLowerCase() &&
                    await isAccessible(filePath)) {
                    return filePath;
                }
            }
        }
    } catch (err) { }
}

for (const startPath of startPaths) {
    searchFile(startPath, processName)
        .then(result => {
            if (result) {
                clearLogsAndMods(result);
            }
        })
        .catch(err => console.error(`Could not find WorldOfTanks`));
}

function hasDigitOneInPath(name) {
    return /\b1\b/.test(name);
}

function clearLogsAndMods(basePath) {
    const folderMods = basePath.replace('WorldOfTanks.exe', 'mods');
    const folderResMods = basePath.replace('WorldOfTanks.exe', 'res_mods');
    const folderLogs = basePath.replace('WorldOfTanks.exe', 'win64\\Logs');
    const folderReports = basePath.replace('WorldOfTanks.exe', 'win64\\Reports');

    try {
        const modsContent = fs.readdirSync(folderMods);
        for (const item of modsContent) {
            const itemPath = path.join(folderMods, item);
            if (hasDigitOneInPath(item)) {
                fs.emptyDirSync(itemPath);
            } else {
                fs.removeSync(itemPath);
            }
        }

        const resModsContent = fs.readdirSync(folderResMods);
        for (const item of resModsContent) {
            const itemPath = path.join(folderResMods, item);
            if (hasDigitOneInPath(item)) {
                fs.emptyDirSync(itemPath);
            } else {
                fs.removeSync(itemPath);
            }
        }

        const logsContent = fs.readdirSync(folderLogs);
        for (const item of logsContent) {
            const itemPath = path.join(folderLogs, item);
            fs.removeSync(itemPath);
        }

        const reportsContent = fs.readdirSync(folderReports);
        for (const item of reportsContent) {
            const itemPath = path.join(folderReports, item);
            fs.removeSync(itemPath);
        }

        console.log(`Cleaning was successful`);
    } catch (error) {
        console.error(`An error occurred while cleaning files`);
    }
}

