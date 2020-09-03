/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room.manager');
 * mod.thing == 'a thing'; // true
 */
module.exports = {
    find : function(findOption, custom) {
        const rooms = this.getOwnRoom();
        const targets = [];
        for (let i in rooms) {
            const r = Game.rooms[rooms[i]];
            if (r) {
                const sourcesInRoom = r.find(findOption, custom);
                for (let j in sourcesInRoom) {
                    targets.push(sourcesInRoom[j]);
                }
            }
        }

        return targets;
    },
    getOwnRoom : function() {
        if (!Memory.roomCacheTime) {
            Memory.roomCacheTime = 0;
        }

        if (!Memory.ownedRooms) {
            const ownedRooms = this.findOwnRooms();
            const ownedRoomNames = [];
            for (let i in ownedRooms) {
                const room = ownedRooms[i];
                ownedRoomNames.push(room);
            }
            Memory.ownedRooms = ownedRoomNames;
            return Memory.ownedRooms;
        } else {
            this.cleanRooms();
            if (Memory.roomCacheTime > 50) {
                delete Memory.ownedRooms;
                Memory.roomCacheTime = 0;
                return this.getOwnRoom();
            }
            Memory.roomCacheTime ++;
            return Memory.ownedRooms;
        }
    },
    findOwnRooms : function() {
        const ownedRooms = [];
        for (let i in Game.rooms) {
            const room = Game.rooms[i];
            if  (room.controller && (room.controller.my || (room.controller.reservation && room.controller.reservation.username) === "Death_fish")) {
                ownedRooms.push(room.name);
            }
        }
        return ownedRooms;
    },
    cleanRooms : function() {
        Memory.ownedRooms = Memory.ownedRooms.filter((value, index, array) => {
            if (!Game.rooms[value]) {
                return true;
            } else {
                return Game.rooms[value].controller && (Game.rooms[value].controller.my || Game.rooms[value].controller.reservation.username === "Death_fish");
            }
        });
    },
    findInvisibleOwnRooms : function() {
        return this.getOwnRoom().filter((v, i, a) => !Game.rooms[v]);
    },
    isClaimableRoom : function(room) {
        if (room instanceof String) {
            if (Game.rooms[room] && (!Game.rooms[room].controller)) {
                return false;
            }

            return this.getOwnRoom().indexOf(room) === -1;
        } else {
            return this.getOwnRoom().indexOf(room.name) === -1;
        }
    },
    getOwnController : function() {
        const rooms = this.getOwnRoom();
        for (var i in rooms) {
            const room = Game.rooms[rooms[i]];
            if (room.controller && room.controller.my) {
                return room.controller;
            }
        }
    },
    randomRoom : function() {
        const ownRoom = this.getOwnRoom();
        const index = Math.floor(Math.random() * ownRoom.length);
        console.log("index: " + index+ ", room: " + ownRoom[index])
        return ownRoom[index];
    }
};