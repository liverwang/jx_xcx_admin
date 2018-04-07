(function () {
    var that = me.define("share_carpooling_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#share_carpooling_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            searchString: params.searchString,
                            mark_carpooling_type: "",
                            start_time:"",
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listMarkCarpooling")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = data.list;
                    });
                }
            });
        },

        addModel: function (model, index) {
            model = model || {
                mark_carpooling_type:1
            };
            me.show("share/share_carpooling_detail", {
                showType: 1,
                style: "pop",
                param: {
                    model: angular.copy(model)
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
                        mark_carpooling_id: model.mark_carpooling_id
                    },
                    url: Util.getApiUrl("account/delMarkCarpooling")
                }, function (data) {
                    that.$scope.data.splice(index,1);
                });
            });
        }
	});
})();
