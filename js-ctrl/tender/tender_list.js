(function () {
    var that = me.define("tender_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#tender_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            searchString: params.searchString,
                            project_status: params.project_status,
                            project_type: params.project_type,
                            audit_status: params.audit_status || (params.source ? '' : me.global.enumProjectAuditStatus_key_map.audit_status_2.code),
                            start_mark_time: $("#search_start_mark_time").val(),
                            end_mark_time: $("#search_end_mark_time").val(),
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listProject")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = data.list;
                    });
                }
            });
        },

        addModel: function (model, index) {
            model = model || {};
            me.show("tender/tender_detail", {
                showType: 1,
                style: "pop",
                param: {
                    model: angular.copy(model),
                    source:that.$scope.params.source
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
                        project_id: model.project_id
                    },
                    url: Util.getApiUrl("account/delProject")
                }, function (data) {
                    that.$scope.data.splice(index,1);
                });
            });
        },

        //全选、反选
        changeAll: function () {
            that.$scope.data.map(function (data) {
                data.checked = that.$scope.checkAll;
            });
        },

        //单选取消后，全选取消
        changeRow: function (d) {
            if (!d.checked) that.$scope.checkAll = false;
        }
	});
})();