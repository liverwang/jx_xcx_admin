(function () {
	var that = me.define("modal", {
		ctrl: function () {
			that.$scope.content = me.param();
			me.global.showPop("myModal");
		},

		confirm: function () {
			me.global.hidePop("myModal", true);
		}
	});
})();
