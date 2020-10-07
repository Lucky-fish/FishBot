/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    distance : function(pos1, pos2) {
        if ((pos1 instanceof RoomPosition) && (pos2 instanceof RoomPosition)) {
            if (pos1.roomName !== pos2.roomName) {
                return Game.map.getRoomLinearDistance(pos1.roomName, pos2.roomName) * 80;
            }
            
            return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2));
        }
        return Infinity;
    }
};