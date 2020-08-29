var roleHarvester = require('role.upgrader');
var lookForSource = require('lookforsource');

module.exports = {
    run : function(creep) {
        if(creep.memory.a && creep.carry.energy == 0) {
            creep.memory.a = false;
	    }
	    if(!creep.memory.a && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.a = true;
	    }
	    
	    if (creep.memory.a) {
	        var broken = creep.room.find(FIND_STRUCTURES, {filter: (e) => (e.hits < e.hitsMax && (e.structureType == STRUCTURE_WALL || e.my)) || (e.structureType == STRUCTURE_ROAD) || (e.structureType == STRUCTURE_RAMPART)});
	        
	        broken.sort(function(a,b) {
	            if (b.structureType == STRUCTURE_RAMPART && b.hits < 400) {
	                return 1;
	            }
	            if (a.structureType == STRUCTURE_RAMPART && a.hits < 400) {
	                return -1;
	            }
	            if (a.structureType == STRUCTURE_ROAD && a.hits < 1000) {
	                return -1;
	            }
	            if (b.structureType == STRUCTURE_ROAD && b.hits < 1000) {
	                return -1;
	            }
	            return a.hits - b.hits;
	        });
	        
	        if (broken.length) {
	            if (creep.repair(broken[0]) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(broken[0]);
	            }
	        } else {
	           roleHarvester.run(creep);
	        }
	    } else {
	        lookForSource.harvest(creep);
        }
    }
};