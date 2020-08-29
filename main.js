var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleFixer = require('role.fixer');
var rolePicker = require('role.picker');
var roleAttacker = require('role.attacker');
var roleFixerStorage = require("role.fixer.storage");
var roleFeeder = require('role.feeder');

var roleSpawn = require('spawn');

var tower = require("tower");

var roomManager = require('room.manager');

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
        var structure = Game.structures[i];
        
        if (structure.structureType == STRUCTURE_TOWER) {
            tower.run(structure);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10).length) {
            creep.pickup(creep.pos.findInRange(FIND_DROPPED_RESOURCES, 10)[0]);
        }
        /*if (roomManager.backToMainRoom(creep)) {
            creep.moveTo(Game.flags["back"]);
        }*/
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        } else if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        } else if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        } else if (creep.memory.role == 'fixer') {
            roleFixer.run(creep);
        } else if (creep.memory.role == "picker") {
            rolePicker.run(creep);
        } else if (creep.memory.role == "attacker") {
            roleAttacker.run(creep);
        } else if (creep.memory.role == "fixer->storage") {
            roleFixerStorage.run(creep);
        } else if (creep.memory.role == 'feeder') {
            roleFeeder.run(creep);
        } else {
            creep.memory.role = "feeder";
        }
    }

}