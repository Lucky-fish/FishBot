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
const commons = require("commons");
const roleUpgrader = require("role.upgrader");

module.exports = {
    run : function(creep) {
        commons.updateEnergy(creep);

        if (!(creep.memory.working) && creep.ticksToLive <= 200) {
            creep.suicide();
        }

        if (!(creep.memory.working) && creep.ticksToLive > 200) {
            let found = roomManger.find(FIND_TOMBSTONES, {filter: function (v) {
                    return v.store.getUsedCapacity() > 0;
                }});
            found.sort(function(a,b) { // prefers further.
                return utils.distance(b.pos, creep.pos) - utils.distance(a.pos, creep.pos);
            });
            if (found.length) {
                const target = found[0];
                for (let i in found[0].store) {
                    if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(found[0]);
                        return;
                    }
                }

            } else {
                found = roomManger.find(FIND_DROPPED_RESOURCES, {filter: function(v) {
                    return v.amount >= 10;
                    }});
                if (found.length) {
                    if (creep.withdraw(target) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    found = roomManger.find(FIND_RUINS, {filter: function (v) {
                            return v.store.getUsedCapacity() > 0;
                        }});
                    found.sort(function(a,b) { // prefers further.
                        return utils.distance(b.pos, creep.pos) - utils.distance(a.pos, creep.pos);
                    });
                    if (found.length) {
                        for (let i in found[0].store) {
                            if (creep.withdraw(found[0], i) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(found[0]);
                                return;
                            }
                        }
                    } else {
                        found = roomManger.find(FIND_STRUCTURES, {filter: function (v) {
                                return v.structureType === STRUCTURE_CONTAINER && v.store.getUsedCapacity() > 0;
                            }});
                        if (found.length) {
                            found.sort(function(a,b) { // prefers further.
                                return utils.distance(b.pos, creep.pos) - utils.distance(a.pos, creep.pos);
                            });
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
            } else {
                roleUpgrader.run(creep);
            }
        }
    }
};