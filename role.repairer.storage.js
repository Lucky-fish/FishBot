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
const commons = require("commons");
const roomManager = require("room.manager");

module.exports = {
    run : function(creep) {
		commons.updateEnergy(creep);
	    
	    if (creep.memory.working) {
			const broken = roomManager.find(FIND_STRUCTURES, {filter: function (e) {
					return ((e.structureType === STRUCTURE_STORAGE && e.my) || e.structureType === STRUCTURE_CONTAINER) && e.hits < e.hitsMax;
				}});

			if (broken.length) {
	            if (creep.repair(broken[0]) === ERR_NOT_IN_RANGE) {
	                creep.moveTo(broken[0]);
	            }
	        } else {
	           roleUpgrader.run(creep);
	        }
	    } else {
			lookForSource.harvest(creep);
        }
    }
};