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

            if (!exe) {
                result = creep.attack(invader);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(invader);
                }
                exe = result != ERR_NO_BODYPART;
            }
        }

        const damagedCreep = _.filter(Game.creeps, (creep) => creep.hits < creep.hitsMax);
        damagedCreep.sort((a, b) => a.hits - b.hits);

        if (creep.heal(damagedCreep[0]) === ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedCreep[0]);
        }
        
        if (!exe) {
            // move randomly
            var x = creep.memory.targetX;
            var y = creep.memory.targetY;

            if ((Math.abs(creep.pos.x - x) < 1 && Math.abs(creep.pos.y - y) < 1) || (!x)  || (!y) || creep.moveTo(creep.room.getPositionAt(x, y), { reusePath : 50}) == ERR_NO_PATH) {
                creep.memory.targetX = Math.floor(Math.random() * 45) + 2;
                creep.memory.targetY = Math.floor(Math.random() * 45) + 2;
            }
        }
    }
};