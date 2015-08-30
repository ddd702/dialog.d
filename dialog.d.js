/**
 * 
 * @author ddd
 * @version 1.0.0 beta
 * @githud https://github.com/ddd702/dialog.d
 * @created 2015.8.30
 * 
 */
(function() {
    var root = typeof self === 'object' && self.self === self && self ||
        typeof global === 'object' && global.global === global && global ||
        this;
    root.D = {}; //在根对象下创建D
    D.opts = {
        dialogStyle: 'body{background:#333}'
    };
    D.dialog = {
        init: function() { //要使用alert,comfirm等dialog时要调用init
            D.utils.createStyle(D.opts.dialogStyle);
        },
        createMask: function() { //创建遮罩
            var maskEle = document.querySelector('#D-mask');
            if (!maskEle) {
                maskEle = document.createElement('div');
                maskEle.className = 'd-dialog-mask';
                maskEle.id = 'D-mask';
                document.body.appendChild(maskEle);
            } else {
                maskEle.className='d-dialog-mask d-visible';
            }
        }
    };
    D.alert = function(t,con,animateClass) {
        var utils = this.utils;
        var dialog=D.dialog;
        dialog.createMask();
        var alertEle = document.querySelector('#D-alert');
        if (!animateClass) {//如果不传动画类
        	var animateClass='';
        }
        if (!alertEle) {
	        alertEle = document.createElement('div');
	        alertEle.className = 'd-dialog-box';
	        alertEle.id = 'D-alert';
	        alertEle.innerHTML='<p class="d-dialog-title">'+t+'</p><p class="d-dialog-con">'+con+'</p>';
	        document.body.appendChild(alertEle);
    	}else{
    		alertEle.className='d-dialog-mask d-visible'+animateClass;
    	}
        

    };
    D.utils = { //工具类
        version: '1.0.0',
        parent: this,
        render:function(tmpl,data){//简单的渲染template模块的函数
        	var 
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
        getRequest: function(params) {
            if (typeof params === undefined || params === null || typeof window === 'object') { //在浏览器端默认是？后面的参数
                params = window.location.search.replace('?', '');
            }
            var url = params; //获取url中"?"符后的字串
            var theRequest = new Object();
            var str = url;
            if (str.indexOf("&") != -1) {
                strs = str.split("&");
                for (var i = 0; i < strs.length; i++) {
                    theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
                }
            } else {
                var key = str.substring(0, str.indexOf("="));
                var value = str.substr(str.indexOf("=") + 1);
                theRequest[key] = decodeURI(value);
            }
            return theRequest;
        },
        browserVer: (function() {
            var u = navigator.userAgent;
            return { //移动终端浏览器版本信息
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
        setTitle: function(t) { //ios微信中document.title失效的bug
            var _this = this;
            var $body = $('body');
            document.title = t;
            if (_this.browserVer.ios) {
                var $iframe = $('<iframe src="/favicon.ico" style="display:none"></iframe>').on('load', function() {
                    setTimeout(function() {
                        $iframe.off('load').remove();
                    }, 0);
                }).appendTo($body);
            }
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
        }

    };
}());
