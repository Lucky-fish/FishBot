const spawn = require("spawn");
const commands = {
    dismantle: function(id) {
        spawn.putSpawnTask({role: "dismantler", id: id}, function(s) {
            return spawn.getHarvesterBody(s);
        });
        return "Scheduled."
    },
    mine : function(id, room) {
        spawn.putSpawnTask({role: "miner", target: id, room: room}, function(s) {
            return spawn.getBuilderBody(s);
        });
        return "Scheduled."
    },
    claim : function(room) {
        for (let i = 0; i < 2; i ++) {
            spawn.putSpawnTask({role : "claimer", targetRoomName : room}, function(s) {
                return spawn.getClaimerBody(s);
            });
        }
        return "Scheduled"
    },
    spawnMinimalFeeder : function(spawn) {
        const result = Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], "fishbot.min-feeder", {memory: {role: "feeder"}});
        if (result === OK) {
            return "Spawning"
        } else {
            return "Error, code: " + result;
        }
    },
    attack : function(room) {
        for (let i in Game.creeps) {
            const creep = Game.creeps[i];
            if (creep.memory.role === "attacker") {
                creep.memory.room = room;
            }
        }
    }
};

module.exports = commands;
