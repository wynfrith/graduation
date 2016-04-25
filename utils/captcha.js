var captchapng = require('captchapng');
export default function(number) { //四位数字
  var p = new captchapng(80,30, number);
  p.color(0, 0, 0, 0);
  p.color(25, 150, 80, 255);
  var img = p.getBase64();
  return new Buffer(img,'base64');
}
