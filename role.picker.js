/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.picker');
 * mod.thing == 'a thing'; // true
 */
const harvester = require("role.fixer");
module.exports = {
    run : function(creep) {
        const dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if (dropped && creep.carry.energy < creep.carryCapacity) {
            if (creep.pickup(dropped) === ERR_NOT_IN_RANGE) {
                creep.moveTo(dropped);
            }
        } else {
            harvester.run(creep);
        }
    }
};