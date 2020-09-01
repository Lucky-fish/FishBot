/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.picker');
 * mod.thing == 'a thing'; // true
 */
module.exports = {
    run : function(creep) {
        if (creep.memory.a && creep.carry.energy === 0) {
            creep.memory.a = false;
        } else if (!creep.memory.a && creep.carry.energy === creep.carryCapacity) {
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
            found = creep.room.find(FIND_RUINS, {filter: creep.room.find(FIND_TOMBSTONES, {filter: (v, i, a) => v.store.getUsedCapacity() > 0})});
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
            if (found.length) {
                for (let j in found) {
                    const storage = found[j];
                    if (storage.store.getFreeCapacity() <= 0) {
                        continue;
                    }

                    for (let i in creep.store) {
                        creep.transfer(storage, i);
                    }
                    return;
                }
            }
        }
    }
};