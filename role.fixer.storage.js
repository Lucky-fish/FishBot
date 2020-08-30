/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.fixer.storage');
 * mod.thing == 'a thing'; // true
 */

const roleHarvester = require("role.harvester");
const lookForSource = require("lookforsource");
const utils = require("utils");

module.exports = {
    run : function(creep) {
        if(creep.memory.a && creep.carry.energy === 0) {
            creep.memory.a = false;
	    }
	    if(!creep.memory.a && creep.carry.energy === creep.carryCapacity) {
	        creep.memory.a = true;
	    }
	    
	    if (creep.memory.a) {
			const broken = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (e) => ((e.structureType === STRUCTURE_STORAGE && e.my) || e.structureType === STRUCTURE_CONTAINER) && e.hits < e.hitsMax});

			if (broken) {
	            if (creep.repair(broken) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(broken);
	            }
	        } else {
	           roleHarvester.run(creep);
	        }
	    } else {
			lookForSource.harvest(creep);
        }
    }
};