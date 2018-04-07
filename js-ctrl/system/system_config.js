(function () {
    var that = me.define("system_config", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.getSystemConfig();
        },

        getSystemConfig: function () {
            //getSysConfig
            Util.ajax({
                method: "POST",
                data: {},
                url: Util.getApiUrl("account/getSysConfig")
            }, function (data) {
                that.$scope.model = data;
            });
        },

        confirm: function (model) {
            if (!Util.isNum(model.vip_price)) {
                Util.info("请输入会员费用");
                return;
            }

            if (!Util.isNum(model.guarantee_price)) {
                Util.info("保函意向金");
                return;
            }

            Util.ajax({
                method: "POST",
                data: model,
                url: Util.getApiUrl("account/upsertSysConfig")
            }, function (data) {
                Util.info("保存成功",true);
            });
        }
	});
})();
