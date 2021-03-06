﻿var Packet = require('./packet.js');

var PacketWriter = function() {
  var self = this;
  
  var builders = [];

  builders[0x00] = function (data) {
      var packet = new Packet(5);

      packet.writeByte(0x00)
            .writeInt(data.keepAliveId);

      return packet;
  };

  builders[0x01] = function(data) {
    var packet = new Packet(26);

    packet.writeByte(0x01)
         .writeInt(data.entityId)
         .writeString("default")
         .writeByte(data.gameMode)
         .writeByte(data.dimension)
         .writeByte(data.difficulty)
         .writeByte(0)
         .writeByte(data.maxPlayers);

    return packet;
  };

  builders[0x03] = function (data) {
      var packet = new Packet(3 + data.message.length*2);

      packet.writeByte(0x03)
            .writeString(data.message);

      return packet;
  };

  builders[0x04] = function (data) {
      var packet = new Packet(17);

      packet.writeByte(0x04)
            .writeArray(data.time)
            .writeArray(data.daytime);

      return packet;
  };

  builders[0x05] = function (data) {
      var size = 9;
      if (data.item.blockId !== -1) {
          size += 6;
      };
      if (data.item.metaData !== undefined && data.item.metaData.length !== -1) {
          size += data.item.metaData.length;
      }
      var packet = new Packet(size);

      packet.writeByte(0x05)
            .writeInt(data.entityId)
            .writeShort(data.slot)
            .writeSlot(data.item)

      return packet;
  };

  builders[0x06] = function (data) {
      var packet = new Packet(13);

      packet.writeByte(0x06)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z);

      return packet;
  };

  builders[0x08] = function (data) {
      var packet = new Packet(9);

      packet.writeByte(0x08)
            .writeShort(data.health)
            .writeShort(data.food)
            .writeFloat(data.foodSaturation);

      return packet;
  };

  builders[0x0D] = function (data) {
      var packet = new Packet(42);

      packet.writeByte(0x0D)
            .writeDouble(data.x)
            .writeDouble(data.stance)
            .writeDouble(data.y)
            .writeDouble(data.z)
            .writeFloat(data.yaw)
            .writeFloat(data.pitch)
            .writeBool(data.onGround);

      return packet;
  };

  builders[0x11] = function (data) {
      var packet = new Packet(15);

      packet.writeByte(0x11)
            .writeInt(data.entityId)
            .writeByte(0)
            .writeInt(data.x)
            .writeByte(data.y)
            .writeInt(data.z);

      return packet;
  };

  builders[0x12] = function (data) {
      var packet = new Packet(6);

      packet.writeByte(0x12)
           .writeInt(data.entityId)
           .writeByte(data.animation);

      return packet;
  };

  builders[0x14] = function (data) {
      var packet = new Packet(31 + data.playerName.length*2);

      packet.writeByte(0x14)
            .writeInt(data.entityId)
            .writeString(data.playerName)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z)
            .writeByte(data.yaw)
            .writeByte(data.pitch)
            .writeShort(data.currentItem)
            .writeMetaData();
      return packet;
  };

  builders[0x16] = function (data) {
      var packet = new Packet(9);

      packet.writeByte(0x16)
            .writeInt(data.collectedId)
            .writeInt(data.collectorId);
      return packet;
  };

  builders[0x17] = function (data) {
      var packet = new Packet(data.objectData > 0 ? 30 : 24);

      packet.writeByte(0x17)
            .writeInt(data.entityId)
            .writeByte(data.type)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z)
            .writeByte(data.yaw)
            .writeByte(data.pitch)
		    .writeInt(data.objectData);
      if (data.objectData > 0) {
          packet.writeShort(data.speedX)
                .writeShort(data.speedY)
                .writeShort(data.speedZ);
      }
      return packet;
  };

  builders[0x18] = function (data) {
      var packet = new Packet(28);

      packet.writeByte(0x18)
           .writeInt(data.entityId)
           .writeByte(data.type)
           .writeInt(data.x)
           .writeInt(data.y)
           .writeInt(data.z)
           .writeByte(data.yaw)
           .writeByte(data.pitch)
           .writeByte(data.headYaw)
           .writeShort(data.velocityX)
           .writeShort(data.velocityY)
           .writeShort(data.velocityZ)
           .writeMetaData();
      return packet;
  };

  builders[0x19] = function (data) {
      var packet = new Packet(23 + data.title.length*2);

      packet.writeByte(0x19)
            .writeInt(data.entityId)
            .writeString(data.title)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z)
            .writeInt(data.direction);
      return packet;
  };

  builders[0x1A] = function (data) {
      var packet = new Packet(19);

      packet.writeByte(0x1A)
            .writeInt(data.entityId)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z)
            .writeShort(data.count);
      return packet;
  };

  builders[0x1C] = function (data) {
      var packet = new Packet(11);

      packet.writeByte(0x1C)
            .writeInt(data.entityId)
            .writeShort(data.velocityX)
            .writeShort(data.velocityY)
            .writeShort(data.velocityZ);
      return packet;
  };

  builders[0x1D] = function (data) {
      var packet = new Packet(2 + data.entityIds.length*4);

      packet.writeByte(0x1D)
            .writeByte(data.entityIds.length);
      for (var i = 0; i < data.entityIds.length; i++) {
          packet.writeInt(data.entityIds[i]);
      }
      return packet;
  };

  builders[0x1E] = function (data) {
      var packet = new Packet(5);

      packet.writeByte(0x1E)
            .writeInt(data.entityId);
      return packet;
  };

  builders[0x1F] = function (data) {
      var packet = new Packet(8);

      packet.writeByte(0x1F)
            .writeInt(data.entityId)
            .writeSByte(data.dX)
            .writeSByte(data.dY)
            .writeSByte(data.dZ);
      return packet;
  };

  builders[0x20] = function (data) {
      var packet = new Packet(7);

      packet.writeByte(0x20)
           .writeInt(data.entityId)
           .writeByte(data.yaw)
           .writeByte(data.pitch);
      return packet;
  };

  builders[0x21] = function (data) {
      var packet = new Packet(10);

      packet.writeByte(0x21)
            .writeInt(data.entityId)
            .writeSByte(data.dX)
            .writeSByte(data.dY)
            .writeSByte(data.dZ)
            .writeByte(data.yaw)
            .writeByte(data.pitch);
      return packet;
  };

  builders[0x22] = function (data) {
      var packet = new Packet(19);

      packet.writeByte(0x22)
            .writeInt(data.entityId)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z)
            .writeByte(data.yaw)
            .writeByte(data.pitch);
      return packet;
  };

  builders[0x23] = function (data) {
      var packet = new Packet(6);

      packet.writeByte(0x23)
            .writeInt(data.entityId)
            .writeByte(data.headYaw);
      return packet;
  };

  builders[0x26] = function (data) {
      var packet = new Packet(6);

      packet.writeByte(0x23)
            .writeInt(data.entityId)
            .writeByte(data.status);
      return packet;
  };

  builders[0x27] = function (data) {
      var packet = new Packet(9);

      packet.writeByte(0x27)
            .writeInt(data.entityId)
            .writeInt(data.vehicleId);
      return packet;
  };

  builders[0x28] = function (data) {
      var packet = new Packet(9);

      packet.writeByte(0x28)
            .writeInt(data.entityId)
	        .writeMetaData(data.meteadata);
			
	  return packet;
  };

  builders[0x29] = function (data) {
      var packet = new Packet(9);

      packet.writeByte(0x29)
            .writeInt(data.entityId)
            .writeByte(data.effectId)
            .writeByte(data.amplifier)
            .writeShort(data.duration);
      return packet;
  };

  builders[0x2A] = function (data) {
      var packet = new Packet(9);

      packet.writeByte(0x2A)
            .writeInt(data.entityId)
            .writeByte(data.effectId);
      return packet;
  };

  builders[0x2B] = function (data) {
      var packet = Packet(9);

      packet.writeByte(0x2B)
            .writeFloat(data.experienceBar)
            .writeShort(data.level)
            .writeShort(data.totalExperience);
      return packet;
  };

  builders[0x33] = function (data) {
      var packet = new Packet(18 + data.compressedSize);

      packet.writeByte(0x33)
            .writeInt(data.x)
            .writeInt(data.z)
            .writeBool(data.continuous)
            .writeUShort(data.primaryBitmap)
            .writeUShort(data.addBitmap)
            .writeInt(data.compressedSize)
            .writeArray(data.compressedData);
      return packet;
  };

  builders[0x34] = function (data) {
      var packet = new Packet(15 + data.data.length*4);

      packet.writeByte(0x34)
            .writeInt(data.chunkX)
            .writeInt(data.chunkZ)
            .writeShort(data.data.length)
            .writeInt(data.data.length*4);
      for (var i = 0; i < data.data.length; i++) {
          packet.writeInt(data.data[i]);
      }
      return packet;
  };

  builders[0x35] = function (data) {
      var packet = new Packet(13);

      packet.writeByte(0x35)
            .writeInt(data.x)
            .writeByte(data.y)
            .writeInt(data.z)
            .writeShort(data.blockType)
            .writeByte(data.blockMetadata);
      return packet;
  };

  builders[0x36] = function (data) {
      var packet = new Packet(15);

      packet.writeByte(0x36)
            .writeInt(data.X)
            .writeShort(data.Y)
            .writeInt(data.Z)
            .writeByte(data.byte1)
            .writeByte(data.byte2)
            .writeShort(data.blockId);
      return packet;
  };

  builders[0x37] = function (data) {
      var packet = new Packet(18);

      packet.writeByte(0x37)
            .writeInt(data.entityId)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z)
            .writeByte(data.stage);
      return packet;
  };

  builders[0x38] = function (data) {
      var packet = new Packet(8 + data.chunkData.length + (12*data.metadata.length));
  
      packet.writeByte(0x38)
            .writeShort(data.chunkCount)
            .writeInt(data.chunkData.length)
	        .writeBool(true) //TODO: Handle SkyLightSent flag
            .writeArray(data.chunkData);
      for (var i = 0; i < data.metadata.length; i++) {
          packet.writeInt(data.metadata[i].chunkX)
                .writeInt(data.metadata[i].chunkZ)
                .writeUShort(data.metadata[i].primaryBitmap)
                .writeUShort(data.metadata[i].addBitmap);
      }

      return packet;
  };

 // builders[0x3C] = function (data) {
 // };

  builders[0x3D] = function (data) {
      var packet = new Packet(18);

      packet.writeByte(0x3D)
            .writeInt(data.entityId)
            .writeInt(data.x)
            .writeByte(data.y)
            .writeInt(data.z)
            .writeByte(data.data)
            .writeBool(false); //TODO: What is this?
      return packet;
  };

  builders[0x3E] = function (data) {
  };

  builders[0x46] = function (data) {
      var packet = new Packet(3);

      packet.writeByte(0x46)
            .writeByte(data.reason)
            .writeByte(data.gameMode);
      return packet;
  };

  builders[0x47] = function (data) {
      var packet = new Packet(18);

      packet.writeByte(0x47)
            .writeInt(data.entityId)
            .writeBool(true)
            .writeInt(data.x)
            .writeInt(data.y)
            .writeInt(data.z);
      return packet;
  };

 // builders[0x64] = function (data) {
 // };

  builders[0x65] = function (data) {
      var packet = new Packet(2);

      packet.writeByte(0x65)
            .writeByte(data.windowId);
      return packet;
  };

 // builders[0x66] = function (data) {
 // };

  builders[0x67] = function (data) {
      var packet = new Packet(11);

      packet.writeByte(0x67)
            .writeByte(data.windowId)
            .writeShort(data.slot)
            .writeSlot(data.entity);
      return packet;      
  };

  builders[0x68] = function (data) {
      var packet = new Packet(18);

      packet.writeByte(0x68)
            .writeByte(data.windowId)
            .writeShort(data.slot)
            .writeSlot(data.entity);
      return packet;      
  };

  builders[0x69] = function (data) {
      var packet = new Packet(6);

      packet.writeByte(0x69)
            .writeByte(data.windowId)
            .writeShort(data.property)
            .writeShort(data.value);
      return packet;
  };

  builders[0x6A] = function (data) {
      var packet = new Packet(6);

      packet.writeByte(0x6A)
            .writeByte(data.windowId)
            .writeShort(data.actionNumber)
            .writeBool(data.accepted);
      return packet;
  };

  builders[0x6C] = function (data) {
      var packet = new Packet(3);

      packet.writeByte(0x6C)
            .writeByte(data.windowId)
            .writeByte(data.enchantment);
      return packet;
  };

  builders[0x82] = function (data) {
      var packet = new Packet(19 + data.text1.length*2 + data.text2.length*2 + data.text3.length*2 + data.text4.length*2);

      packet.writeByte(0x82)
            .writeInt(data.x)
            .writeShort(data.y)
            .writeInt(data.z)
            .writeString(data.text1)
            .writeString(data.text2)
            .writeString(data.text3)
            .writeString(data.text4);
      return packet;
  };

// builders[0x83] = function (data) {
// };
//
// builders[0x84] = function (data) {
// };

  builders[0xC8] = function (data) {
      var packet = new Packet(6);

      packet.writeByte(0xC8)
            .writeInt(data.statistic)
            .writeBool(data.amount);
      return packet;
  };

  builders[0xC9] = function (data) {
      var packet = new Packet(6 + data.playerName.length *2);

      packet.writeByte(0xC9)
            .writeString(data.playerName)
            .writeBool(data.online)
            .writeShort(data.ping);
      return packet;
  };

  builders[0xCA] = function (data) {
      var packet = new Packet(4);

      packet.writeByte(0xCA)
            .writeByte(data.flags)
            .writeByte(data.flyingSpeed)
            .writeByte(data.walkingSpeed);
      return packet;
  };

 // builders[0xCB] = function (data) {
 // };

  builders[0xFA] = function (data) {
      var packet = new Packet(5 + (data.channel.length*2) + data.dataLength);

      packet.writeByte(0xFA)
            .writeString(data.channel)
            .writeShort(data.dataLength)
            .writeArray(data.data);
      return packet;
  };

  builders[0xFC] = function (data) {
      var packet = new Packet(5);

      packet.writeByte(0xFC)
            .writeShort(0)
            .writeShort(0);

      return packet;
  };

  builders[0xFD] = function (data) {
      var packet = new Packet(7 + data.serverId.length*2 + data.publicKey.length + data.token.length);

      packet.writeByte(0xFD)
            .writeString(data.serverId)
            .writeShort(data.publicKey.length)
            .writeArray(data.publicKey)
            .writeShort(data.token.length)
            .writeArray(data.token);
      return packet;
  };
    
  builders[0xFF] = function (data) {
    var packet = new Packet(3 + data.serverStatus.length*2);

    packet.writeByte(0xFF)
          .writeString(data.serverStatus);

    return packet;
  };
  
  self.build = function(type, data) {
    if( !builders.hasOwnProperty(type)) {
      console.log('Unknown packet to build: ' + type);
      return new Buffer(0);
    }
    
    return builders[type](data).result();
  };
};

module.exports = PacketWriter;