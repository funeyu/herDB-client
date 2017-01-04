const Promise = require('bluebird');
const uuid = require('uuid/v1');
var net = require('net');

var Client = function(host, port) {
  var self = this;

  return new Promise(function(resolve, reject) {
    var socket = new net.Socket();
    socket.connect(port, host, function() {

      self.socket = socket;
      self.uuid = uuid();
      resolve(self);
    });

    socket.on('error', function(error) {
      reject(error);
    });
  })
}

Client.prototype.auth = function(password) {
  this.__sendCommand('auth,' + password);
  var self = this;
  return new Promise(function(resolve, reject) {
    self.socket.on('data', function(data) {
      self.data = data;
      self.socket.removeListener('data', resolve);
      resolve(self);
    });
  });
}

Client.prototype.get = function(key) {
  var self = this;
  this.__sendCommand('get,' + key);
  return new Promise(function(resolve, reject) {
    self.socket.on('data', function(data) {
      self.data = data;
      self.socket.removeListener('data', resolve);
      resolve(self);
    });
  })
}

Client.prototype.put = function(key, value) {
  var self = this;
  this.__sendCommand('put,' + key + ',' + value);
  return new Promise().then(function() {
    return self;
  })
}
//
// writeUInt32BE的方法定义
// Buffer.prototype.writeUInt32BE = function(value, offset, noAssert) {
//   value = +value;
//   offset = offset >>> 0;
//   if (!noAssert)
//     checkInt(this, value, offset, 4, 0xffffffff, 0);
//   this[offset] = (value >>> 24);
//   this[offset + 1] = (value >>> 16);
//   this[offset + 2] = (value >>> 8);
//   this[offset + 3] = value;
//   return offset + 4;
// };

Client.prototype.__sendCommand = function(commandInfo) {
  var commandsBuffer = new Buffer(commentsInfo.length + this.uuid.length + 4);
  // 先是写入uuid
  commandsBuffer.write(self.uuid);
  // 再写入命令数据的长度 int 4个字节
  commandsBuffer.writeUInt32BE(commentsInfo.length, self.uuid.length);
  // 最后写入commandInfo数据
  commandsBuffer.write(commandInfo);
}

module.exports = Client;
