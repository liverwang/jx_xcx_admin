﻿(function () {
    var that = me.define("system_enterprise_detail", {
        ctrl: function () {
            that.$scope.model = {}|| me.param().model;
            me.global.showPop("modal_system_enterprise_detail");
		},

		confirm: function (model) {
			//Util.ajax({
			//	method: "POST",
			//	data: model,
			//	url: Util.getApiUrl(model.id ? "unit/modifyUnit" : "unit/addUnit")
			//}, function (data) {
			//    Util.info("修改成功", true);
		    me.global.hidePop("modal_system_enterprise_detail", model);
			//});
		}
	});
})();