const roleHarvester = require('role.upgrader');
const lookForSource = require('resource');

module.exports = {
    run : function(creep) {
        if(creep.memory.a && creep.carry.energy === 0) {
            creep.memory.a = false;
	    }
	    if(!creep.memory.a && creep.carry.energy === creep.carryCapacity) {
	        creep.memory.a = true;
	    }
	    
	    if (creep.memory.a) {
	    	if (creep.memory.fixing) {
	    		this.repair(creep, Game.getObjectById(creep.memory.fixing));

	    		if (creep.memory.fixTimer >= 10) {
	    			delete creep.memory.fixing;
	    			delete creep.memory.fixTimer;
				} else {
					return;
				}
			}

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

					return e.hits < e.hitsMax && e.structureType === STRUCTURE_WALL;
				}});

			broken.sort(function(a,b) {
	            if (b.structureType === STRUCTURE_RAMPART && b.hits < 400) {
	                return 1;
	            }
	            if (a.structureType === STRUCTURE_RAMPART && a.hits < 400) {
	                return -1;
	            }
	            if (a.structureType === STRUCTURE_ROAD && a.hits < 1000) {
	                return -1;
	            }
	            if (b.structureType === STRUCTURE_ROAD && b.hits < 1000) {
	                return 1;
	            }
	            if (creep.room.memory.fixing == b.id) {
	            	return -1;
				}
	            if (creep.room.memory.fixing == a.id) {
	            	return 1;
				}
	            return a.hits - b.hits;
	        });
	        
	        if (broken.length) {
	            this.repair(creep, broken[0]);
	        } else {
	           roleHarvester.run(creep);
	        }
	    } else {
	        lookForSource.harvest(creep);
        }
    },
	repair : function(creep, target) {
    	if (creep.repair(target) === ERR_NOT_IN_RANGE) {
    		creep.moveTo(target);
		}
    	creep.memory.fixing = target.id;
    	if (!creep.memory.fixTimer) {
    		creep.memory.fixTimer = 1;
		} else if (target.hits > target.hitsMax) {
    		creep.memory.fixTimer = 20;
		} else {
    		creep.memory.fixTimer ++;
		}
	}
};