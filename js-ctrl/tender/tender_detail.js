(function () {
    var that = me.define("tender_detail", {
        ctrl: function () {
            that.$scope.params = me.param();
            that.$scope.model = me.param().model;
            me.global.showPop("modal_tender_detail");
            me.global.getProvince();
            that.$scope.$watch("model.province_id", function () {
                me.global.getCity(that.$scope.model.province_id);
            })
		},

        confirm: function (model) {
            model.download_stop_time = $("#download_stop_time").val();
            model.start_mark_time = $("#start_mark_time").val();
            model.announcement_time = $("#announcement_time").val();
            Util.ajax({
                method: "POST",
                data: model,
                url: Util.getApiUrl("account/upsertProject")
            }, function (data) {
                Util.info("修改成功", true);
                me.global.hidePop("modal_tender_detail", model);
            });
        },

        passModel:function(model){
            model.audit_status = me.global.enumProjectAuditStatus_key_map.audit_status_2.code;
            that.confirm(model);
        },

        addFile: function (res_type) {
		    Util.doUploadFile({}, "image/jpg;image/jpeg;image/png;image/gif;image/bmp;", 500, function (data) {
		        if (!data) return;
		        var res_urls = that.$scope.model.res_urls || [];
		        var res = res_urls.filter(function(res){
		            return res.project_res_type==res_type && !res.is_delete;
		        });
		        if (res.length) res.id_delete = 1;

		        res_urls.push({
		            res_url: data.path,
		            is_delete: 0,
		            project_res_type:res_type
		        });
		        that.$scope.model.res_urls = res_urls;
		        that.$scope.$apply();
		    });
        },

        getFileName: function (res_type) {
            var res_urls = that.$scope.model.res_urls || [];
            var res = res_urls.filter(function (res) {
                return res.project_res_type == res_type && !res.is_delete;
            });
            if (res.length == 0) return "";
            return res[0].res_url;
        },

        removeFile: function (res_type) {
            var res_urls = that.$scope.model.res_urls || [];
            var res = res_urls.filter(function (res) {
                return res.project_res_type == res_type && !res.is_delete;
            });
            res.length && (res[0].is_delete = 1);
        }

	});
})();