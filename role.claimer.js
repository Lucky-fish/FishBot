const roomManager = require("room.manager");

const claimer = {
    run : function(creep) {
        if (creep.memory.finished) {
            creep.suicide();
            return;
        }

        if (!creep.memory.targetRoomName) {
            const targetRoomResult = this.scanForRoom(creep.room.name, 0, 2147483647);
            creep.memory.targetRoomName = targetRoomResult.room;
        }
        const targetRoomName = creep.memory.targetRoomName;

        if (creep.room.name !== targetRoomName) {
            if (creep.memory.lastRoom !== creep.room.name) {
                creep.memory.lastRoom = creep.room.name;
                creep.memory.target = creep.findClosestByPath(Game.map.findExit(creep.room, targetRoomName), {algorithm: "astar"});
            }

            creep.moveTo(creep.memory.target);
        } else {
            const controller = creep.room.controller;
            if (!controller) {
                delete creep.memory.targetRoomName;
                return;
            }
            if (controller.owner && controller.owner.username !== "Death_fish") {
                if (creep.attackController(controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
            } else {
                const result = creep.claimController(controller);
                if (result == ERR_GCL_NOT_ENOUGH) {
                    if (creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller);
                    }
                    creep.memory.reserving = true;
                } else if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                    creep.memory.finished = true;
                }
            }
        }
    },
    scanForRoom : function(room, depth, minimumDepth) {
        if (depth >= minimumDepth) { // reduce cpu
            return null;
        }

        const exits = Game.map.describeExits(room);
        const deep = [];
        for (let i in exits) {
            const exitRoom = exits[i];
            if (roomManager.isClaimableRoom(exitRoom)) {
                return {room: exitRoom, depth: depth};
            } else {
                deep.push(exitRoom);
            }
        }

        let foundRoom;
        let foundDepth = minimumDepth;
        for (let i in deep) {
            let result = this.scanForRoom(deep[i], depth + 1, foundDepth);
            if (!result) { // no better room
                continue;
            }
            if (result.depth < foundDepth) {
                foundDepth = result.depth;
                foundRoom = result.room;
            }
        }
        return foundRoom;
    }
};

module.exports = claimer;
