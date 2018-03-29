(function () {
    var that = me.define("system_config", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
        }
	});
})();