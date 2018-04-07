(function () {
	var that = me.define("login", {
		ctrl: function () {
		    that.getGraphicVercode();
		    if (localStorage.getItem("account_phone")) {
		        that.$scope.params = {
		            account_phone: localStorage.getItem("account_phone") || ""
		        };
		    }
		    that.$scope.params = that.$scope.params || {};
		},

		login: function (params) {
		    if (!params) {
		        Util.info("请输入登录信息", 2);
		        return;
		    }
		    if (!params.account_phone) {
		        Util.info("请输入账号", 2);
		        return;
		    }
		    if (!params.password) {
		        Util.info("请填写密码", 2);
		        return;
		    }
		    if (!params.code) {
		        Util.info("请填写验证码", 2);
		        return;
		    }

		    Util.ajax({
		        method: "POST",
		        data: {
		            account: params.account_phone,
		            code_id: that.$scope.code_id,
		            code: that.$scope.params.code,
		            password: params.password
		        },
		        url: Util.getApiUrl("account/login")
		    }, function (data) {
		        //登陆前清空浏览器缓存
		        localStorage.clear();
		        /*记住账号*/
		        localStorage["account_phone"] = that.$scope.rememberAccount ? that.$scope.params.account_phone : "";
		        /*缓存登陆用户数据*/
		        localStorage["login_data"] = JSON.stringify(data);
		        /*跳转到首页*/
		        location.replace("index.html");
		    });
		},

		getGraphicVercode: function () {
		    Util.ajax({
		        method: "POST",
		        data: {},
		        url: Util.getApiUrl("account/getGraphicVercode")
		    }, function (data) {
		        that.$scope.code_img = data.image;
		        that.$scope.code_id = data.code_id;
		    });
		},

		forgetPassword: function () {
		    Util.info("请联系系统管理员", 1);
		},

		keydown: function (params, event) {
		    if (event.keyCode == 13 || event.which == 13) {
		        that.login(params);
		    }
		}
	});
})();