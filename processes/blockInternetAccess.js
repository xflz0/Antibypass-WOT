const { exec } = require('child-process-promise');

async function blockInternetAccess(names, paths) {
    for (const [index, processName] of names.entries()) {
        const processPath = paths[index];
        const ruleName = `Block_${processName}`;
        
        const ruleExists = await doesRuleExist(ruleName);

        if (!ruleExists) {
            await exec(`netsh advfirewall firewall add rule name="${ruleName}" dir=out action=block program="${processPath}" enable=yes`);
        }
    }
}

async function doesRuleExist(ruleName) {
    try {
        const result = await exec(`netsh advfirewall firewall show rule name="${ruleName}"`);
        return result.stdout.includes('Rule Name:');
    } catch (error) {
        return false;
    }
}


module.exports = { blockInternetAccess }