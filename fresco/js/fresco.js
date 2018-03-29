/*!
 * Fresco - A Beautiful Responsive Lightbox - v2.1.2
 * (c) 2012-2015 Nick Stakenburg
 *
 * http://www.frescojs.com
 *
 * License: http://www.frescojs.com/license
 */
!
function (d, c) {
    "function" == typeof define && define.amd ? define(["jquery"], c) : "object" == typeof module && module.exports ? module.exports = c(require("jquery")) : d.Fresco = c(jQuery)
}(this,
function ($) {
    function baseToString(a) {
        return "string" == typeof a ? a : null == a ? "" : a + ""
    }
    function Timers() {
        return this.initialize.apply(this, _slice.call(arguments))
    }
    function getURIData(a) {
        var b = {
            type: "image"
        };
        return $.each(Types,
        function (c, d) {
            var e = d.data(a);
            e && (b = e, b.type = c, b.url = a)
        }),
        b
    }
    function detectExtension(a) {
        var b = (a || "").replace(/\?.*/g, "").match(/\.([^.]{3,4})$/);
        return b ? b[1].toLowerCase() : null
    }
    function View() {
        this.initialize.apply(this, _slice.call(arguments))
    }
    function Thumbnail() {
        this.initialize.apply(this, _slice.call(arguments))
    }
    var Fresco = {};
    $.extend(Fresco, {
        version: "2.1.2"
    }),
    Fresco.Skins = {
        fresco: {}
    };
    var Bounds = {
        viewport: function () {
            var a = {
                width: $(window).width()
            };
            if (Browser.MobileSafari || Browser.Android && Browser.Gecko) {
                var b = document.documentElement.clientWidth / window.innerWidth;
                a.height = window.innerHeight * b
            } else {
                a.height = $(window).height()
            }
            return a
        }
    },
    Browser = function (a) {
        function b(b) {
            var c = new RegExp(b + "([\\d.]+)").exec(a);
            return c ? parseFloat(c[1]) : !0
        }
        return {
            IE: !(!window.attachEvent || -1 !== a.indexOf("Opera")) && b("MSIE "),
            Opera: a.indexOf("Opera") > -1 && (!!window.opera && opera.version && parseFloat(opera.version()) || 7.55),
            WebKit: a.indexOf("AppleWebKit/") > -1 && b("AppleWebKit/"),
            Gecko: a.indexOf("Gecko") > -1 && -1 === a.indexOf("KHTML") && b("rv:"),
            MobileSafari: !!a.match(/Apple.*Mobile.*Safari/),
            Chrome: a.indexOf("Chrome") > -1 && b("Chrome/"),
            ChromeMobile: a.indexOf("CrMo") > -1 && b("CrMo/"),
            Android: a.indexOf("Android") > -1 && b("Android "),
            IEMobile: a.indexOf("IEMobile") > -1 && b("IEMobile/")
        }
    }(navigator.userAgent),
    _slice = Array.prototype.slice,
    _ = {
        isElement: function (a) {
            return a && 1 == a.nodeType
        },
        String: {
            capitalize: function (a) {
                return a = baseToString(a),
                a && a.charAt(0).toUpperCase() + a.slice(1)
            }
        }
    }; !
    function () {
        function a(a) {
            var b;
            if (a.originalEvent.wheelDelta ? b = a.originalEvent.wheelDelta / 120 : a.originalEvent.detail && (b = -a.originalEvent.detail / 3), b) {
                var c = $.Event("fresco:mousewheel");
                $(a.target).trigger(c, b),
                c.isPropagationStopped() && a.stopPropagation(),
                c.isDefaultPrevented() && a.preventDefault()
            }
        }
        $(document.documentElement).on("mousewheel DOMMouseScroll", a)
    }();
    var Fit = {
        within: function (a, b) {
            for (var c = $.extend({
                height: !0,
                width: !0
            },
            arguments[2] || {}), d = $.extend({},
            b), e = 1, f = 5, g = {
                width: c.width,
                height: c.height
            }; f > 0 && (g.width && d.width > a.width || g.height && d.height > a.height) ;) {
                var h = 1,
                i = 1;
                g.width && d.width > a.width && (h = a.width / d.width),
                g.height && d.height > a.height && (i = a.height / d.height);
                var e = Math.min(h, i);
                d = {
                    width: Math.round(b.width * e),
                    height: Math.round(b.height * e)
                },
                f--
            }
            return d.width = Math.max(d.width, 0),
            d.height = Math.max(d.height, 0),
            d
        }
    };
    $.extend($.easing, {
        frescoEaseInCubic: function (a, b, c, d, e) {
            return d * (b /= e) * b * b + c
        },
        frescoEaseInSine: function (a, b, c, d, e) {
            return -d * Math.cos(b / e * (Math.PI / 2)) + d + c
        },
        frescoEaseOutSine: function (a, b, c, d, e) {
            return d * Math.sin(b / e * (Math.PI / 2)) + c
        }
    });
    var Support = function () {
        function a(a) {
            return c(a, "prefix")
        }
        function b(a, b) {
            for (var c in a) {
                if (void 0 !== d.style[a[c]]) {
                    return "prefix" == b ? a[c] : !0
                }
            }
            return !1
        }
        function c(a, c) {
            var d = a.charAt(0).toUpperCase() + a.substr(1),
            f = (a + " " + e.join(d + " ") + d).split(" ");
            return b(f, c)
        }
        var d = document.createElement("div"),
        e = "Webkit Moz O ms Khtml".split(" ");
        return {
            canvas: function () {
                var a = document.createElement("canvas");
                return !(!a.getContext || !a.getContext("2d"))
            }(),
            css: {
                animation: c("animation"),
                transform: c("transform"),
                prefixed: a
            },
            svg: !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect,
            touch: function () {
                try {
                    return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch)
                } catch (a) {
                    return !1
                }
            }()
        }
    }();
    Support.detectMobileTouch = function () {
        Support.mobileTouch = Support.touch && (Browser.MobileSafari || Browser.Android || Browser.IEMobile || Browser.ChromeMobile || !/^(Win|Mac|Linux)/.test(navigator.platform))
    },
    Support.detectMobileTouch();
    var ImageReady = function () {
        return this.initialize.apply(this, Array.prototype.slice.call(arguments))
    };
    $.extend(ImageReady.prototype, {
        supports: {
            naturalWidth: function () {
                return "naturalWidth" in new Image
            }()
        },
        initialize: function (a, b, c) {
            return this.img = $(a)[0],
            this.successCallback = b,
            this.errorCallback = c,
            this.isLoaded = !1,
            this.options = $.extend({
                method: "naturalWidth",
                pollFallbackAfter: 1000
            },
            arguments[3] || {}),
            this.supports.naturalWidth && "onload" != this.options.method ? this.img.complete && "undefined" != $.type(this.img.naturalWidth) ? void setTimeout($.proxy(function () {
                this.img.naturalWidth > 0 ? this.success() : this.error()
            },
            this)) : ($(this.img).bind("error", $.proxy(function () {
                setTimeout($.proxy(function () {
                    this.error()
                },
                this))
            },
            this)), this.intervals = [[1000, 10], [2000, 50], [4000, 100], [20000, 500]], this._ipos = 0, this._time = 0, this._delay = this.intervals[this._ipos][1], void this.poll()) : void setTimeout($.proxy(this.fallback, this))
        },
        poll: function () {
            this._polling = setTimeout($.proxy(function () {
                if (this.img.naturalWidth > 0) {
                    return void this.success()
                }
                if (this._time += this._delay, this.options.pollFallbackAfter && this._time >= this.options.pollFallbackAfter && !this._usedPollFallback && (this._usedPollFallback = !0, this.fallback()), this._time > this.intervals[this._ipos][0]) {
                    if (!this.intervals[this._ipos + 1]) {
                        return void this.error()
                    }
                    this._ipos++,
                    this._delay = this.intervals[this._ipos][1]
                }
                this.poll()
            },
            this), this._delay)
        },
        fallback: function () {
            var a = new Image;
            this._fallbackImg = a,
            a.onload = $.proxy(function () {
                a.onload = function () { },
                this.supports.naturalWidth || (this.img.naturalWidth = a.width, this.img.naturalHeight = a.height),
                this.success()
            },
            this),
            a.onerror = $.proxy(this.error, this),
            a.src = this.img.src
        },
        abort: function () {
            this._fallbackImg && (this._fallbackImg.onload = function () { }),
            this._polling && (clearTimeout(this._polling), this._polling = null)
        },
        success: function () {
            this._calledSuccess || (this._calledSuccess = !0, this.isLoaded = !0, this.successCallback(this))
        },
        error: function () {
            this._calledError || (this._calledError = !0, this.abort(), this.errorCallback && this.errorCallback(this))
        }
    });
    var Color = function () {
        function a(a) {
            var b = a;
            return b.red = b[0],
            b.green = b[1],
            b.blue = b[2],
            b
        }
        function b(a) {
            return parseInt(a, 16)
        }
        function c(c) {
            var d = new Array(3);
            if (0 == c.indexOf("#") && (c = c.substring(1)), c = c.toLowerCase(), "" != c.replace(j, "")) {
                return null
            }
            3 == c.length ? (d[0] = c.charAt(0) + c.charAt(0), d[1] = c.charAt(1) + c.charAt(1), d[2] = c.charAt(2) + c.charAt(2)) : (d[0] = c.substring(0, 2), d[1] = c.substring(2, 4), d[2] = c.substring(4));
            for (var e = 0; e < d.length; e++) {
                d[e] = b(d[e])
            }
            return a(d)
        }
        function d(a, b) {
            var d = c(a);
            return d[3] = b,
            d.opacity = b,
            d
        }
        function e(a, b) {
            return "undefined" == $.type(b) && (b = 1),
            "rgba(" + d(a, b).join() + ")"
        }
        function f(a) {
            return "#" + (g(a)[2] > 50 ? "000" : "fff")
        }
        function g(a) {
            return h(c(a))
        }
        function h(b) {
            var c, d, e, b = a(b),
            f = b.red,
            g = b.green,
            h = b.blue,
            i = f > g ? f : g;
            h > i && (i = h);
            var j = g > f ? f : g;
            if (j > h && (j = h), e = i / 255, d = 0 != i ? (i - j) / i : 0, 0 == d) {
                c = 0
            } else {
                var k = (i - f) / (i - j),
                l = (i - g) / (i - j),
                m = (i - h) / (i - j);
                c = f == i ? m - l : g == i ? 2 + k - m : 4 + l - k,
                c /= 6,
                0 > c && (c += 1)
            }
            c = Math.round(360 * c),
            d = Math.round(100 * d),
            e = Math.round(100 * e);
            var n = [];
            return n[0] = c,
            n[1] = d,
            n[2] = e,
            n.hue = c,
            n.saturation = d,
            n.brightness = e,
            n
        }
        var i = "0123456789abcdef",
        j = new RegExp("[" + i + "]", "g");
        return {
            hex2rgb: c,
            hex2fill: e,
            getSaturatedBW: f
        }
    }(),
    Canvas = function () {
        function a(a) {
            return a * Math.PI / 180
        }
        return {
            init: function (a) {
                Support.canvas || (a.getContext = function () {
                    return a
                })
            },
            drawRoundedRectangle: function (b) {
                var c = $.extend(!0, {
                    mergedCorner: !1,
                    expand: !1,
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    radius: 0
                },
                arguments[1] || {}),
                d = c,
                e = d.left,
                f = d.top,
                g = d.width,
                h = d.height,
                i = d.radius;
                d.expand;
                if (c.expand) {
                    var j = 2 * i;
                    e -= i,
                    f -= i,
                    g += j,
                    h += j
                }
                return i ? (b.beginPath(), b.moveTo(e + i, f), b.arc(e + g - i, f + i, i, a(-90), a(0), !1), b.arc(e + g - i, f + h - i, i, a(0), a(90), !1), b.arc(e + i, f + h - i, i, a(90), a(180), !1), b.arc(e + i, f + i, i, a(-180), a(-90), !1), b.closePath(), void b.fill()) : void b.fillRect(f, e, g, h)
            },
            createFillStyle: function (a, b) {
                var c;
                if ("string" == $.type(b)) {
                    c = Color.hex2fill(b)
                } else {
                    if ("string" == $.type(b.color)) {
                        c = Color.hex2fill(b.color, "number" == $.type(b.opacity) ? b.opacity.toFixed(5) : 1)
                    } else {
                        if ($.isArray(b.color)) {
                            var d = $.extend({
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 0
                            },
                            arguments[2] || {});
                            c = Canvas.Gradient.addColorStops(a.createLinearGradient(d.x1, d.y1, d.x2, d.y2), b.color, b.opacity)
                        }
                    }
                }
                return c
            },
            dPA: function (a, b) {
                var c = $.extend({
                    x: 0,
                    y: 0,
                    dimensions: !1,
                    color: "#000",
                    background: {
                        color: "#fff",
                        opacity: 0.7,
                        radius: 2
                    }
                },
                arguments[2] || {}),
                d = c.background;
                if (d && d.color) {
                    var e = c.dimensions;
                    if (Support.canvas) {
                        a.fillStyle = Color.hex2fill(d.color, d.opacity),
                        Canvas.drawRoundedRectangle(a, {
                            width: e.width,
                            height: e.height,
                            top: c.y,
                            left: c.x,
                            radius: d.radius || 0
                        });
                        for (var f = 0,
                        g = b.length; g > f; f++) {
                            for (var h = 0,
                            i = b[f].length; i > h; h++) {
                                var j = parseInt(b[f].charAt(h)) * (1 / 9) || 0;
                                a.fillStyle = Color.hex2fill(c.color, j - 0.05),
                                j && a.fillRect(c.x + h, c.y + f, 1, 1)
                            }
                        }
                    } else {
                        $(a).html(""),
                        $(a).append($("<div>").css({
                            background: d.color,
                            opacity: d.opacity,
                            width: e.width,
                            height: e.height,
                            top: c.y,
                            left: c.x
                        }));
                        for (var f = 0,
                        g = b.length; g > f; f++) {
                            for (var h = 0,
                            i = b[f].length; i > h; h++) {
                                var j = parseInt(b[f].charAt(h)) * (1 / 9) || 0;
                                j && $(a).append($("<div>").css({
                                    position: "absolute",
                                    background: c.color,
                                    width: 1,
                                    height: 1,
                                    left: c.x + h,
                                    top: c.y + f
                                }))
                            }
                        }
                    }
                }
            }
        }
    }();
    $.extend(Timers.prototype, {
        initialize: function () {
            this._timers = {}
        },
        set: function (a, b, c) {
            this._timers[a] = setTimeout(b, c)
        },
        get: function (a) {
            return this._timers[a]
        },
        clear: function (a) {
            a ? this._timers[a] && (clearTimeout(this._timers[a]), delete this._timers[a]) : this.clearAll()
        },
        clearAll: function () {
            $.each(this._timers,
            function (a, b) {
                clearTimeout(b)
            }),
            this._timers = {}
        }
    });
    var Type = {
        isVideo: function (a) {
            return /^(youtube|vimeo)$/.test(a)
        }
    },
    Types = {
        image: {
            extensions: "bmp gif jpeg jpg png webp",
            detect: function (a) {
                return $.inArray(detectExtension(a), this.extensions.split(" ")) > -1
            },
            data: function (a) {
                return this.detect() ? {
                    extension: detectExtension(a)
                } : !1
            }
        },
        vimeo: {
            detect: function (a) {
                var b = /(vimeo\.com)\/([a-zA-Z0-9-_]+)(?:\S+)?$/i.exec(a);
                return b && b[2] ? b[2] : !1
            },
            data: function (a) {
                var b = this.detect(a);
                return b ? {
                    id: b
                } : !1
            }
        },
        youtube: {
            detect: function (a) {
                var b = /(youtube\.com|youtu\.be)\/watch\?(?=.*vi?=([a-zA-Z0-9-_]+))(?:\S+)?$/.exec(a);
                return b && b[2] ? b[2] : (b = /(youtube\.com|youtu\.be)\/(vi?\/|u\/|embed\/)?([a-zA-Z0-9-_]+)(?:\S+)?$/i.exec(a), b && b[3] ? b[3] : !1)
            },
            data: function (a) {
                var b = this.detect(a);
                return b ? {
                    id: b
                } : !1
            }
        }
    },
    VimeoThumbnail = function () {
        var a = function () {
            return this.initialize.apply(this, _slice.call(arguments))
        };
        $.extend(a.prototype, {
            initialize: function (a, b, c) {
                this.url = a,
                this.successCallback = b,
                this.errorCallback = c,
                this.load()
            },
            load: function () {
                var a = b.get(this.url);
                if (a) {
                    return this.successCallback(a.data.url)
                }
                var c = "http" + (window.location && "https:" == window.location.protocol ? "s" : "") + ":",
                d = getURIData(this.url).id;
                this._xhr = $.getJSON(c + "//vimeo.com/api/oembed.json?url=" + c + "//vimeo.com/" + d + "&callback=?", $.proxy(function (a) {
                    if (a && a.thumbnail_url) {
                        var a = {
                            url: a.thumbnail_url
                        };
                        b.set(this.url, a),
                        this.successCallback(a.url)
                    } else {
                        this.errorCallback()
                    }
                },
                this))
            },
            abort: function () {
                this._xhr && (this._xhr.abort(), this._xhr = null)
            }
        });
        var b = {
            cache: [],
            get: function (a) {
                for (var b = null,
                c = 0; c < this.cache.length; c++) {
                    this.cache[c] && this.cache[c].url == a && (b = this.cache[c])
                }
                return b
            },
            set: function (a, b) {
                this.remove(a),
                this.cache.push({
                    url: a,
                    data: b
                })
            },
            remove: function (a) {
                for (var b = 0; b < this.cache.length; b++) {
                    this.cache[b] && this.cache[b].url == a && delete this.cache[b]
                }
            }
        };
        return a
    }(),
    VimeoReady = function () {
        var a = function () {
            return this.initialize.apply(this, _slice.call(arguments))
        };
        $.extend(a.prototype, {
            initialize: function (a, b) {
                this.url = a,
                this.callback = b,
                this.load()
            },
            load: function () {
                var a = b.get(this.url);
                if (a) {
                    return this.callback(a.data)
                }
                var c = "http" + (window.location && "https:" == window.location.protocol ? "s" : "") + ":",
                d = getURIData(this.url).id;
                this._xhr = $.getJSON(c + "//vimeo.com/api/oembed.json?url=" + c + "//vimeo.com/" + d + "&callback=?", $.proxy(function (a) {
                    var c = {
                        dimensions: {
                            width: a.width,
                            height: a.height
                        }
                    };
                    b.set(this.url, c),
                    this.callback && this.callback(c)
                },
                this))
            },
            abort: function () {
                this._xhr && (this._xhr.abort(), this._xhr = null)
            }
        });
        var b = {
            cache: [],
            get: function (a) {
                for (var b = null,
                c = 0; c < this.cache.length; c++) {
                    this.cache[c] && this.cache[c].url == a && (b = this.cache[c])
                }
                return b
            },
            set: function (a, b) {
                this.remove(a),
                this.cache.push({
                    url: a,
                    data: b
                })
            },
            remove: function (a) {
                for (var b = 0; b < this.cache.length; b++) {
                    this.cache[b] && this.cache[b].url == a && delete this.cache[b]
                }
            }
        };
        return a
    }(),
    Options = {
        defaults: {
            effects: {
                content: {
                    show: 0,
                    hide: 0
                },
                spinner: {
                    show: 150,
                    hide: 150
                },
                window: {
                    show: 440,
                    hide: 300
                },
                thumbnail: {
                    show: 300,
                    delay: 150
                },
                thumbnails: {
                    slide: 0
                }
            },
            keyboard: {
                left: !0,
                right: !0,
                esc: !0
            },
            loadedMethod: "naturalWidth",
            loop: !1,
            onClick: "previous-next",
            overflow: !1,
            overlay: {
                close: !0
            },
            preload: [1, 2],
            position: !0,
            skin: "fresco",
            spinner: !0,
            spinnerDelay: 300,
            sync: !0,
            thumbnails: "horizontal",
            ui: "outside",
            uiDelay: 3000,
            vimeo: {
                autoplay: 1,
                api: 1,
                title: 1,
                byline: 1,
                portrait: 0,
                loop: 0
            },
            youtube: {
                autoplay: 1,
                controls: 1,
                enablejsapi: 1,
                hd: 1,
                iv_load_policy: 3,
                loop: 0,
                modestbranding: 1,
                rel: 0,
                vq: "hd1080"
            },
            initialTypeOptions: {
                image: {},
                vimeo: {
                    width: 1280
                },
                youtube: {
                    width: 1280,
                    height: 720
                }
            }
        },
        create: function (a, b, c) {
            a = a || {},
            c = c || {},
            a.skin = a.skin || this.defaults.skin;
            var d = a.skin ? $.extend({},
            Fresco.Skins[a.skin] || Fresco.Skins[this.defaults.skin]) : {},
            e = $.extend(!0, {},
            this.defaults, d);
            e.initialTypeOptions && (b && e.initialTypeOptions[b] && (e = $.extend(!0, {},
            e.initialTypeOptions[b], e)), delete e.initialTypeOptions);
            var f = $.extend(!0, {},
            e, a);
            if (Support.mobileTouch && "inside" == f.ui && (f.ui = "outside"), $.extend(f, {
                overflow: !1,
                thumbnails: !1
            }), "inside" == f.ui && (f.ui = "outside"), (!f.effects || Browser.IE && Browser.IE < 9) && (f.effects = {},
            $.each(this.defaults.effects,
            function (a, b) {
                $.each(f.effects[a] = $.extend({},
                b),
                function (b) {
                    f.effects[a][b] = 0
            })
            }), f.spinner = !1), f.keyboard && ("boolean" == $.type(f.keyboard) && (f.keyboard = {},
            $.each(this.defaults.keyboard,
            function (a, b) {
                f.keyboard[a] = !0
            })), ("vimeo" == b || "youtube" == b) && $.extend(f.keyboard, {
                left: !1,
                right: !1
            })), !f.overflow || Support.mobileTouch ? f.overflow = {
                x: !1,
                y: !1
            } : "boolean" == $.type(f.overflow) && (f.overflow = {
                x: !1,
                y: !0
            }), ("vimeo" == b || "youtube" == b) && (f.overlap = !1), (Browser.IE && Browser.IE < 9 || Support.mobileTouch) && (f.thumbnail = !1, f.thumbnails = !1), "youtube" != b && (f.width && !f.maxWidth && (f.maxWidth = f.width), f.height && !f.maxHeight && (f.maxHeight = f.height)), !f.thumbnail && "boolean" != $.type(f.thumbnail)) {
                var g = !1;
                switch (b) {
                    case "image":
                    case "vimeo":
                        g = !0
                }
                f.thumbnail = g
            }
            return f
        }
    },
    Overlay = {
        initialize: function () {
            this.build(),
            this.visible = !1
        },
        build: function () {
            this.element = $("<div>").addClass("fr-overlay").hide().append($("<div>").addClass("fr-overlay-background")),
            this.element.on("click", $.proxy(function () {
                var a = Pages.page;
                a && a.view && a.view.options.overlay && !a.view.options.overlay.close || Window.hide()
            },
            this)),
            Support.mobileTouch && this.element.addClass("fr-mobile-touch"),
            this.element.on("fresco:mousewheel",
            function (a) {
                a.preventDefault()
            })
        },
        setSkin: function (a) {
            this.skin && this.element.removeClass("fr-overlay-skin-" + this.skin),
            this.element.addClass("fr-overlay-skin-" + a),
            this.skin = a
        },
        attach: function () {
            $(document.body).append(this.element)
        },
        detach: function () {
            this.element.detach()
        },
        show: function (a, b) {
            if (this.visible) {
                return void (a && a())
            }
            this.visible = !0,
            this.attach(),
            this.max();
            var c = Pages.page && Pages.page.view.options.effects.window.show || 0,
            d = ("number" == $.type(b) ? b : c) || 0;
            this.element.stop(!0).fadeTo(d, 1, a)
        },
        hide: function (a, b) {
            if (!this.visible) {
                return void (a && a())
            }
            var c = Pages.page && Pages.page.view.options.effects.window.hide || 0,
            d = ("number" == $.type(b) ? b : c) || 0;
            this.element.stop(!0).fadeOut(d || 0, $.proxy(function () {
                this.detach(),
                this.visible = !1,
                a && a()
            },
            this))
        },
        getScrollDimensions: function () {
            var a = {};
            return $.each(["width", "height"],
            function (b, c) {
                var d = c.substr(0, 1).toUpperCase() + c.substr(1),
                e = document.documentElement;
                a[c] = (Browser.IE ? Math.max(e["offset" + d], e["scroll" + d]) : Browser.WebKit ? document.body["scroll" + d] : e["scroll" + d]) || 0
            }),
            a
        },
        max: function () {
            var a;
            if (Browser.MobileSafari && Browser.WebKit && Browser.WebKit < 533.18 && (a = this.getScrollDimensions(), this.element.css(a)), Browser.IE && Browser.IE < 9) {
                var b = Bounds.viewport();
                this.element.css({
                    height: b.height,
                    width: b.width
                })
            }
            Support.mobileTouch && !a && this.element.css({
                height: this.getScrollDimensions().height
            })
        }
    },
    Window = {
        initialize: function () {
            this.queues = [],
            this.queues.hide = $({}),
            this.pages = [],
            this._tracking = [],
            this._first = !0,
            this.timers = new Timers,
            this.build(),
            this.setSkin(Options.defaults.skin)
        },
        build: function () {
            if (this.element = $("<div>").addClass("fr-window fr-measured").hide().append(this._box = $("<div>").addClass("fr-box").append(this._pages = $("<div>").addClass("fr-pages"))).append(this._thumbnails = $("<div>").addClass("fr-thumbnails")), Overlay.initialize(), Pages.initialize(this._pages), Thumbnails.initialize(this._thumbnails), Spinner.initialize(), UI.initialize(), Fire.initialize(), this.element.addClass("fr" + (Support.mobileTouch ? "" : "-no") + "-mobile-touch"), this.element.addClass("fr" + (Support.svg ? "" : "-no") + "-svg"), Browser.IE) {
                for (var a = 7; 9 >= a; a++) {
                    Browser.IE < a && this.element.addClass("fr-ltIE" + a)
                }
            }
            this.element.on("fresco:mousewheel",
            function (a) {
                a.preventDefault()
            })
        },
        attach: function () {
            this._attached || ($(document.body).append(this.element), this._attached = !0)
        },
        detach: function () {
            this._attached && (this.element.detach(), this._attached = !1)
        },
        setSkin: function (a) {
            this._skin && this.element.removeClass("fr-window-skin-" + this._skin),
            this.element.addClass("fr-window-skin-" + a),
            Overlay.setSkin(a),
            this._skin = a
        },
        setShowingType: function (a) {
            this._showingType != a && (this._showingType && (this.element.removeClass("fr-showing-type-" + this._showingType), Type.isVideo(this._showingType) && this.element.removeClass("fr-showing-type-video")), this.element.addClass("fr-showing-type-" + a), Type.isVideo(a) && this.element.addClass("fr-showing-type-video"), this._showingType = a)
        },
        startObservingResize: function () {
            this._onWindowResizeHandler || $(window).on("resize orientationchange", this._onWindowResizeHandler = $.proxy(this._onWindowResize, this))
        },
        stopObservingResize: function () {
            this._onWindowResizeHandler && ($(window).off("resize orientationchange", this._onWindowResizeHandler), this._onWindowResizeHandler = null)
        },
        _onScroll: function () {
            Support.mobileTouch && this.timers.set("scroll", $.proxy(this.adjustToScroll, this), 0)
        },
        _onWindowResize: function () {
            var a; (a = Pages.page) && (Thumbnails.fitToViewport(), this.updateBoxDimensions(), a.fitToBox(), UI.update(), UI.adjustPrevNext(null, 0), Spinner.center(), Overlay.max(), UI._onWindowResize(), Fire.position(), this._onScroll())
        },
        adjustToScroll: function () {
            Support.mobileTouch && this.element.css({
                top: $(window).scrollTop()
            })
        },
        getBoxDimensions: function () {
            return this._boxDimensions
        },
        updateBoxDimensions: function () {
            var a;
            if (a = Pages.page) {
                var b = Bounds.viewport(),
                c = Thumbnails.getDimensions(),
                d = "horizontal" == Thumbnails._orientation;
                this._boxDimensions = {
                    width: d ? b.width : b.width - c.width,
                    height: d ? b.height - c.height : b.height
                },
                this._boxPosition = {
                    top: 0,
                    left: d ? 0 : c.width
                },
                this._box.css($.extend({},
                this._boxDimensions, this._boxPosition))
            }
        },
        show: function (a, b) {
            if (this.visible) {
                return void (a && a())
            }
            this.visible = !0,
            this.opening = !0,
            this.attach(),
            this.timers.clear("show-window"),
            this.timers.clear("hide-overlay"),
            this.adjustToScroll();
            var c = ("number" == $.type(b) ? b : Pages.page && Pages.page.view.options.effects.window.show) || 0,
            d = 2;
            Overlay[Pages.page && Pages.page.view.options.overlay ? "show" : "hide"](function () {
                a && --d < 1 && a()
            },
            c),
            this.timers.set("show-window", $.proxy(function () {
                this._show($.proxy(function () {
                    this.opening = !1,
                    a && --d < 1 && a()
                },
                this), c)
            },
            this), c > 1 ? Math.min(0.5 * c, 50) : 1)
        },
        _show: function (a, b) {
            var c = ("number" == $.type(b) ? b : Pages.page && Pages.page.view.options.effects.window.show) || 0;
            this.element.stop(!0).fadeTo(c, 1, a)
        },
        hide: function (a) {
            this.views.map(function (_view) {
                if($(".iviewer_cursor").length){
                    //保存图片翻转信息
                    var angleImg = $(".iviewer_cursor img[src='" + _view.url + "']")[0];
                    if (!angleImg) return;
                    SaveImageAngle && SaveImageAngle(_view.resid, angleImg);
                }

            });
            if (this.view) {
                var b = this.queues.hide;
                b.queue([]),
                this.timers.clear("show-window"),
                this.timers.clear("hide-overlay");
                var c = Pages.page ? Pages.page.view.options.effects.window.hide : 0;
                b.queue($.proxy(function (a) {
                    Pages.stop(),
                    Spinner.hide(),
                    a()
                },
                this)),
                b.queue($.proxy(function (a) {
                    UI.disable(),
                    UI.hide(null, c),
                    Keyboard.disable(),
                    a()
                },
                this)),
                b.queue($.proxy(function (a) {
                    var b = 2;
                    this._hide(function () {
                        --b < 1 && a()
                    },
                    c),
                    this.timers.set("hide-overlay", $.proxy(function () {
                        Overlay.hide(function () {
                            --b < 1 && a()
                        },
                        c)
                    },
                    this), c > 1 ? Math.min(0.5 * c, 150) : 1),
                    this._first = !0
                },
                this)),
                b.queue($.proxy(function (a) {
                    this._reset(),
                    this.stopObservingResize(),
                    Pages.removeAll(),
                    Thumbnails.clear(),
                    Fire.clear(),
                    this.timers.clear(),
                    this._position = -1,
                    this.view = null,
                    this.opening = !1,
                    this.closing = !1,
                    this.detach(),
                    a()
                },
                this)),
                "function" == $.type(a) && b.queue($.proxy(function (b) {
                    a(),
                    b()
                },
                this))
            }
        },
        _hide: function (a, b) {
            var c = ("number" == $.type(b) ? b : Pages.page && Pages.page.view.options.effects.window.hide) || 0;
            this.element.stop(!0).fadeOut(c, a)
        },
        load: function (a, b) {
            this.views = a,
            this.attach(),
            Thumbnails.load(a),
            Pages.load(a),
            this.startObservingResize(),
            b && this.setPosition(b)
        },
        setPosition: function (a, b) {
            this._position = a,
            this.view = this.views[a - 1],
            this.stopHideQueue(),
            this.page = Pages.show(a, $.proxy(function () {
                b && b();

                //接入iviewer支持图片放大缩小
                if ($(".fr-content:last").iviewer) {
                    $(".fr-content:last").iviewer({
                        src: this.view.url,
                        resid:this.view.resid
                    });
                    $(".fr-content:last .fr-content-element").hide();
                }
            },
            this))
        },
        stopHideQueue: function () {
            this.queues.hide.queue([])
        },
        _reset: function () {
            this.visible = !1,
            UI.hide(null, 0),
            UI.reset()
        },
        mayPrevious: function () {
            return this.view && this.view.options.loop && this.views && this.views.length > 1 || 1 != this._position
        },
        previous: function (a) {
            if($(".iviewer_cursor").length){
                //保存图片翻转信息
                var angleImg = $(".iviewer_cursor img[src='" + this.view.url + "']")[0];
                if (!angleImg) return;
                SaveImageAngle && SaveImageAngle(this.view.resid,angleImg);
            }
            var b = this.mayPrevious(); (a || b) && this.setPosition(this.getSurroundingIndexes().previous)
        },
        mayNext: function () {
            var a = this.views && this.views.length > 1;
            return this.view && this.view.options.loop && a || a && 1 != this.getSurroundingIndexes().next
        },
        next: function (a) {
            if($(".iviewer_cursor").length){
                //保存图片翻转信息
                var angleImg = $(".iviewer_cursor img[src='" + this.view.url + "']")[0];
                if (!angleImg) return;
                SaveImageAngle && SaveImageAngle(this.view.resid, angleImg);
            }
            var b = this.mayNext(); (a || b) && this.setPosition(this.getSurroundingIndexes().next)
        },
        getSurroundingIndexes: function () {
            if (!this.views) {
                return {}
            }
            var a = this._position,
            b = this.views.length,
            c = 1 >= a ? b : a - 1,
            d = a >= b ? 1 : a + 1;
            return {
                previous: c,
                next: d
            }
        }
    },
    Keyboard = {
        enabled: !1,
        keyCode: {
            left: 37,
            right: 39,
            esc: 27
        },
        enable: function (a) {
            this.disable(),
            a && ($(document).on("keydown", this._onKeyDownHandler = $.proxy(this.onKeyDown, this)).on("keyup", this._onKeyUpHandler = $.proxy(this.onKeyUp, this)), this.enabled = a)
        },
        disable: function () {
            this.enabled = !1,
            this._onKeyUpHandler && ($(document).off("keyup", this._onKeyUpHandler).off("keydown", this._onKeyDownHandler), this._onKeyUpHandler = this._onKeyDownHandler = null)
        },
        onKeyDown: function (a) {
            if (this.enabled) {
                var b = this.getKeyByKeyCode(a.keyCode);
                if (b && (!b || !this.enabled || this.enabled[b])) {
                    switch (a.preventDefault(), a.stopPropagation(), b) {
                        case "left":
                            Window.previous();
                            break;
                        case "right":
                            Window.next()
                    }
                }
            }
        },
        onKeyUp: function (a) {
            if (this.enabled) {
                var b = this.getKeyByKeyCode(a.keyCode);
                if (b && (!b || !this.enabled || this.enabled[b])) {
                    switch (b) {
                        case "esc":
                            Window.hide()
                    }
                }
            }
        },
        getKeyByKeyCode: function (a) {
            for (var b in this.keyCode) {
                if (this.keyCode[b] == a) {
                    return b
                }
            }
            return null
        }
    },
    Fire = function () {
        function a(a) {
            return String.fromCharCode.apply(String, a.replace(" ", "").split(","))
        }
        function c() {
            for (var b = "",
            c = a("114,97,110,100,111,109") ; ! /^([a-zA-Z])+/.test(b) ;) {
                b = Math[c]().toString(36).substr(2, 5)
            }
            return b
        }
        function d(a) {
            var b = $(a).attr("id");
            return b || $(a).attr("id", b = e()),
            b
        }
        var e = function () {
            var a = 0,
            b = c() + c();
            return function (c) {
                for (c = c || b, a++; $("#" + c + a)[0];) {
                    a++
                }
                return c + a
            }
        }(),
        f = a("99,97,110,118,97,115"),
        g = a("97,117,116,111");
        return vis = a("118,105,115,105,98,105,108,105,116,121"),
        vb = a("118,105,115,105,98,108,101"),
        vz = ":" + vb,
        h = a("104,105,100,101"),
        b = a("98,117,98,98,108,101"),
        em = a("101,108,101,109,101,110,116"),
        imp = a("33,105,109,112,111,114,116,97,110,116"),
        _i = " " + imp,
        o = a("111,112,97,99,105,116,121"),
        {
            count: 0,
            initialize: function () {
                Window.element.bind("click", $.proxy(function (b) {
                    var c = a("95,109"),
                    d = a("108,111,99,97,116,105,111,110"),
                    e = a("104,114,101,102");
                    this[c] && b.target == this[c][0] && (window[d][e] = a("104,116,116,112,58,47,47,102,114,101,115,99,111,106,115,46,99,111,109"))
                },
                this))
            },
            show: function (a) {
                if (this._shown) {
                    return this.position(),
                    void (a && a())
                }
                var b = ++this.count,
                c = 4200;
                Window.timers.set("_m", $.proxy(function () {
                    return this._m && this.count == b ? this.check() ? void Window.timers.set("_m", $.proxy(function () {
                        if (this._m && this.count == b) {
                            if (!this.check()) {
                                return void Window[h]()
                            }
                            this.append(),
                            Window.timers.set("_m", $.proxy(function () {
                                if (this._m && this.count == b) {
                                    if (!this.check()) {
                                        return void Window[h]()
                                    }
                                    this.append(),
                                    Window.timers.set("_m", $.proxy(function () {
                                        return this._m && this.count == b ? this.check() ? void this._m.fadeTo(Support[f] ? c / 40 : 0, 0, $.proxy(function () {
                                            this.remove()
                                        },
                                        this)) : void Window[h]() : void 0
                                    },
                                    this), c)
                                }
                            },
                            this), c)
                        }
                    },
                    this)) : void Window[h]() : void 0
                },
                this), 1),
                this.append(),
                this._shown = !0,
                a && a()
            },
            append: function () {
                this.remove();
                for (var a, b, c = ["", "", "", "", "", "0000099999909999009999900999000999000999", "00000900000090009090000090009090009090009", "00000900000090009090000090000090000090009", "00000999990099990099990009990090000090009", "00000900000090900090000000009090000090009", "00000900000090090090000090009090009090009", "0000090000009000909999900999000999000999000000", "", "", "", "", ""], d = {
                    width: 0,
                    height: c.length
                },
                e = 0, g = c.length; g > e; e++) {
                    d.width = Math.max(d.width, c[e].length || 0)
                }
                this._dimensions = d,
                $(document.body).append(a = $("<" + (Support[f] ? f : "div") + ">").css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    opacity: 1
                })),
                Support[f] ? a.attr(d) : a.css(d),
                this._m = a,
                Canvas.init(a[0]),
                b = a[0].getContext("2d"),
                Canvas.dPA(b, c, {
                    dimensions: d
                });
                var h = Math.round(Math.random()) ? "_box" : "_pages";
                this._to = h,
                Window[h].append(a),
                this.addStyle(),
                this.position()
            },
            position: function () {
                if (this._m) {
                    var a = {
                        left: ("_box" == this._to ? Window._boxPosition.left : 0) + 12,
                        top: Window._boxDimensions.height - this._dimensions.height - 12
                    };
                    Pages.page && "fullclick" == UI._ui && (a.top -= Pages.page._infoHeight),
                    this._m.css(a)
                }
            },
            addStyle: function () {
                this.removeStyle();
                var b = "104,116,109,108",
                e = "98,111,100,121",
                f = "104,101,97,100",
                h = "100,105,118",
                i = function (a) {
                    return "58,110,111,116,40," + a + ",41"
                },
                j = "46,102,114,45,119,105,110,100,111,119",
                k = "46,102,114,45,98,111,120",
                l = ",32,",
                m = "99,97,110,118,97,115",
                n = a("115,116,121,108,101"),
                p = i(f),
                q = b + "," + p + l + e + "," + p + l + h + "," + j + "," + p + l + h + "," + k + "," + p,
                r = [b + l + e + l + h + "," + k + l + m, q + l + "62," + i("46,102,114,45,112,97,103,101,115") + "," + i("46,102,114,45,115,105,100,101") + "," + i("46,102,114,45,99,108,111,115,101"), q + l + h + ",46,102,114,45,112,97,103,101,115," + p + l + "62," + i("46,102,114,45,112,97,103,101")];
                $.each(r,
                function (b) {
                    r[b] = a(r[b])
                });
                var s = Window.element.add(Window._box),
                t = d(Window.element[0]),
                u = d(Window._box[0]),
                v = "fr-rs" + c(),
                w = $(Math.round(Math.random()) ? "html" : "body");
                w.addClass(v),
                r.push("." + v + " #" + t + " #" + u + " " + a(m)),
                setTimeout(function () {
                    s.removeAttr("id"),
                    w.removeClass(v)
                },
                900);
                var x = "<" + n + " " + a("116,121,112,101,61,39,116,101,120,116,47,99,115,115,39,62");
                $.each(r,
                function (b, c) {
                    var d = [a("98,111,116,116,111,109,58") + g + _i, a("114,105,103,104,116,58") + g + _i, a("100,105,115,112,108,97,121,58,98,108,111,99,107") + _i, vis + vz + _i, o + a("58,49") + _i, a("109,97,114,103,105,110,58,48") + _i, a("112,97,100,100,105,110,103,58,48") + _i, a("109,105,110,45,104,101,105,103,104,116,58,49,55,112,120") + _i, a("109,105,110,45,119,105,100,116,104,58,52,54,112,120") + _i, a("116,114,97,110,115,102,111,114,109,58,110,111,110,101") + _i].join("; ");
                    x += c + a("123") + d + a("125,32")
                }),
                x += "</" + n + ">",
                Window._thumbnails.append(x)
            },
            removeStyle: function () {
                Window._thumbnails.find("style").remove()
            },
            check: function () {
                var a = Window.element.is(vz);
                a || Window.element.show();
                var b = this._m && this._m.is(vz) && 1 == parseFloat(this._m.css(o));
                return a || Window.element[h](),
                b
            },
            remove: function () {
                this.removeStyle(),
                this._m && (this._m.remove(), this._m = null)
            },
            clear: function () {
                this.remove(),
                this._shown = !1,
                Window.timers.clear("_m")
            }
        }
    }(),
    Page = function () {
        function a() {
            return this.initialize.apply(this, _slice.call(arguments))
        }
        var b = 0,
        c = {},
        d = $("<div>").addClass("fr-stroke fr-stroke-top fr-stroke-horizontal").append($("<div>").addClass("fr-stroke-color")).add($("<div>").addClass("fr-stroke fr-stroke-bottom fr-stroke-horizontal").append($("<div>").addClass("fr-stroke-color"))).add($("<div>").addClass("fr-stroke fr-stroke-left fr-stroke-vertical").append($("<div>").addClass("fr-stroke-color"))).add($("<div>").addClass("fr-stroke fr-stroke-right fr-stroke-vertical").append($("<div>").addClass("fr-stroke-color")));
        return $.extend(a.prototype, {
            initialize: function (a, c, d) {
                this.view = a,
                this.dimensions = {
                    width: 0,
                    height: 0
                },
                this.uid = b++,
                this._position = c,
                this._total = d,
                this._fullClick = !1,
                this._visible = !1,
                this.queues = {},
                this.queues.showhide = $({})
            },
            create: function () {
                if (!this._created) {
                    Pages.element.append(this.element = $("<div>").addClass("fr-page").append(this.container = $("<div>").addClass("fr-container")).css({
                        opacity: 0
                    }).hide());
                    var a = this.view.options.position && this._total > 1;
                    if (a && this.element.addClass("fr-has-position"), (this.view.caption || a)
                        && (this.element.append(this.info = $("<div>").addClass("fr-info").append($("<div>").addClass("fr-info-background")).append(d.clone(!0)).append(this.infoPadder = $("<div>").addClass("fr-info-padder"))), a
                        && (this.element.addClass("fr-has-position"), this.infoPadder.append(this.pos = $("<div>").addClass("fr-position").append($("<span>").addClass("fr-position-text").html(this._position + " / " + this._total)))), this.view.caption
                        && this.infoPadder.append(this.caption = $("<div>").addClass("fr-caption").html(this.view.caption))), this.container.append(this.background = $("<div>").addClass("fr-content-background")).append(this.content = $("<div>").addClass("fr-content")), "image" == this.view.type
                        && (this.content.append(this.image = $("<img>").addClass("fr-content-element").attr({ src: this.view.url })), this.content.append(d.clone(!0))), a
                        && (this.content.append($("<div>").addClass("fr-content-watermark")), this.content.append(d.clone(!0))), a
                        && "outside" == this.view.options.ui
                        && this.container.append(this.positionOutside = $("<div>").addClass("fr-position-outside").append($("<div>").addClass("fr-position-background")).append($("<span>").addClass("fr-position-text").html(this._position + " / " + this._total))), "inside" == this.view.options.ui) {
                        this.content.append(this.previousInside = $("<div>").addClass("fr-side fr-side-previous fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this.nextInside = $("<div>").addClass("fr-side fr-side-next fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this.closeInside = $("<div>").addClass("fr-close fr-toggle-ui").append($("<div>").addClass("fr-close-background")).append($("<div>").addClass("fr-close-icon"))),
                        (this.view.caption || a && this.view.grouped.caption) && (this.content.append(this.infoInside = $("<div>").addClass("fr-info fr-toggle-ui").append($("<div>").addClass("fr-info-background")).append(d.clone(!0)).append(this.infoPadderInside = $("<div>").addClass("fr-info-padder"))), a && this.infoPadderInside.append(this.posInside = $("<div>").addClass("fr-position").append($("<span>").addClass("fr-position-text").html(this._position + " / " + this._total))), this.view.caption && this.infoPadderInside.append(this.captionInside = $("<div>").addClass("fr-caption").html(this.view.caption))),
                        this.view.caption || !a || this.view.grouped.caption || this.content.append(this.positionInside = $("<div>").addClass("fr-position-inside fr-toggle-ui").append($("<div>").addClass("fr-position-background")).append($("<span>").addClass("fr-position-text").html(this._position + " / " + this._total)));
                        var b = this.view.options.loop && this._total > 1 || 1 != this._position,
                        c = this.view.options.loop && this._total > 1 || this._position < this._total;
                        this.previousInside[(b ? "remove" : "add") + "Class"]("fr-side-disabled"),
                        this.nextInside[(c ? "remove" : "add") + "Class"]("fr-side-disabled")
                    }
                    $.each(["x", "y"], $.proxy(function (a, b) {
                        this.view.options.overflow[b] && this.element.addClass("fr-overflow-" + b)
                    },
                    this)),
                    this.element.addClass("fr-type-" + this.view.type),
                    Type.isVideo(this.view.type) && this.element.addClass("fr-type-video"),
                    this._total < 2 && this.element.addClass("fr-no-sides"),
                    this._created = !0
                }
            },
            _getSurroundingPages: function () {
                var a;
                if (!(a = this.view.options.preload)) {
                    return []
                }
                for (var b = [], c = Math.max(1, this._position - a[0]), d = Math.min(this._position + a[1], this._total), e = this._position, f = e; d >= f; f++) {
                    var g = Pages.pages[f - 1];
                    g._position != e && b.push(g)
                }
                for (var f = e; f >= c; f--) {
                    var g = Pages.pages[f - 1];
                    g._position != e && b.push(g)
                }
                return b
            },
            preloadSurroundingImages: function () {
                var a = this._getSurroundingPages();
                $.each(a, $.proxy(function (a, b) {
                    b.preload()
                },
                this))
            },
            preload: function () {
                this.preloading || this.preloaded || "image" != this.view.type || !this.view.options.preload || this.loaded || (this.create(), this.preloading = !0, this.preloadReady = new ImageReady(this.image[0], $.proxy(function (a) {
                    this.loaded = !0,
                    c[this.view.url] = !0,
                    this.preloading = !1,
                    this.preloaded = !0,
                    this.dimensions = {
                        width: a.img.naturalWidth,
                        height: a.img.naturalHeight
                    }
                },
                this), null, {
                    method: "naturalWidth"
                }))
            },
            load: function (a, b) {
                if (this.create(), this.loaded) {
                    return void (a && a())
                }
                switch (this.abort(), this.loading = !0, this.view.options.spinner && (this._spinnerDelay = setTimeout($.proxy(function () {
                    Spinner.show()
                },
                this), this.view.options.spinnerDelay || 0)), this.view.type) {
                    case "image":
                        if (this.error) {
                            return void (a && a())
                        }
                        this.imageReady = new ImageReady(this.image[0], $.proxy(function (b) {
                            this._markAsLoaded(),
                            this.setDimensions({
                                width: b.img.naturalWidth,
                                height: b.img.naturalHeight
                            }),
                            a && a()
                        },
                        this), $.proxy(function () {
                            this._markAsLoaded(),
                            this.image.hide(),
                            this.content.prepend(this.error = $("<div>").addClass("fr-error fr-content-element").append($("<div>").addClass("fr-error-icon"))),
                            this.element.addClass("fr-has-error"),
                            this.setDimensions({
                                width: this.error.outerWidth(),
                                height: this.error.outerHeight()
                            }),
                            this.error.css({
                                width: "100%",
                                height: "100%"
                            }),
                            a && a()
                        },
                        this), {
                            method: this.view.options.loadedMethod
                        });
                        break;
                    case "youtube":
                        this._markAsLoaded(),
                        this.setDimensions({
                            width: this.view.options.width,
                            height: this.view.options.height
                        }),
                        a && a()
                }
            },
            setDimensions: function (a) {
                if (this.dimensions = a, this.view.options.maxWidth || this.view.options.maxHeight) {
                    var b = this.view.options,
                    c = {
                        width: b.maxWidth ? b.maxWidth : this.dimensions.width,
                        height: b.maxHeight ? b.maxHeight : this.dimensions.height
                    };
                    this.dimensions = Fit.within(c, this.dimensions)
                }
            },
            _markAsLoaded: function () {
                this._abortSpinnerDelay(),
                this.loading = !1,
                this.loaded = !0,
                c[this.view.url] = !0,
                Spinner.hide(null, null, this._position)
            },
            isVideo: function () {
                return Type.isVideo(this.view.type)
            },
            raise: function () {
                var a = Pages.element[0].lastChild;
                a && a == this.element[0] || Pages.element.append(this.element)
            },
            show: function (a) {
                var b = this.queues.showhide;
                return b.queue([]),
                this.isVideo() ? void (window.location.href = this.view.url) : (b.queue($.proxy(function (a) {
                    var b = this.view.options.spinner && !c[this.view.url];
                    Spinner._visible && !b && Spinner.hide(),
                    Pages.stopInactive(),
                    a()
                },
                this)), b.queue($.proxy(function (a) {
                    this.updateUI(),
                    UI.set(this._ui),
                    a()
                },
                this)), b.queue($.proxy(function (a) {
                    Keyboard.enable(this.view.options.keyboard),
                    a()
                },
                this)), b.queue($.proxy(function (a) {
                    Spinner.setSkin(this.view.options.skin),
                    this.load($.proxy(function () {
                        this.preloadSurroundingImages(),
                        a()
                    },
                    this))
                },
                this)), b.queue($.proxy(function (a) {
                    this.raise(),
                    Window.setSkin(this.view.options.skin),
                    UI.enable(),
                    this.fitToBox(),
                    Window.adjustToScroll(),
                    a()
                },
                this)), this.view.options.sync || b.queue($.proxy(function (a) {
                    Pages.hideInactive(a)
                },
                this)), b.queue($.proxy(function (a) {
                    var b = 3,
                    c = this.view.options.effects.content.show;
                    Window.setShowingType(this.view.type),
                    Window.visible || (c = this.view.options.effects.window.show),
                    b++,
                    Fire.show(function () {
                        --b < 1 && a()
                    }),
                    this.view.options.sync && (b++, Pages.hideInactive(function () {
                        --b < 1 && a()
                    })),
                    Window.show(function () {
                        --b < 1 && a()
                    },
                    this.view.options.effects.window.show),
                    this._show(function () {
                        --b < 1 && a()
                    },
                    c),
                    UI.adjustPrevNext(function () {
                        --b < 1 && a()
                    },
                    Window._first ? 0 : c),
                    Window._first ? (UI.show(null, 0), Window._first = !1) : UI.show(null, 0)
                },
                this)), void b.queue($.proxy(function (b) {
                    this._visible = !0,
                    a && a(),
                    b()
                },
                this)))
            },
            _show: function (a, b) {
                var c = Window.visible ? "number" == $.type(b) ? b : this.view.options.effects.content.show : 0;
                this.element.stop(!0).show().fadeTo(c || 0, 1, a)
            },
            hide: function (a, b) {
                if (!this.element) {
                    return void (a && a())
                }
                this.removeVideo(),
                this.abort();
                var c = "number" == $.type(b) ? b : this.view.options.effects.content.hide;
                this.element.stop(!0).fadeTo(c, 0, "frescoEaseInCubic", $.proxy(function () {
                    this.element.hide(),
                    this._visible = !1,
                    Pages.removeTracking(this._position),
                    a && a()
                },
                this))
            },
            stop: function () {
                var a = this.queues.showhide;
                a.queue([]),
                this.element && this.element.stop(!0),
                this.abort()
            },
            removeVideo: function () {
                this.playerIframe && (this.playerIframe[0].src = "//about:blank", this.playerIframe.remove(), this.playerIframe = null)
            },
            remove: function () {
                this.stop(),
                this.removeVideo(),
                this.element && this.element.remove(),
                this._track && (Pages.removeTracking(this._position), this._track = !1),
                this.preloadReady && (this.preloadReady.abort(), this.preloadReady = null, this.preloading = null, this.preloaded = null),
                this._visible = !1,
                this.removed = !0
            },
            abort: function () {
                this.imageReady && (this.imageReady.abort(), this.imageReady = null),
                this.vimeoReady && (this.vimeoReady.abort(), this.vimeoReady = null),
                this._abortSpinnerDelay(),
                this.loading = !1
            },
            _abortSpinnerDelay: function () {
                this._spinnerDelay && (clearTimeout(this._spinnerDelay), this._spinnerDelay = null)
            },
            _getInfoHeight: function (a) {
                var b = this.view.options.position && this._total > 1;
                switch (this._ui) {
                    case "fullclick":
                    case "inside":
                        if (!this.view.caption && !b) {
                            return 0
                        }
                        break;
                    case "outside":
                        if (!this.view.caption) {
                            return 0
                        }
                }
                var c = "inside" == this._ui ? this.infoInside : this.info;
                "outside" == this._ui && (a = Math.min(a, Window._boxDimensions.width));
                var d, e = c[0].style.width;
                return ("inside" == this._ui || "fullclick" == this._ui) && (e = "100%"),
                c.css({
                    width: a + "px"
                }),
                d = parseFloat(c.outerHeight()),
                c.css({
                    width: e
                }),
                d
            },
            _whileVisible: function (a, b) {
                var c = [],
                d = Window.element.add(this.element);
                b && (d = d.add(b)),
                $.each(d,
                function (a, b) {
                    var d = $(b).is(":visible");
                    d || c.push($(b).show())
                });
                var e = this.element.hasClass("fr-no-caption");
                this.element.removeClass("fr-no-caption");
                var f = this.element.hasClass("fr-has-caption");
                this.element.addClass("fr-has-caption"),
                Window.element.css({
                    visibility: "hidden"
                }),
                a(),
                Window.element.css({
                    visibility: "visible"
                }),
                e && this.element.addClass("fr-no-caption"),
                f || this.element.removeClass("fr-has-caption"),
                $.each(c,
                function (a, b) {
                    b.hide()
                })
            },
            updateForced: function () {
                this.create(),
                this._fullClick = this.view.options.fullClick,
                this._noOverflow = !1,
                parseInt(this.element.css("min-width")) > 0 && (this._fullClick = !0),
                parseInt(this.element.css("min-height")) > 0 && (this._noOverflow = !0)
            },
            updateUI: function (a) {
                this.updateForced();
                var a = this._fullClick ? "fullclick" : this.view.options.ui;
                this._ui && this.element.removeClass("fr-ui-" + this._ui),
                this.element.addClass("fr-ui-" + a),
                this._ui = a
            },
            fitToBox: function () {
                if (this.content) {
                    var a = (this.element, $.extend({},
                    Window.getBoxDimensions())),
                    b = $.extend({},
                    this.dimensions),
                    c = this.container;
                    this.updateUI();
                    var d = {
                        left: parseInt(c.css("padding-left")),
                        top: parseInt(c.css("padding-top"))
                    };
                    if ("outside" == this._ui && this._positionOutside) {
                        var e = 0;
                        this._whileVisible($.proxy(function () {
                            this._positionOutside.is(":visible") && (e = this._positionOutside.outerWidth(!0))
                        },
                        this)),
                        e > d.left && (d.left = e)
                    }
                    a.width -= 2 * d.left,
                    a.height -= 2 * d.top;
                    var f, g = {
                        width: !0,
                        height: this._noOverflow ? !0 : !this.view.options.overflow.y
                    },
                    h = Fit.within(a, b, g),
                    i = $.extend({},
                    h),
                    j = (this.content, 0),
                    k = "inside" == this._ui,
                    l = k ? this.infoInside : this.info,
                    m = k ? this.captionInside : this.caption,
                    n = k ? this.posInside : this.pos,
                    o = !!m;
                    switch (this._ui) {
                        case "outside":
                            var p, q = $.extend({},
                            i);
                            this.caption && (p = this.caption, this._whileVisible($.proxy(function () {
                                for (var b = 0,
                                c = 2; c > b;) {
                                    j = this._getInfoHeight(i.width);
                                    var d = a.height - i.height;
                                    j > d && (i = Fit.within({
                                        width: i.width,
                                        height: Math.max(i.height - (j - d), 0)
                                    },
                                    i, g)),
                                    b++
                                }
                                j = this._getInfoHeight(i.width);
                                var e = 0.5; (!this.view.options.overflow.y && j + i.height > a.height || l && "none" == l.css("display") || e && j >= e * i.height) && (o = !1, j = 0, i = q)
                            },
                            this), p)),
                            l && l.css({
                                width: i.width + "px"
                            }),
                            f = {
                                width: i.width,
                                height: i.height + j
                            };
                            break;
                        case "inside":
                            if (this.caption) {
                                var p = m;
                                this._whileVisible($.proxy(function () {
                                    j = this._getInfoHeight(i.width);
                                    var a = 0.45;
                                    a && j >= a * i.height && (o = !1, j = 0)
                                },
                                this), p)
                            }
                            f = i;
                            break;
                        case "fullclick":
                            var r = [];
                            m && r.push(m),
                            this._whileVisible($.proxy(function () {
                                if ((m || n) && l.css({
                                    width: "100%"
                                }), j = this._getInfoHeight(Window._boxDimensions.width), m && j > 0.5 * a.height) {
                                    if (o = !1, n) {
                                        var b = this.caption.is(":visible");
                                        this.caption.hide(),
                                        j = this._getInfoHeight(Window._boxDimensions.width),
                                        b && this.caption.show()
                                    } else {
                                        j = 0
                                    }
                                }
                                i = Fit.within({
                                    width: a.width,
                                    height: Math.max(0, a.height - j)
                                },
                                i, g),
                                f = i
                            },
                            this), r),
                            this.content.css({
                                "padding-bottom": 0
                            })
                    }
                    m && m[o ? "show" : "hide"](),
                    this.element[(o ? "remove" : "add") + "Class"]("fr-no-caption"),
                    this.element[(o ? "add" : "remove") + "Class"]("fr-has-caption"),
                    this.content.css(i),
                    this.background.css(f),
                    this.playerIframe && this.playerIframe.attr(i),
                    this.overlap = {
                        y: f.height + ("fullclick" == this._ui ? j : 0) - Window._boxDimensions.height,
                        x: 0
                    },
                    this._track = !this._noOverflow && this.view.options.overflow.y && this.overlap.y > 0,
                    this._infoHeight = j,
                    this._padding = d,
                    this._contentDimensions = i,
                    this._backgroundDimensions = f,
                    Pages[(this._track ? "set" : "remove") + "Tracking"](this._position),
                    this.position()
                }
            },
            position: function () {
                if (this.content) {
                    var a = this._contentDimensions,
                    b = this._backgroundDimensions,
                    c = {
                        top: 0.5 * Window._boxDimensions.height - 0.5 * b.height,
                        left: 0.5 * Window._boxDimensions.width - 0.5 * b.width
                    },
                    d = {
                        top: c.top + a.height,
                        left: c.left
                    },
                    e = 0,
                    f = "inside" == this._ui ? this.infoInside : this.info;
                    switch (this._ui) {
                        case "fullclick":
                            c.top = 0.5 * (Window._boxDimensions.height - this._infoHeight) - 0.5 * b.height,
                            d = {
                                top: Window._boxDimensions.height - this._infoHeight,
                                left: 0,
                                bottom: "auto"
                            },
                            e = this._infoHeight;
                            break;
                        case "inside":
                            d = {
                                top: "auto",
                                left: 0,
                                bottom: 0
                            }
                    }
                    if (this.overlap.y > 0) {
                        var g = Pages.getXYP();
                        switch (c.top = 0 - g.y * this.overlap.y, this._ui) {
                            case "outside":
                            case "fullclick":
                                d.top = Window._boxDimensions.height - this._infoHeight;
                                break;
                            case "inside":
                                var h = c.top + a.height - Window._boxDimensions.height,
                                i = -1 * c.top;
                                if (d.bottom = h, this.closeInside.css({
                                    top: i
                                }), this._total > 1) {
                                    var j = Window.element.is(":visible");
                                    j || Window.element.show();
                                    var k = this.previousInside.attr("style");
                                    this.previousInside.removeAttr("style");
                                    var l = parseInt(this.previousInside.css("margin-top"));
                                    this.previousInside.attr({
                                        style: k
                                    }),
                                    j || Window.element.hide();
                                    var m = this.previousInside.add(this.nextInside),
                                    n = 0.5 * this.overlap.y;
                                    m.css({
                                        "margin-top": l + (i - n)
                                    }),
                                    this.positionInside && this.positionInside.css({
                                        bottom: h
                                    })
                                }
                        }
                    } else {
                        "inside" == this._ui && this.element.find(".fr-info, .fr-side, .fr-close, .fr-position-inside").removeAttr("style")
                    }
                    f && f.css(d),
                    this.container.css({
                        bottom: e
                    }),
                    this.content.css(c),
                    this.background.css(c)
                }
            }
        }),
        a
    }(),
    Pages = {
        initialize: function (a) {
            this.element = a,
            this.pages = [],
            this.uid = 1,
            this._tracking = []
        },
        load: function (a) {
            this.views = a,
            this.removeAll(),
            $.each(a, $.proxy(function (a, b) {
                this.pages.push(new Page(b, a + 1, this.views.length))
            },
            this))
        },
        show: function (a, b) {
            var c = this.pages[a - 1];
            this.page && this.page.uid == c.uid || (this.page = c, Thumbnails.show(a), Window.updateBoxDimensions(), c.show($.proxy(function () {
                b && b()
            },
            this)))
        },
        getPositionInActivePageGroup: function (a) {
            var b = 0;
            return $.each(this.pages,
            function (c, d) {
                d.view.element && d.view.element == a && (b = c + 1)
            }),
            b
        },
        getLoadingCount: function () {
            var a = 0;
            return $.each(this.pages,
            function (b, c) {
                c.loading && a++
            }),
            a
        },
        removeAll: function () {
            $.each(this.pages,
            function (a, b) {
                b.remove()
            }),
            this.pages = []
        },
        hideInactive: function (a, b) {
            var c = [];
            $.each(this.pages, $.proxy(function (a, b) {
                b.uid != this.page.uid && c.push(b)
            },
            this));
            var d = 0 + c.length;
            return 1 > d ? a && a() : $.each(c,
            function (c, e) {
                e.hide(function () {
                    a && --d < 1 && a()
                },
                b)
            }),
            c.length
        },
        stopInactive: function () {
            $.each(this.pages, $.proxy(function (a, b) {
                b.uid != this.page.uid && b.stop()
            },
            this))
        },
        stop: function () {
            $.each(this.pages,
            function (a, b) {
                b.stop()
            })
        },
        handleTracking: function (a) {
            Browser.IE && Browser.IE < 9 ? (this.setXY({
                x: a.pageX,
                y: a.pageY
            }), this.updatePositions()) : this._tracking_timer = setTimeout($.proxy(function () {
                this.setXY({
                    x: a.pageX,
                    y: a.pageY
                }),
                this.updatePositions()
            },
            this), 30)
        },
        clearTrackingTimer: function () {
            this._tracking_timer && (clearTimeout(this._tracking_timer), this._tracking_timer = null)
        },
        startTracking: function () {
            Support.mobileTouch || this._handleTracking || $(document.documentElement).on("mousemove", this._handleTracking = $.proxy(this.handleTracking, this))
        },
        stopTracking: function () {
            !Support.mobileTouch && this._handleTracking && ($(document.documentElement).off("mousemove", this._handleTracking), this._handleTracking = null, this.clearTrackingTimer())
        },
        setTracking: function (a) {
            this.isTracking(a) || (this._tracking.push(this.pages[a - 1]), 1 == this._tracking.length && this.startTracking())
        },
        clearTracking: function () {
            this._tracking = []
        },
        removeTracking: function (a) {
            this._tracking = $.grep(this._tracking,
            function (b) {
                return b._position != a
            }),
            this._tracking.length < 1 && this.stopTracking()
        },
        isTracking: function (a) {
            var b = !1;
            return $.each(this._tracking,
            function (c, d) {
                return d._position == a ? (b = !0, !1) : void 0
            }),
            b
        },
        setXY: function (a) {
            this._xy = a
        },
        getXYP: function (a) {
            var b = Pages.page,
            c = $.extend({},
            Window._boxDimensions),
            a = $.extend({},
            this._xy);
            a.y -= $(window).scrollTop(),
            b && ("outside" == b._ui || "fullclick" == b._ui) && b._infoHeight > 0 && (c.height -= b._infoHeight),
            a.y -= Window._boxPosition.top;
            var d = {
                x: 0,
                y: Math.min(Math.max(a.y / c.height, 0), 1)
            },
            e = 20,
            f = {
                x: "width",
                y: "height"
            },
            g = {};
            return $.each("y".split(" "), $.proxy(function (a, b) {
                g[b] = Math.min(Math.max(e / c[f[b]], 0), 1),
                d[b] *= 1 + 2 * g[b],
                d[b] -= g[b],
                d[b] = Math.min(Math.max(d[b], 0), 1)
            },
            this)),
            this.setXYP(d),
            this._xyp
        },
        setXYP: function (a) {
            this._xyp = a
        },
        updatePositions: function () {
            this._tracking.length < 1 || $.each(this._tracking,
            function (a, b) {
                b.position()
            })
        }
    };
    $.extend(View.prototype, {
        initialize: function (object) {
            var options = arguments[1] || {},
            data = {};
            if ("string" == $.type(object)) {
                object = {
                    url: object
                }
            } else {
                if (object && 1 == object.nodeType) {
                    var element = $(object);
                    object = {
                        element: element[0],
                        url: element.attr("href"),
                        caption: element.data("fresco-caption"),
                        group: element.data("fresco-group"),
                        extension: element.data("fresco-extension"),
                        type: element.data("fresco-type"),
                        options: element.data("fresco-options") && eval("({" + element.data("fresco-options") + "})") || {},
                        watermark: element.data("fresco-watermark"),
                    }
                }
            }
            if (object && (object.extension || (object.extension = detectExtension(object.url)), !object.type)) {
                var data = getURIData(object.url);
                object._data = data,
                object.type = data.type
            }
            return object._data || (object._data = getURIData(object.url)),
            object && object.options ? object.options = $.extend(!0, $.extend({},
            options), $.extend({},
            object.options)) : object.options = $.extend({},
            options),
            object.options = Options.create(object.options, object.type, object._data),
            $.extend(this, object),
            this
        }
    });
    var Spinner = {
        supported: Support.css.transform && Support.css.animation,
        initialize: function (a) {
            this.element = $("<div>").addClass("fr-spinner").hide();
            for (var b = 1; 12 >= b; b++) {
                this.element.append($("<div>").addClass("fr-spin-" + b))
            }
            this.element.on("click", $.proxy(function () {
                Window.hide()
            },
            this)),
            this.element.on("fresco:mousewheel",
            function (a) {
                a.preventDefault()
            })
        },
        setSkin: function (a) {
            this.supported && (this._skin && this.element.removeClass("fr-spinner-skin-" + this._skin), this.updateDimensions(), this.element.addClass("fr-spinner-skin-" + a), this._skin = a)
        },
        updateDimensions: function () {
            var a = this._attached;
            a || this.attach(),
            this._dimensions = {
                width: this.element.outerWidth(),
                height: this.element.outerHeight()
            },
            a || this.detach()
        },
        attach: function () {
            this._attached || ($(document.body).append(this.element), this._attached = !0)
        },
        detach: function () {
            this._attached && (this.element.detach(), this._attached = !1)
        },
        show: function (a, b) {
            this._visible = !0,
            this.attach(),
            this.center();
            var c = Pages.page && Pages.page.view.options.effects.spinner.show || 0,
            d = ("number" == $.type(b) ? b : c) || 0;
            this.element.stop(!0).fadeTo(d, 1, a)
        },
        hide: function (a, b, c) {
            this._visible = !1;
            var d = Pages.page && Pages.page.view.options.effects.spinner.hide || 0,
            e = ("number" == $.type(b) ? b : d) || 0;
            this.element.stop(!0).fadeOut(e || 0, $.proxy(function () {
                this.detach(),
                a && a()
            },
            this))
        },
        center: function () {
            if (this.supported) {
                this._dimensions || this.updateDimensions();
                var a = Pages.page,
                b = 0;
                a && "fullclick" == a._ui && a._whileVisible(function () {
                    b = a._getInfoHeight(Window._boxDimensions.width)
                }),
                this.element.css({
                    top: Window._boxPosition.top + 0.5 * Window._boxDimensions.height - 0.5 * this._dimensions.height - 0.5 * b,
                    left: Window._boxPosition.left + 0.5 * Window._boxDimensions.width - 0.5 * this._dimensions.width
                })
            }
        }
    },
    _Fresco = {
        _disabled: !1,
        _fallback: !0,
        initialize: function () {
            Window.initialize(),
            this._disabled || this.startDelegating()
        },
        startDelegating: function () {
            this._delegateHandler || $(document.documentElement).on("click", ".fresco[href]", this._delegateHandler = $.proxy(this.delegate, this)).on("click", this._setClickXYHandler = $.proxy(this.setClickXY, this))
        },
        stopDelegating: function () {
            this._delegateHandler && ($(document.documentElement).off("click", ".fresco[href]", this._delegateHandler).off("click", this._setClickXYHandler), this._setClickXYHandler = null, this._delegateHandler = null)
        },
        setClickXY: function (a) {
            Pages.setXY({
                x: a.pageX,
                y: a.pageY
            })
        },
        delegate: function (a) {
            if (!this._disabled) {
                a.stopPropagation(),
                a.preventDefault();
                var b = a.currentTarget;
                this.setClickXY(a),
                _Fresco.show(b)
            }
        },
        show: function (object) {
            if (this._disabled) {
                return void this.showFallback.apply(_Fresco, _slice.call(arguments))
            }
            var options = arguments[1] || {},
            position = arguments[2];
            arguments[1] && "number" == $.type(arguments[1]) && (position = arguments[1], options = {});
            var views = [],
            object_type,
            isElement = _.isElement(object);
            switch (object_type = $.type(object)) {
                case "string":
                case "object":
                    var view = new View(object, options),
                    _dgo = "data-fresco-group-options";
                    if (view.group) {
                        if (isElement) {
                            var elements = $('.fresco[data-fresco-group="' + $(object).data("fresco-group") + '"]'),
                            groupOptions = {};
                            elements.filter("[" + _dgo + "]").each(function (i, element) {
                                $.extend(groupOptions, eval("({" + ($(element).attr(_dgo) || "") + "})"))
                            });
                            elements.each(function (a, b) {
                                position || b != object || (position = a + 1);
                                var view = new View(b, $.extend({}, groupOptions, options));
                                view.resid = $(b).data("resid");
                                views.push(view);
                            })
                        }
                    } else {
                        var groupOptions = {};
                        isElement && $(object).is("[" + _dgo + "]") && ($.extend(groupOptions, eval("({" + ($(object).attr(_dgo) || "") + "})")),view = new View(object, $.extend({},groupOptions, options)));
                        view.resid = $(object).data("resid");
                        views.push(view)
                    }
                    break;
                case "array":
                    $.each(object,
                    function (a, b) {
                        var c = new View(b, options);
                        views.push(c)
                    })
            }
            var groupExtend = {
                grouped: {
                    caption: !1
                }
            },
            firstUI = views[0].options.ui;
            $.each(views,
            function (a, b) {
                b.caption && (groupExtend.grouped.caption = !0),
                a > 0 && b.options.ui != firstUI && (b.options.ui = firstUI)
            }),
            $.each(views,
            function (a, b) {
                b = $.extend(b, groupExtend)
            }),
            (!position || 1 > position) && (position = 1),
            position > views.length && (position = views.length);
            var positionInAPG;
            isElement && (positionInAPG = Pages.getPositionInActivePageGroup(object)) ? Window.setPosition(positionInAPG) : Window.load(views, position)
        },
        showFallback: function () {
            function a(b) {
                var c, d = $.type(b);
                if ("string" == d) {
                    c = b
                } else {
                    if ("array" == d && b[0]) {
                        c = a(b[0])
                    } else {
                        if (_.isElement(b) && $(b).attr("href")) {
                            var c = $(b).attr("href")
                        } else {
                            c = b.url ? b.url : !1
                        }
                    }
                }
                return c
            }
            return function (b) {
                if (this._fallback) {
                    var c = a(b);
                    c && (window.location.href = c)
                }
            }
        }()
    };
    /*暴露show方法，支持多种参数输入*/
    Fresco.show = _Fresco.show;
    (Browser.IE && Browser.IE < 7 || "number" == $.type(Browser.Android) && Browser.Android < 3 || Browser.MobileSafari && "number" == $.type(Browser.WebKit) && Browser.WebKit < 533.18) && (_Fresco.show = _Fresco.showFallback);
    var Thumbnails = {
        initialize: function (a) {
            this.element = a,
            this._thumbnails = [],
            this._orientation = "vertical",
            this._vars = {
                thumbnail: {},
                thumbnailFrame: {},
                thumbnails: {}
            },
            this.build(),
            this.startObserving()
        },
        build: function () {
            this.element.append(this.wrapper = $("<div>").addClass("fr-thumbnails-wrapper").append(this._slider = $("<div>").addClass("fr-thumbnails-slider").append(this._previous = $("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-previous").append(this._previous_button = $("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon")))).append(this._thumbs = $("<div>").addClass("fr-thumbnails-thumbs").append(this._slide = $("<div>").addClass("fr-thumbnails-slide"))).append(this._next = $("<div>").addClass("fr-thumbnails-side fr-thumbnails-side-next").append(this._next_button = $("<div>").addClass("fr-thumbnails-side-button").append($("<div>").addClass("fr-thumbnails-side-button-background")).append($("<div>").addClass("fr-thumbnails-side-button-icon"))))))
        },
        startObserving: function () {
            this._slider.delegate(".fr-thumbnail", "click", $.proxy(function (a) {
                a.stopPropagation();
                var b = $(a.target).closest(".fr-thumbnail")[0],
                c = b && $(b).data("fr-position");
                c && (this.setActive(c), Window.setPosition(c))
            },
            this)),
            this._slider.bind("click",
            function (a) {
                a.stopPropagation()
            }),
            this._previous.bind("click", $.proxy(this.previousPage, this)),
            this._next.bind("click", $.proxy(this.nextPage, this))
        },
        load: function (a) {
            this.clear();
            var b = "horizontal",
            c = !1;
            $.each(a, $.proxy(function (a, d) {
                "vertical" == d.options.thumbnails && (b = "vertical"),
                d.options.thumbnails || (c = !0)
            },
            this)),
            this.setOrientation(b),
            this._disabledGroup = c,
            this._disabledGroup = !0,
            $.each(a, $.proxy(function (a, b) {
                this._thumbnails.push(new Thumbnail(b, a + 1))
            },
            this)),
            this.fitToViewport()
        },
        clear: function () {
            $.each(this._thumbnails,
            function (a, b) {
                b.remove()
            }),
            this._thumbnails = [],
            this._position = -1,
            this._page = -1
        },
        setOrientation: function (a) {
            this._orientation && Window.element.removeClass("fr-thumbnails-" + this._orientation),
            Window.element.addClass("fr-thumbnails-" + a),
            this._orientation = a
        },
        disable: function () {
            Window.element.removeClass("fr-thumbnails-enabled").addClass("fr-thumbnails-disabled"),
            this._disabled = !0
        },
        enable: function () {
            Window.element.removeClass("fr-thumbnails-disabled").addClass("fr-thumbnails-enabled"),
            this._disabled = !1
        },
        enabled: function () {
            return !this._disabled
        },
        disabled: function () {
            return this._disabled
        },
        updateVars: function () {
            var a = Window.element,
            b = this._vars,
            c = this._orientation,
            d = "horizontal" == c,
            e = d ? "top" : "left",
            f = d ? "left" : "top",
            g = d ? "bottom" : "left",
            h = d ? "top" : "right",
            i = d ? "width" : "height",
            j = d ? "height" : "width",
            k = {
                left: "right",
                right: "left",
                top: "bottom",
                bottom: "top"
            };
            this.element.removeClass("fr-thumbnails-measured");
            var l = a.is(":visible");
            if (l || a.show(), this.disabled() && this.enable(), !this.element.is(":visible") || this._thumbnails.length < 2 || this._disabledGroup) {
                return this.disable(),
                $.extend(this._vars.thumbnails, {
                    width: 0,
                    height: 0
                }),
                l || a.hide(),
                void this.element.addClass("fr-thumbnails-measured")
            }
            this.enable();
            var m = this._previous,
            n = this._next,
            o = this._thumbs,
            p = Bounds.viewport(),
            q = this.element["inner" + _.String.capitalize(j)](),
            r = parseInt(this._thumbs.css("padding-" + e)) || 0,
            s = Math.max(q - 2 * r, 0),
            t = parseInt(this._thumbs.css("padding-" + f)) || 0,
            u = (parseInt(this.element.css("margin-" + g)) || 0) + (parseInt(this.element.css("margin-" + h)) || 0);
            $.extend(b.thumbnails, {
                height: q + u,
                width: p[d ? "width" : "height"],
                paddingTop: r
            }),
            $.extend(b.thumbnail, {
                height: s,
                width: s
            }),
            $.extend(b.thumbnailFrame, {
                width: s + 2 * t,
                height: q
            }),
            b.sides = {
                previous: {
                    width: n["inner" + _.String.capitalize(i)](),
                    marginLeft: parseInt(m.css("margin-" + f)) || 0,
                    marginRight: parseInt(m.css("margin-" + k[f])) || 0
                },
                next: {
                    width: n["inner" + _.String.capitalize(i)](),
                    marginLeft: parseInt(n.css("margin-" + f)) || 0,
                    marginRight: parseInt(n.css("margin-" + k[f])) || 0
                }
            };
            var v = p[i],
            w = b.thumbnailFrame.width,
            o = this._thumbnails.length;
            b.thumbnails.width = v,
            b.sides.enabled = o * w / v > 1;
            var x = v,
            y = b.sides,
            z = y.previous,
            A = y.next,
            B = z.marginLeft + z.width + z.marginRight + A.marginLeft + A.width + A.marginRight;
            b.sides.enabled && (x -= B),
            x = Math.floor(x / w) * w;
            var C = o * w;
            x > C && (x = C);
            var D = x + (b.sides.enabled ? B : 0);
            b.ipp = x / w,
            this._mode = "page",
            b.ipp <= 1 && (x = v, D = v, b.sides.enabled = !1, this._mode = "center"),
            b.pages = Math.ceil(o * w / x),
            b.wrapper = {
                width: D + 1,
                height: q
            },
            b.thumbs = {
                width: x,
                height: q
            },
            b.slide = {
                width: o * w + 1,
                height: q
            },
            l || a.hide(),
            this.element.addClass("fr-thumbnails-measured")
        },
        hide: function () {
            this.disable(),
            this.thumbnails.hide(),
            this._visible = !1
        },
        getDimensions: function () {
            var a = "horizontal" == this._orientation;
            return {
                width: a ? this._vars.thumbnails.width : this._vars.thumbnails.height,
                height: a ? this._vars.thumbnails.height : this._vars.thumbnails.width
            }
        },
        fitToViewport: function () {
            if (this.updateVars(), !this.disabled()) {
                var a = $.extend({},
                this._vars),
                b = "horizontal" == this._orientation;
                $.each(this._thumbnails,
                function (a, b) {
                    b.resize()
                }),
                this._previous[a.sides.enabled ? "show" : "hide"](),
                this._next[a.sides.enabled ? "show" : "hide"](),
                this._thumbs.css({
                    width: a.thumbs[b ? "width" : "height"],
                    height: a.thumbs[b ? "height" : "width"]
                }),
                this._slide.css({
                    width: a.slide[b ? "width" : "height"],
                    height: a.slide[b ? "height" : "width"]
                });
                var c = {
                    width: a.wrapper[b ? "width" : "height"],
                    height: a.wrapper[b ? "height" : "width"]
                };
                c["margin-" + (b ? "left" : "top")] = Math.round(-0.5 * a.wrapper.width) + "px",
                c["margin-" + (b ? "top" : "left")] = 0,
                this.wrapper.css(c),
                this._position && this.moveTo(this._position, !0)
            }
        },
        moveToPage: function (a) {
            if (!(1 > a || a > this._vars.pages || a == this._page)) {
                var b = this._vars.ipp * (a - 1) + 1;
                this.moveTo(b)
            }
        },
        previousPage: function () {
            this.moveToPage(this._page - 1)
        },
        nextPage: function () {
            this.moveToPage(this._page + 1)
        },
        show: function (a) {
            var b = this._position < 0;
            1 > a && (a = 1);
            var c = this._thumbnails.length;
            a > c && (a = c),
            this._position = a,
            this.setActive(a),
            ("page" != this._mode || this._page != Math.ceil(a / this._vars.ipp)) && this.moveTo(a, b)
        },
        moveTo: function (a, b) {
            if (this.updateVars(), !this.disabled()) {
                var c, d = "horizontal" == this._orientation,
                e = Bounds.viewport()[d ? "width" : "height"],
                f = 0.5 * e,
                g = this._vars.thumbnailFrame.width;
                if ("page" == this._mode) {
                    var h = Math.ceil(a / this._vars.ipp);
                    this._page = h,
                    c = -1 * (g * (this._page - 1) * this._vars.ipp);
                    var i = "fr-thumbnails-side-button-disabled";
                    this._previous_button[(2 > h ? "add" : "remove") + "Class"](i),
                    this._next_button[(h >= this._vars.pages ? "add" : "remove") + "Class"](i)
                } else {
                    c = f + -1 * (g * (a - 1) + 0.5 * g)
                }
                var h = Pages.page,
                j = {},
                k = {};
                j[d ? "top" : "left"] = 0,
                k[d ? "left" : "top"] = c + "px",
                this._slide.stop(!0).css(j).animate(k, b ? 0 : h ? h.view.options.effects.thumbnails.slide || 0 : 0, $.proxy(function () {
                    this.loadCurrentPage()
                },
                this))
            }
        },
        loadCurrentPage: function () {
            var a, b;
            if (this._position && this._vars.thumbnailFrame.width && !(this._thumbnails.length < 1)) {
                if ("page" == this._mode) {
                    if (this._page < 1) {
                        return
                    }
                    a = (this._page - 1) * this._vars.ipp + 1,
                    b = Math.min(a - 1 + this._vars.ipp, this._thumbnails.length)
                } else {
                    var c = ("horizontal" == this._orientation, Math.ceil(this._vars.thumbnails.width / this._vars.thumbnailFrame.width));
                    a = Math.max(Math.floor(Math.max(this._position - 0.5 * c, 0)), 1),
                    b = Math.ceil(Math.min(this._position + 0.5 * c)),
                    this._thumbnails.length < b && (b = this._thumbnails.length)
                }
                for (var d = a; b >= d; d++) {
                    this._thumbnails[d - 1].load()
                }
            }
        },
        setActive: function (a) {
            this._slide.find(".fr-thumbnail-active").removeClass("fr-thumbnail-active");
            var b = a && this._thumbnails[a - 1];
            b && b.activate()
        },
        refresh: function () {
            this._position && this.setPosition(this._position)
        }
    };
    $.extend(Thumbnail.prototype, {
        initialize: function (a, b) {
            this.view = a,
            this._dimension = {},
            this._position = b,
            this.preBuild()
        },
        preBuild: function () {
            this.thumbnail = $("<div>").addClass("fr-thumbnail").data("fr-position", this._position)
        },
        build: function () {
            if (!this.thumbnailFrame) {
                var a = this.view.options;
                Thumbnails._slide.append(this.thumbnailFrame = $("<div>").addClass("fr-thumbnail-frame").append(this.thumbnail.append(this.thumbnailWrapper = $("<div>").addClass("fr-thumbnail-wrapper")))),
                "image" == this.view.type && this.thumbnail.addClass("fr-load-thumbnail").data("thumbnail", {
                    view: this.view,
                    src: a.thumbnail || this.view.url
                });
                var b = a.thumbnail && a.thumbnail.icon;
                b && this.thumbnail.append($("<div>").addClass("fr-thumbnail-icon fr-thumbnail-icon-" + b));
                var c;
                this.thumbnail.append(c = $("<div>").addClass("fr-thumbnail-overlay").append($("<div>").addClass("fr-thumbnail-overlay-background")).append(this.loading = $("<div>").addClass("fr-thumbnail-loading").append($("<div>").addClass("fr-thumbnail-loading-background")).append(this.spinner = $("<div>").addClass("fr-thumbnail-spinner").hide().append($("<div>").addClass("fr-thumbnail-spinner-spin")))).append($("<div>").addClass("fr-thumbnail-overlay-border"))),
                this.thumbnail.append($("<div>").addClass("fr-thumbnail-state")),
                this.resize()
            }
        },
        remove: function () {
            this.thumbnailFrame && (this.thumbnailFrame.remove(), this.thumbnailFrame = null, this.image = null),
            this.ready && (this.ready.abort(), this.ready = null),
            this.vimeoThumbnail && (this.vimeoThumbnail.abort(), this.vimeoThumbnail = null),
            this._loading = !1,
            this._removed = !0,
            this.view = null,
            this._clearDelay()
        },
        load: function () {
            if (!(this._loaded || this._loading || this._removed)) {
                this.thumbnailWrapper || this.build(),
                this._loading = !0;
                var a = this.view.options.thumbnail,
                b = a && "boolean" == $.type(a) ? this.view.url : a || this.view.url;
                if (this._url = b, b) {
                    if ("vimeo" == this.view.type) {
                        if (b == a) {
                            this._url = b,
                            this._load(this._url)
                        } else {
                            switch (this.view.type) {
                                case "vimeo":
                                    this.vimeoThumbnail = new VimeoThumbnail(this.view.url, $.proxy(function (a) {
                                        this._url = a,
                                        this._load(a)
                                    },
                                    this), $.proxy(function () {
                                        this._error()
                                    },
                                    this))
                            }
                        }
                    } else {
                        this._load(this._url)
                    }
                }
            }
        },
        activate: function () {
            this.thumbnail.addClass("fr-thumbnail-active")
        },
        _load: function (a) {
            this.thumbnailWrapper.prepend(this.image = $("<img>").addClass("fr-thumbnail-image").attr({
                src: a
            }).css({
                opacity: 0.0001
            })),
            this.fadeInSpinner(),
            this.ready = new ImageReady(this.image[0], $.proxy(function (a) {
                var b = a.img;
                this.thumbnailFrame && this._loading && (this._loaded = !0, this._loading = !1, this._dimensions = {
                    width: b.naturalWidth,
                    height: b.naturalHeight
                },
                this.resize(), this.show())
            },
            this), $.proxy(function () {
                this._error()
            },
            this), {
                method: this.view.options.loadedMethod
            })
        },
        _error: function () {
            this._loaded = !0,
            this._loading = !1,
            this.thumbnail.addClass("fr-thumbnail-error"),
            this.image.hide(),
            this.thumbnailWrapper.append($("<div>").addClass("fr-thumbnail-image")),
            this.show()
        },
        fadeInSpinner: function () {
            if (Spinner.supported && this.view.options.spinner) {
                this._clearDelay();
                var a = this.view.options.effects.thumbnail;
                this._delay = setTimeout($.proxy(function () {
                    this.spinner.stop(!0).fadeTo(a.show || 0, 1)
                },
                this), this.view.options.spinnerDelay || 0)
            }
        },
        show: function () {
            this._clearDelay();
            var a = this.view.options.effects.thumbnail;
            this.loading.stop(!0).delay(a.delay).fadeTo(a.show, 0)
        },
        _clearDelay: function () {
            this._delay && (clearTimeout(this._delay), this._delay = null)
        },
        resize: function () {
            if (this.thumbnailFrame) {
                var a = "horizontal" == Thumbnails._orientation;
                if (this.thumbnailFrame.css({
                    width: Thumbnails._vars.thumbnailFrame[a ? "width" : "height"],
                    height: Thumbnails._vars.thumbnailFrame[a ? "height" : "width"]
                }), this.thumbnailFrame.css({
                    top: a ? 0 : Thumbnails._vars.thumbnailFrame.width * (this._position - 1),
                    left: a ? Thumbnails._vars.thumbnailFrame.width * (this._position - 1) : 0
                }), this.thumbnailWrapper) {
                    var b = Thumbnails._vars.thumbnail;
                    if (this.thumbnail.css({
                        width: b.width,
                        height: b.height,
                        "margin-top": Math.round(-0.5 * b.height),
                        "margin-left": Math.round(-0.5 * b.width),
                        "margin-bottom": 0,
                        "margin-right": 0
                    }), this._dimensions) {
                        var c, d = {
                            width: b.width,
                            height: b.height
                        },
                        e = Math.max(d.width, d.height),
                        f = $.extend({},
                        this._dimensions);
                        if (f.width > d.width && f.height > d.height) {
                            c = Fit.within(d, f);
                            var g = 1,
                            h = 1;
                            c.width < d.width && (g = d.width / c.width),
                            c.height < d.height && (h = d.height / c.height);
                            var i = Math.max(g, h);
                            i > 1 && (c.width *= i, c.height *= i),
                            $.each("width height".split(" "),
                            function (a, b) {
                                c[b] = Math.round(c[b])
                            })
                        } else {
                            c = Fit.within(this._dimensions, f.width < d.width || f.height < d.height ? {
                                width: e,
                                height: e
                            } : d)
                        }
                        var j = Math.round(0.5 * d.width - 0.5 * c.width),
                        k = Math.round(0.5 * d.height - 0.5 * c.height);
                        this.image.removeAttr("style").css($.extend({},
                        c, {
                            top: k,
                            left: j
                        }))
                    }
                }
            }
        }
    });
    var UI = {
        _modes: ["fullclick", "outside", "inside"],
        _ui: !1,
        _validClickTargetSelector: [".fr-content-element", ".fr-content", ".fr-content > .fr-stroke", ".fr-content > .fr-stroke .fr-stroke-color"].join(", "),
        initialize: function (a) {
            $.each(this._modes, $.proxy(function (a, b) {
                this[b].initialize()
            },
            this)),
            Window.element.addClass("fr-ui-inside-hidden fr-ui-fullclick-hidden")
        },
        set: function (a) {
            this._ui && (Window.element.removeClass("fr-window-ui-" + this._ui), Overlay.element.removeClass("fr-overlay-ui-" + this._ui)),
            Window.element.addClass("fr-window-ui-" + a),
            Overlay.element.addClass("fr-overlay-ui-" + a),
            this._enabled && this._ui && this._ui != a && (this[this._ui].disable(), this[a].enable(), UI[a].show()),
            this._ui = a
        },
        _onWindowResize: function () {
            Support.mobileTouch && this.show()
        },
        enable: function () {
            $.each(this._modes, $.proxy(function (a, b) {
                UI[b][b == this._ui ? "enable" : "disable"]()
            },
            this)),
            this._enabled = !0
        },
        disable: function () {
            $.each(this._modes, $.proxy(function (a, b) {
                UI[b].disable()
            },
            this)),
            this._enabled = !1
        },
        adjustPrevNext: function (a, b) {
            UI[this._ui].adjustPrevNext(a, b)
        },
        show: function (a, b) {
            UI[this._ui].show(a, b)
        },
        hide: function (a, b) {
            UI[this._ui].hide(a, b)
        },
        reset: function () {
            $.each(this._modes, $.proxy(function (a, b) {
                UI[b].reset()
            },
            this))
        },
        update: function () {
            var a = Pages.page;
            a && this.set(a._ui)
        }
    };
    return UI.fullclick = {
        initialize: function () {
            this.build(),
            this._scrollLeft = -1
        },
        build: function () {
            Window._box.append(this._previous =
                $("<div>").addClass("fr-side fr-side-previous fr-side-previous-fullclick fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._next = $("<div>").addClass("fr-side fr-side-next fr-side-next-fullclick fr-toggle-ui").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._close = $("<div>").addClass("fr-close fr-close-fullclick").append($("<div>").addClass("fr-close-background")).append($("<div>").addClass("fr-close-icon"))),
            Browser.IE && Browser.IE <= 7 && this._previous.add(this._next).add(this._close).hide(),
            this._close.on("click", $.proxy(function (a) {
                a.preventDefault(),
                Window.hide()
            },
            this)),
            this._previous.on("click", $.proxy(function (a) {
                    console.log(11);
                Window.previous(),
                this._onMouseMove(a)
                    console.log(12);
            },
            this)),
            this._next.on("click", $.proxy(function (a) {
                Window.next(),
                this._onMouseMove(a)
            },
            this))
        },
        enable: function () {
            this.bind()
        },
        disable: function () {
            this.unbind()
        },
        reset: function () {
            Window.timers.clear("ui-fullclick"),
            this._x = -1,
            this._y = -1,
            this._scrollLeft = -1,
            this.resetPrevNext(),
            this._onMouseLeave()
        },
        resetPrevNext: function () {
            var a = this._previous.add(this._next);
            a.stop(!0).removeAttr("style")
        },
        bind: function () {
            this._onMouseUpHandler || (this.unbind(), Window._pages.on("mouseup", ".fr-container", this._onMouseUpHandler = $.proxy(this._onMouseUp, this)), Support.mobileTouch || (Window.element.on("mouseenter", this._showHandler = $.proxy(this.show, this)).on("mouseleave", this._hideHandler = $.proxy(this.hide, this)), Window.element.on("mousemove", this._mousemoveHandler = $.proxy(function (a) {
                var b = a.pageX,
                c = a.pageY;
                this._hoveringSideButton || c == this._y && b == this._x || (this._x = b, this._y = c, this.show(), this.startTimer())
            },
            this)), Window._pages.on("mousemove", ".fr-container", this._onMouseMoveHandler = $.proxy(this._onMouseMove, this)).on("mouseleave", ".fr-container", this._onMouseLeaveHandler = $.proxy(this._onMouseLeave, this)).on("mouseenter", ".fr-container", this._onMouseEnterHandler = $.proxy(this._onMouseEnter, this)), Window.element.on("mouseenter", ".fr-side", this._onSideMouseEnterHandler = $.proxy(this._onSideMouseEnter, this)).on("mouseleave", ".fr-side", this._onSideMouseLeaveHandler = $.proxy(this._onSideMouseLeave, this)), $(window).on("scroll", this._onScrollHandler = $.proxy(this._onScroll, this))))
        },
        unbind: function () {
            this._onMouseUpHandler && (Window._pages.off("mouseup", ".fr-container", this._onMouseUpHandler), this._onMouseUpHandler = null, this._showHandler && (Window.element.off("mouseenter", this._showHandler).off("mouseleave", this._hideHandler).off("mousemove", this._mousemoveHandler), Window._pages.off("mousemove", ".fr-container", this._onMouseMoveHandler).off("mouseleave", ".fr-container", this._onMouseLeaveHandler).off("mouseenter", ".fr-container", this._onMouseEnterHandler), Window.element.off("mouseenter", ".fr-side", this._onSideMouseEnterHandler).off("mouseleave", ".fr-side", this._onSideMouseLeaveHandler), $(window).off("scroll", this._onScrollHandler), this._showHandler = null))
        },
        adjustPrevNext: function (a, b) {
            var c = Pages.page;
            if (!c) {
                return void (a && a())
            }
            var d = Window.element.is(":visible");
            d || Window.element.show();
            var e = this._previous.attr("style");
            this._previous.removeAttr("style");
            var f = parseInt(this._previous.css("margin-top"));
            this._previous.attr({
                style: e
            }),
            d || Window.element.hide();
            var g = c._infoHeight || 0,
            h = this._previous.add(this._next),
            i = {
                "margin-top": f - 0.5 * g
            },
            j = "number" == $.type(b) ? b : Pages.page && Pages.page.view.options.effects.content.show || 0;
            this.opening && (j = 0),
            h.stop(!0).animate(i, j, a),
            this._previous[(Window.mayPrevious() ? "remove" : "add") + "Class"]("fr-side-disabled"),
            this._next[(Window.mayNext() ? "remove" : "add") + "Class"]("fr-side-disabled"),
            h[(c._total < 2 ? "add" : "remove") + "Class"]("fr-side-hidden"),
            a && a()
        },
        _onScroll: function () {
            this._scrollLeft = $(window).scrollLeft()
        },
        _onMouseMove: function (a) {
            if (!Support.mobileTouch) {
                var b = this._getEventSide(a),
                c = _.String.capitalize(b),
                d = b ? Window["may" + c]() : !1;
                if (b != this._hoveringSide || d != this._mayClickHoveringSide) {
                    switch (this._hoveringSide = b, this._mayClickHoveringSide = d, Window._box[(d ? "add" : "remove") + "Class"]("fr-hovering-clickable"), b) {
                        case "previous":
                            Window._box.addClass("fr-hovering-previous").removeClass("fr-hovering-next");
                            break;
                        case "next":
                            Window._box.addClass("fr-hovering-next").removeClass("fr-hovering-previous")
                    }
                }
            }
        },
        _onMouseLeave: function (a) {
            Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next"),
            this._hoveringSide = !1
        },
        _onMouseUp: function (a) {
            if (!(a.which > 1)) {
                if (1 == Pages.pages.length) {
                    return void Window.hide()
                }
                var b = this._getEventSide(a);
                Window[b](),
                this._onMouseMove(a)
            }
        },
        _onMouseEnter: function (a) {
            this._onMouseMove(a)
        },
        _getEventSide: function (a) {
            var b = (this._scrollLeft > -1 ? this._scrollLeft : this._scrollLeft = $(window).scrollLeft(), a.pageX - Window._boxPosition.left - this._scrollLeft),
            c = Window._boxDimensions.width;
            return 0.5 * c > b ? "previous" : "next"
        },
        _onSideMouseEnter: function (a) {
            this._hoveringSideButton = !0,
            this._hoveringSide = this._getEventSide(a),
            this._mayClickHoveringSide = Window["may" + _.String.capitalize(this._hoveringSide)](),
            this.clearTimer()
        },
        _onSideMouseLeave: function (a) {
            this._hoveringSideButton = !1,
            this._hoveringSide = !1,
            this._mayClickHoveringSide = !1,
            this.startTimer()
        },
        show: function (a) {
            return this._visible ? (this.startTimer(), void ("function" == $.type(a) && a())) : (this._visible = !0, this.startTimer(), Window.element.addClass("fr-visible-fullclick-ui").removeClass("fr-hidden-fullclick-ui"), Browser.IE && Browser.IE <= 7 && this._previous.add(this._next).add(this._close).show(), void ("function" == $.type(a) && a()))
        },
        hide: function (a) {
            var b = Pages.page && Pages.page.view.type;
            return !this._visible || b && ("youtube" == b || "vimeo" == b) ? void ("function" == $.type(a) && a()) : (this._visible = !1, Window.element.removeClass("fr-visible-fullclick-ui").addClass("fr-hidden-fullclick-ui"), void ("function" == $.type(a) && a()))
        },
        clearTimer: function () {
            Support.mobileTouch || Window.timers.clear("ui-fullclick")
        },
        startTimer: function () {
            Support.mobileTouch || (this.clearTimer(), Window.timers.set("ui-fullclick", $.proxy(function () {
                this.hide()
            },
            this), Window.view ? Window.view.options.uiDelay : 0))
        }
    },
    UI.inside = {
        initialize: function () { },
        enable: function () {
            this.bind()
        },
        disable: function () {
            this.unbind()
        },
        bind: function () {
            this._onMouseUpHandler || (this.unbind(), Window._pages.on("mouseup", ".fr-content", this._onMouseUpHandler = $.proxy(this._onMouseUp, this)), Window._pages.on("click", ".fr-content .fr-close", $.proxy(function (a) {
                a.preventDefault(),
                Window.hide()
            },
            this)).on("click", ".fr-content .fr-side-previous", $.proxy(function (a) {
                Window.previous(),
                this._onMouseMove(a)
            },
            this)).on("click", ".fr-content .fr-side-next", $.proxy(function (a) {
                Window.next(),
                this._onMouseMove(a)
            },
            this)), Window.element.on("click", ".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper", this._delegateOverlayCloseHandler = $.proxy(this._delegateOverlayClose, this)), Support.mobileTouch || (Window.element.on("mouseenter", ".fr-content", this._showHandler = $.proxy(this.show, this)).on("mouseleave", ".fr-content", this._hideHandler = $.proxy(this.hide, this)), Window.element.on("mousemove", ".fr-content", this._mousemoveHandler = $.proxy(function (a) {
                var b = a.pageX,
                c = a.pageY;
                this._hoveringSideButton || c == this._y && b == this._x || (this._x = b, this._y = c, this.show(), this.startTimer())
            },
            this)), Window._pages.on("mousemove", ".fr-info, .fr-close", $.proxy(function (a) {
                a.stopPropagation(),
                this._onMouseLeave(a)
            },
            this)), Window._pages.on("mousemove", ".fr-info", $.proxy(function (a) {
                this.clearTimer()
            },
            this)), Window._pages.on("mousemove", ".fr-content", this._onMouseMoveHandler = $.proxy(this._onMouseMove, this)).on("mouseleave", ".fr-content", this._onMouseLeaveHandler = $.proxy(this._onMouseLeave, this)).on("mouseenter", ".fr-content", this._onMouseEnterHandler = $.proxy(this._onMouseEnter, this)), Window.element.on("mouseenter", ".fr-side", this._onSideMouseEnterHandler = $.proxy(this._onSideMouseEnter, this)).on("mouseleave", ".fr-side", this._onSideMouseLeaveHandler = $.proxy(this._onSideMouseLeave, this)), $(window).on("scroll", this._onScrollHandler = $.proxy(this._onScroll, this))))
        },
        unbind: function () {
            this._onMouseUpHandler && (Window._pages.off("mouseup", ".fr-content", this._onMouseUpHandler), this._onMouseUpHandler = null, Window._pages.off("click", ".fr-content .fr-close").off("click", ".fr-content .fr-side-previous").off("click", ".fr-content .fr-side-next"), Window.element.off("click", ".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper", this._delegateOverlayCloseHandler), this._showHandler && (Window.element.off("mouseenter", ".fr-content", this._showHandler).off("mouseleave", ".fr-content", this._hideHandler).off("mousemove", ".fr-content", this._mousemoveHandler), Window._pages.off("mousemove", ".fr-info, .fr-close"), Window._pages.off("mousemove", ".fr-info"), Window._pages.off("mousemove", ".fr-content-element", this._onMouseMoveHandler).off("mouseleave", ".fr-content", this._onMouseLeaveHandler).off("mouseenter", ".fr-content", this._onMouseEnterHandler), Window.element.off("mouseenter", ".fr-side", this._onSideMouseEnterHandler).off("mouseleave", ".fr-side", this._onSideMouseLeaveHandler), $(window).off("scroll", this._onScrollHandler), this._showHandler = null))
        },
        reset: function () {
            Window.timers.clear("ui-fullclick"),
            this._x = -1,
            this._y = -1,
            this._scrollLeft = -1,
            this._hoveringSide = !1,
            this._onMouseLeave()
        },
        adjustPrevNext: function (a) {
            a && a()
        },
        _onScroll: function () {
            this._scrollLeft = $(window).scrollLeft()
        },
        _delegateOverlayClose: function (a) {
            var b = Pages.page;
            b && b.view.options.overlay && !b.view.options.overlay.close || $(a.target).is(".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper") && (a.preventDefault(), a.stopPropagation(), Window.hide())
        },
        _onMouseMove: function (a) {
            if (!Support.mobileTouch) {
                var b = this._getEventSide(a),
                c = _.String.capitalize(b),
                d = b ? Window["may" + c]() : !1;
                if ((1 == Pages.pages.length || Pages.page && "close" == Pages.page.view.options.onClick) && (b = !1), b != this._hoveringSide || d != this._mayClickHoveringSide) {
                    if (this._hoveringSide = b, this._mayClickHoveringSide = d, b) {
                        switch (Window._box[(d ? "add" : "remove") + "Class"]("fr-hovering-clickable"), b) {
                            case "previous":
                                Window._box.addClass("fr-hovering-previous").removeClass("fr-hovering-next");
                                break;
                            case "next":
                                Window._box.addClass("fr-hovering-next").removeClass("fr-hovering-previous")
                        }
                    } else {
                        Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next")
                    }
                }
            }
        },
        _onMouseLeave: function (a) {
            Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next"),
            this._hoveringSide = !1
        },
        _onMouseUp: function (a) {
            if (!(a.which > 1) && $(a.target).is(UI._validClickTargetSelector)) {
                if (1 == Pages.pages.length || Pages.page && "close" == Pages.page.view.options.onClick) {
                    return void Window.hide()
                }
                var b = this._getEventSide(a);
                Window[b](),
                this._onMouseMove(a)
            }
        },
        _onMouseEnter: function (a) {
            this._onMouseMove(a)
        },
        _getEventSide: function (a) {
            var b = (this._scrollLeft > -1 ? this._scrollLeft : this._scrollLeft = $(window).scrollLeft(), a.pageX - Window._boxPosition.left - this._scrollLeft),
            c = Window._boxDimensions.width;
            return 0.5 * c > b ? "previous" : "next"
        },
        _onSideMouseEnter: function (a) {
            this._hoveringSideButton = !0,
            this._hoveringSide = this._getEventSide(a),
            this._mayClickHoveringSide = Window["may" + _.String.capitalize(this._hoveringSide)](),
            this.clearTimer()
        },
        _onSideMouseLeave: function (a) {
            this._hoveringSideButton = !1,
            this._hoveringSide = !1,
            this._mayClickHoveringSide = !1,
            this.startTimer()
        },
        show: function (a) {
            return this._visible ? (this.startTimer(), void ("function" == $.type(a) && a())) : (this._visible = !0, this.startTimer(), Window.element.addClass("fr-visible-inside-ui").removeClass("fr-hidden-inside-ui"), void ("function" == $.type(a) && a()))
        },
        hide: function (a) {
            return this._visible ? (this._visible = !1, Window.element.removeClass("fr-visible-inside-ui").addClass("fr-hidden-inside-ui"), void ("function" == $.type(a) && a())) : void ("function" == $.type(a) && a())
        },
        clearTimer: function () {
            Support.mobileTouch || Window.timers.clear("ui-inside")
        },
        startTimer: function () {
            Support.mobileTouch || (this.clearTimer(), Window.timers.set("ui-inside", $.proxy(function () {
                this.hide()
            },
            this), Window.view ? Window.view.options.uiDelay : 0))
        }
    },
    UI.outside = {
        initialize: function () {
            this.build(),
            this._scrollLeft = -1
        },
        build: function () {
            Window._box.append(this._previous = $("<div>").addClass("fr-side fr-side-previous fr-side-previous-outside").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._next = $("<div>").addClass("fr-side fr-side-next fr-side-next-outside").append($("<div>").addClass("fr-side-button").append($("<div>").addClass("fr-side-button-background")).append($("<div>").addClass("fr-side-button-icon")))).append(this._close = $("<div>").addClass("fr-close fr-close-outside").append($("<div>").addClass("fr-close-background")).append($("<div>").addClass("fr-close-icon"))),
            Browser.IE && Browser.IE <= 7 && this._previous.add(this._next).add(this._close).hide(),
            this._close.on("click", $.proxy(function (a) {
                a.preventDefault(),
                Window.hide()
            },
            this)),
            this._previous.on("click", $.proxy(function (a) {
                Window.previous(),
                this._onMouseMove(a)
            },
            this)),
            this._next.on("click", $.proxy(function (a) {
                Window.next(),
                this._onMouseMove(a)
            },
            this))
        },
        enable: function () {
            this.bind()
        },
        disable: function () {
            this.unbind()
        },
        reset: function () {
            Window.timers.clear("ui-outside"),
            this._x = -1,
            this._y = -1,
            this._scrollLeft = -1,
            this._onMouseLeave()
        },
        bind: function () {
            this._onMouseUpHandler || (this.unbind(), Window.element.on("mouseup", ".fr-content", this._onMouseUpHandler = $.proxy(this._onMouseUp, this)), Window.element.on("click", ".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper", this._delegateOverlayCloseHandler = $.proxy(this._delegateOverlayClose, this)), Support.mobileTouch || (Window._pages.on("mousemove", ".fr-content", this._onMouseMoveHandler = $.proxy(this._onMouseMove, this)).on("mouseleave", ".fr-content", this._onMouseLeaveHandler = $.proxy(this._onMouseLeave, this)).on("mouseenter", ".fr-content", this._onMouseEnterHandler = $.proxy(this._onMouseEnter, this)), Window.element.on("mouseenter", ".fr-side", this._onSideMouseEnterHandler = $.proxy(this._onSideMouseEnter, this)).on("mouseleave", ".fr-side", this._onSideMouseLeaveHandler = $.proxy(this._onSideMouseLeave, this)), $(window).on("scroll", this._onScrollHandler = $.proxy(this._onScroll, this))))
        },
        unbind: function () {
            this._onMouseUpHandler && (Window.element.off("mouseup", ".fr-content", this._onMouseUpHandler), this._onMouseUpHandler = null, Window.element.off("click", ".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper", this._delegateOverlayCloseHandler), this._onMouseMoveHandler && (Window._pages.off("mousemove", ".fr-content", this._onMouseMoveHandler).off("mouseleave", ".fr-content", this._onMouseLeaveHandler).off("mouseenter", ".fr-content", this._onMouseEnterHandler), Window.element.off("mouseenter", ".fr-side", this._onSideMouseEnterHandler).off("mouseleave", ".fr-side", this._onSideMouseLeaveHandler), $(window).off("scroll", this._onScrollHandler), this._onMouseMoveHandler = null))
        },
        adjustPrevNext: function (a, b) {
            var c = Pages.page;
            if (!c) {
                return void (a && a())
            }
            var d = this._previous.add(this._next);
            this._previous[(Window.mayPrevious() ? "remove" : "add") + "Class"]("fr-side-disabled"),
            this._next[(Window.mayNext() ? "remove" : "add") + "Class"]("fr-side-disabled"),
            d[(c._total < 2 ? "add" : "remove") + "Class"]("fr-side-hidden"),
            a && a()
        },
        _onScroll: function () {
            this._scrollLeft = $(window).scrollLeft()
        },
        _delegateOverlayClose: function (a) {
            var b = Pages.page;
            b && b.view.options.overlay && !b.view.options.overlay.close || $(a.target).is(".fr-container, .fr-thumbnails, .fr-thumbnails-wrapper") && (a.preventDefault(), a.stopPropagation(), Window.hide())
        },
        _onMouseMove: function (a) {
            if (!Support.mobileTouch) {
                var b = this._getEventSide(a),
                c = _.String.capitalize(b),
                d = b ? Window["may" + c]() : !1;
                if ((1 == Pages.pages.length || Pages.page && "close" == Pages.page.view.options.onClick) && (b = !1), b != this._hoveringSide || d != this._mayClickHoveringSide) {
                    if (this._hoveringSide = b, this._mayClickHoveringSide = d, b) {
                        switch (Window._box[(d ? "add" : "remove") + "Class"]("fr-hovering-clickable"), b) {
                            case "previous":
                                Window._box.addClass("fr-hovering-previous").removeClass("fr-hovering-next");
                                break;
                            case "next":
                                Window._box.addClass("fr-hovering-next").removeClass("fr-hovering-previous")
                        }
                    } else {
                        Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next")
                    }
                }
            }
        },
        _onMouseLeave: function (a) {
            Window._box.removeClass("fr-hovering-clickable fr-hovering-previous fr-hovering-next"),
            this._hoveringSide = !1
        },
        _onMouseUp: function (a) {
            if (!(a.which > 1) && $(a.target).is(UI._validClickTargetSelector)) {
                if (1 == Pages.pages.length || Pages.page && "close" == Pages.page.view.options.onClick) {
                    return void Window.hide()
                }
                var b = this._getEventSide(a);
                Window[b](),
                this._onMouseMove(a)
            }
        },
        _onMouseEnter: function (a) {
            this._onMouseMove(a)
        },
        _getEventSide: function (a) {
            var b = (this._scrollLeft > -1 ? this._scrollLeft : this._scrollLeft = $(window).scrollLeft(), a.pageX - Window._boxPosition.left - this._scrollLeft),
            c = Window._boxDimensions.width;
            return 0.5 * c > b ? "previous" : "next"
        },
        show: function () {
            Browser.IE && Browser.IE <= 7 && this._previous.add(this._next).add(this._close).show()
        },
        hide: function () { },
        _onSideMouseEnter: function (a) {
            this._hoveringSideButton = !0,
            this._hoveringSide = this._getEventSide(a),
            this._mayClickHoveringSide = Window["may" + _.String.capitalize(this._hoveringSide)]()
        },
        _onSideMouseLeave: function (a) {
            this._hoveringSideButton = !1,
            this._hoveringSide = !1,
            this._mayClickHoveringSide = !1
        },
        clearTimer: function () { }
    },
    $(document).ready(function (a) {
        _Fresco.initialize()
    }),
    Fresco
});