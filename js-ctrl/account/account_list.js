(function () {
    var that = me.define("account_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#account_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            company_id: params.enterprise && params.enterprise.company_id,
                            searchString: params.searchString,
                            user_role: "",
                            user_status:"",
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listUser")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = data.list;
                    });
                }
            });
        },

        addModel: function (model, index) {
            model = model || {};
            me.show("account/account_detail", {
                showType: 1,
                style: "pop",
                param: {
                    model: model
                }
            }).on("hide", function (data) {
                if (!data) return;
                that.$scope.pager.toPage(that.$scope.pager.pageIndex);
            });
        },

        disableModel: function (model, index) {
            me.show("modal", {
                showType: 1,
                style: "pop",
                param: "是否" + (model.user_status === 1?"冻结":"解冻") + "当前数据?"
            }).on("hide", function (data) {
                if (!data) return;
                Util.ajax({
                    method: "POST",
                    data: {
                        user_id: model.user_id,
                        user_status: model.user_status === 1 ? 2 : 1
                    },
                    url: Util.getApiUrl("account/changeUserStatus")
                }, function (data) {
                    Util.info("操作成功",true);
                    that.$scope.pager.toPage(that.$scope.pager.pageIndex);
                });
            });
        }
	});
})();
