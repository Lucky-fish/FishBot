/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.manager');
 * mod.thing == 'a thing'; // true
 */

const allowedRoom = ["W26S71"];

module.exports = {
    // escape from other's room
    backToMainRoom : function(creep) {

        let contains = false;
        for (let i in allowedRoom) {
            if (creep.room.name === allowedRoom[i]) {
                contains = true;
                break;
            }
        }
        
        if (contains) {
            return false;
        }
        creep.move(TOP);
        const exitDir = Game.map.findExit(creep.room, "W26S71");
        const exit = creep.pos.findClosestByRange(exitDir);
        creep.moveTo(exit);
        
        return true;
    }
};