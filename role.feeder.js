const roleBuilder = require("role.builder");
const lookForSource = require("resource");
const roomManager = require("room.manager");
const utils = require("utils");
const commons = require("commons");
const roleFeeder = {
    /** @param {Creep} creep **/
    run: function (creep) {
        commons.updateEnergy(creep);
        if (!creep.memory.working) {
            lookForSource.harvest(creep);
        } else {
            const targets = roomManager.find(FIND_STRUCTURES, {
                filter: function (structure) {
                    return (structure.structureType === STRUCTURE_EXTENSION ||
                        structure.structureType === STRUCTURE_SPAWN ||
                        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                }
            });
            targets.sort(function (a, b) {
                if (a.structureType === STRUCTURE_TOWER) {
                    return 1;
                } else if (b.structureType === STRUCTURE_TOWER) {
                    return -1;
                }
                return utils.distance(a.pos, creep.pos) - utils.distance(b.pos, creep.pos);
            });
            if (targets.length > 0) {
                if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } else {
                roleBuilder.run(creep);
            }
        }
    }
};

module.exports = roleFeeder;