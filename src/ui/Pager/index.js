/*!
 * 文件描述
 * @author ydr.me
 * @create 2014-12-17 21:49
 */


define(function (require, exports, module) {
    /**
     * @module parent/index
     */
    'use strict';

    var generator = require('../generator.js');
    var selector = require('../../core/dom/selector.js');
    var modification = require('../../core/dom/modification.js');
    var attribute = require('../../core/dom/attribute.js');
    var event = require('../../core/event/touch.js');
    var dato = require('../../util/dato.js');
    var Template = require('../../libs/Template.js');
    var template = require('html!./template.html');
    var style = require('css!./style.css');
    var tpl = new Template(template);
    var defaults = {
        // 默认为第 1 页
        page: 1,
        // 最大精确正整数，2^53
        max: 9007199254740991
    };
    var alienClass = 'alien-ui-pager';
    var Pager = generator({
        STATIC: {},
        constructor: function ($parent, options) {
            var the = this;

            the._$ele = selector.query($parent);

            if (!the._$ele.length) {
                throw new Error('instance element is empty');
            }

            the._$ele = the._$ele[0];
            the._options = dato.extend(true, {}, defaults, options);
            the._init();
        },

        _init: function () {
            var the = this;

            the.page = null;
            the._initEvent();
        },


        _initEvent: function () {
            var the = this;

            event.on(the._$ele, 'click tap', '.' + alienClass + '-page', the._onpage.bind(the));
        },


        _onpage: function (eve) {
            var the = this;
            var page = attribute.data(eve.target, 'page');

            page = dato.parseInt(page, 1);

            if (page !== the.page) {
                the.page = page;
                the.emit('page', the.page);
            }
        },


        /**
         * 渲染分页
         * @param data {Object} 分页数据
         * @param data.page {Number} 页码
         * @param [data.max] {Number} 最大页码
         */
        render: function (data) {
            var the = this;
            var html = tpl.render(dato.extend(the._options, data));

            the._$ele.innerHTML = html;
        },


        /**
         * 销毁实例
         */
        destroy: function () {
            var the = this;

            event.un(the._$ele, 'click tap', the._onpage);
            the._$ele.innerHTML = '';
        }
    });

    modification.importStyle(style);
    module.exports = Pager;
});