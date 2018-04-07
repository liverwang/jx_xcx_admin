(function () {
    var that = me.define("system_enterprise_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.getCompanyTotal();
        },

        getCompanyTotal: function () {
            Util.ajax({
                method: "POST",
                data: {},
                url: Util.getApiUrl("account/companyLevelTongji")
            }, function (data) {
                that.$scope.totalCompany = data;

                if (data && data.length) {
                    var activeTotalIndex = that.$scope.activeTotalIndex || 0;
                    if (activeTotalIndex > data.length)
                        activeTotalIndex = 0;
                    that.selectTotal(data[activeTotalIndex], activeTotalIndex);
                }
            });
        },

        selectTotal: function (total,index) {
            that.$scope.params.company_level = total.company_level;
            that.$scope.activeTotalIndex = index;
            that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#system_enterprise_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            company_level: params.company_level,
                            searchString: params.searchString,
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listCompany")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = data.list;
                    });
                }
            });
        },

        addModel: function (model, index) {
            model = model || {
                company_level: that.$scope.params.company_level
            };
            me.show("system/system_enterprise_detail", {
                showType: 1,
                style: "pop",
                param: {
                    model: angular.copy(model)
                }
            }).on("hide", function (data) {
                if (!data) return;
                that.getCompanyTotal();
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
                        company_id: model.company_id
                    },
                    url: Util.getApiUrl("account/delCompany")
                }, function (data) {
                    that.getCompanyTotal();
                });
            });
        },

        showUserList: function (enterprise) {
            me.show("account/account_list", {
                showType: 1,
                param: {
                    enterprise: enterprise
                }
            });
        }
	});
})();
