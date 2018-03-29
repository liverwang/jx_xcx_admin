var Util = (function () {
    var that;
    var obj = function () {
        this.ajaxCount = 0;
        that = this;
        that.popId = [];

    };

    obj.prototype = {
        getQueryString: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return "";
        },

        info: function (msg, success) {
            $(".util_pop_info").remove();

            var innerDiv = document.createElement("div");
            innerDiv.className = "util_pop_info";
            if (success) {
                innerDiv.className += " success";
            } else {
                innerDiv.className += " warning";
            }
            innerDiv.innerHTML = msg;

            document.body.appendChild(innerDiv);
            setTimeout(function () {
                $(".util_pop_info").remove();
            }, 3000);
        },

        getApiUrl: function (method, param, api) {
            var url;
            if (method && method.indexOf("http://") >= 0)
                url = method;
            else {
                url = (api ? api : Config.api).replace("{method}", method);
            }

            if (param) {
                if (url.indexOf("?") < 0) url += "?";
                for (var key in param) {
                    url += key + "=" + param[key] + "&";
                }
                url = url.substring(0, url.length - 1);
            }
            return url;
        },

        ajax: function (option, callback, noloading, noerror) {
            option.data = option.data || {};

            /*默认添加token参数*/
            if (!option.data.token) {
                //从localstorage提取token信息
                if (localStorage.getItem("login_data")) {
                    var login_data = JSON.parse(localStorage.getItem("login_data"));
                    //如果发现localstorage中的token与global中的token不一致，则刷新页面
                    if (me.global.login_data && me.global.login_data.token != login_data.token) {
                        location.reload();
                        return;
                    }
                    option.data.token = login_data.token;
                }
            }

            //当前菜单对应role_id
            if (!noloading) that.showLoading(option.url);

            var startTime = new Date();
            me.ajax(option, function (data) {
                if (!noloading) that.hideLoading();

                if (me._param.config.debug) {
                    console.group && console.group("ajax");
                    console.log("%c链接", "font-weight:bold;");
                    console.log(option.url);
                    console.log("%c参数", "font-weight:bold;");
                    console.log(JSON.stringify(option.data))
                    console.log("%c返回", "font-weight:bold;");
                    console.log(data.data);
                    console.log("%c执行时间 " + (new Date() - startTime), "font-weight:bold;");
                    console.groupEnd && console.groupEnd();
                }

                if (data.resultCode && data.resultCode != "0") {
                    Util.hideLoading();
                    !noerror && data.resultMsg && Util.info(data.resultMsg, 2);

                    if (data.resultCode == 100) {
                        easyDialog.open({
                            container: {
                                header: '重新登录',
                                content: '<div class="easyDialog_warning">登录状态已失效，请重新登录</div>',
                                yesFn: function (e) {
                                    //跳转回登陆页面前清空缓存数据
                                    localStorage.clear();
                                    location.replace("login.html");
                                },
                                noFn: true
                            }
                        });
                        return;
                    }
                    return;
                }

                callback(data.data);
            }, function (msg, status) {
                if (!noloading) that.hideLoading();
                if (status != 0) Util.info("系统异常，请重试", 3);
            });
        },

        showLoading: function (url) {
            this.ajaxCount++;
            var loading = top.document.getElementById("loading");
            if (!loading) {
                loading = document.createElement("div");
                loading.id = "loading";
                loading.innerHTML = '<div class="mop-load-div"><div class="mop-css-3 wandering-cubes"><div class="cube1"></div><div class="cube2"></div></div></div>';
                document.body.appendChild(loading);
            }

            //如果接口配置了不需要延迟，则直接显示loading
            var loadingConfig = UnDelayLoadingConfig.map(function (method) {
                return Util.getApiUrl(method);
            });

            if (loadingConfig.indexOf(url)>=0) {
                $("#loading").fadeIn(300);
            }
            else {
                setTimeout(function () {
                    $("#loading").fadeIn(300);
                }, 1000);
            }
        },

        hideLoading: function () {
            this.ajaxCount--;
            if (this.ajaxCount <= 0) {
                var loading = top.document.getElementById("loading");
                if (loading) {
                    top.document.body.removeChild(loading);
                }
                this.ajaxCount = 0;
            }
        },

        /*
        *   对象数组根据key值转化为map
        *   @arr：待转化的数组
        *   @idField：转化依据的对象字段
        *   @idField2：转化依据的扩展字段
        *   @char：扩展字段连接字符
        */
        toMap: function (arr, idField, idField2, char) {
            if (!arr) return {};

            var map = {};
            arr.forEach(function (item) {
                var field = item[idField];
                if (!field) return;
                if (idField2) {
                    field += char + item[idField2];
                }
                map[field] = item;
            });
            return map;
        },

        doUploadFile: function (data, accept, maxSize,appUpload, callBack) {
            //appUpload用来判断
            var url = "upload/uploadfile";   //普通上传接口
            var appUrl = "upload/uploadAppFile";    //app版本更新上传接口
            if(appUpload){
                url = appUrl;
            }
            File.upload({
                multi: true,
                url: Util.getApiUrl(url),
                param: data,
                accept: accept,
                before: function (files) {
                    if (!maxSize) {
                        if (files[0].size > maxSize * 1024) {
                            Util.info("图像大小不能超过" + maxSize + "KB", 2);
                            return false;
                        }
                    }
                    Util.showLoading();
                },
                after: function (data) {
                    Util.hideLoading();
                    data = JSON.parse(data).data;
                    callBack && callBack(data);
                },
                error: function () {
                    Util.hideLoading();
                    Util.info("上传失败", 3);
                },
                progress: function () { }
            });
        },

        /*设置cookie*/
        setCookie: function (name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        },

        /*提取cookie*/
        getCookie: function (name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        },

        /*删除cookie*/
        delCookie: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = that.getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        },

        isPhone: function (phone) {
            return /^1[34578]\d{9}$/.test(phone) || /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(phone);
        },

        isNum: function (num) {
            return /^\d+(\.\d+)?$/.test(num);
        },

        isInteger: function (num) {
            return /^\d+$/.test(num);
        },

        //身份证验证
        idnumber: function (str) {
            var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            return reg.test(str);
        },

        decentString: function (str) {
            return /^[a-zA-Z_\d]+$/.test(str);
        },

        decentStringZH: function (str) {
            return /^[a-zA-Z_\d\u4e00-\u9fa5]+$/.test(str);
        },

        isMail: function (str) {
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(str);
        },

        fitImg: function (img, parentSelector) {
            img = $(img);

            var src = img.attr("src");
            var parent = parentSelector ? img.parents(parentSelector) : img.parent();
            var parentWidth = parent.width();
            var parentHeight = parent.height();

            var nimg = new Image();
            nimg.onload = function () {
                var imgwidth = this.width;
                var imgheight = this.height;

                img.css("margin-top", "0px");
                if (imgwidth / imgheight > parentWidth / parentHeight) {
                    var rightHeight = parentWidth * imgheight / imgwidth;
                    img.width(parentWidth);
                    img.height(rightHeight);
                    img.css("margin-top", (parentHeight - rightHeight) / 2 + "px");
                } else if (imgwidth / imgheight < parentWidth / parentHeight) {
                    var rightWidth = parentHeight * imgwidth / imgheight;
                    img.width(rightWidth);
                    img.height(parentHeight);
                } else {
                    img.width(parentWidth);
                }
                img.fadeIn(350);
            }
            nimg.src = src;
        },

        /*图片充满容器*/
        fullImg: function (img, parentSelector) {
            img = $(img);

            var src = img.attr("src");
            var parent = parentSelector ? img.parents(parentSelector) : img.parent();
            var parentWidth = parent.width();
            var parentHeight = parent.height();
            var nimg = new Image();
            nimg.onload = function () {
                var imgwidth = this.width;
                var imgheight = this.height;
                img.css({
                    "top": 0,
                    "left": 0
                });
                if (imgwidth / imgheight >= parentWidth / parentHeight) {
                    img.height(parentHeight);
                    var _width = imgwidth / imgheight * img.height();
                    var _left = (_width - parentWidth) / 2;
                    img.css({ "left": 0 - _left });
                } else {
                    img.width(parentWidth);
                    var _height = imgheight / imgwidth * img.width();
                    var _top = (_height - parentHeight) / 2;
                    img.css({ "top": 0 - _top });
                }
                img.fadeIn(350);
            }
            nimg.src = src;
        },

        subString: function (str, len) {
            var newLength = 0;
            var newStr = "";
            var chineseRegex = /[^\x00-\xff]/g;
            var singleChar = "";
            var strLength = str.replace(chineseRegex, "**").length;
            for (var i = 0; i < strLength; i++) {
                singleChar = str.charAt(i).toString();
                if (singleChar.match(chineseRegex) != null) {
                    newLength += 2;
                }
                else {
                    newLength++;
                }
                if (newLength > len) {
                    break;
                }
                newStr += singleChar;
            }
            return newStr;
        },

        preventDefault: function (e) {
            e = e || arguments.callee.caller.arguments[0] || window.event;
            if (!e) return;
            //如果提供了事件对象，则这是一个非IE浏览器
            if (e && e.stopPropagation)
                //因此它支持W3C的stopPropagation()方法
                e.stopPropagation();
            else
                //否则，我们需要使用IE的方式来取消事件冒泡 
                e.cancelBubble = true;

            //如果提供了事件对象，则这是一个非IE浏览器 
            if (e && e.preventDefault)
                //阻止默认浏览器动作(W3C) 
                e.preventDefault();
            else
                //IE中阻止函数器默认动作的方式 
                e.returnValue = false;
            return false;
        },

        pushContent: function (div, content, width, noIndent, defaultContent) {
            div.innerHTML = "";
            div.style.cssText = "text-align:left;";
            div.style.width = (width + 50) + "px";
            div.style.overflow = "hidden";

            var line = document.createElement("p");
            if (!noIndent)
                line.style.cssText = "text-indent:0.6cm;"
            var lineCount = 0;
            line.innerHTML = defaultContent || "";
            div.appendChild(line);

            var lineTemp = document.createElement("span");
            div.appendChild(lineTemp);
            var lineWidth = width
            for (var i = 0; i < content.length; i++) {
                //空字符串不在拼接
                if (content.charAt(i) == " ") continue;
                if (content.charAt(i) != '\n') {
                    line.innerHTML += content.charAt(i);
                    lineTemp.innerHTML += content.charAt(i);
                }
                
                //标点符号结尾不换行
                if (/[,.!\u3002\uff0c]/.test(content.charAt(i))) continue;

                //如果需要抬头缩进，则宽度-50
                //lineWidth = width - (line.style.textIndent ? 5 : 0);

                if (content.charAt(i) == '\n') {
                    line = document.createElement("p");
                    div.removeChild(lineTemp);
                    lineTemp = document.createElement("span");
                    div.appendChild(lineTemp);
                    if (!noIndent)
                        line.style.cssText = "text-indent:0.6cm;"
                    div.appendChild(line);
                    //行累计
                    lineCount++;
                }
                else if (line.offsetWidth == lineWidth) {
                    if (lineTemp.offsetWidth <= lineWidth)
                        continue;
                    line = document.createElement("p");
                    div.removeChild(lineTemp);
                    lineTemp = document.createElement("span");
                    div.appendChild(lineTemp);
                    div.appendChild(line);
                    //行累计
                    lineCount++;
                } else if (line.offsetWidth > lineWidth) {
                    if (lineTemp.offsetWidth <= lineWidth)
                        continue;
                    line.innerHTML = line.innerHTML.substring(0, line.innerHTML.length - 1);
                    line = document.createElement("p");
                    line.innerHTML = content.charAt(i);

                    div.removeChild(lineTemp);
                    lineTemp = document.createElement("span");
                    div.appendChild(lineTemp);
                    div.appendChild(line);
                    //行累计
                    lineCount++;
                }
            }
            div.removeChild(lineTemp);
            return lineCount;
        },

        //格式化提示输出
        formatNotice: function (content) {
            var reg = /<notice.*?type="(.*?)".*?>.*?<\/notice>/ig;
            var match = reg.exec(content);
            var replacer = [];
            while (match) {
                var template = match[0],
                    type = match[1];

                switch (type) {
                    case "case":
                        var r = /<notice.*?field="(.*?)".*?value="(.*?)".*?>(.*?)<\/notice>/ig;
                        var m = r.exec(template);
                        var obj = {
                            field: m[1],
                            value: m[2],
                            content: m[3]
                        };
                        //replacer.push(obj.value);
                        return obj.value;
                        break;

                    case "font":
                        var r = /<notice.*?color="(.*?)".*?>(.*?)<\/notice>/ig;
                        var m = r.exec(template);
                        var obj = {
                            color: m[1],
                            content: m[2]
                        };
                        replacer.push([template, "<font style='color:" + obj.color + ";'>" + obj.content + "</font>"]);
                        break;

                    case "report":
                        var r = /<notice.*?reportid="(.*?)".*?caseid="(.*?)".*?>(.*?)<\/notice>/ig;
                        var m = r.exec(template);
                        var obj = {
                            reportid: m[1],
                            caseid: m[2],
                            content: m[3]
                        };
                        replacer.push([template, "<a onclick='me.global.viewReport(" + obj.caseid
                        + "," + obj.reportid + ");me.ngobj.$scope.$apply();'>" + obj.content + "</a> "]);
                        break;
                }

                match = reg.exec(content);
            }

            for (var i = 0; i < replacer.length; i++) {
                content = content.replace(replacer[i][0], replacer[i][1])
            }

            return content;
        },

        //获取本地图片的base64字符
        getBase64Image: function (_img,callback) {
            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                var canvas = document.createElement('CANVAS');
                var ctx = canvas.getContext('2d');
                var dataURL;
                canvas.height = this.naturalHeight;
                canvas.width = this.naturalWidth;
                ctx.drawImage(this, 0, 0);
                dataURL = canvas.toDataURL("image/png");
                callback(dataURL);
            };
            img.src = _img.src;
        },

        //根据字段分组数据，返回对象
        toGroup: function (arr, field) {
            var group = {};
            if (!arr || arr.length == 0) return group;
            arr.map(function (a) {
                if (!group[a[field]]) {
                    group[a[field]] = [];
                }
                group[a[field]].push(a);
            });
            return group;
        }
    };

    return new obj();
})();