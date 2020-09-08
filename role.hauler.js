const commons = require("commons");
const roomManager = require("room.manager");
const utils = require("utils");

const hauler = {
    run : function(creep) {
        commons.updateEnergy(creep);

        if (creep.memory.working) {
            const found = roomManager.find(FIND_MY_STRUCTURES, {filter : function (e) {
                    return e.structureType == STRUCTURE_STORAGE;
                }});

            const broken = roomManager.find(FIND_STRUCTURES, {
                filter: function (e) {
                    return e.hits < e.hitsMax;
                }});

            broken.sort(function(a,b) {
                return utils.distance(a.pos, creep.pos) - utils.distance(b.pos, creep.pos);
            });


            if (broken.length) {
                creep.repair(broken[0]);
            }

            if (found.length) {
                for (let j in found) {
                    const storage = found[j];
                    if (storage.store.getFreeCapacity() <= 0) {
                        continue;
                    }

                    for (let i in creep.store) {
                        if (creep.transfer(storage, i) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                    return;
                }
            } else {
                roleUpgrader.run(creep);
            }
        } else {
            const target = roomManager.find(FIND_STRUCTURES,  {filter: function(target) {
                    return target.structureType == STRUCTURE_CONTAINER && target.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity();
                }});
            target.sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
            if (creep.withdraw(target[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0]);
            }
        }
    }
};

module.exports = hauler;
