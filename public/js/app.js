var $app = {
  // 输入消息的内容, 消息的等级(选填)
  notify: function(text, rank) {
    $('#sys_notify .msg').text(text);
    $('#sys_notify').css('marginTop', '0');
    var restore = function () { $('#sys_notify').css('marginTop', '-50px'); }
    setTimeout(restore, 2200)
  },
  search: function (text, isGlobal) {
    var obj = isGlobal ? {} : $qs.parse(location.search);
    if (text) obj.search = text.trim().replace(/\s+/g, '+'); // 空格
    location.search = $qs.stringify(obj)
  },
  appendQs: function(qsObj) {
    var obj = $qs.parse(location.search);
    for(var o in qsObj) {
      obj[o] = qsObj[o];
    }
    location.search = $qs.stringify(obj)
  }

}
