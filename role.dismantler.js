const dismantler = {
    run: function(creep) {
        const struct = Game.getObjectById(creep.memory.id);
        if (!struct) {
            creep.suicide();
            return;
        }

        if (creep.dismantle(struct) == ERR_NOT_IN_RANGE) {
            creep.moveTo(struct);
        }
    }
}

module.exports = dismantler;
