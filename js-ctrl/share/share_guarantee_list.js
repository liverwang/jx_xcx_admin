(function () {
    var that = me.define("share_guarantee_list", {
        ctrl: function () {
            that.$scope.params = me.param() || {};
            that.getGuaranteeCompanys();
        },

        getGuaranteeCompanys: function () {
            Util.ajax({
                method: "POST",
                data: {},
                url: Util.getApiUrl("account/baohanTongji")
            }, function (data) {
                that.$scope.companys = data;
                if (data && data.length) {
                    var activeCompanyIndex = that.$scope.activeCompanyIndex || 0;
                    if (activeCompanyIndex > data.length)
                        activeCompanyIndex = 0;
                    that.selectCompany(data[activeCompanyIndex], activeCompanyIndex);
                }
            });
        },

        selectCompany: function (company, index) {
            that.$scope.params.company_id = company.company_id;
            that.$scope.activeCompanyIndex = index;
            that.doSearch(that.$scope.params);
        },

        doSearch: function (params) {
            that.$scope.pager = new Pagination("#share_guarantee_list_pager", {
                pageSize: 10,
                autoLoad: true,
                unit: "条",
                toPage: function (index) {
                    var paper = this;
                    Util.ajax({
                        method: "POST",
                        data: {
                            company_id: params.company_id,
                            pageIndex: index,
                            pageSize: 10
                        },
                        url: Util.getApiUrl("account/listGuaranteeLog")
                    }, function (data) {
                        if (index == 0) paper.updateCount(data.count);
                        that.$scope.data = data.list;
                    });
                }
            });
        },

        addModel: function (model, index) {
            model = model || {};
            me.show("base/center_add", {
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
                        guarantee_log_id: model.guarantee_log_id
                    },
                    url: Util.getApiUrl("account/delGuaranteeLog")
                }, function (data) {
                    that.getGuaranteeCompanys();
                });
            });
        }
	});
})();
