const roleUpgrader = require("role.upgrader");
const lookForSource = require("resource");
const utils = require("utils");
const roomManager = require("room.manager");
const commons = require("commons");

const roleBuilder = {
	/** @param {Creep} creep **/
	run: function (creep) {
		commons.updateEnergy(creep);

		if (creep.memory.a) {
			const targets = roomManager.find(FIND_CONSTRUCTION_SITES);
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
				creep.room.memory.building = true;
			} else {
				if (creep.room.memory.building) {
					Game.notify("It seems that there is nothing to build, so " + creep.name + " would upgrade the room controller now.");
				}
				creep.room.memory.building = false;
				roleUpgrader.run(creep);
			}
		} else {
			lookForSource.harvest(creep);
		}
	}
};

module.exports = roleBuilder;