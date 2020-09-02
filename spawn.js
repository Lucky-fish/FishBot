/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

const maxEnergyUse = 1500;

const roleSpawn = {
    run: function (spawn) {
        if (spawn.spawning) {
            return;
        }

        if (!spawn.memory.tasks) {
            spawn.memory.tasks = [];
        }
        if (spawn.memory.tasks.length) {
            const task = spawn.memory.tasks[0];
            let body = task.body;
            let memory = task.memory;

            if (spawn.spawnCreep(body, "fishbot-" + Math.ceil(Math.random() * 10000), memory) === OK) {
                spawn.memory.tasks.shift();
                return;
            }
        }

        const feederLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'feeder').length;
        const builderLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length;
        const upgraderLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length;
        const repairerLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer').length;
        const scavengerLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'scavenger').length;
        const attackerLength = _.filter(Game.creeps, (creep) => creep.memory.role === "attacker").length;
        const storageRepairerLength = _.filter(Game.creeps, (creep) => creep.memory.role === "repairer->storage").length + _.filter(Game.creeps, (creep) => creep.memory.role === "fixer->storage").length;
        const harvesterLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester' && creep.ticksToLive > 50).length;

        const containerLength = Math.min(spawn.room.find(FIND_SOURCES).length, spawn.room.find(FIND_STRUCTURES, {filter: (e) => ((e.structureType === STRUCTURE_STORAGE && e.my) || e.structureType === STRUCTURE_CONTAINER)}).length);

        let spawned = null;

        if (storageRepairerLength < containerLength) {
            const result = spawn.createCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], "fishbot.storage-repairer-" + Math.ceil(Math.random() * 10000), {role: "repairer->storage"});
            if ((result instanceof String)) {
                spawned = "repairer->storager";
            }
        }

        if (attackerLength < 2) {
            const result = spawn.createCreep(this.getAttackerBody(spawn), "fishbot.attacker-" + Math.ceil(Math.random() * 10000), {role: "attacker"});
            if ((result instanceof String)) {
                spawned = "attacker";
            }
        }

        if (repairerLength < 1) {
            const result = spawn.createCreep(this.getBuilderBody(spawn), "fishbot.repairer-" + Math.ceil(Math.random() * 10000), {role: "repairer"});
            if ((result instanceof String)) {
                spawned = "repairer";
            }
        }

        if (scavengerLength < 1 && spawn.room.find(FIND_MY_STRUCTURES, {filter : {structureType : STRUCTURE_STORAGE}}).length) {
            const result = spawn.createCreep(this.getFeederBody(spawn), "fishbot.scavenger-" + Math.ceil(Math.random() * 10000), {role : "scavenger"});
            if ((result instanceof String)) {
                spawned = "scavenger";
            }
        }

        if (builderLength < 1) {
            const result = spawn.createCreep(this.getBuilderBody(spawn), "fishbot.builder-" + Math.ceil(Math.random() * 10000), {role: "builder"});
            if ((result instanceof String)) {
                spawned = "builder";
            }
        }

        if (upgraderLength < 1) {
            const result = spawn.createCreep(this.getUpgraderBody(spawn), "fishbot.upgrader-" + Math.ceil(Math.random() * 10000), {role: "upgrader"});
            if ((result instanceof String)) {
                spawned = "upgrader";
            }
        }

        if (harvesterLength < containerLength) {
            const result = spawn.createCreep(this.getHarvesterBody(spawn), "fishbot.harvester-" + Math.ceil(Math.random() * 10000), {role: "harvester"});
            if ((result instanceof String)) {
                spawned = "harvester";
            }
        }

        if (feederLength < 3) {
            const result = spawn.createCreep(this.getFeederBody(spawn), "fishbot.feeder-" + Math.ceil(Math.random() * 10000), {role: "feeder"});
            if ((result instanceof String)) {
                spawned = "feeder-";
            }
        }
        if (spawned instanceof String) {
            console.log("Spawning: " + spawned);
        }
    },
    putClaimerSpawnTask : function(memory, bodyFetch) {
        for (let i in Game.spawns) {
            const spawn = Game.spawns[i];
            spawn.memory.tasks.push({body : bodyFetch(spawn), memory : memory});
            return;
        }
    },
    getAvailableEnergy : function (spawn) {
        return Math.min(maxEnergyUse, spawn.room.energyCapacityAvailable);
    },
    getFeederBody: function (spawn) {
        const energy = this.getAvailableEnergy(spawn) - this.getBodyCost([WORK]);
        const body = [WORK];

        const unit = this.getBodyCost([MOVE, CARRY]);

        for (let i = 0; i < Math.floor(energy / unit); i++) {
            body.push(MOVE, CARRY);
        }

        return body;
    },
    getHarvesterBody: function (spawn) {
        const energy = this.getAvailableEnergy(spawn) - this.getBodyCost([CARRY, MOVE]);
        const body = [CARRY, MOVE];

        const unit = this.getBodyCost([WORK]);

        for (let i = 0; i < Math.floor(energy / unit); i++) {
            body.push(WORK);
        }

        return body;
    },
    getBuilderBody : function (spawn) {
        const energy = this.getAvailableEnergy(spawn);

        const body = [];
        const unit = this.getBodyCost([MOVE, CARRY, WORK]);

        for (let i = 0; i < Math.floor(energy / unit); i ++) {
            body.push(WORK, CARRY, MOVE);
        }

        return body;
    },
    getUpgraderBody : function (spawn) {
        const energy = this.getAvailableEnergy(spawn);
        const body = [];
        const unit = this.getBodyCost([MOVE, CARRY, WORK, MOVE, CARRY]);
        for (let i = 0; i < Math.floor(energy / unit); i ++) {
            body.push(MOVE, CARRY, WORK, MOVE, CARRY);
        }
        return body;
    },
    getClaimerBody : function(spawn) {
        const energy = spawn.room.energyCapacityAvailable;
        const body = [];
        const unit = this.getBodyCost([MOVE, CLAIM, CLAIM]);
        for (let i = 0; i < Math.floor(energy / unit); i ++) {
            body.push(MOVE, CLAIM, CLAIM);
        }
        return body;
    },
    getAttackerBody : function(spawn) {
        const energy = this.getAvailableEnergy(spawn);
        let available = energy;
        const body = [];

        let attackParts = 0;
        let toughParts = 0;
        let healParts = 0;
        let rangedParts = 0;
        let total = 0;
        while (available > energy * 0.8) {
            available -= this.getBodyCost([RANGED_ATTACK]);
            rangedParts ++;
            total ++;
            if (total % 2 == 0) {
                available -= this.getBodyCost([MOVE]);
            }
        }
        if (available > 0) {
            while (available > energy * 0.7) {
                available -= this.getBodyCost([HEAL]);
                healParts ++;

                total ++;
                if (total % 2 == 0) {
                    available -= this.getBodyCost([MOVE]);
                }
            }
        }
        if (available > 0) {
            while (available > energy * 0.45) {
                attackParts ++;
                available -= this.getBodyCost([ATTACK]);
                total ++;
                if (total % 2 == 0) {
                    available -= this.getBodyCost([MOVE]);
                }
            }
        }
        while (available > this.getBodyCost([TOUGH, MOVE])) {
            available -= this.getBodyCost([TOUGH]);
            toughParts ++;
            total ++;
            if (total % 2 == 0) {
                available -= this.getBodyCost([MOVE]);
            }
        }

        // combine.
        for (let i = 0; i < toughParts; i ++) {
            body.push(TOUGH);
        }
        for (let i = 0; i < healParts; i ++) {
            body.push(HEAL);
        }
        for (let i = 0; i < attackParts; i ++) {
            body.push(ATTACK);
        }
        for (let i = 0; i < Math.ceil(total / 2); i ++) {
            body.push(MOVE);
        }
        for (let i = 0; i < rangedParts; i ++) {
            body.push(RANGED_ATTACK);
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