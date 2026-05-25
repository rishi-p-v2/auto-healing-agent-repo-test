const { bsLocal } = require('../../fixtures');
const { promisify } = require('util');
const sleep = promisify(setTimeout);

module.exports = async () => {

    if (bsLocal && bsLocal.isRunning()) {
        await new Promise(r => bsLocal.stop(r))
    }

};