const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepairer = require('role.repairer');
const roleScavenger = require('role.scavenger');
const roleAttacker = require('role.attacker');
const roleStorageRepairer = require("role.repairer.storage");
const roleFeeder = require('role.feeder');
const roleClaimer = require('role.claimer');

const roleSpawn = require('spawn');

const tower = require("tower");

const roomManager = require('room.manager');
const profile = require("profile");

module.exports.loop = function () {
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
    }

    let profileSession = profile.start("spawn");
    for (let i in Game.spawns) {
        const spawn = Game.spawns[i];
        roleSpawn.run(spawn);

        if (spawn.room.find(FIND_HOSTILE_CREEPS).length > 2 && (!spawn.room.controller.safeMode)) { // it seems that there is raid taken place here
            spawn.room.controller.activateSafeMode();
        }
    }
    profile.end(profileSession);

    profileSession = profile.start("cleanup");
    for (let i in Memory.creeps) {
        let spawning = false;
        for (let j in Game.spawns) {
            if (Game.spawns[j].spawning && Game.spawns[j].spawning.name == i) {
                spawning = true;
            }
        }
        if (spawning) {
            continue;
        }

        if (!Game.creeps[i]) {
            const mem = Memory.creeps[i];
            if (mem.role === "claimer" && mem.reserving) {
                roleSpawn.putSpawnTask({role : "claimer", reserving : true, targetRoomName : mem.targetRoomName}, (spawn) => roleSpawn.getClaimerBody(spawn));
            }
            console.log("Deleting memory: " + i)
            delete Memory.creeps[i];
        }
    }
    profile.end(profileSession);

    profileSession = profile.start("tower");
    for (let i in Game.structures) {
        const structure = Game.structures[i];

        if (structure.structureType === STRUCTURE_TOWER) {
            tower.run(structure);
        }
    }
    profile.end(profileSession);

    profileSession = profile.start("creep");
    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        // these code will be disabled after the picker spawns.
        if (creep.pos.findInRange(FIND_DROPPED_RESOURCES, 4).length) {
            creep.pickup(creep.pos.findInRange(FIND_DROPPED_RESOURCES, 4)[0]);
        }
        if (creep.pos.findInRange(FIND_TOMBSTONES, 4).length) {
            creep.withdraw(creep.pos.findInRange(FIND_TOMBSTONES, 4).filter((v,i,a) => v.store[RESOURCE_ENERGY] > 0)[0], RESOURCE_ENERGY);
        }
        if (creep.pos.findInRange(FIND_RUINS, 4).length) {
            creep.withdraw(creep.pos.findInRange(FIND_RUINS, 4).filter((v, i, a) => v.store[RESOURCE_ENERGY] > 0)[0], RESOURCE_ENERGY);
        }
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        } else if (creep.memory.role == "scavenger") {
            roleScavenger.run(creep);
        } else if (creep.memory.role == "attacker") {
            roleAttacker.run(creep);
        } else if (creep.memory.role == "fixer->storage" || creep.memory.role == "repairer->storage") {
            roleStorageRepairer.run(creep);
        } else if (creep.memory.role == "claimer") {
            roleClaimer.run(creep);
        } else if (creep.memory.role == 'feeder') {
            roleFeeder.run(creep);
        }
    }
    profile.end(profileSession);
}