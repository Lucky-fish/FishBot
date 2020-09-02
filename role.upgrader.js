const lookForSource = require("resource");
const commons = require("commons");

const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {
        commons.updateEnergy(creep);

        if (creep.memory.a) {
            const controller = creep.room.controller;
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if ((!controller.sign) || (controller.sign.username !== "Death_fish")) {
                if (creep.signController(controller, "喵") === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        } else {
            lookForSource.harvest(creep);
        }
    }
};

module.exports = roleUpgrader;