const fs = require('fs-extra');
const path = require('path');

function isExcludedDirectory(directoryName) {
    const excludedDirectories = ['Windows', 'Users', 'Program Files', 'Program Files (x86)', 'win32'];
    return excludedDirectories.includes(directoryName);
}

function findFile(startPaths, targetFileNames) {
    const foundFiles = [];

    for (const startPath of startPaths) {
        const stack = [startPath];

        while (stack.length > 0) {
            const currentPath = stack.pop();

            try {
                const files = fs.readdirSync(currentPath);

                for (const file of files) {
                    const filePath = path.join(currentPath, file);

                    try {
                        const stat = fs.statSync(filePath);

                        if (stat.isDirectory()) {
                            const directoryName = path.basename(filePath);

                            if (!isExcludedDirectory(directoryName)) {
                                stack.push(filePath);
                            }
                        } else if (targetFileNames.includes(file)) {
                            foundFiles.push(filePath);
                        }
                    } catch (error) { }
                }
            } catch (error) { }
        }
    }
    return foundFiles;
}

module.exports = { findFile };
