var BufferUtil = {};


// 将server返回的二进制数据处理成相应的string，
BufferUtil.toString = function(buffer) {

  if(buffer.length < 5)
    return '';

  var lenBuffer = buffer.slice(0, 4);
  var stringLen = lenBuffer[0] << 24 + lenBuffer[1] << 16 + lenBuffer[2] << 8 + lenBuffer[3];
  var result = buffer.slice(4, buffer.length).toString();
}


BufferUtil.toBytes = function(string) {
  
}
