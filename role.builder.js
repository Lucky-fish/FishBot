const roleUpgrader = require("role.upgrader");
const lookForSource = require("lookforsource");
const utils = require("utils");

const roleBuilder = {

	/** @param {Creep} creep **/
	run: function (creep) {

		if (creep.memory.a && creep.carry.energy === 0) {
			creep.memory.a = false;
		} else if ((!creep.memory.a) && creep.carry.energy === creep.carryCapacity) {
			creep.memory.a = true;
		}

		if (creep.memory.a) {
			const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
			if (targets.length) {
				if (utils.distance(creep.pos, targets[0].pos) < 3) {
					if (creep.move(LEFT)) { // free the source...
						if (creep.move(BOTTOM)) {
							if (creep.move(TOP)) {
								if (creep.move(RIGHT)) {
									if (creep.move(TOP_LEFT)) {
										if (creep.move(TOP_RIGHT)) {
											if (creep.move(BOTTOM_LEFT)) {
												creep.move(BOTTOM_RIGHT);
											}
										}
									}
								}
							}
						}
					}
				}
				if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0]);
				}
			} else {
				roleUpgrader.run(creep);
			}
		} else {
			lookForSource.harvest(creep);
		}
	}
};

module.exports = roleBuilder;