var Pagination = (function () {
    var obj = function (el, options) {
        this.container = $(el);
        this.container.addClass("pagination_container");

        //if (!document.querySelector) {
        //    this.container = typeof (el) == "string" ? document.getElementById(el.substring(1)) : el;
        //} else {
        //    this.container = typeof (el) == "string" ? document.querySelector(el) : el;
        //}

        this.pageIndex = 0;
        this.pageSize = 1;
        this.pageCount = 0;
        this.dataCount = 0;
        this.unit = "条";

        if (options) {
            this.pageSize = options.pageSize;
            this.dataCount = options.dataCount || 0;
            this.toPage = options.toPage;
            //记录单位：条、例、片等
            this.unit = options.unit || this.unit;
            this.scrollTop = options.scrollTop;
        }

        this._generateStyle();

        if (options.autoLoad && (typeof this.toPage == "function")) {
            this.toPage.call(this, 0);
        } else {
            this._generate();
        }
    }

    obj.prototype = {
        handleEvent: function (e, element) {
            element = !element ? e.srcElement : element;
            element = element || e.target;
            var clickIndex = element.attributes["p_index"].value;
            if (clickIndex == this.pageIndex) {
                return;
            }

            if (clickIndex > this.pageCount - 1) return;
            if (clickIndex < 0) return;

            this._chooseItem(clickIndex);

            if (typeof this.toPage == "function") {
                this.toPage.call(this, parseFloat(clickIndex));
            }
        },

        updateCount: function (count) {
            this.dataCount = count;

            this._generate();
        },

        _generate: function () {
            this.pageCount = Math.ceil(this.dataCount / this.pageSize);
            if (this.pageCount < 1) {
                this.container.empty();
                return;
            }

            var bar = document.createElement("table");
            bar.setAttribute("cellspacing", 1);
            bar.setAttribute("cellpadding", 0);
            bar.setAttribute("border", 0);
            bar.className = "pagination_bar";

            var tbody = document.createElement("tbody");
            var tr = document.createElement("tr");

            // 回到首页
            var td = document.createElement("td");
            td.innerHTML = "«";
            td.setAttribute("p_index", 0)
            td.className = "pagination_item pagination_start";
            tr.appendChild(td);
            //this._bindEvent(td);

            for (var i = 0; i < this.pageCount; i++) {
                td = document.createElement("td");
                td.innerHTML = i + 1;
                td.setAttribute("p_index", i)
                td.className = "pagination_item pagination_index";
                tr.appendChild(td);
                if (i > 9) {
                    td.style.display = "none";
                }
            }

            td = document.createElement("td");
            td.innerHTML = (parseInt(this.pageIndex) + 1) + " / " + this.pageCount;;
            td.className = "pagination_item simple_item";
            this.simple_item = td;
            tr.appendChild(td);

            // 到末页
            td = document.createElement("td");
            td.innerHTML = "»";
            td.setAttribute("p_index", this.pageCount - 1)
            td.className = "pagination_item pagination_end";
            tr.appendChild(td);
            //this._bindEvent(td);

            tbody.appendChild(tr);
            bar.appendChild(tbody);

            this.container.empty();
            this.container.append(bar);

            var countSpan = document.createElement("span");
            countSpan.className = "pagination_count";
            countSpan.innerHTML = "共" + this.dataCount + this.unit;
            this.container.append(countSpan);

            this._bindEvent();

            this._chooseItem(0);
        },

        _updateIndex: function () {
        },

        _bind: function (element) {
            if (this._isIE()) {
                var that = this;
                element.onclick = function () {
                    that.handleEvent.call(that, null, element);
                }
            } else {
                element.addEventListener("click", this, false);
            }
        },

        _bindEvent: function () {
            var startEl =$(this.container).find(".pagination_start");
            for (var i = 0; i < startEl.length; i++) {
                if ($(startEl[i]).parents(".simple").length) {
                    startEl[i].setAttribute("p_index", Math.max(parseInt(this.pageIndex) - 1, 0));
                }
                this._bind(startEl[i]);
            }

            var endEl = $(this.container).find(".pagination_end");
            for (var i = 0; i < endEl.length; i++) {
                if ($(endEl[i]).parents(".simple").length) {
                    endEl[i].setAttribute("p_index", Math.min(parseInt(this.pageIndex) + 1, this.pageCount));
                }
                this._bind(endEl[i]);
            }

            var indexEl = $(this.container).find(".pagination_index");
            for (var i = 0; i < indexEl.length; i++) {
                this._bind(indexEl[i]);
            }
        },

        _generateStyle: function () {
            var str_css = ".pagination_container{height:33px;}"
               + ".pagination_bar {background-color:#dddddd;text-align:center;height:33px;color:#525252;"
               + "cursor:pointer;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;float:left;}"
               + ".pagination_item {width:33px;background-color:white;}"
               + ".pagination_item.simple_item {display:none;width:auto;padding:0 5px;}"
               + ".simple  .pagination_item.simple_item {display:table-cell;}"
               + ".pagination_item:hover {background-color:#eee;}"
               + ".pagination_item.simple_item:hover {background-color:white;}"
               + ".pagination_item.pagination_active {background-color:#019ff8; color:white;}"
               + ".pagination_item.pagination_active:hover{cursor:default;}"
               + ".pagination_count{float:left;line-height:32px;margin-left:5px;}"
                + ".simple .pagination_index{display:none!important;}";

            //var str_css = ".pagination_bar {background-color:#dddddd;text-align:center;height:33px;color:#428bca;"
            //    + "cursor:pointer;font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;font-size:14px;float:left;margin-bottom:10px;margin-right:5px;}"
            //    + ".pagination_item {width:33px;background-color:white;}"
            //    + ".pagination_item:hover {background-color:#eee;}"
            //    + ".pagination_item.pagination_active {background-color:#428bca; color:white;}"
            //    + ".pagination_item.pagination_active:hover{cursor:default;}"
            //    + ".pagination_count{float:left;line-height:35px;}";
            if (this._isIE()) {
                if (document.styleSheets['pagination_style']) {
                    return;
                }

                var ss = document.createStyleSheet();
                ss.owningElement.id = 'pagination_style';
                ss.cssText = str_css;
            } else {
                if (document.getElementById("pagination_style")) {
                    return;
                }
                var style = document.createElement("style");
                style.id = "pagination_style";
                style.type = "text/css";
                style.innerHTML = str_css;
                document.getElementsByTagName("HEAD").item(0).appendChild(style);
            }
        },

        _chooseItem: function (index) {
            if (this.curSelectedItem) {
                this.curSelectedItem.removeClass("pagination_active");
            }

            this.pageIndex = index;
            this.curSelectedItem = $(this.container).find(".pagination_index[p_index=" + index + "]");
            this.curSelectedItem.addClass("pagination_active");
            this._getShowIndex(index);

            this._bindEvent();
        },

        _getShowIndex: function (index) {
            var $container = $(this.container);
            $container.find(".simple_item").html((parseInt(index) + 1) + " / " + this.pageCount);;
            $container.find(".pagination_index:visible").hide();

            index = parseFloat(index);
            var arr = [];
            for (var i = index - 5; i <= index + 4; i++) {
                if (i >= 0 && i < this.pageCount) {
                    arr.push(i);
                    $container.find(".pagination_index[p_index=" + i + "]").show();
                }
            }

            var arrLen = arr.length;
            if (arrLen < 10) {
                for (var i = 0; i < 10 - arrLen; i++) {
                    if (arr[arr.length - 1] + 1 < this.pageCount) {
                        $container.find(".pagination_index[p_index=" + (arr[arr.length - 1] + 1) + "]").show();
                        arr.push(arr[arr.length - 1] + 1);
                    }
                }
            }

            arrLen = arr.length;
            if (arrLen < 10) {
                for (var i = 0; i < 10 - arrLen; i++) {
                    if (arr[0] - 1 >= 0) {
                        $container.find(".pagination_index[p_index=" + (arr[0] - 1) + "]").show();
                        arr.unshift(arr[0] - 1);
                    }
                }
            }

            //滚动到顶部
            $(this.scrollTop).animate({ scrollTop: 0 }, 300);
        },

        _isIE: function () {
            var navigatorName = "Microsoft Internet Explorer";
            return navigator.appName == navigatorName;
        }
    };

    return obj;
})();