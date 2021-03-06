﻿
function Player() {
    this.name = '';
    this.entityId = -1;
    this.token = 0;
    this.id = 0;
    this.x = 0;
    this.y = 64.5;
    this.z = 0;
    this.oldx = 0;
    this.oldy = 64.5;
    this.oldz = 0;
    this.stance = 66.12;
    this.yaw = 0;
    this.pitch = 0;
    this.onGround = true;
    this.rawping = [];
    this.digging = {};

    this.network = {};
    this.handshakeData = {};
    this.inventory = {};
    this.activeSlot = 36;
};

Player.prototype.getPing = function () {
    if (this.rawping.length === 0)
        return 0;

    var ping = this.rawping[0] * 1000;
    ping += Math.round(this.rawping[1] / 1000000);

    return Math.round(ping / 2);    
}

Player.prototype.getPositionLook = function () {
    return {
        x: this.x,
        y: this.y,
        z: this.x,
        stance: this.stance,
        yaw: this.yaw,
        pitch: this.pitch,
        onGround: this.onGround
    };
};

Player.prototype.getPosition = function () {
    return {
        x: this.x,
        y: this.y,
        z: this.x,
        stance: this.stance,
        onGround: this.onGround
    };
};

Player.prototype.getLook = function () {
    return {
        yaw: this.yaw,
        pitch: this.pitch,
        onGround: this.onGround
    };
};

Player.prototype.getAbsolutePosition = function() {
    var apos = {
        x: Math.round(this.x * 32),
        y: Math.round(this.y * 32),
        z: Math.round(this.z * 32),
        yaw: (((Math.floor(this.yaw) % 360) / 360) * 256) & 0xFF,
        pitch: (((Math.floor(this.pitch) % 360) / 360) * 256) & 0xFF
      };

    return apos;
};

Player.prototype.getAbsoluteDelta = function () {
    var apos = {
        x: Math.round(this.x * 32 - this.oldx * 32),
        y: Math.round(this.y * 32 - this.oldy * 32),
        z: Math.round(this.z * 32 - this.oldz * 32),
        yaw: (((Math.floor(this.yaw) % 360) / 360) * 256) & 0xFF,
        pitch: (((Math.floor(this.pitch) % 360) / 360) * 256) & 0xFF
    };

    return apos;
};

Player.prototype.addToInventory = function(item, packetWriter) {
    if(!this.inventory[this.activeSlot]) {
        this.inventory[this.activeSlot] = item;    
    } else {
        this.inventory[this.activeSlot].count += item.count;
    }

	console.log(item);
	return;

    var inventoryUpdate = packetWriter.build(0x67, {
        windowId: 0,
        slot: this.activeSlot,
        entity: {
            itemId: item.itemId,
            count: this.inventory[this.activeSlot].count,
            damage: item.damage || 0,
            metaData: { length: -1 }
        }
    });

    this.network.write(inventoryUpdate);
};

Player.prototype.updatePosition = function (newPosition) {
    var coordCheck = function (value, newValue) {
        return Math.abs(value - newValue) <= 100;
    }

    if (newPosition.hasOwnProperty('yaw')) {
        this.yaw = newPosition.yaw;
    }

    if (newPosition.hasOwnProperty('pitch')) {
        this.pitch = newPosition.pitch;
    }

    if (newPosition.hasOwnProperty('onGround')) {
        this.onGround = newPosition.onGround;
    }

    if (newPosition.hasOwnProperty('x')) {
        if (!coordCheck(this.x, newPosition.x)) {
            return false;
        }

        this.oldx = this.x;
        this.x = newPosition.x;
    }

    if (newPosition.hasOwnProperty('y')) {
        if (!coordCheck(this.y, newPosition.y)) {
            return false;
        }

        this.oldy = this.y;
        this.y = newPosition.y;
    }

    if (newPosition.hasOwnProperty('z')) {
        if (!coordCheck(this.z, newPosition.z)) {
            return false;
        }

        this.oldz = this.z;
        this.z = newPosition.z;
    }

    if (newPosition.hasOwnProperty('stance')) {
        this.stance = newPosition.stance;
    }

    return true;
};

Player.prototype.validateDigging = function (digInfo) {
    this.digging.Stop = process.hrtime(this.digging.Start);

    //TODO: really validate digging based on tool and block

    if(this.digging.x !== digInfo.x ||
       this.digging.y !== digInfo.y ||
       this.digging.z !== digInfo.z ||
       this.digging.face !== digInfo.face) {
        return false;
    }

    return true;
};

Player.prototype.checkForPickups = function(worldEntities, packetWriter) {
    //TODO: Fix Item Pickups after 1.4.6 change
	return;

    var pos = this.getAbsolutePosition();
    var entities = worldEntities.getItemsInPickupRange({x: pos.x, y: pos.y, z: pos.z});

    for (var entityIndex in entities) {
        var entity = entities[entityIndex];
        var pickupEntity = packetWriter.build(0x16, {
            collectedId: entity.entityId,
            collectorId: this.entityId
        });

        worldEntities.remove(entity.entityId);

        this.network.write(pickupEntity);
        this.addToInventory(entity, packetWriter);
    }
};

Player.prototype.sendItemEntities = function(itemEntities, packetWriter) {
    var entities = itemEntities.getItemsInVisualRange({x: this.x, y: this.y, z: this.z});

    for (var entityIndex in entities) {
        var entity = entities[entityIndex];
        var spawnEntity = packetWriter.build(0x15, {
            entityId: entity.entityId,
            itemId: entity.itemId,
            count: entity.count,
            data: 0,
            x: entity.x,
            y: entity.y,
            z: entity.z,
            rotation: 0,
            pitch: 0,
            roll: 0
        });

        this.network.write(spawnEntity);
    }

};

Player.prototype.sendNpcEntities = function(npcEntities, packetWriter) {

};

Player.prototype.sendPlayerEntities = function(playerEntities, packetWriter) {
    var entities = playerEntities.getItemsInVisualRange({x: this.x, y: this.y, z: this.z});

    for (var entityIndex in entities) {
        var entity = entities[entityIndex];
        if (this.entityId !== entity.entityId) {
            var absolutePosition = entity.getAbsolutePosition();
            var namedEntity = packetWriter.build(0x14, {
                entityId: entity.entityId,
                playerName: entity.name,
                x: absolutePosition.x,
                y: absolutePosition.y,
                z: absolutePosition.z,
                yaw: absolutePosition.yaw,
                pitch: absolutePosition.pitch,
                currentItem: 0
            });
            
            var headLook = packetWriter.build(0x23, {
                entityId: entity.entityId,
                headYaw: absolutePosition.yaw
            });

            this.network.write(namedEntity);
            this.network.write(headLook);
        }
    }
};

module.exports = Player;