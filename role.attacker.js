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
            if (creep.body.indexOf(ATTACK) !== -1) {
                if (creep.attack(invader) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(invader);
                }
                exe = true;
            }
            if (creep.body.indexOf(RANGED_ATTACK) !== -1) {
                if (creep.rangedAttack(invader) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(invader);
                }
                exe = true;
            }
        }
        
        if (creep.body.indexOf(HEAL) !== -1) {
            const damagedCreep = _.filter(Game.creeps, (creep) => creep.hits < creep.hitsMax);
            damagedCreep.sort((a, b) => a.hits - b.hits);
            
            if (creep.heal(damagedCreep[0]) === ERR_NOT_IN_RANGE) {
                creep.moveTo(damagedCreep[0]);
            }
            exe = true;
        }
        
        if (!exe) {
            creep.moveTo(Game.flags["back"]);
        }
    }
};