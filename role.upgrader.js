const lookForSource = require("resource");

const roleUpgrader = {

    /** @param {Creep} creep **/
    run: function (creep) {

        if (creep.memory.a && creep.carry.energy === 0) {
            creep.memory.a = false;
        }
        if (!creep.memory.a && creep.carry.energy === creep.carryCapacity) {
            creep.memory.a = true;
        }

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