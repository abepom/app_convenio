String.prototype.replaceAll = function(de, para) {
  var str = this;
  var pos = str.indexOf(de);
  while (pos > -1) {
    str = str.replace(de, para);
    pos = str.indexOf(de);
  }
  return str;
};

module.exports = String.prototype.replaceAll;
