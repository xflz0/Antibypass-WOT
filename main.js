const { blockInternetAccess } = require('./processes/blockInternetAccess');
const { findFile } = require('./processes/findFile');
const { findActiveProcces } = require('./processes/findActiveProcess');
const { runGame } = require('./Shortcut/runGame');

const processNames = ['cef_subprocess.exe', 'cef_browser_process.exe'];
const startPaths = ['C:\\', 'D:\\'];
const processPath = findFile(startPaths, processNames);
const WorldOfTanksPath = findFile(startPaths, ['WorldOfTanks.exe']);
if (processPath.length < 1) {
    console.log('Not found WorldOfTanks');
    return setTimeout(() => {
        process.exit(0);
    }, 10000);
} else {
    console.log('Wait for the game to launch...');
}

let interval = setInterval(async () => {
    const check = await findActiveProcces(['WorldOfTanks.exe']);
    if (check === true) {
        clearInterval(interval);
    }
}, 5000);

blockInternetAccess(processNames, processPath);
runGame(WorldOfTanksPath[1]);








