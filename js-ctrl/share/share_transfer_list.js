(function () {
    var that = me.define("share_transfer_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            //that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#share_transfer_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            center_name:params.searchString,
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listCenter")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = data.list;
                    });
                }
            });
        },

        addModel: function (model, index) {
            model = model || {};
            me.show("share/share_transfer_detail", {
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

        delModel: function (model,index) {
            me.show("modal", {
                showType: 1,
                style: "pop",
                param: "是否删除当前数据?"
            }).on("hide", function (data) {
                if (!data) return;
                Util.ajax({
                    method: "POST",
                    data: {
                        center_id:model.center_id
                    },
                    url: Util.getApiUrl("account/delCenter")
                }, function (data) {
                    that.$scope.data.splice(index,1);
                });
            });
        }
	});
})();