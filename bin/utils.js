const colors = require('colors/safe');
const cp     = require('child_process');


module.exports = {
    errorLog, getBuildVersion, getProjectName
};


function getProjectName() {
    try {
        return require('../package').name;
    } catch (err) {
        errorLog(err, 'Failed to get the project name');
    }
}

function getBuildVersion() {
    try {
        const packageJson = require('../package');
        return `${packageJson.version}-${getHashCommit()}`;

    } catch (err) {
        errorLog(err, 'Failed to get the build version');
    }
}

function getHashCommit() {
    try {
        return cp.execSync('git rev-parse --short HEAD').toString().trim();
    } catch (err) {
        errorLog(err, 'Failed to get SHA-1 sum for current commit');
    }
}

function reportFailedReason(reason) {
    console.log(colors.red(`✖ - ${reason}`));
}

function errorLog(err, reason) {
    reportFailedReason(reason);
    console.error(err);
    process.exit(1);
}
