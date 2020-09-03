/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.miner');
 * mod.thing == 'a thing'; // true
 */
const lookForSource = require("resource");
const spawn = require("spawn");

module.exports = {
    run : function(creep) {
        if (creep.ticksToLive < 50 && (!creep.memory.spawnScheduled)) {
            spawn.putSpawnTask(JSON.parse(JSON.stringify(creep.memory)), function(spawnIn) {
                return spawn.getHarvesterBody(spawnIn);
            });
            creep.memory.spawnScheduled = true;
        }

        const source = lookForSource.lockFinding(creep);
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        } else {
            const targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER || (structure.structureType === STRUCTURE_STORAGE && structure.my)) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                }
            });
            if(targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets);
                }
            }
        }
    }
};