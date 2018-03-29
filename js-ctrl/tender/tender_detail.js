(function () {
    var that = me.define("tender_detail", {
        ctrl: function () {
            that.$scope.params = me.param();
            that.$scope.model = me.param().model;
            me.global.showPop("modal_tender_detail");
		},

		confirm: function (model) {
			//Util.ajax({
			//	method: "POST",
			//	data: model,
			//	url: Util.getApiUrl(model.id ? "unit/modifyUnit" : "unit/addUnit")
			//}, function (data) {
			//    Util.info("修改成功", true);
		    me.global.hidePop("modal_tender_detail", model);
			//});
		}
	});
})();