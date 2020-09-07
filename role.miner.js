const commons = require("commons");
const roomManager = require("room.manager");

const miner = {
    run : function(creep) {
        commons.updateEnergy(creep);

        if (!creep.memory.working) {
            creep.move(TOP);
            const room = creep.memory.room;
            const target = Game.getObjectById(creep.memory.target);

            if (!target) {
                const route = Game.map.findRoute(creep.room, room, {
                    routeCallback(roomName) {
                        if (roomName == "E13N29") {
                            return Infinity;
                        }
                        return 1;
                    }
                });
                if(route.length > 0) {
                    const exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
                }
            } else {
                creep.cancelOrder("move");
                if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        } else {
            const found = roomManager.find(FIND_MY_STRUCTURES, {filter : function (e) {
                    return e.structureType === STRUCTURE_STORAGE;
                }});
            for (let j in found) {
                const storage = found[j];
                if (storage.store.getFreeCapacity() <= 0) {
                    continue;
                }

                for (let i in creep.store) {
                    if (creep.transfer(storage, i) === ERR_NOT_IN_RANGE) {
                        if (creep.room !== storage.room) {
                            creep.move(RIGHT);
                            const route = Game.map.findRoute(creep.room, storage.room, {
                                routeCallback(roomName) {
                                    if (roomName == "E13N29") {
                                        return Infinity;
                                    }
                                    return 1;
                                }
                            });
                            if(route.length > 0) {
                                const exit = creep.pos.findClosestByRange(route[0].exit);
                                creep.moveTo(exit);
                            }
                        } else {
                            creep.moveTo(storage);
                        }
                    }
                }
                return;
            }
        }
    }
}

module.exports = miner;
