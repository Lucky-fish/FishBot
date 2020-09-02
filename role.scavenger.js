/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.picker');
 * mod.thing == 'a thing'; // true
 */
const utils = require("utils");

module.exports = {
    run : function(creep) {
        if (creep.memory.a && creep.store.getUsedCapacity() === 0) {
            creep.memory.a = false;
        } else if (!creep.memory.a && creep.store.getFreeCapacity() === creep.store.getCapacity()) {
            creep.memory.a = true;
        }

        if (!creep.memory.a) {
            let found = creep.room.find(FIND_DROPPED_RESOURCES);
            if (found.length) {
                const target = found[0];
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            found = creep.room.find(FIND_TOMBSTONES, {filter: (v, i, a) => v.store.getUsedCapacity() > 0});
            if (found.length) {
                for (let i in found[0].store) {
                    if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        return;
                    }
                }
            }
            found = creep.room.find(FIND_RUINS, {filter: (v, i, a) => v.store.getUsedCapacity() > 0});
            if (found.length) {
                for (let i in found[0].store) {
                    if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        return;
                    }
                }
            }
            found = creep.room.find(FIND_STRUCTURES, {filter: (v, i, a) => v.store.getUsedCapacity() > 0 && v.structureType === STRUCTURE_CONTAINER});
            if (found.length) {
                for (let i in found[0].store) {
                    if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        return;
                    }
                }
            }
        } else {
            const found = creep.room.find(FIND_MY_STRUCTURES, {filter : {structureType : STRUCTURE_STORAGE}});

            const broken = creep.room.find(FIND_STRUCTURES, {
                filter(e) {
                    const creeps = _.filter(Game.creeps, (creep) => creep.memory.role === 'fixer');
                    for (let i in creeps) {
                        const check = creeps[i];
                        if (check === creep) {
                            continue;
                        }
                        if (check.memory.fixing && check.memory.fixing === e.id) {
                            return false;
                        }
                    }

                    return e.hits < e.hitsMax && (e.structureType === STRUCTURE_WALL || (e.structureType === STRUCTURE_ROAD));
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
            }
        }
    }
};