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

        const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (enemy) {
            tower.attack(enemy);
        }

        const damagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (creep) => creep.hits < creep.hitsMax});
        if (damagedCreep) {
            tower.heal(damagedCreep);
        }

        if (tower.store[RESOURCE_ENERGY] > tower.store.getCapacity(RESOURCE_ENERGY) / 2) {
            const broken = tower.room.find(FIND_STRUCTURES, {filter: (e) => (e.hits < e.hitsMax && (e.structureType === STRUCTURE_WALL || e.my)) || (e.structureType === STRUCTURE_RAMPART)});

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
            }
        }
    }
};
module.exports = tower;