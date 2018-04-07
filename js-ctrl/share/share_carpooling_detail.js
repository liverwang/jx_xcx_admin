(function () {
    var that = me.define("share_carpooling_detail", {
        ctrl: function () {
            that.$scope.model =me.param().model;
            me.global.showPop("modal_share_carpooling_detail");
		},

        confirm: function (model) {
            model.start_time = $("#carpooling_start_time").val();
			Util.ajax({
				method: "POST",
				data: model,
				url: Util.getApiUrl("account/upsertMarkCarpooling")
			}, function (data) {
			    Util.info("保存成功", true);
			    me.global.hidePop("modal_share_carpooling_detail", model);
			});
		}
	});
})();