﻿(function () {
    var that = me.define("share_transfer_detail", {
        ctrl: function () {
            that.$scope.model =me.param().model;
            me.global.showPop("modal_share_transfer_detail");
        },

        confirm: function (model) {
            Util.ajax({
                method: "POST",
                data: model,
                url: Util.getApiUrl("account/upsertQualification")
            }, function (data) {
                Util.info("保存成功", true);
                me.global.hidePop("modal_share_transfer_detail", model);
            });
        }
    });
})();
