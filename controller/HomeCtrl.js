
const HomeCtrl = {};

HomeCtrl.index = function*() {
  yield this.render('index')
}

module.exports = HomeCtrl;
