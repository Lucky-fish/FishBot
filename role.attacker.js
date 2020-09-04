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
        } else {
            const hostileBuildings = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
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
            }
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
            const room = creep.memory.room;

            let success = false;
            if (x && y && room) {
                const result = creep.moveTo(new RoomPosition(x, y, room));
                if (result == OK || result == ERR_TIRED) {
                    success = true;
                }
            }

            if ((Math.abs(creep.pos.x - x) < 1 && Math.abs(creep.pos.y - y) < 1) || (!success)) {
                let invalid = false;
                do {
                    invalid = false;
                    creep.memory.targetX = Math.floor(Math.random() * 45) + 2;
                    creep.memory.targetY = Math.floor(Math.random() * 45) + 2;
                    creep.memory.room = roomManager.randomRoom();

                    const terrain = new Room.Terrain(creep.memory.room);
                    invalid = terrain.get(creep.memory.targetX, creep.memory.targetY) == TERRAIN_MASK_WALL;
                    const look = new RoomPosition(x, y, room).look();
                    for (let i in look) {
                        const r = look[i];
                        invalid = invalid || (r.type == LOOK_STRUCTURES && r.structure.structureType == "constructedWall");
                        if (invalid) {
                            break;
                        }
                    }
                } while (invalid);
            }
        }
    }
};