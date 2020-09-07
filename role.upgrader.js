const lookForSource = require("resource");
const commons = require("commons");
const roomManager = require("room.manager");

const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        commons.updateEnergy(creep);

        if (creep.memory.working) {
            const controller = roomManager.getOwnController();
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
            }
            if ((!controller.sign) || (controller.sign.username !== "Death_fish")) {
                if (creep.signController(controller, "喵") === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            }
        } else {
            lookForSource.harvest(creep);
        }
    }
};

module.exports = roleUpgrader;