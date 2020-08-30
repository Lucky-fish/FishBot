const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleFixer = require('role.fixer');
const rolePicker = require('role.picker');
const roleAttacker = require('role.attacker');
const roleFixerStorage = require("role.fixer.storage");
const roleFeeder = require('role.feeder');

const roleSpawn = require('spawn');

const tower = require("tower");

const roomManager = require('room.manager');

module.exports.loop = function () {
    for (var i in Game.spawns) {
        roleSpawn.run(Game.spawns[i]);
    }

    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    for (var i in Game.structures) {
        const structure = Game.structures[i];

        if (structure.structureType === STRUCTURE_TOWER) {
            tower.run(structure);
        }
    }

    for(let name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10).length) {
            creep.pickup(creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10)[0]);
        }
        /*if (roomManager.backToMainRoom(creep)) {
            creep.moveTo(Game.flags["back"]);
        }*/
        if(creep.memory.role === 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role === 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role === 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role === 'fixer') {
            roleFixer.run(creep);
        } else if (creep.memory.role === "picker") {
            rolePicker.run(creep);
        } else if (creep.memory.role === "attacker") {
            roleAttacker.run(creep);
        } else if (creep.memory.role == "fixer->storage") {
            roleFixerStorage.run(creep);
        } else if (creep.memory.role === 'feeder') {
            roleFeeder.run(creep);
        } else {
            creep.memory.role = "feeder";
        }
    }

}