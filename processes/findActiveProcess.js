const ps = require('ps-node');
const { promisify } = require('util');

const lookupAsync = promisify(ps.lookup);

async function findActiveProcces(processNames) {
    for (const processName of processNames) {
        const resultList = await lookupAsync({ command: processName });
        if (resultList.length > 0) {
            console.log(`Antibypass activate: ${processName}`);
            return true
        } else {
            return false
        }
    }
}

module.exports = { findActiveProcces };
