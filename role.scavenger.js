/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.picker');
 * mod.thing == 'a thing'; // true
 */
const utils = require("utils");
const roomManger = require("room.manager");

module.exports = {
    run : function(creep) {
        if (creep.memory.a && creep.carry.energy === 0) {
            creep.memory.a = false;
        } else if (!creep.memory.a && creep.carry.energy === creep.carryCapacity) {
            creep.memory.a = true;
        }

        if (!(creep.memory.a) && creep.ticksToLive > 200) {
            let found = roomManger.find(FIND_DROPPED_RESOURCES);
            if (found.length) {
                const target = found[0];
                if (creep.pickup(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                found = roomManger.find(FIND_TOMBSTONES, {filter: function (v) {
                        return v.store.getUsedCapacity() > 0;
                    }});
                if (found.length) {
                    for (let i in found[0].store) {
                        if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                            return;
                        }
                    }
                } else {
                    found = roomManger.find(FIND_RUINS, {filter: function (v) {
                            return v.store.getUsedCapacity() > 0;
                        }});
                    if (found.length) {
                        for (let i in found[0].store) {
                            if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(target);
                                return;
                            }
                        }
                    } else {
                        found = roomManger.find(FIND_STRUCTURES, {filter: function (v) {
                                return v.structureType === STRUCTURE_CONTAINER && v.store.getUsedCapacity() > 0;
                            }});
                        if (found.length) {
                            for (let i in found[0].store) {
                                if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                                    creep.moveTo(found[0]);
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            const found = roomManger.find(FIND_MY_STRUCTURES, {filter : function (e) {
                return e.structureType == STRUCTURE_STORAGE;
                }});

            const broken = roomManger.find(FIND_STRUCTURES, {
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
            }
        }
    }
};