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
const utils = require("utils");

module.exports = {
    run : function(creep) {
        if (creep.ticksToLive < 50 && (!creep.memory.spawnScheduled)) {
            console.log("dying memory: " + JSON.stringify(creep.memory));
            spawn.putSpawnTask(JSON.parse(JSON.stringify(creep.memory)), function(spawnIn) {
                return spawn.getHarvesterBody(spawnIn);
            });
            creep.memory.spawnScheduled = true;
        }

        const source = lookForSource.lockFinding(creep);
        if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        } else {
            const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER || (structure.structureType === STRUCTURE_STORAGE && structure.my)) && structure.store[RESOURCE_ENERGY] < structure.storeCapacity;
                }
            });
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    if (utils.distance(target.pos, creep.pos) > 5) {
                        // maybe there is a construction site there.
                        const constructSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                        if (constructSite) {
                            creep.build(constructSite);
                        } else {
                            const container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return structure.structureType === STRUCTURE_CONTAINER;
                                }
                            })
                            if (container) {
                                creep.repair(container);
                            }
                        }
                    } else {
                        creep.moveTo(target);
                    }
                }
            } else {
                const constructSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                creep.build(constructSite);
            }
        }
    }
};