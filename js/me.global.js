me.ready(function () {
    me.global({
        timeGMTToString: function (str, format) {
            if (!str) return;

            if (typeof str == "object")
                return me.global.timespanToString(str.getTime(), format);
            if (typeof str == "number")
                return me.global.timespanToString(str, format);

            str = str.split(' ');
            var date_str = str[0];
            var time_str = "";
            if (str.length > 1)
                time_str = str[1];
            date_str = date_str.split('-');
            time_str = time_str.split(':');
            var date = new Date();
            date.setFullYear(date_str[0], date_str[1] - 1, date_str[2]);
            date.setHours(time_str[0], time_str.length > 1 ? time_str[1] : 0, time_str.length > 2 ? time_str[2] : 0, time_str.length > 3 ? time_str[3] : 0);
            return me.global.timespanToString(date.getTime(), format);
        },

        dateToString: function (timespan, format) {
            if (!timespan) return "-";

            var temp = /^\/Date\((\d+)\)\/$/i.exec(timespan);
            if (temp) {
                timespan = parseFloat(temp[1]);
                return me.global.timespanToString(timespan, format);
            }
            else {
                return "-";
            }
        },

        timespanToString: function (timespan, format) {
            if (!timespan) return "--";

            var date = new Date(timespan);
            var o = {
                "M+": date.getMonth() + 1, //month
                "d+": date.getDate(), //day
                "h+": date.getHours(), //hour
                "m+": date.getMinutes(), //minute
                "s+": date.getSeconds(), //second
                "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
                "S": date.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

            for (var k in o) {
                if (new RegExp("(" + k + ")").test(format)) {
                    format = format.replace(RegExp.$1,
                                  RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
                }
            }

            return format;
        },

        generateMbx: function (scope, pageTitle) {
            var from = me.param() ? me.param().from : null;
            if (!from) return;

            if (typeof from == "string") {
                from = [from];
            }

            from.push(pageTitle);

            scope.fromList = from;
        },

        /*
            *	@num:数字
            *	@precision:小数位
            *	@separator:拆分字符串
            */
        formatMoney: function (num, precision, separator) {
            num = num || 0;
            var parts;
            // 判断是否为数字
            if (!isNaN(parseFloat(num)) && isFinite(num)) {
                // 把类似 .5, 5. 之类的数据转化成0.5, 5, 为数据精度处理做准, 至于为什么
                // 不在判断中直接写 if (!isNaN(num = parseFloat(num)) && isFinite(num))
                // 是因为parseFloat有一个奇怪的精度问题, 比如 parseFloat(12312312.1234567119)
                // 的值变成了 12312312.123456713
                num = Number(num);
                // 处理小数点位数
                num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
                // 分离数字的小数部分和整数部分
                parts = num.split('.');
                // 整数部分加[separator]分隔, 借用一个著名的正则表达式
                parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

                return parts.join('.');
            }
            return NaN;
        },

        /*
            @elId:modal id
            @intervals:定时器列表
        */
        showPop: function (elId, intervals) {
            $('#' + elId).modal('show');
            $('#' + elId).on('hidden.bs.modal', function (e) {
                me.hide();
            });

            //根据屏幕高度适应弹出框高度
            var clientHeight = document.documentElement.clientHeight;
            var height = clientHeight - 250;
            $(".modal-body").css({
                'max-height': height + "px",
                'overflow-y':'auto'
            });
            if(clientHeight<650)
                $(".modal-body iframe").css({'height':580+"px"});
            $(".modal-body.tab-content").height(height);
        },

        hidePop: function (elId, data) {
            /*取消showPop时绑定的默认hide事件*/
            $('#' + elId).unbind("hidden.bs.modal");
            $('#' + elId).on('hidden.bs.modal', function (e) {
                me.hide(data);
            });

            $('#' + elId).modal('hide');
        },

        /*图片缓存*/
        noCacheUrl: function (url) {
            if (!url)
                return;
            if (url.indexOf("?") >= 0)
                url += "&r=" + (+new Date());
            else
                url += "?r=" + (+new Date());
            return url;
        },

        //添加随机数后缀
        Random: function () {
            return "?_r=" + (new Date().getTime());
        },

        formatNumber: function (num) {
            if (num < 10000)
                return num;
            else
                return Math.round(num * 1.0 / 10000 * 100) / 100 + "万";
        },

        //获取枚举数据
        getEnumData: function (callback) {
            Util.ajax({
                method: "POST",
                data: {},
                url: Util.getApiUrl("data/listEnumData")
            }, function (data) {
                me.global('enumData', data)
                for (var key in data) {
                    /*枚举排序*/
                    data[key] = data[key].sort(function (a, b) {
                        return a.code >= b.code;
                    });
                    var item = data[key];

                    me.global(key + "_map", Util.toMap(item, "code"));
                    me.global(key + "_key_map", Util.toMap(item, "key"));
                }

                callback && callback();
            }, true);
        },

        /*
        * 文件大小格式化
        */
        format_size: function (size) {
            if (!size)
                return "0M";
            var units = ["B", "KB", "M", "G", "T"];
            var index = 0;
            while (size > 1024) {
                size = Math.round(size * 1.0 / 1024 * 100) / 100;
                if (index >= units.length - 1)
                    break;
                index++;
            }
            return Math.round(size * 10) / 10 + units[index];
        },

        fixedNumber: function (number) {
            if (!number) return "0.00";
            number = parseFloat(number);
            return number.toFixed(2);
        },

        //去除html标签,获取内容
        htmlFormat: function (msg) {
            var a = msg.replace(/<\/?.+?>/g, "");
            return a.replace(/ /g, "");
        },

        prefixInteger: function (num, length) {
            return (Array(length).join('0') + num).slice(-length);
        },

        togglePanel: function () {
            var e = window.event;
            $(e.srcElement).parents(".panel:eq(0)").find(".panel-body").slideToggle(200);
            $(e.srcElement).parents(".panel:eq(0)").find(".panel_toggle").toggleClass("down");
        },

        //查询省份数据
        getProvince: function () {
            Util.ajax({
                method: "POST",
                data: {},
                url: Util.getApiUrl("data/listProvince")
            }, function (data) {
                me.global("province_dict", data);
                me.global("province_dict_map", Util.toMap(data, "province_id"));
            }, true);
        },

        //查询城市数据
        getCity: function (province_id) {
            Util.ajax({
                method: "POST",
                data: {
                    province_id: province_id
                },
                url: Util.getApiUrl("data/listCity")
            }, function (data) {
                me.global("city_dict", data);
                me.global("city_dict_map", Util.toMap(data, "city_id"));
            }, true);
        },

        //查询区县数据
        getArea: function (city_id) {
            Util.ajax({
                method: "POST",
                data: {
                    city_id: city_id
                },
                url: Util.getApiUrl("data/listArea")
            }, function (data) {
                me.global("area_dict", data);
                me.global("area_dict_map", Util.toMap(data, "area_id"));
            }, true);
        },
    });

    if (!localStorage.getItem("login_data")) {
        localStorage.clear();
        location.replace("login.html");
        return;
    }

    /*加载默认数据*/
    me.global("login_data", localStorage["login_data"] ? JSON.parse(localStorage["login_data"]) : {});
    me.global("res", Config.res);

    me.global("qualification_type_dict", [{
        code: 1,
        text: "我是买家",
        key: "buyer"
    }, {
        code: 2,
        text: "我是卖家",
        key: "seller"
    }])
});
