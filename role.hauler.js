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
            if (!creep.memory.target) {
                const found = roomManager.find(FIND_STRUCTURES, {
                    filter: function (target) {
                        const haulers = _.filter(Game.creeps, (creepw) => creepw.memory.role === "hauler" && creepw !== creep);
                        for (let i in haulers) {
                            if (haulers[i].target === target.id) {
                                return false;
                            }
                        }

                        return target.structureType == STRUCTURE_CONTAINER && target.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity();
                    }
                });
                found.sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);
                if (!found.length) {
                    return;
                }
                creep.memory.target = found[0].id;
            }
            const target = Game.getObjectById(creep.memory.target);
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        }
    }
};

module.exports = hauler;
