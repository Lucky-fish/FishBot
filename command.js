const spawn = require("spawn");
const commands = {
    dismantle: function(id) {
        spawn.putSpawnTask({role: "dismantler", id: id}, function(s) {
            return spawn.getBuilderBody(s);
        });
    }
};

module.exports = commands;
