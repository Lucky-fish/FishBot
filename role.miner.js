const commons = require("commons");

const miner = {
    run : function(creep) {
        commons.updateEnergy(creep);

        if (creep.working) {
            creep.move(TOP);
            const room = creep.memory.room;
            const target = Game.getObjectById(creep.memory.target);

            if (!target.room) {
                const route = Game.map.findRoute(creep.room, room);
                if(route.length > 0) {
                    const exit = creep.pos.findClosestByRange(route[0].exit);
                    creep.moveTo(exit);
                }
            } else {
                const found = roomManger.find(FIND_MY_STRUCTURES, {filter : function (e) {
                        return e.structureType === STRUCTURE_STORAGE;
                    }});
                for (let j in found) {
                    const storage = found[j];
                    if (storage.store.getFreeCapacity() <= 0) {
                        continue;
                    }

                    for (let i in creep.store) {
                        if (creep.transfer(storage, i) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(storage);
                        }
                    }
                    return;
                }
            }
        }
    }
}

module.exports = miner;
