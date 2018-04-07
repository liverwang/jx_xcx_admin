(function () {
    var that = me.define("share_constructor_detail", {
        ctrl: function () {
            that.$scope.model =me.param().model;
            me.global.showPop("modal_share_constructor_detail");
            me.global.getProvince();
            that.$scope.$watch("model.province_id", function () {
                me.global.getCity(that.$scope.model.province_id);
            })
		},

        confirm: function (model) {
            model.birth = $("#birth").val();
			Util.ajax({
				method: "POST",
				data: model,
				url: Util.getApiUrl("account/upsertConstructor")
			}, function (data) {
			    Util.info("保存成功", true);
		        me.global.hidePop("modal_share_constructor_detail", model);
			});
		}
	});
})();
