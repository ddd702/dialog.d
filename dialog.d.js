/**
 * 
 * @author ddd
 * @version 1.0.0 beta
 * @githud https://github.com/ddd702/dialog.d
 * @created 2015.8.30
 * 
 */
D = {}; //在根对象下创建D
D.dialog = {
    tpl: {
        alert: '<div class="d-dialog-cell"><p class="d-dialog-title"><&=title&></p><p class="d-dialog-con"><&=content&><div class="d-dialog-btn"><a href="javascript:" class="btn" id="D-alert-y"><&=btn&></a></div></div> ',
        confirm: '<div class="d-dialog-cell"><p class="d-dialog-title"><&=title&></p><p class="d-dialog-con"><&=content&></p><div class="d-dialog-btns"><a href="javascript:" class="btn" id="D-confirm-y"><&=btnY&></a><a href="javascript:" class="btn" id="D-confirm-n"><&=btnN&></a></div></div>',
        prompt: '<div class="d-dialog-cell"><p class="d-dialog-title"><&=title&></p><p class="d-dialog-con"><&=content&></p><input class="d-dialog-input" type="<&=inputType&>" value="<&=defaultVal&>"><div class="d-dialog-btns"><a href="javascript:" class="btn" id="D-prompt-y"><&=btnY&></a><a href="javascript:" class="btn" id="D-prompt-n"><&=btnN&></a></div></div>',
        notify: '<div class="d-notify-cell"><span class="d-notify-con"><&=content&></span></div>'
    },
    config: {
        alert: {
            title: '',
            content: '未知信息',
            btn: '确定',
            animateShow: '',
            animateHide: ''
        },
        confirm: {
            title: '',
            content: '你确定？',
            btnY: '确定',
            btnN: '取消',
            fnY: function(t) {
                console.log('你按了确定');
                return true;
            },
            fnN: function(t) {
                console.log('你按了取消');
                return false;
            },
            animateShow: '',
            animateHide: ''
        },
        prompt: {
            title: '',
            content: '填入信息',
            btnY: '确定',
            btnN: '取消',
            fnY: function(t) {
                console.log('你填入了：' + t);
                return true;
            },
            fnN: function(t) {
                console.log('你按了取消');
                return false;
            },
            inputType: 'text',
            defaultVal: '',
            animateShow: '',
            animateHide: ''
        },
        notify: {
            content: 'it is a notify',
            rmTime: 3000, //消失时间，单位毫秒
            autoRm: true, //是否自动消失,false为一直显示
            operate: true, //notify 出现的同时能否执行其他操作
            fn: function() {} //同时执行的回调
        }
    },
    notifyTimer: null, //notify的定时器
    createBox: function() {
        var boxEle = document.createElement('div');
        boxEle.className = 'd-dialog-box d-show';
        return boxEle;
    },
    createMask: function() { //创建遮罩
        this.maskEle = document.querySelector('#D-mask');
        if (!this.maskEle) {
            this.maskEle = document.createElement('div');
            this.maskEle.className = 'd-dialog-mask';
            this.maskEle.id = 'D-mask';
            document.body.appendChild(this.maskEle);
        } else {
            this.maskEle.className = 'd-dialog-mask d-show';
        }
    },
    removeMask: function() {
        this.maskEle.className = 'd-dialog-mask d-hide';
    }
};
D.alert = function(con, cb) {
    var utils = this.utils;
    var dialog = D.dialog;
    var opt = dialog.config.alert;
    var alertEle = document.querySelector('#D-alert');
    var alertTpl = dialog.tpl.alert;

    function rmAlert() {
        dialog.removeMask();
        document.body.removeChild(alertEle);
    }
    if (alertEle) {
        rmAlert();
    }
    dialog.createMask();
    opt.content = con;
    alertEle = dialog.createBox();
    alertEle.id = 'D-alert';
    alertEle.innerHTML = utils.render(alertTpl, opt);
    document.body.appendChild(alertEle);
    utils.setEvent(alertEle.querySelector('#D-alert-y'), 'click', function(e) {
        e.stopPropagation();
        dialog.removeMask();
        alertEle.className = 'd-dialog-box d-hide ' + opt.animateHide;
        if (cb) { cb() }
    });
};
D.confirm = function(param) {
    var utils = this.utils;
    var dialog = D.dialog;
    var confirmEle = document.querySelector('#D-confirm');
    var confirmTpl = dialog.tpl.confirm;
    var opt = utils.extend(dialog.config.confirm, param);
    dialog.createMask();

    function rmConfirm() {
        dialog.removeMask();
        document.body.removeChild(confirmEle);
    }
    if (confirmEle) {
        rmConfirm();
    }
    confirmEle = dialog.createBox();
    confirmEle.id = "D-confirm";
    confirmEle.innerHTML = utils.render(confirmTpl, opt);
    document.body.appendChild(confirmEle);
    utils.setEvent(confirmEle.querySelector('#D-confirm-y'), 'click', function(e) {
        e.stopPropagation();
        rmConfirm();
        opt.fnY();
    });
    utils.setEvent(confirmEle.querySelector('#D-confirm-n'), 'click', function(e) {
        e.stopPropagation();
        rmConfirm();
        opt.fnN();
    });
};
D.prompt = function(param) {
    var utils = this.utils;
    var dialog = D.dialog;
    var promptEle = document.querySelector('#D-prompt');
    var promptTpl = dialog.tpl.prompt;
    var opt = utils.extend(dialog.config.prompt, param);
    dialog.createMask();

    function rmPrompt() {
        dialog.removeMask();
        document.body.removeChild(promptEle);
    }
    if (promptEle) {
        rmPrompt();
    }
    promptEle = dialog.createBox();
    promptEle.id = "D-prompt";
    promptEle.innerHTML = utils.render(promptTpl, opt);
    document.body.appendChild(promptEle);
    utils.setEvent(promptEle.querySelector('#D-prompt-y'), 'click', function(e) {
        e.stopPropagation();
        rmPrompt();
        var val = promptEle.querySelectorAll('.d-dialog-input')[0].value;
        opt.fnY(val);
    });
    utils.setEvent(promptEle.querySelector('#D-prompt-n'), 'click', function(e) {
        e.stopPropagation();
        rmPrompt();
        opt.fnN();
    });
};
D.notify = function(con, param) {
    var utils = this.utils;
    var dialog = D.dialog;
    var notifyEle = document.querySelector('#D-notify');
    var notifyTpl = dialog.tpl.notify;
    var opt = utils.extend(dialog.config.notify, param);
    opt.content = con;
    if (!notifyEle) {
        notifyEle = opt.operate ? document.createElement('div') : dialog.createBox();
        notifyEle.id = 'D-notify';
        notifyEle.innerHTML = utils.render(notifyTpl, opt);
        document.body.appendChild(notifyEle);
    } else {
        notifyEle.className = opt.operate ? 'd-show' : 'd-dialog-box d-show';
        notifyEle.querySelectorAll('.d-notify-con')[0].innerHTML = con;
    }
    opt.fn();
    if (opt.autoRm) {
        clearTimeout(D.dialog.notifyTimer);
        D.dialog.notifyTimer = setTimeout(function() {
            notifyEle.className = opt.operate ? 'd-hide' : 'd-dialog-box d-hide';
        }, opt.rmTime);
    }
};
D.rmNotify = function() {
    var notifyEle = document.querySelector('#D-notify');
    if (!notifyEle) {
        return false
    }
    clearTimeout(D.dialog.notifyTimer);
    notifyEle.className = 'd-dialog-box d-hide';
}
D.utils = { //工具类
    version: '1.0.0',
    parent: this,
    arrUniq: function(arr) { //数组去重
        var n = []; //一个新的临时数组
        for (var i = 0; i < arr.length; i++) //遍历当前数组
        {
            //如果当前数组的第i已经保存进了临时数组，那么跳过，
            //否则把当前项push到临时数组里面
            if (n.indexOf(arr[i]) == -1) n.push(arr[i]);
        }
        return n;
    },
    setTitle(t) {
        var _this = this;
        var $body = $('body');
        document.title = t;
        if (_this.browserVer.weixin) {
            var $iframe = $('<iframe src="/favicon.ico" style="display:none"></iframe>').on('load', function() {
                setTimeout(function() {
                    $iframe.off('load').remove();
                }, 0);
            }).appendTo($body);
        }
    },
    byteConvert: function(bytes) {
        if (bytes < 1000) return bytes + 'B';
        var k = 1000, // 1024
            sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    },
    viewUploadImage: function(inputEle, imgCell) {
        /**
         * @description ['实时预览上传的图片,支持流行浏览器']
         * @param {[domcumentElement,domcumentElement]} [inputEle, imgCell] ['上传图片的input','放预览图的img标签']
         */
        // 检查图片格式
        var f = inputEle.value;
        if (!/\.(gif|jpg|jpeg|png|GIF|JPG|JPEG|PNG)$/.test(f)) {
            D.notify('图片格式不正确');
            imgCell.src = '';
            return false;
        }
        window.URL = window.URL || window.webkitURL;
        var files = inputEle.files;
        if (files[0].size > (3 * 1024 * 1024)) {
            imgCell.src = '';
            D.notify('图片大小不得超过3M');
            return false;
        };
        imgCell.src = window.URL.createObjectURL(files[0]);
        return true;
    },
    createStyle: function(str) { //异步append style标签
        /**
         * @param {[string,function]} [url, callback] [css的路径,回调函数]
         */
        var doc = document,
            head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement,
            node = doc.createElement("style");
        node.innerHTML = str;
        node.type = "text/css";
        head.appendChild(node);
    },
    loadCss: function(url, callback) { //异步加载css样式
        /**
         * @param {[string,function]} [url, callback] [css的路径,回调函数]
         */
        var doc = document,
            head = doc.head || doc.getElementsByTagName("head")[0] || doc.documentElement,
            baseElement = head.getElementsByTagName("base")[0],
            node = doc.createElement("link"),
            supportOnload = "onload" in node;

        if (supportOnload) {
            node.onload = onload;
            node.onerror = function() {
                onload('error');
            };
        } else {
            node.onreadystatechange = function() {
                if (/loaded|complete/.test(node.readyState)) {
                    onload();
                }
            };
        }
        node.rel = "stylesheet";
        node.href = url;
        baseElement ? head.insertBefore(node, baseElement) : head.appendChild(node);

        function onload(error) {
            node.onload = node.onerror = node.onreadystatechange = null;
            node = null;
            callback && callback(error);
        };
    },
    timeFormat: function(sTamp) {
        var seconds = parseInt(sTamp / 1000);
        var s, m, h, d;
        if (seconds <= 0) {
            return {
                seconds: 0,
                d: '00',
                h: '00',
                m: '00',
                s: '00',
            }
        }
        d = parseInt(seconds / (24 * 60 * 60));
        h = d > 0 ? parseInt(seconds / (60 * 60) % 24) : parseInt(seconds / (60 * 60));
        m = h > 0 || d > 0 ? parseInt(seconds / 60 % 60) : parseInt(seconds / 60);
        s = m > 0 || h > 0 || d > 0 ? parseInt(seconds % 60) : seconds;
        return {
            seconds: seconds,
            d: d >= 10 ? d : '0' + d,
            h: h >= 10 ? h : '0' + h,
            m: m >= 10 ? m : '0' + m,
            s: s >= 10 ? s : '0' + s,
        }
    },
    dateFormat: function(timestamp, format) {
        var date = new Date(parseInt(timestamp, 10)),
            o = {
                "M+": date.getMonth() + 1,
                "d+": date.getDate(),
                "h+": date.getHours(),
                "m+": date.getMinutes(),
                "s+": date.getSeconds(),
                "q+": Math.floor((date.getMonth() + 3) / 3),
                "S": date.getMilliseconds()
            };

        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },
    indexOfArr: function(val, arr) {
        var order = -1;
        arr.forEach(function(itm, index) {
            if (val === itm) {
                order = index;
            }
        });
        return order;
    },
    getWeek: function(timestamp) {
        var val = '星期日'
        console.warn(new Date(timestamp).getDay());
        switch (new Date(timestamp).getDay()) {
            case 0:
                val = '星期日';
                break;
            case 1:
                val = '星期一';
                break;
            case 2:
                val = '星期二';
                break;
            case 3:
                val = '星期三';
                break;
            case 4:
                val = '星期四';
                break;
            case 5:
                val = '星期五';
                break;
            case 6:
                val = '星期六';
                break;
        }
        return val;
    },
    extend: function(obj1, obj2) { //浅度合并obj1，obj2并返回新对象
        var obj = {};
        var o1 = obj1;
        var o2 = this.clone(obj2);
        for (var prop in o1) {
            if (o2.hasOwnProperty(prop)) {
                obj[prop] = o2[prop];
                delete o2[prop];
            } else {
                obj[prop] = o1[prop];
            }
        }
        for (var prop in o2) {
            obj[prop] = o2[prop];
        }
        return obj;
    },
    clone: function(obj) { //返回一个克隆的对象  
        var newObj = {};
        for (var prop in obj) {
            newObj[prop] = obj[prop];
        }
        return newObj;
    },
    render: function(str, data) {
        if (!str || !data) {
            return '';
        }
        return (new Function("obj",
            "var p=[];" +
            "with(obj){p.push('" +
            str
            .replace(/[\r\t\n]/g, " ")
            .replace(/\'/g, "\"")
            .split("<&").join("\t")
            .replace(/((^|&>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)&>/g, "',$1,'")
            .split("\t").join("');")
            .split("&>").join("p.push('")
            .split("\r").join("\\'") + "');}return p.join('');"))(data);
    },
    getRequest: function(params) {
        /**
         * 
         * @param  {params} [传入参数序列,如:name=ddd&age=24&sex=1,默认window.location.search.replace('?', '');]
         * @return {[array]}  [返回一个参数数组]
         */
        if (!params) {
            params = window.location.search.replace('?', '');
        }
        var url = params; //获取url中"?"符后的字串
        var theRequest = new Object();
        var str = url;
        if (str.indexOf("&") != -1) {
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].replace(strs[i].split("=")[0] + '=', ''));
            }
        } else {
            var key = str.substring(0, str.indexOf("="));
            var value = str.substr(str.indexOf("=") + 1);
            theRequest[key] = decodeURI(value);
        }
        return theRequest;
    },
    setEvent: function(ele, eName, handler, useCapture) {
        /**
         * @description ['绑定浏览器事件']
         * @param {object,string,function,boolean} [ele,eName,handler,useCapture] [dom对象,事件名,事件处理函数,是否冒泡(默认是false)]
         * 
         */
        if (!useCapture) {
            var useCapture = false;
        }
        if (window.addEventListener) {
            ele.addEventListener(eName, handler, useCapture);
        } else if (window.attachEvent) {
            ele.attachEvent('on' + eName, handler);
        } else {
            console.log('无法绑定事件');
        }
    },
    delEvent: function(ele, eName, handler, useCapture) {
        /**
         * @description ['解绑浏览器事件']
         * @param {object,string,function} [ele,eName,handler] [dom对象,事件名,去除的事件处理函数]
         * 
         */
        if (window.removeEventListener) {
            ele.removeEventListener(eName, handler, useCapture);
        } else if (window.attachEvent) {
            ele.detachEvent('on' + eName, handler);
        } else {
            console.log('无法解绑事件');
        }
    },
    browserVer: (function() {
        var u = navigator.userAgent;
        return { //移动终端浏览器版本信息
            chrome: u.indexOf('Chrome') > -1,
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webkit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') === -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //is weixin browser
            info: u //返回完整的userAgent信息
        };
    })(),
    supportCss3: function(style) { //是否支持某css3特性,如transform,box-shadow
        var prefix = ['webkit', 'Moz', 'ms', 'o'],
            i,
            humpString = [],
            htmlStyle = document.documentElement.style,
            _toHumb = function(string) {
                return string.replace(/-(\w)/g, function($0, $1) {
                    return $1.toUpperCase();
                });
            };
        for (i in prefix) {
            humpString.push(_toHumb(prefix[i] + '-' + style));
        }
        humpString.push(_toHumb(style));
        for (i in humpString) {
            if (humpString[i] in htmlStyle) {
                return true;
            }
        }
        return false;
    },
    //设置cookies
    setCookie: function(name, value, t) {
        var Days = 7;
        var exp = new Date();
        if (!t) {
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        } else {
            exp.setTime(t);
        }
        document.cookie = name + "=" + escape(value) + ";path=/;expires=" + exp.toGMTString();
    },
    //读取cookies
    getCookie: function(name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return (arr[2]);
        else
            return null;
    },
    sendXhr: function(obj, cb, errorCb) { //依赖于zepto,
        var timer;
        var ajaxOpt = $.extend({
            timeout: 1000 * 60,
            preCode: true,
            hasBefore: true,
            url: '/',
            type: 'GET',
            dataType: 'json',
            jsonp: null,
            data: {}
        }, obj);
        return $.ajax($.extend(ajaxOpt, {
            beforeSend: function(xhr) {
                if (ajaxOpt.hasBefore) {
                    D.notify('loading', { autoRm: false, operate: false })
                }
            },
            error: function(xhr, type) {
                //clearTimeout(timer);
                D.rmNotify();
                console.warn('json error');
                if (errorCb) { errorCb() } else {
                    D.alert('服务器异常！')
                }
            },
            success: function(data, status, xhr) {
                //clearTimeout(timer);
                D.rmNotify();
                if (cb) { cb(data) };
            },
            complete: function(XMLHttpRequest, status) { //请求完成后最终执行参数
                //clearTimeout(timer);
                　　　　
                if (status == 'timeout') { //超时,status还有success,error等值的情况
                    　　　　　 D.alert("请求超时");　　　　 }　　
            }
        }));


    }
};
if (typeof define === "function" && define.amd) {
    define("D", [], function() {
        return D;
    });
} else {
    window.D = D;
}