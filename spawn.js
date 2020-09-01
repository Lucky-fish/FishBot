/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

const roleSpawn = {
    run: function (spawn) {
        const feederLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'feeder').length;
        const builderLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length;
        const upgraderLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length;
        const fixerLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'fixer').length;
        const pickerLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'picker').length;
        const attackerLength = _.filter(Game.creeps, (creep) => creep.memory.role === "attacker").length;
        const storageFixerLength = _.filter(Game.creeps, (creep) => creep.memory.role === "fixer->storage").length;
        const harvesterLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester' && creep.ticksToLive > 50).length;

        const containerLength = Math.min(spawn.room.find(FIND_SOURCES).length, spawn.room.find(FIND_STRUCTURES, {filter: (e) => ((e.structureType === STRUCTURE_STORAGE && e.my) || e.structureType === STRUCTURE_CONTAINER)}).length);

        let spawned = null;

        if (storageFixerLength < containerLength) {
            var result = spawn.createCreep([WORK, WORK, WORK, CARRY, MOVE], "fishbot.storage-fixer-" + Math.ceil(Math.random() * 10000), {role: "fixer->storage"});
            if ((result instanceof String)) {
                spawned = "fixer->storager";
            }
        }

        if (attackerLength < 2) {
            var result = spawn.createCreep([TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, ATTACK, ATTACK, MOVE, MOVE], "fishbot.attacker-" + Math.ceil(Math.random() * 10000), {role: "attacker"});
            if ((result instanceof String)) {
                spawned = "attacker";
            }
        }

        if (fixerLength < 4) {
            var result = spawn.createCreep(this.getBuilderBody(spawn), "fishbot.fixer-" + Math.ceil(Math.random() * 10000), {role: "fixer"});
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

        if (builderLength < 1) {
            var result = spawn.createCreep(this.getBuilderBody(spawn), "fishbot.builder-" + Math.ceil(Math.random() * 10000), {role: "builder"});
            if ((result instanceof String)) {
                spawned = "builder";
            }
        }

        if (upgraderLength < 4) {
            var result = spawn.createCreep(this.getUpgraderBody(spawn), "fishbot.upgrader-" + Math.ceil(Math.random() * 10000), {role: "upgrader"});
            if ((result instanceof String)) {
                spawned = "upgrader";
            }
        }

        if (harvesterLength < containerLength) {
            var result = spawn.createCreep(this.getHarvesterBody(spawn), "fishbot.harvester-" + Math.ceil(Math.random() * 10000), {role: "harvester"});
            if ((result instanceof String)) {
                spawned = "harvester";
            }
        }

        if (feederLength < 3) {
            var result = spawn.createCreep(this.getFeederBody(spawn), "fishbot.feeder-" + Math.ceil(Math.random() * 10000), {role: "feeder"});
            if ((result instanceof String)) {
                spawned = "feeder-";
            }
        }
        if (spawned instanceof String) {
            console.log("Spawning: " + spawned);
        }
    },
    getFeederBody: function (spawn) {
        const energy = spawn.room.energyCapacityAvailable - this.getBodyCost([WORK]);
        const body = [WORK];

        const unit = this.getBodyCost([MOVE, CARRY]);

        for (let i = 0; i < Math.floor(energy / unit); i++) {
            body.push(MOVE, CARRY);
        }

        return body;
    },
    getHarvesterBody: function (spawn) {
        const energy = spawn.room.energyCapacityAvailable - this.getBodyCost([CARRY, MOVE]);
        const body = [CARRY, MOVE];

        const unit = this.getBodyCost([WORK]);

        for (let i = 0; i < Math.floor(energy / unit); i++) {
            body.push(WORK);
        }

        return body;
    },
    getBuilderBody : function (spawn) {
        const energy = spawn.room.energyCapacityAvailable;

        const body = [];
        const unit = this.getBodyCost([MOVE, CARRY, WORK]);

        for (let i = 0; i < Math.floor(energy / unit); i ++) {
            body.push(WORK, CARRY, MOVE);
        }

        return body;
    },
    getUpgraderBody : function (spawn) {
        const energy = spawn.room.energyCapacityAvailable;
        const body = [];
        const unit = this.getBodyCost([MOVE, CARRY, WORK, MOVE, CARRY]);
        for (let i = 0; i < Math.floor(energy / unit); i ++) {
            body.push(MOVE, CARRY, WORK, MOVE, CARRY);
        }
        return body;
    },
    getBodyCost : function(parts) {
        var cost = 0;
        for (var i in parts) {
            cost += BODYPART_COST[parts[i]];
        }
        return cost;
    }
};

module.exports = roleSpawn;