/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('lookforsource');
 * mod.thing == 'a thing'; // true
 */
 
var utils = require("utils");
var resourceFinding = {
    normalFinding : function(creep) {
        var containers = creep.room.find(FIND_STRUCTURES, {filter:  (a) => (a.structureType==STRUCTURE_CONTAINER || a.structureType==STRUCTURE_STORAGE) && a.store[RESOURCE_ENERGY] > 0 });
        
        var cs = null;
        if (containers.length) {
            for (var i in containers) {
                var c = containers[i];
                if (c.store && (cs == null || c.store[RESOURCE_ENERGY] > cs.store[RESOURCE_ENERGY])) {
                    if (!cs || (Math.abs(c.store[RESOURCE_ENERGY] - cs.store[RESOURCE_ENERGY]) > 100)) {
                        cs = c;
                    }
                }
            }
            return cs;
        }
        
        var sources = creep.room.find(FIND_SOURCES);
        var s = [];
        for (var i in sources) {
            var source = sources[i];
            if (source.energy != 0) {
                s.push(source);
            }
        }
        s.sort(function(a, b) {
            return utils.distance(a.pos, creep.pos) - utils.distance(b.pos, creep.pos);
        });
        
        return s[0];
    },
    
    lockFinding : function(creep, room) {
        if (creep.memory.lockedResourceId != null) {
            return Game.getObjectById(creep.memory.lockedResourceId);
        }
        
        var sources = creep.room.find(FIND_SOURCES);
        
        for (var i in sources) {
            var locked = false;
            for (var j in Game.creeps) {
                if (Game.creeps[j].memory.lockedResourceId == sources[i].id) {
                    locked = true;
                    break;
                }
            }
            if (!locked) {
                creep.memory.lockedResourceId = sources[i].id;
                return sources[i];
            }
        }
    },
    
    harvest : function(creep) {
        if (!creep.memory.s) {
	        var source = this.normalFinding(creep);
	        if (!source) {
	            return;
	        }
	        creep.memory.s = source.id;
	    }
	    source = Game.getObjectById(creep.memory.s);
	    if (source.structureType) {
	        if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	            creep.moveTo(source);
	        } else {
	            delete creep.memory.s;
	        }
	    } else if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        creep.moveTo(source);
        } else {
            delete creep.memory.s;
        }
    }
}

module.exports = resourceFinding;