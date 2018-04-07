(function () {
    var that = me.define("system_enterprise_detail", {
        ctrl: function () {
            that.$scope.model = me.param().model;
            me.global.showPop("modal_system_enterprise_detail");
            that.$scope.$$postDigest(function () {
                $('.switch').bootstrapSwitch();
                $('.switch').on("switch-change", function (e, data) {
                    that.$scope.model.guarantee_type = data.value;
                })
            })
        },

        confirm: function (model) {
            model.guarantee_type = model.guarantee_type ? 2 : 1;
            Util.ajax({
                method: "POST",
                data: model,
                url: Util.getApiUrl("account/upsertCompany")
            }, function (data) {
                Util.info("保存成功", true);
                me.global.hidePop("modal_system_enterprise_detail", model);
            });
        }
    });
})();
