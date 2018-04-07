(function () {
    var that = me.define("share_recruit_detail", {
        ctrl: function () {
            that.$scope.model = me.param().model;
            me.global.showPop("modal_share_recruit_detail");
		},

		confirm: function (model) {
			Util.ajax({
				method: "POST",
				data: model,
				url: Util.getApiUrl("account/upsertRecruitment")
			}, function (data) {
			    Util.info("保存成功", true);
			    me.global.hidePop("modal_share_recruit_detail", model);
			});
		}
	});
})();