(function () {
    var that = me.define("demo_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#demo_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                scrollTop: ".index_right",
                toPage: function (index) {
                    var paper = this;
                    //Util.ajax({
                    //    method: "POST",
                    //    data: {
                    //        name: that.$scope.log_type,
                    //        page_index: index,
                    //        page_size: 10
                    //    },
                    //    url: Util.getApiUrl("unit/getUnit")
                    //}, function (data) {
                    //    if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = [1,2,3];
                    //});
                }
            });
        },

        addModel: function (model, index) {
            model = model || {};
            me.show("demo/demo_add", {
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
                //Util.ajax({
                //    method: "POST",
                //    data: {
                //        id:model.id
                //    },
                //    url: Util.getApiUrl("unit/deleteUnit")
                //}, function (data) {
                //    Util.info("删除成功", true);
                    that.$scope.data.splice(index, 1);
                //});
            });
        }
	});
})();