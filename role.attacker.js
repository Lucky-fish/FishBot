/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run : function(creep) {
        let exe = false;
        const invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (invader) {
            let result = creep.rangedAttack(invader);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(invader);
            }
            exe = result != ERR_NO_BODYPART;

            result = creep.attack(invader);
            if (result === ERR_NOT_IN_RANGE) {
                creep.moveTo(invader);
            }
            exe = exe || result != ERR_NO_BODYPART;
        }

        const damagedCreep = _.filter(Game.creeps, (creep) => creep.hits < creep.hitsMax);
        damagedCreep.sort((a, b) => a.hits - b.hits);

        if (creep.heal(damagedCreep[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedCreep[0]);
        }
        
        if (!exe) {
            // move randomly
            const x = creep.memory.targetX;
            const y = creep.memory.targetY;

            let success = false;
            if (x && y) {
                const result = creep.moveTo(x, y);
                if (result == OK || result == ERR_TIRED) {
                    success = true;
                }
            }

            if ((Math.abs(creep.pos.x - x) < 1 && Math.abs(creep.pos.y - y) < 1) || (!success)) {
                creep.memory.targetX = Math.floor(Math.random() * 45) + 2;
                creep.memory.targetY = Math.floor(Math.random() * 45) + 2;
            }
        }
    }
};