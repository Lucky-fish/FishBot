/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.attacker');
 * mod.thing == 'a thing'; // true
 */

const roomManager = require("room.manager");
module.exports = {
    run : function(creep) {
        let exe = false;

        const invader = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter : function(creep) {
                return roomManager.getOwnRoom().indexOf(creep.room.name) !== -1 || creep.owner.username === "Invader"
            }
        });
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
        } else {
            const hostileBuildings = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                filter : function(target) {
                    return target.owner.username === "Invader";
                }
            });
            if (hostileBuildings) {
                let result = creep.rangedAttack(hostileBuildings);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileBuildings);
                }
                exe = result != ERR_NO_BODYPART;
                result = creep.attack(hostileBuildings);
                if (result === ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostileBuildings);
                }
                exe = exe || result != ERR_NO_BODYPART;
            } else {
                delete creep.memory.goalRoom;
            }
        }

        const damagedCreep = _.filter(Game.creeps, (creep) => creep.hits < creep.hitsMax);
        damagedCreep.sort((a, b) => a.hits - b.hits);
        let result = creep.heal(damagedCreep[0]);
        if (result === ERR_NOT_IN_RANGE) {
            creep.moveTo(damagedCreep[0]);
        }
        
        if (!exe) {
            // attack another player's base
            if (Memory.attackRoom) {
                if (creep.room.name !== Memory.attackRoom) {
                    creep.memory.room = Memory.attackRoom;
                } else {
                    // attack their spawn first.
                    const spawns = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                        filter : function(target) {
                            return target.structureType === STRUCTURE_SPAWN && target.owner.username === Memory.attackTarget;
                        }
                    });
                    let attackTarget;
                    if (spawns.length) {
                        attackTarget = spawns[0];
                    } else {
                        const storages = creep.room.find(FIND_HOSTILE_STRUCTURES, {
                            filter : function(target) {
                                return target.structureType === STRUCTURE_STORAGE && target.owner.username === Memory.attackTarget;
                            }
                        });
                        attackTarget = storages[0];
                    }

                    creep.rangedAttack(attackTarget);
                    const result = creep.attack(attackTarget);
                    if (result === ERR_NOT_IN_RANGE) {
                        const moveResult = creep.moveTo(attackTarget);
                        if (moveResult === ERR_NO_PATH || moveResult === ERR_NOT_FOUND) {
                            // find closes rampart or wall to attack
                            const a = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
                                filter : function(target) {
                                    return target.structureType === STRUCTURE_RAMPART && target.owner.username === Memory.attackTarget;
                                }
                            });
                            creep.rangedAttack(a);
                            creep.attack(a);
                        }
                    }

                    return;
                }
            }

            // move randomly
            const x = creep.memory.targetX;
            const y = creep.memory.targetY;
            const room = creep.memory.room;

            let success = false;
            if (x && y && room) {
                const result = creep.moveTo(new RoomPosition(x, y, room));
                if (result == OK || result == ERR_TIRED) {
                    success = true;
                }
            }

            if ((Math.abs(creep.pos.x - x) < 2 && Math.abs(creep.pos.y - y) < 2 && creep.room.name === room) || (!success)) {
                creep.memory.targetX = Math.floor(Math.random() * 45) + 2;
                creep.memory.targetY = Math.floor(Math.random() * 45) + 2;
                creep.memory.room = roomManager.randomRoom();
            }
        }
    }
};