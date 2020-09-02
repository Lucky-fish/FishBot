/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.fixer.storage');
 * mod.thing == 'a thing'; // true
 */

const roleUpgrader = require("role.upgrader");
const lookForSource = require("resource");
const utils = require("utils");

module.exports = {
    run : function(creep) {
		if (creep.memory.a && creep.store.getUsedCapacity() === 0) {
			creep.memory.a = false;
		} else if (!creep.memory.a && creep.getFreeCapacity() === creep.getCapacity()) {
			creep.memory.a = true;
		}
	    
	    if (creep.memory.a) {
			const broken = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (e) => ((e.structureType === STRUCTURE_STORAGE && e.my) || e.structureType === STRUCTURE_CONTAINER) && e.hits < e.hitsMax});

			if (broken) {
	            if (creep.repair(broken) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(broken);
	            }
	        } else {
	           roleUpgrader.run(creep);
	        }
	    } else {
			lookForSource.harvest(creep);
        }
    }
};