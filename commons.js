const commons = {
    updateEnergy : function(creep) {
        if (creep.memory.working && creep.store.getUsedCapacity() === 0) {
            creep.memory.working = false;
        } else if (!creep.memory.working && creep.store.getUsedCapacity() === creep.store.getCapacity()) {
            creep.memory.working = true;
            delete creep.memory.s;
        }
    }
};

module.exports = commons;
