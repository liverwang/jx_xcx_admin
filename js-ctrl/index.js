(function () {
	var that = me.define("index", {
	    ctrl: function () {
	        me.global.getEnumData(function () {
	            that.initMenu();
	        });
	    },

	    initMenu: function () {
	        that.$scope.menuList = Menu;
	        that.$scope.activeMenuIndex = parseInt(localStorage.getItem('activeMenuIndex')) || 0;
	        that.$scope.activeSubMenuIndex = parseInt(localStorage.getItem('activeSubMenuIndex')) || 0;
	        var menu = that.$scope.menuList[that.$scope.activeMenuIndex];
	        menu.index = that.$scope.activeMenuIndex;
	        if (menu.page_list) {
	            var submenu = menu.page_list[that.$scope.activeSubMenuIndex];
	            that.changeMenu(submenu, that.$scope.activeSubMenuIndex, menu);
	        }
	        else {
	            that.changeMenu(menu, that.$scope.activeMenuIndex, menu);
	        }
	    },

	    changeMenu: function (submenu, index, menu) {
	        //如果有下级菜单，则切换下级菜单显示
	        if (submenu.page_list) {
	            submenu.toggle = !submenu.toggle;
	            return;
	        }
	        localStorage.setItem("activeMenuIndex", menu.index);
	        localStorage.setItem("activeSubMenuIndex", index);
	        that.$scope.activeMenuIndex = menu.index;
	        that.$scope.activeSubMenuIndex = index;
	        me.global("activeMenu", menu);
	        me.global("activeSubMenu", submenu);
	        me.show(submenu.page_src, {
	            showType: 0
	        });
	    },


		changePassword: function () {
			me.show("changePassword", {
				showType: 1,
				style: "pop",
				param: {}
			}).on("hide", function (data) {
				if (!data) return;
				that.exit();
			});
		},

		/*退出*/
		exit: function () {
		    localStorage.clear();
		    location.replace("login.html");
		}
	});
})();