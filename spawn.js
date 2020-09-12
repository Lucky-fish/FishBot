/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn');
 * mod.thing == 'a thing'; // true
 */

const spawnConfig = {
    attacker: 0,
    repairer: 2,
    scavenger: 1,
    builder: 2,
    upgrader: 1,
    feeder: 3,
    hauler: 6,
    maxSpawnEnergy: 800
};

const roomManager = require("room.manager");
const utils = require("utils");

const roleSpawn = {
    run: function (spawn) {
        if (!Memory.spawnConfig) {
            Memory.spawnConfig = spawnConfig;
        }
        for (let i in spawnConfig) {
            if (!Memory.spawnConfig[i]) {
                Memory.spawnConfig[i] = spawnConfig[i];
            }
        }

        if (spawn.spawning) {
            return;
        }
        if (!this.checkSpawnCooldown(spawn)) {
            return;
        }

        if (!spawn.memory.tasks) {
            spawn.memory.tasks = [];
        }

        const feederLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'feeder').length;
        const builderLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'builder').length;
        const upgraderLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'upgrader').length;
        const repairerLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'repairer').length;
        const scavengerLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'scavenger').length;
        const attackerLength = _.filter(Game.creeps, (creep) => creep.memory.role === "attacker").length;
        const storageRepairerLength = _.filter(Game.creeps, (creep) => creep.memory.role === "repairer->storage").length;
        const harvesterLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'harvester').length;
        const haulerLength = _.filter(Game.creeps, (creep) => creep.memory.role === 'hauler').length;

        const containerLength = Math.min(roomManager.find(FIND_SOURCES).length, roomManager.find(FIND_STRUCTURES, {filter: function (e) {
            return e.structureType === STRUCTURE_CONTAINER;
            }}).length);

        let spawned = null;

        if (feederLength > 2) {
            if (spawn.memory.tasks.length) {
                const task = spawn.memory.tasks[0];
                let body = task.body;
                let memory = JSON.parse(JSON.stringify(task.memory));

                if (spawn.spawnCreep(body, "fishbot-" + Math.ceil(Math.random() * 10000), {memory: memory}) === OK) {
                    spawn.memory.tasks.shift();
                    return;
                }
            }
            if (harvesterLength > 1 || containerLength < 1) {
                if (storageRepairerLength < containerLength) {
                    const result = spawn.spawnCreep([WORK, WORK, WORK, CARRY, MOVE, MOVE], "fishbot.storage-repairer-" + Math.ceil(Math.random() * 10000), {memory: {role: "repairer->storage"}});
                    if ((result === OK)) {
                        spawned = "repairer->storager";
                    }
                }

                if (attackerLength < Memory.spawnConfig.attacker) {
                    const result = spawn.spawnCreep(this.getAttackerBody(spawn), "fishbot.attacker-" + Math.ceil(Math.random() * 10000), {memory: {role: "attacker"}});
                    if ((result === OK)) {
                        spawned = "attacker";
                    }
                }

                if (repairerLength < Memory.spawnConfig.repairer) {
                    const result = spawn.spawnCreep(this.getBuilderBody(spawn), "fishbot.repairer-" + Math.ceil(Math.random() * 10000), {memory: {role: "repairer"}});
                    if ((result === OK)) {
                        spawned = "repairer";
                    }
                }

                if (scavengerLength < Memory.spawnConfig.scavenger) {
                    const result = spawn.spawnCreep(this.getFeederBody(spawn), "fishbot.scavenger-" + Math.ceil(Math.random() * 10000), {memory: {role: "scavenger"}});
                    if ((result === OK)) {
                        spawned = "scavenger";
                    }
                }

                if (builderLength < Memory.spawnConfig.builder) {
                    const result = spawn.spawnCreep(this.getBuilderBody(spawn), "fishbot.builder-" + Math.ceil(Math.random() * 10000), {memory: {role: "builder"}});
                    if ((result === OK)) {
                        spawned = "builder";
                    }
                }

                if (upgraderLength < Memory.spawnConfig.upgrader) {
                    const result = spawn.spawnCreep(this.getUpgraderBody(spawn), "fishbot.upgrader-" + Math.ceil(Math.random() * 10000), {memory: {role: "upgrader"}});
                    if ((result === OK)) {
                        spawned = "upgrader";
                    }
                }

                if (haulerLength < this.getHaulerCountNeeded(spawn)) {
                    const result = spawn.spawnCreep(this.getFeederBody(spawn), "fishbot.hauler-" + Math.ceil(Math.random() * 10000), {memory: {role: "hauler", target : this.getMostNeededContainer(spawn)}});
                    if (result === OK) {
                        spawned = "hauler";
                    }
                }
            }
        }

        if (harvesterLength < containerLength) {
            const result = spawn.spawnCreep(this.getHarvesterBody(spawn), "fishbot.harvester-" + Math.ceil(Math.random() * 10000), {memory: {role: "harvester"}});
            if ((result === OK)) {
                spawned = "harvester";
            }
        }

        if (feederLength < Memory.spawnConfig.feeder) {
            const result = spawn.spawnCreep(this.getFeederBody(spawn), "fishbot.feeder-" + Math.ceil(Math.random() * 10000), {memory: {role: "feeder"}});
            if (result === OK) {
                spawned = "feeder";
            } else if (feederLength <= 0) {
                spawn.spawnCreep([WORK, CARRY, CARRY, MOVE, MOVE], "fishbot.feeder-" + Math.ceil(Math.random() * 10000), {memory: {role: "feeder"}});
                Game.notify("There is no feeder and we can not even spawn one.");
            }
        }
        if (spawned) {
            console.log("Spawning: " + spawned);
        }
    },
    putSpawnTask : function(memory, bodyFetch) {
        for (let i in Game.spawns) {
            const spawn = Game.spawns[i];
            spawn.memory.tasks.push({body : bodyFetch(spawn), memory : memory});
            return;
        }
    },
    getAvailableEnergy : function (spawn, limited = true) {
        if (limited) {
            return Math.min(Memory.spawnConfig.maxSpawnEnergy, spawn.room.energyCapacityAvailable);
        } else {
            return spawn.room.energyCapacityAvailable;
        }
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

        const unit = this.getBodyCost([WORK, WORK, MOVE]);

        for (let i = 0; i < Math.floor(energy / unit); i++) {
            body.push(WORK, WORK, MOVE);
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
        const energy = this.getAvailableEnergy(spawn);
        const body = [];
        const unit = this.getBodyCost([MOVE, CLAIM]);
        for (let i = 0; i < Math.floor(energy / unit); i ++) {
            body.push(MOVE, CLAIM);
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
    },
    checkSpawnCooldown : function(spawn) {
        if (!spawn.memory.cooldown || spawn.memory.cooldown <= 0) {
            if (spawn.spawning) {
                spawn.memory.cooldown = 30;
            }
            return true;
        }
        if (!spawn.spawning) {
            spawn.memory.cooldown --;
        }
        return false;
    },
    getHaulerCountNeeded : function(spawn) {
        const containers = roomManager.find(FIND_STRUCTURES, {filter : function(e) {
            return e.structureType == STRUCTURE_CONTAINER;
            }})

        let count = 0;
        for (let i in containers) {
            const container = containers[i];
            count += Math.ceil(utils.distance(container.pos, spawn.pos) / 10);
        }
        return count;
    },
    getMostNeededContainer : function(spawn) {
        const containers = roomManager.find(FIND_STRUCTURES, {filter : function(e) {
                return e.structureType == STRUCTURE_CONTAINER;
            }})
        if (!containers.length) {
            return undefined;
        }
        const containerCounter = {};

        for (let i in containers) {
            const container = containers[i];
            containerCounter[container.id] = Math.ceil(utils.distance(container.pos, spawn.pos) / 10) - _.filter(Game.creeps, (creep) => creep.memory.role === "hauler" && creep.memory.target === container.id).length;
        }

        let most = undefined;
        let mostAmount = -1;
        for (let i in containerCounter) {
            if (containerCounter[i] >= mostAmount) {
                most = i;
                mostAmount = containerCounter[i];
            }
        }

        return most;
    }
};

module.exports = roleSpawn;