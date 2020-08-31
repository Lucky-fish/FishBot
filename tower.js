/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('tower');
 * mod.thing == 'a thing'; // true
 */
const tower = {
    run: function (tower) {
        if (tower.structureType !== STRUCTURE_TOWER) {
            return;
        }
        let exe = false;
        const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy) {
            tower.attack(enemy);
            exe = true;
        }

        const damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax});
        if (damagedCreep) {
            tower.heal(damagedCreep);
            exe = true;
        }

        if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) / 2 && (!exe)) {
            if (tower.room.memory.fixing) {
                const target = Game.getObjectById(tower.room.memory.fixing);
                tower.repair(target);
                tower.room.memory.fixTimer ++;

                if (tower.room.memory.fixTimer > 10 || target.hits >= target.hitsMax) {
                    delete tower.room.memory.fixing;
                    delete tower.room.memory.fixTimer;
                }
                return;
            }

            const broken = tower.room.find(FIND_STRUCTURES, {filter: (e) => (e.hits < e.hitsMax && (e.structureType === STRUCTURE_WALL || e.my || e.structureType === STRUCTURE_ROAD)) || (e.structureType === STRUCTURE_RAMPART)});

            broken.sort(function (a, b) {
                if (b.structureType === STRUCTURE_RAMPART && b.hits < 400) {
                    return 1;
                }
                if (a.structureType === STRUCTURE_RAMPART && a.hits < 400) {
                    return -1;
                }
                return a.hits - b.hits;
            });
            if (broken.length) {
                tower.repair(broken[0]);
                tower.room.memory.fixing = broken[0].id;
                tower.room.memory.fixTimer = 0;
            }
        }
    }
};
module.exports = tower;