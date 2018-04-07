(function () {
	var that = me.define("changePassword", {
		ctrl: function () {
			me.global.showPop("modal_change_password");
		},

		confirm: function (model) {
		    if (!model.password) {
		        Util.info("请填写原密码");
		        return;
		    }

			if (!model.new_password) {
				Util.info("请填写新密码");
				return;
			}

			if (model.new_password != model.confirm_new_password) {
				Util.info("新密码不一致");
				return;
			}

			Util.ajax({
				method: "POST",
				data: {
				    password: model.password,
				    new_password: model.new_password
				},
				url: Util.getApiUrl("seller/updatePassword")
			}, function (data) {
			    me.global.hidePop("modal_change_password", model);
			    Util.info("修改成功", true);
			});
		}
	});
})();
