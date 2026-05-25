const { bsLocal, BS_LOCAL_ARGS } = require('../../fixtures');

module.exports = async () => {
    console.log("Setting Up Local Connection...");
    await new Promise(r => bsLocal.start(BS_LOCAL_ARGS, r));
};