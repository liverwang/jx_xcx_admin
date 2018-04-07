(function () {
    var that = me.define("account_detail", {
        ctrl: function () {
            that.$scope.model = me.param().model;
            that.getUserLog();
            me.global.showPop("modal_account_detail");
        },

        getUserLog: function (params) {
            that.$scope.logPager = new Pagination("#account_detail_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            user_id:that.$scope.model.user_id,
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listUserLog")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.userLogs = data.list;
                    });
                }
            });
        },

		confirm: function (model) {
			//Util.ajax({
			//	method: "POST",
			//	data: model,
			//	url: Util.getApiUrl(model.id ? "unit/modifyUnit" : "unit/addUnit")
			//}, function (data) {
			//    Util.info("修改成功", true);
		    me.global.hidePop("modal_account_detail", model);
			//});
		}
	});
})();