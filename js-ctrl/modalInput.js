(function () {
    var that = me.define("modalInput", {
		ctrl: function () {
			that.$scope.param = me.param();
			me.global.showPop("myModal_modalInput");
		},

		confirm: function () {
		    if (that.$scope.param.require && !that.$scope.content) {
		        Util.info(that.$scope.param.title);
		        return;
		    }
		    me.global.hidePop("myModal_modalInput", {
		        content: that.$scope.content
		    });
		}
	});
})();
