(function () {
    var that = me.define("share_constructor_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#share_constructor_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            searchString: params.searchString,
                            create_time: "",
                            need_talent: "",
                            regist_situation:"",
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listConstructor")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = data.list;
                    });
                }
            });
        },

        addModel: function (model, index) {
            model = model || {
                user_id: me.global.login_data.user_id,
                constructor_type: me.global.enumConstructorType_key_map.constructor_type_1.code
            };
            me.show("share/share_constructor_detail", {
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
                        constructor_id: model.constructor_id
                    },
                    url: Util.getApiUrl("account/delConstructor")
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
        },

        delBatchModel: function () {
            var constructor_ids = that.$scope.data.filter(function (data) {
                return data.checked;
            }).map(function (data) {
                return data.constructor_id
            });
            me.show("modal", {
                showType: 1,
                style: "pop",
                param: "是否删除相关数据?"
            }).on("hide", function (data) {
                if (!data) return;
                Util.ajax({
                    method: "POST",
                    data: {
                        constructor_ids: constructor_ids
                    },
                    url: Util.getApiUrl("account/batchDelConstructor")
                }, function (data) {
                    that.$scope.pager.toPage(that.$scope.pager.pageIndex);
                });
            });
        }
	});
})();
