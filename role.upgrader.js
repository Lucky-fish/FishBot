var lookForSource = require("lookforsource");

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.a && creep.carry.energy == 0) {
            creep.memory.a = false;
	    }
	    if(!creep.memory.a && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.a = true;
	    }

	    if(creep.memory.a) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            lookForSource.harvest(creep);
        }
	}
};

module.exports = roleUpgrader;