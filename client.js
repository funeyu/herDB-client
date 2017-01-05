const Promise = require('bluebird');
const uuid = require('uuid/v1');
var net = require('net');

var Client = function(host, port) {
  this.host = host;
  this.port = port;
  this.uuid = uuid();
}

Client.prototype.init = function() {
  var self = this;
  return new Promise(function(resolve, reject) {
    var socket = new net.Socket();
    socket.connect(self.port, self.host, function() {

      self.socket = socket;
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
  this.__sendCommand('put,' + key + ',' + value);
}

Client.prototype.stopServer = function() {
  this.__sendCommand('close');
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
  var commandsBuffer = new Buffer(commandInfo.length + this.uuid.length + 4);
  // 先是写入uuid
  commandsBuffer.write(this.uuid);
  // 再写入命令数据的长度 int 4个字节
  commandsBuffer.writeUInt32BE(commandInfo.length, this.uuid.length);
  // 最后写入commandInfo数据
  commandsBuffer.write(commandInfo, this.uuid.length + 4);
  this.socket.write(commandsBuffer);
}

module.exports = Client




var cl = new Client('127.0.0.1', 8888);
var authed = cl.init().then(function(cl) {
  return cl.auth('funer');
})

// authed.then(function(cli) {
//   // cli.put('javajava', 'java jeclipse nodejs    ejf;ajfojas;odifja;osifjd;aofjido;ajifd;ajfd;a');
// });

// wrong 写法：
// for(var i = 0; i < 1000; i ++) {
//   authed.then(function(cli) {
//     cli.get('nodjes' + i).then(function(cli) {
//       console.log(cli.data.toString());
//     });
//   });
// }

// authed.then(function(cli) {
//   cli.put('fuheyu8090', 'fuheryu1989');
// })
authed.then(function(cli) {
  cli.get('fuheyu8090').then(function(cli) {
    console.log('fuheyu8090:');
    console.log(cli.data.toString());
  })
});

// authed.then(function(cli) {
//   cli.get('javajava').then(function(cli) {
//     console.log('data');
//     console.log(cli.data.toString());
//   })
// });

// authed.then(function(cli) {
//   cli.stopServer();
// });
