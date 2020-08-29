/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */
 
var roleSpawn = {
    run : function(spawn) {
        var feederLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'feeder').length;
        var builderLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        var upgraderLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
        var fixerLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'fixer').length;
        var pickerLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'picker').length;
        var attackerLength = _.filter(Game.creeps, (creep) => creep.memory.role == "attacker").length;
        var storageFixerLength = _.filter(Game.creeps, (creep) => creep.memory.role == "fixer->storage").length;
        var harvesterLength = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
        
        var containerLength = Math.min(spawn.room.find(FIND_SOURCES).length, spawn.room.find(FIND_STRUCTURES, {filter: (e) => ((e.structureType == STRUCTURE_STORAGE && e.my) || e.structureType == STRUCTURE_CONTAINER) && e.hits < e.hitsMax / (e.store[RESOURCE_ENERGY] < e.storeCapacity / 2 ? 2 : 1)}));
        
        var spawned = null;
        
        if (storageFixerLength < containerLength) {
            var result = spawn.createCreep([WORK, WORK, WORK, CARRY, MOVE], "fishbot.storage-fixer-" + Math.ceil(Math.random() * 10000), {role : "fixer->storage"});
            if ((result instanceof String)) {
                spawned = "fixer->storager";
            }
        }
        
        if (attackerLength < 2) {
            var result = spawn.createCreep([TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, ATTACK, ATTACK, MOVE, MOVE], "fishbot.attacker-" + Math.ceil(Math.random() * 10000), {role : "attacker"});
            if ((result instanceof String)) {
                spawned = "attacker";
            }
        }
        
        if (fixerLength < 3) {
            var result = spawn.createCreep([WORK, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], "fishbot.fixer-" + Math.ceil(Math.random() * 10000), {role : "fixer"});
            if ((result instanceof String)) {
                spawned = "fixer";
            }
        }
        
        /*if (pickerLength < 1) {
            var result = spawn.createCreep([WORK, WORK, CARRY, MOVE, CARRY, MOVE], "fishbot.picker-" + Math.ceil(Math.random() * 10000), {role : "picker"});
            if ((result instanceof String)) {
                spawned = "picker";
            }
        }*/
        
        if (builderLength < 4) {
            var result = spawn.createCreep([WORK, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE], "fishbot.builder-" + Math.ceil(Math.random() * 10000), {role : "builder"});
            if ((result instanceof String)) {
                spawned = "builder";
            }
        }
        
        if (upgraderLength < 1) {
            var result = spawn.createCreep([WORK, CARRY, MOVE, CARRY, MOVE], "fishbot.upgrader-" + Math.ceil(Math.random() * 10000), {role : "upgrader"});
            if ((result instanceof String)) {
                spawned = "upgrader";
            }
        }
        
        if (harvesterLength < containerLength) {
            var result = spawn.createCreep([WORK, WORK, CARRY, MOVE], "fishbot.harvester-" + Math.ceil(Math.random() * 10000), {role : "harvester"});
            if ((result instanceof String)) {
                spawned = "upgrader";
            }
        }
    
        if (feederLength < 3) {
            var result = spawn.createCreep([WORK, MOVE, CARRY], "fishbot.feeder-" + Math.ceil(Math.random() * 10000), {role : "feeder"});
            if ((result instanceof String)) {
                spawned = "feeder-";
            }
        }
        if (spawned instanceof String) {
            console.log("Spawning: " + spawned);
        }
    }
}

module.exports = roleSpawn;