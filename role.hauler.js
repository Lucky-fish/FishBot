const commons = require("commons");
const roomManager = require("room.manager");
const utils = require("utils");

const hauler = {
    run : function(creep) {
        commons.updateEnergy(creep);

        if (!creep.memory.boundTo) {
            const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester");
            const others = _.filter(Game.creeps, (ocreep) => ocreep.memory.role == "hauler" && creep != ocreep);

            for (let i in harvesters) {
                const harvester = harvesters[i];
                let alreadyBound = false;
                for (let j in others) {
                    const other = others[j];
                    if (other.memory.boundTo == harvester.name) {
                        alreadyBound = true;
                    }
                }
                if (alreadyBound) {
                    continue;
                }

                creep.memory.boundTo = harvester.name;
            }
        }
        if (!Game.creeps[creep.memory.boundTo]) {
            delete creep.memory.boundTo;
            return;
        }

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
            const boundedCreep = Game.creeps[creep.memory.boundTo]
            if (utils.distance(creep.pos, boundedCreep.pos) > 2) {
                creep.moveTo(boundedCreep);
            } else {
                const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: function(target) {
                    return target.structureType == STRUCTURE_CONTAINER && target.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity();
                    }});
                creep.withdraw(target, RESOURCE_ENERGY)
            }
        }
    }
};

module.exports = hauler;
