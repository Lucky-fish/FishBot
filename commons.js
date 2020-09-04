const commons = {
    updateEnergy : function(creep) {
        if (creep.memory.a && creep.store.getUsedCapacity() === 0) {
            creep.memory.a = false;
        } else if (!creep.memory.a && creep.store.getUsedCapacity() === creep.store.getCapacity()) {
            creep.memory.a = true;
            delete creep.memory.s;
        }
    }
};

module.exports = commons;
