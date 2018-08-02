/**
 * Created by cdxiaqing1 on 2015/12/23.
 */
/**
 * Created by cdxiaqing1 on 2015/9/1.
 * common ajax
 */

$(function () {
    $('input[name="customerCode"]').hide();
    /**
     * 请求ajax地址
     */
    var urls = {
        //地区级联
        areaUrl: '/area/list.htm'
    };
    /**
     * ajax回调函数
     */
    var callbacks = {
        //搜索回调
        searchCallback: function (data) {
            $('.data-return').html(data);
        },
        //地区选择回调
        areaCallback: function (data) {
            var city_json = {};
            var temp_html = '<option selected disabled value=\'\' class=\'hide\'>--请选择--</option>';
            var node = $(this).attr('class') == 'prov' ? $('.city') : $('.dist');
            if (data.result == true) {
                city_json = data.messages.arealist;
                if (city_json && city_json.length > 0) {
                    node.removeClass('hide');
                    $.each(city_json, function (i, obj) {
                        temp_html += '<option value=' + obj.areaName + ' data-area-id=' + obj.areaId + ' data-level=' + obj.level + '>' + obj.areaName + '</option>';
                    });
                    node.html(temp_html);
                } else {
                    node.addClass('hide');
                }
            }
        }

    };
    //门店限制

    var shopInfo = {

        init: function () {
            this.btn = $('.show_btn');
            this.shopInfoTd = $('.line_permit');
            this.tdLineHeighgt = this.shopInfoTd.css('lineHeight');
            this.tdHeighgt = this.shopInfoTd.height();
            this.tdHeighgt_4 = parseInt(this.tdLineHeighgt) * 4;
            this.styleShowType = false;
            if (parseInt(this.tdHeighgt) > parseInt(this.tdHeighgt_4)) {
                this.shopInfoTd.css('height', '100px');
                this.btn.show();
            } else {
                this.shopInfoTd.css('height', 'auto');
                this.btn.remove();
            }
        },
        buttonBind: function () {
            var _this = this;
            this.btn.click(function () {
                _this.shopInfoTd.css({
                    'height': 'auto'
                });
                _this.btn.remove();
            });
        }

        /**
         * 搜索数据拼装
         */
    };var indexRankFn = function (node) {
        var userJson = {};
        node.find('input').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = $(this).attr('name');
                var searchVal = $(this).val();
                userJson[searchKey] = searchVal;
            }
        });
        return userJson;
    };

    /**
     *
     * 配置地区级联，一页只能有一个地区级联选项，若有多个，使用ID进行配置
     * 使用格式
     * <div class="address_select inline">
     *     <select class="prov" name="prov"></select>
     *     <select class="city" name="city"></select>
     *     <select class="dist" name="dist"></select>
     * </div>
     */
    $('.prov').on('change', function () {
        var self = $(this);
        $('.city').addClass('hide');
        $('.dist').addClass('hide');
        var id = $(this).find('option:selected').attr('data-area-id');
        var level = parseInt($(this).find('option:selected').attr('data-level')) + 1;
        userJson = {
            parentId: id,
            level: level
        };
        self.packajax({
            ajax_url: urls.areaUrl,
            user: userJson,
            succ: function (data) {
                callbacks.areaCallback.call(self, data);
            }

        });
    });
    $('.city').on('change', function () {
        $('.dist').addClass('hide');
        var id = $(this).find('option:selected').attr('data-area-id');
        var level = parseInt($(this).find('option:selected').attr('data-level')) + 1;
        userJson = {
            id: id,
            level: level
        };
        $(this).packajax({
            ajax_url: urls.areaUrl,
            user: userJson,
            succ: function (data) {
                callbacks.areaCallback.call(self, data);
            }
        });
    });

    shopInfo.init();
    shopInfo.buttonBind();
});

/**
 * Created by cdxiaqing1 on 2015/12/23.
 */
$(function () {
    /**
     * 请求ajax地址
     */
    var urls = {
        JAVASCRIPT: 'javascript:;',
        //运营-批量导出
        exportMerchantDateUrl: '/purchase/merchant/exportData.htm',
        merchantPurchaseQueryUrl: '/purchase/merchant/query.htm'

    };
    /**
     * ajax回调函数
     */
    var callbacks = {
        //入驻提交信息回调
        userInfoCallback: function (data) {
            if (data.result) {
                window.location.href = data.messages.url;
            } else {
                console.log(data.messages);
            }
        },
        //个人信息提交信息回调
        venderInfoCallback: function (data) {
            if (data.result) {
                alert('保存成功');
            } else {
                alert('保存失败');
            }
        },
        //搜索回调
        searchCallback: function (data) {
            $('.data-return').html(data);
        },
        //data-return被占用时的回调
        forDataCallback: function (data) {
            $('.data-return-dup').html(data);
        },
        //触发弹窗
        showPopupCallback: function (data) {
            $('.popup').html(data.messages.popup).show();
        },
        //首次触发弹窗回调确定后刷新页面
        onPopupReload: function (data) {
            var self = $(this);
            if (data.result) {
                var thisPopup = self.parents('.popup');
                thisPopup.hide();
                window.location.reload();
            }
        },
        // 二次触发弹窗回调 1为点击确定后刷新页面的回调函数
        onPopupCallback1: function (data) {
            var self = $(this);
            if (data.result) {
                //更新弹窗内容
                var thisPopup = self.parents('.popup');
                thisPopup.html(data.messages.popup);
                thisPopup.delegate('.med2btn', 'click', function () {
                    thisPopup.hide();
                    window.location.reload();
                });
            } else {
                var thisPopup = self.parents('.popup');
                thisPopup.html(data.messages.popup);
                thisPopup.delegate('.med2btn', 'click', function () {
                    thisPopup.hide();
                    window.location.reload();
                });
                console.log(data.messages.msg);
            }
        },
        // 二次触发弹窗回调 2为点击确定后跳转返回url的回调函数
        onPopupCallback2: function (data) {
            var self = $(this);
            if (data.result) {
                //更新弹窗内容
                var thisPopup = self.parents('.popup');
                thisPopup.html(data.messages.popup);
                thisPopup.delegate('.med2btn', 'click', function () {
                    thisPopup.hide();
                    window.location.href = data.messages, url;
                });
            } else {
                console.log(data.messages.msg);
            }
        }

    };

    /**
     * 搜索数据拼装
     * orderState：tab_card状态数据
     * userJson:ajaxUpload接收数据，obj
     */
    var searchKeyFn = function (node) {
        var searchItem = node.parents('.wrapper').find('.filter_search');
        var tabItem = searchItem.parents('.wrapper').find('.tab_card');
        //var userJson={};
        //var state = tabItem.attr('name');
        //var sValue = tabItem.find('.current').attr('value');
        ////写入tab card数据
        //userJson[state]=sValue;
        //写入input数据
        searchItem.find('input').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = self.attr('name');
                var searchVal = self.val();
                userJson[searchKey] = searchVal;
            }
        });
        //写入selcet数据
        searchItem.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = self.data();
                for (var i in searchKey) {
                    userJson[i] = searchKey[i];
                }
            }
        });
        return userJson;
    };
    var indexRankFn = function (node) {
        var userJson = {};
        node.find('input').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = $(this).attr('name');
                var searchVal = $(this).val();
                userJson[searchKey] = searchVal;
            }
        });
        return userJson;
    };
    /**
     * tap card 数据拼装
     */
    var tabKeyFn = function (node) {
        var self = node;
        var userJson = {};
        var state = self.parents('.tab_card').attr('name');
        var sValue = self.attr('value');
        var sData = self.parents('.tab_card').data();
        userJson = searchKeyFn(node.parents('.wrapper').find('.search_btn'));
        userJson = sData;
        userJson[state] = sValue;
        return userJson;
    };

    var pageKetFn = function (node) {
        var self = node;
        var userJson = {};
        var state = self.parents('.tab_card').attr('name');
        var sValue = self.attr('value');
        userJson = searchKeyFn(node.parents('.wrapper').find('.search_btn'));
        userJson[state] = sValue;
        return userJson;
    };
    /**
     * 行间按钮data传递
     */
    var dataItemFn = function (node) {
        var dataItem = null;

        if (node.parents('tr').length != 0) {
            dataItem = node.parents('tr').data();
        } else if (node.parents('li').length != 0) {
            dataItem = node.parents('li').data();
        }
        if (dataItem) {
            return dataItem;
        }
    };
    /**
     * 单页按钮data传递，例如出库/批量出库页 出库按钮
     */
    var pageDataFn = function (node) {
        var userJson = {};
        var dataItem = {};
        var userArray = [];
        var dataKey = null;
        var dataVal = null;
        thisNode = node.parents('.main_content');
        var beChecked = thisNode.find('.shop_table_list').find('tr');
        if (beChecked.length != 0) {
            $.each(beChecked, function (i) {
                userJson = beChecked.eq(i).data('ids');
                if (userJson) {
                    userArray.push(userJson);
                }
            });
            dataVal = userArray.join(',');
            dataKey = 'ids';
            dataItem[dataKey] = dataVal;
        }
        thisNode.find('input[type=text]').each(function () {
            dataKey = thisNode.find('input[type=text]').attr('name');
            dataVal = thisNode.find('input[type=text]').val();
            dataItem[dataKey] = dataVal;
        });
        thisNode.find('textarea').each(function () {
            dataKey = thisNode.find('textarea').attr('name');
            dataVal = thisNode.find('textarea').val();
            dataItem[dataKey] = dataVal;
        });
        thisNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });

        return dataItem;
    };
    /**
     * popup内按钮data传递
     */
    var popupTxtFn = function (node) {
        var popupNode = node.parents('.popup');
        var dataKey = null;
        var dataVal = null;
        var dataValArr = [];
        var dataItem = node.data();
        popupNode.find('input[type=text]').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        popupNode.find('input[type=checkbox]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataValArr.push(dataVal);
            dataItem[dataKey] = dataValArr.join(',');
        });
        popupNode.find('input[type=radio]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataItem[dataKey] = dataVal;
        });
        popupNode.find('textarea').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        popupNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });
        return dataItem;
    };
    /**
     * 批量（导出，出库）传递data
     * data-ids 字段不可变
     */
    var batchDataFn = function (node) {
        var userJson;
        var userArray = [];
        var beChecked = node.parents('.tab_card,.account_detail_part').siblings('.data-return').find('.shop_table_list').find('input[type=checkbox]:checked');
        $.each(beChecked, function (i) {
            userJson = beChecked.eq(i).parents('tr').data('ids');
            if (userJson) {
                userArray.push(userJson);
            }
        });
        return userArray;
    };

    /**
     * 批量传递data 优化版
     * 字段可变,行间可传递input、select
     * @param node
     * @returns {Array}
     */
    var batchDataFn2 = function (node) {
        var userTr = null;
        var userInput = null;
        var eachUserJson = null;
        var userJson = null;
        var userArray = [];
        var beChecked = node.parents('.tab_card,.account_detail_part').siblings('.data-return').find('.shop_table_list').find('input[type=checkbox]:checked:not(".check_all")');
        $.each(beChecked, function (i) {
            eachUserJson = {};
            userTr = beChecked.eq(i).parents('tr').data();
            userInput = beChecked.eq(i).parents('tr').find('select').find('option:selected').data();
            for (var j in userTr) {
                eachUserJson[j] = userTr[j];
            }
            for (var k in userInput) {
                eachUserJson[k] = userInput[k];
            }
            userArray.push(eachUserJson);
        });

        return userArray;
    };

    /**
     * 除popup之外的“保存”传参
     * @param node
     * @returns {*}
     */
    var saveTxtFn = function (node, parentCard) {
        var parentNode = parentCard;
        var dataKey = null;
        var dataVal = null;
        var dataValArr = [];
        var dataItem = node.data();
        parentNode.find('input[type=text]').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('input[type=checkbox]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataValArr.push(dataVal);
            dataItem[dataKey] = dataValArr.join(',');
        });
        parentNode.find('input[type=radio]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('textarea').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });
        return dataItem;
    };

    /**
     * 此方法用于行间的编辑按钮调用
     * node:点击调用此方法的按钮dom元素
     * @param node
     */
    var toEditFn = function (node) {
        var editArea = node.parents('tr').find('.toEdit');
        editArea.each(function () {
            var $this = $(this);
            var nowVal = null;
            var editKind = $this.data('edit');
            switch (editKind) {
                case 'input':
                    nowVal = $this.text();
                    $this.removeClass('toEdit').addClass('beEditing').html('<input type="text" value="' + nowVal + '">');
                    break;
                case 'select':
                    nowVal = $this.data('this');
                    var optionList = $this.data('select').split(',');
                    var valueList = $this.data('value').split(',');
                    var temHtml = '<select>';
                    for (var i in optionList) {
                        temHtml += '<option value="' + valueList[i] + '"data-show=' + optionList[i] + '>' + optionList[i] + '</option>';
                    }
                    temHtml += '</select>';
                    $this.removeClass('toEdit').addClass('beEditing').html(temHtml).find('select').val(nowVal);
                    break;
                default:
                    break;
            }
        });
    };

    /**
     * 此方法用于行间的编辑按钮保存使用
     * @param node 点击调用此方法的dom元素
     * @param isAjax 是否需要发请求保存 true/false
     * @param url  保存请求地址 '字符串'
     * @param userJson 保存请求所需参数 json
     * @param succ 保存成功后的回调
     */
    var toSaveFn = function (node, isAjax, url, userJson, succ) {
        var editingArea = node.parents('tr').find('.beEditing');
        editingArea.each(function () {
            var $this = $(this);
            var nowShow = null;
            var thisVal = null;
            var editKind = $this.data('edit');
            switch (editKind) {
                case 'input':
                    nowShow = $this.find('input').val();
                    $this.html(nowShow).removeClass('beEditing').addClass('toEdit');
                    break;
                case 'select':
                    nowShow = $this.find('option:selected').data('show');
                    thisVal = $this.find('option:selected').val();
                    $this.html(nowShow).data('this', thisVal).removeClass('beEditing').addClass('toEdit');
                    break;
                default:
                    break;
            }
        });
        if (isAjax) {
            node.packajax({
                ajax_url: url,
                user: userJson,
                succ: succ
            });
        }
    };
    /**
     * 全局变量，用于复制粘贴
     * @type {Array}
     */
    var inputList = [];
    /**
     *  此方法用于行间的复制按钮保存使用
     * @param node 点击调用此方法的dom元素
     * @param copyType 获取值的方式，字符串，beTxt/beVal
     */
    var toCopyFn = function (node, copyType) {
        inputList = [];
        if (copyType == 'beTxt') {
            node.parents('tr').find('td[data-edit]').each(function () {
                inputList.push($(this).text());
            });
        } else if (copyType == 'beVal') {
            node.parents('tr').find('td[data-edit]').each(function () {
                inputList.push($(this).find('input').val());
            });
        }
    };
    /**
     * 此方法用于行间的黏贴按钮保存使用
     * @param node 点击调用此方法的dom元素
     */
    var toPasteFn = function (node) {
        console.log(inputList);
        node.parents('tr').find('td[data-edit]').each(function (i) {
            $(this).find('input').val(inputList[i]);
        });
    };

    /**
     *  单一按钮传参,需要将按钮本身和父级dom传进来
     * @param node 点击调用此方法的dom元素
     * @param parentNode 内含input，select，textarea的父级dom节点
     * @returns {*}
     */
    var singleBtnFn = function (node, parentNode) {
        var dataItem = node.data();
        parentNode.find('textarea').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('input[type=text]').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('input[type=checkbox]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataValArr.push(dataVal);
            dataItem[dataKey] = dataValArr.join(',');
        });
        parentNode.find('input[type=radio]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });
        return dataItem;
    };

    /********************************调用函数的分割线*************************************************/

    //运营-采购单管理-搜索按钮
    $('#merchantSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.merchantPurchaseQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //运营-采购模块-采购单切换-tab_card
    $('#merchantTabBtn ul li').on('click', function () {
        var self = $(this);
        var userJson = tabKeyFn(self);
        self.packajax({
            ajax_url: urls.merchantPurchaseQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //采购单查询
    $('.wrapper').delegate('#pageIndexMerchantPurchase .smallbtn', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        userJson[index] = self.siblings('.page_skip').find('input').val();
        self.packajax({
            ajax_url: urls.merchantPurchaseQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //采购单查询
    $('.wrapper').delegate('#pageIndexMerchantPurchase ul li.pageNum', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        userJson[index] = self.text();
        self.packajax({
            ajax_url: urls.merchantPurchaseQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //采购单查询-上一页
    $('.wrapper').delegate('#pageIndexMerchantPurchase ul li.frontPage', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        userJson[index] = parseInt(self.parents('ul').find('.current').text()) - 1;
        self.parents('ul').find('.current').removeClass('current');
        self.parents('#pageIndexMerchantPurchase').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: urls.merchantPurchaseQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //采购单查询-下一页
    $('.wrapper').delegate('#pageIndexMerchantPurchase ul li.nextPage', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        userJson[index] = parseInt(self.parents('ul').find('.current').text()) + 1;
        self.parents('ul').find('.current').removeClass('current');
        self.parents('#pageIndexMerchantPurchase').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: urls.merchantPurchaseQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //采购管理-批量出库
    $('.tab_card').delegate('#exportMerchantDate', 'click', function () {
        var self = $(this);
        var userArray = batchDataFn(self);
        var ids = userArray.join(',');
        if (ids.length > 0) {
            window.location.href = urls.exportMerchantDateUrl + '?purchaseIds=' + ids;
        } else {
            alert('请选择要导出的数据');
        }
    });
});

/**
 * Created by cdxiaqing1 on 2015/12/23.
 */
/**
 * Created by cdxiaqing1 on 2015/8/18.
 * pop ajax
 */
$(function () {
    /**
     * 请求ajax地址
     */
    var urls = {
        JAVASCRIPT: 'javascript:;',

        //商品管理
        myProductLibUrl: 'indexRank.html',
        myProductSKULibUrl: 'wareSkuSearchRank.html',
        editPageUrl: 'edit.html',

        productUpShelfUrl: 'shelf.html?status=2',
        productDownShelfUrl: 'shelf.html?status=3',
        batchIngressShelfUrl: '/vender/b/product/shelf.htm',
        importUpShelfUrl: '/vender/b/product/importUpShelf',
        importDownShelfUrl: '/vender/b/product/importDownShelf',
        editAreaCatUrl: 'editAreaCat.html',
        itemDelUrl: '/vender/b/product/delete.htm',
        areaDelUrl: '/vender/b/product/deleteLimit',
        //商品区域价查询、保存
        areaPriceSearchUrl: '/vender/b/product/areaPriceRank.htm',
        areaPriceSaveUrl: '/vender/b/product/areaPriceRank.htm',
        //协议价查询、删除和修改
        agreementPriceSearchUrl: '/vender/b/product/discountBank.htm',
        agreementPriceDeleteUrl: '/vender/b/product/delete.htm',
        agreementPriceDModifyUrl: '/vender/b/product/modify.htm',
        agreementPriceUpdataUrl: '/vender/b/product/updateAreaPrice.htm',
        //结算统计
        settleAccountSearchUrl: '/vender/b/stat/indexRank.htm',
        //入驻提交用户信息
        //userInfoUrl:'/join/submitInfo.htm',
        //userInfoUrl:'/join/submitInfo.htm'
        //渠道管理-账期维护
        channelSetAccount: '/这里写URL',
        //账期管理
        standingBookSearch: '/vender/b/account/query.htm',
        scopeSearch: '/vender/b/account/scopequery.htm',
        paymentSearch: '/vender/b/account/paymentquery.htm',

        //渠道管理--经销商列表--经销商列表搜索
        bSellerManageSellersUrl: '/vender/b/channel/merchant/b_seller_manage/indexQuery.html',
        //渠道管理--经销商列表--查看--启用经销商
        bSellerManageDetailUserStatusOnUrl: '/vender/b/channel/merchant/b_seller_manage/statusOn.html',
        //渠道管理--经销商列表--查看--禁用经销商
        bSellerManageDetailUserStatusOffUrl: '/vender/b/channel/merchant/b_seller_manage/statusOff.html',
        //渠道管理--经销商列表--账期维护--保存账期
        bSellerManageSaveAccountUrl: '/vender/b/channel/merchant/b_seller_manage/saveAccount.html',
        //渠道管理--首营认证--首营认证列表搜索
        bSellerFirstSearchUrl: '/vender/b/channel/merchant/b_seller_first/indexQuery.html',
        //渠道管理--首营认证--编辑审核--审核通过
        bSellerManageDetailAuditPassUrl: '/vender/b/channel/merchant/b_seller_first/auditPass.html',
        //渠道管理--首营认证--编辑审核--进入驳回资质页面
        bSellerManageDetailToAuditDenyUrl: '/vender/b/channel/merchant/b_seller_first/toAuditDeny.html',
        //渠道管理--首营认证--编辑审核--驳回资质
        bSellerManageDetailAuditDenyUrl: '/vender/b/channel/merchant/b_seller_first/auditDeny.html',
        //渠道管理--采购目录维护--经销商列表搜索
        bSellerWareRelationshipSellersSearchUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/indexQuery.html',
        //渠道管理--采购目录维护--编辑商品--搜索列表
        bSellerWareRelationshipEditBtnUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/editQuery.html',
        //渠道管理--采购目录维护--编辑商品--单个删除商品
        bSellerWareRelationshipSingleDeleteUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/singleDelete.html',
        //渠道管理--采购目录维护--编辑商品--批量删除商品
        bSellerWareRelationshipBatchDeleteUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/batchDelete.html',
        //渠道管理--采购目录维护--编辑商品--编辑商品后保存
        bSellerWareRelationshipUpdateUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/update.html',
        //渠道管理--采购目录维护--导入新商品--搜索列表
        bSellerWareRelationshipAddSearchBtnUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/addQuery.html',
        //渠道管理--采购目录维护--导入新商品--单个导入商品
        bSellerWareRelationshipSingleSaveUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/singleSave.html',
        //渠道管理--采购目录维护--导入新商品--批量导入商品
        bSellerWareRelationshipBatchSaveUrl: '/vender/b/channel/merchant/b_seller_ware_relationship/batchSave.html',
        //渠道管理--会员等级--搜索
        bSellerCategoryIndexQueryUrl: '/vender/b/channel/merchant/b_seller_category/indexQuery.html',

        //采购单模块
        venderBPurchaseQueryUrl: '/vender/b/purchase/query.htm',
        venderBAuditPurchaseUrl: '/vender/b/purchase/remote/audit.htm',
        venderBOrderQueryUrl: '/vender/b/order/query.htm',
        venderBDisagreePurchaseUrl: '/vender/b/purchase/remote/disagree.htm',
        venderBRejectPurchaseUrl: '/vender/b/purchase/remote/reject.htm',
        venderBModifyPurchseOrderUrl: '/vender/b/purchase/remote/modifyPurchase.htm',
        venderBSavePurchseSkuUrl: '/vender/b/purchase/remote/savePurchaseSku.htm',
        venderBDelPurchseSkuUrl: '/vender/b/purchase/remote/delPurchaseSku.htm',
        venderBShowProductUrl: '/vender/b/purchase/remote/showProduct.htm',
        venderBQueryProductUrl: '/vender/b/purchase/searchProduct.htm',
        venderBStockoutUrl: '/vender/b/order/remote/stockout.htm',

        //卖家模块
        bSellerDetailSellersUrl: '/vender/b/detail/index.htm',

        //商品批量上传
        importSkus: '/vender/b/product/importSkus',

        //商品批量上传结果
        importResult: '/vender/b/product/importInfo.htm',

        //图片批量上传
        importImgs: '/vender/b/product/importImgs.htm',
        //图片批量上传结果
        importImgsResult: '/vender/b/product/importImgInfo.htm'
    };

    var importStatus = {
        skuStatus: -999,
        imgStatus: -999
    };

    var intervals = {
        //商品批量导入状态查询
        skuInterval: null,
        //图片批量导入状态查询
        imgInterval: null

        /**
         * ajax回调函数
         */
    };var callbacks = {
        //入驻提交信息回调
        userInfoCallback: function (data) {
            if (data.result) {
                window.location.href = data.messages.url;
            } else {
                console.log(data.messages);
            }
        },
        //个人信息提交信息回调
        venderInfoCallback: function (data) {
            if (data.result) {
                alert('保存成功');
            } else {
                alert('保存失败');
            }
        },
        //搜索回调
        searchCallback: function (data) {
            $('.data-return').html(data);
        },
        //data-return被占用时的回调
        forDataCallback: function (data) {
            $('.data-return-dup').html(data);
        },
        //触发弹窗
        showPopupCallback: function (data) {
            $('.loading').remove();
            $('.popup').html(data.messages.popup).show();
        },
        showPopup: function (text, reload) {
            var closeClass = reload ? 'ok_close' : 'just_close';
            var popupContent = '<div class="popup_card">\
                <div class="popup_close"> <div class="close_css"></div> </div> \
                <div class="popup_sure"> \
                    <div class="popup_title">提示信息</div> \
                    <div class="popup_content"> \
                        <div class="popup_sure_txt">' + text + '</div> \
                        <div class="btnarea1"> <div class="med2btn btnblue ' + closeClass + '" id="flush_page_btn"><a >关闭</a></div></div> \
                    </div>\
                 </div>\
            </div>';
            $('.popup').html(popupContent).show();
        },
        //首次触发弹窗回调确定后刷新页面
        onPopupReload: function (data) {
            var self = $(this);
            if (data.result) {
                var thisPopup = self.parents('.popup');
                thisPopup.hide();
                window.location.reload();
            }
        },
        // 二次触发弹窗回调 1为点击确定后刷新页面的回调函数
        onPopupCallback1: function (data) {
            var self = $(this);
            if (data.result) {
                //更新弹窗内容
                var thisPopup = self.parents('.popup');
                thisPopup.html(data.messages.popup);
                thisPopup.delegate('.med2btn', 'click', function () {
                    thisPopup.hide();
                    window.location.reload();
                });
            } else {
                var thisPopup = self.parents('.popup');
                thisPopup.html(data.messages.popup);
                thisPopup.delegate('.med2btn', 'click', function () {
                    thisPopup.hide();
                    window.location.reload();
                });
                console.log(data.messages.msg);
            }
        },
        // 二次触发弹窗回调 2为点击确定后跳转返回url的回调函数
        onPopupCallback2: function (data) {
            var self = $(this);
            if (data.result) {
                //更新弹窗内容
                var thisPopup = self.parents('.popup');
                thisPopup.html(data.messages.popup);
                thisPopup.delegate('.med2btn', 'click', function () {
                    thisPopup.hide();
                    window.location.href = data.messages, url;
                });
            } else {
                console.log(data.messages.msg);
            }
        },
        //商品上传成功
        uploadSuccessAllCallback: function (data, isImg) {
            if (isImg) {
                clearIntervalIfNotNull(intervals.imgInterval);
            } else {
                clearIntervalIfNotNull(intervals.skuInterval);
            }
            var source = $('#template_item_import2').html();
            var template = Handlebars.compile(source);
            var html = template(data);
            $('.popup').html(html).show();
        },
        //图片上传成功（部分）
        uploadImgsSuccessPartCallback: function (data, openResult) {
            clearIntervalIfNotNull(intervals.imgInterval);
            if (typeof data !== 'undefined' && data) {
                //importSku接口返回数据
                var source = $('#template_item_import3').html();
                var template = Handlebars.compile(source);
                var html = template(data);
                $('.popup').html(html);
                $('.popup').find('.popup_title').html('图片导入');
                $('.popup').find('.popup_sure_subtxt').html('共' + data.totalNum + '条数据，成功' + data.successNum + '条，失败' + data.failNum + '条，如下表显示：');
                data.fails.map(function (item) {
                    $('.error_list').append('<li>图片' + item + '失败</li>');
                });
                $('.popup_sure_txt').append('<div class=\'popup_sure_subtxt\' style=\'text-align:left;\'><p>上传失败原因：<br/>1.图片尺寸及大小不符合规则；<br/>2.文件命名方式不符合规则；<br/>3.对应商品未录入商品库；<br/>4.上传文件或商品发生重复。<br/>请核查，如无以上问题，请联络运营人员。</p></div>');
                $('.popup').show();
            } else {
                //无数据，从接口查询,显示三角形
                $.ajax({
                    type: 'get',
                    url: urls.importImgsResult,
                    timeout: 2000,
                    success: function (data) {
                        if (data && data.totalNum !== data.successNum) {
                            if (openResult) {
                                callbacks.uploadImgsSuccessPartCallback(data, true);
                            }
                        } else if (data && data.totalNum == data.successNum && openResult && data.totalNum) {
                            //全部成功
                            callbacks.uploadSuccessAllCallback(data, true);
                        } else if (openResult) {
                            //失败
                            callbacks.uploadFailedCallback('', true);
                        }
                        $('#item_images_btn').parent().find('.triangle').show();
                        $('#item_images_btn').removeClass('uploading').html('图片导入');
                    },
                    error: function () {
                        console.log('获取图片导入状态失败');
                    }
                });
            }
        },
        //商品上传成功（部分）
        uploadSuccessPartCallback: function (data, openResult) {
            clearIntervalIfNotNull(intervals.skuInterval);
            if (typeof data !== 'undefined' && data) {
                //importSku接口返回数据
                var source = $('#template_item_import3').html();
                var template = Handlebars.compile(source);
                var html = template(data);
                $('.popup').html(html);
                data.repeatRows.map(function (item) {
                    $('.error_list').append('<li>商品' + item + '重复</li>');
                });
                data.failRows.map(function (item) {
                    $('.error_list').append('<li>商品' + item + '失败</li>');
                });
                data.parseFailRows.map(function (item) {
                    $('.error_list').append('<li>第' + item + '行解析失败</li>');
                });
                $('.popup').show();
            } else {
                //无数据，从接口查询,显示三角形
                $.ajax({
                    type: 'get',
                    url: urls.importResult,
                    timeout: 2000,
                    success: function (data) {
                        if (data && data.totalNum !== data.successNum) {
                            //部分成功
                            if (openResult) {
                                callbacks.uploadSuccessPartCallback(data, true);
                            }
                        } else if (data && data.totalNum == data.successNum && openResult && data.totalNum) {
                            //全部成功
                            callbacks.uploadSuccessAllCallback(data, false);
                        } else if (openResult) {
                            //失败
                            callbacks.uploadFailedCallback('', false);
                        }
                        $('#item_import_btn').parent().find('.triangle').show();
                        $('#item_import_btn').removeClass('uploading').html('商品导入');
                    },
                    error: function () {
                        console.log('获取商品导入状态失败');
                    }
                });
            }
        },
        //上传失败
        uploadFailedCallback: function (msg, isImg) {
            var source = $('#template_item_import4').html();
            var template = Handlebars.compile(source);
            var html = template();
            $('.popup').html(html);
            $('.tips_red').html('导入失败！');
            if (typeof msg !== 'undefined' && msg.length) {
                $('.popup_sure_txt').append('<p class=\'popup_sure_subtxt\'>' + msg + '</div>');
            }
            if (typeof isImg !== 'undefined' && isImg) {
                $('.popup').find('.popup_title').html('图片导入');
                $('.popup_sure_txt').append('<div class=\'popup_sure_subtxt\' style=\'text-align:left;\'><p>上传失败原因：<br/>1.图片尺寸及大小不符合规则；<br/>2.文件命名方式不符合规则；<br/>3.对应商品未录入商品库；<br/>4.上传文件或商品发生重复。<br/>请核查，如无以上问题，请联络运营人员。</p></div>');
                clearIntervalIfNotNull(intervals.imgInterval);
            } else {
                clearIntervalIfNotNull(intervals.skuInterval);
            }
            $('.popup').show();
        },
        //上传中
        uploadLoadingDisplay: function (isImg) {
            var source = $('#template_item_import2').html();
            var template = Handlebars.compile(source);
            var html = template();
            $('.popup').html(html);
            $('.popup').find('.tips_blue').html('导入中...').addClass('tips_yellow');
            if (typeof isImg !== 'undefined' && isImg) {
                $('.popup').find('.popup_title').html('图片导入');
                $('.popup').find('.popup_sure_subtxt').html('注：当显示为导入中状态时，图片数量较多，系统需要更多时间上传商品，请耐心等待。');
            } else {
                $('.popup').find('.popup_sure_subtxt').html('注：当显示为导入中状态时，商品数量较多，系统需要更多时间上传商品，请耐心等待。');
            }
            $('.popup').show();
        },
        //上传中调接口
        uploadLoadingCallback: function (isImg) {
            if (typeof isImg !== 'undefined' && isImg) {
                intervals.imgInterval = setInterval(function () {
                    importImgsStatusFn(true);
                }, 1000);
            } else {
                intervals.skuInterval = setInterval(function () {
                    importStatusFn(true);
                }, 1000);
            }
        },
        //上传按钮状态
        uploadStatusCallback: function (data, showResult) {
            if (data == 1) {
                //导入中
                importStatus.skuStatus = 1;
                $('#item_import_btn').addClass('uploading').html('导入中...');
                $('#item_import_btn').parent().find('triangle').hide();
            } else if (data == 2) {
                //导入完成
                //clearIntervalIfNotNull(intervals.skuInterval);
                importStatus.skuStatus = 2;
                $('#item_import_btn').removeClass('uploading').html('商品导入');
                //导入出错，显示红三角
                //callbacks.uploadSuccessPartCallback();
                if (typeof showResult !== 'undefined' && showResult) {
                    callbacks.uploadSuccessPartCallback(null, showResult);
                } else {
                    callbacks.uploadSuccessPartCallback();
                }
            } else {
                importStatus.skuStatus = -999;
            }
        },
        //图片导入按钮状态
        uploadImgsStatusCallback: function (data, showResult) {
            if (data == 1) {
                //导入中
                importStatus.imgStatus = 1;
                $('#item_images_btn').addClass('uploading').html('导入中...');
                $('#item_images_btn').parent().find('triangle').hide();
            } else if (data == 2) {
                //导入完成
                //clearIntervalIfNotNull(intervals.imgInterval);
                importStatus.imgStatus = 2;
                $('#item_images_btn').removeClass('uploading').html('图片导入');
                //导入出错，显示红三角
                //callbacks.uploadImgsSuccessPartCallback();
                if (typeof showResult !== 'undefined' && showResult) {
                    callbacks.uploadImgsSuccessPartCallback(null, showResult);
                } else {
                    callbacks.uploadImgsSuccessPartCallback();
                }
            } else {
                importStatus.imgStatus = -999;
            }
        },
        importCallback: function (title, msg) {
            var source = $('#template_item_import4').html();
            var template = Handlebars.compile(source);
            var html = template();
            $('.popup').html(html);
            $('.popup').find('.popup_title').html(title);
            $('.popup').find('.tips_red').html(msg);
        }

    };

    /**
     * 搜索数据拼装
     * orderState：tab_card状态数据
     * userJson:ajaxUpload接收数据，obj
     */
    var searchKeyFn = function (node) {
        var searchItem = node.parents('.wrapper').find('.filter_search');
        var tabItem = searchItem.parents('.wrapper').find('.tab_card');
        var userJson = {};
        //var state = tabItem.attr('name');
        //var sValue = tabItem.find('.current').attr('value');
        ////写入tab card数据
        //userJson[state]=sValue;
        //写入input数据
        searchItem.find('input').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = self.attr('name');
                var searchVal = $.trim(self.val());
                userJson[searchKey] = searchVal;
            }
        });
        //写入selcet数据
        searchItem.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = self.data();
                for (var i in searchKey) {
                    userJson[i] = searchKey[i];
                }
            }
        });
        return userJson;
    };
    /**
     * 弹窗上的搜索按钮
     * @param node
     * @returns {{}}
     */
    var searchKeyPopupFn = function (node) {
        var searchItem = node.parents('.popup').find('.filter_search');
        var userJson = {};
        //写入input数据
        searchItem.find('input').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = self.attr('name');
                var searchVal = $.trim(self.val());
                userJson[searchKey] = searchVal;
            }
        });
        //写入selcet数据
        searchItem.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = self.data();
                for (var i in searchKey) {
                    userJson[i] = searchKey[i];
                }
            }
        });
        return userJson;
    };
    var indexRankFn = function (node) {
        var userJson = {};
        node.find('input').each(function () {
            var self = $(this);
            if (self.val()) {
                var searchKey = $(this).attr('name');
                var searchVal = $(this).val();
                userJson[searchKey] = searchVal;
            }
        });
        return userJson;
    };
    /**
     * tap card 数据拼装
     */
    var tabKeyFn = function (node) {
        var self = node;
        var userJson = {};
        var state = self.parents('.tab_card').attr('name');
        var sValue = self.attr('value');
        var sData = self.parents('.tab_card').data();
        userJson = searchKeyFn(node.parents('.wrapper').find('.search_btn'));
        userJson = sData;
        userJson[state] = sValue;
        return userJson;
    };

    var pageKetFn = function (node) {
        var self = node;
        var userJson = {};
        var state = self.parents('.tab_card').attr('name');
        var sValue = self.attr('value');
        userJson = searchKeyFn(node.parents('.wrapper').find('.search_btn'));
        userJson[state] = sValue;
        return userJson;
    };
    /**
     * 行间按钮data传递
     */
    var dataItemFn = function (node) {
        var dataItem = null;

        if (node.parents('tr').length != 0) {
            dataItem = node.parents('tr').data();
        } else if (node.parents('li').length != 0) {
            dataItem = node.parents('li').data();
        }
        if (dataItem) {
            return dataItem;
        }
    };
    /**
     * 单页按钮data传递，例如出库/批量出库页 出库按钮
     */
    var pageDataFn = function (node) {
        var userJson = {};
        var dataItem = {};
        var userArray = [];
        var dataKey = null;
        var dataVal = null;
        thisNode = node.parents('.main_content');
        var beChecked = thisNode.find('.shop_table_list').find('tr');
        if (beChecked.length != 0) {
            $.each(beChecked, function (i) {
                userJson = beChecked.eq(i).data('ids');
                if (userJson) {
                    userArray.push(userJson);
                }
            });
            dataVal = userArray.join(',');
            dataKey = 'ids';
            dataItem[dataKey] = dataVal;
        }
        thisNode.find('input[type=text]').each(function () {
            dataKey = thisNode.find('input[type=text]').attr('name');
            dataVal = thisNode.find('input[type=text]').val();
            dataItem[dataKey] = dataVal;
        });
        thisNode.find('textarea').each(function () {
            dataKey = thisNode.find('textarea').attr('name');
            dataVal = thisNode.find('textarea').val();
            dataItem[dataKey] = dataVal;
        });
        thisNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });

        return dataItem;
    };
    /**
     * popup内按钮data传递
     */
    var popupTxtFn = function (node) {
        var popupNode = node.parents('.popup');
        var dataKey = null;
        var dataVal = null;
        var dataValArr = [];
        var dataItem = node.data();
        popupNode.find('input[type=text]').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        popupNode.find('input[type=checkbox]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataValArr.push(dataVal);
            dataItem[dataKey] = dataValArr.join(',');
        });
        popupNode.find('input[type=radio]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataItem[dataKey] = dataVal;
        });
        popupNode.find('textarea').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        popupNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });
        return dataItem;
    };
    /**
     * 批量（导出，出库）传递data
     * data-ids 字段不可变
     */
    var batchDataFn = function (node) {
        var userJson;
        var userArray = [];
        var beChecked = node.parents('.tab_card,.account_detail_part').siblings('.data-return').find('.shop_table_list').find('input[type=checkbox]:checked');
        $.each(beChecked, function (i) {
            userJson = beChecked.eq(i).parents('tr').data('ids');
            if (userJson) {
                userArray.push(userJson);
            }
        });
        return userArray;
    };

    /**
     * 批量传递data 优化版
     * 字段可变,行间可传递input、select
     * @param node
     * @returns {Array}
     */
    var batchDataFn2 = function (node) {
        var userTr = null;
        var userInput = null;
        var eachUserJson = null;
        var userJson = null;
        var userArray = [];
        var beChecked = node.parents('.tab_card,.account_detail_part').siblings('.data-return').find('.shop_table_list').find('input[type=checkbox]:checked:not(".check_all")');
        $.each(beChecked, function (i) {
            eachUserJson = {};
            userTr = beChecked.eq(i).parents('tr').data();
            userInput = beChecked.eq(i).parents('tr').find('select').find('option:selected').data();
            for (var j in userTr) {
                eachUserJson[j] = userTr[j];
            }
            for (var k in userInput) {
                eachUserJson[k] = userInput[k];
            }
            userArray.push(eachUserJson);
        });

        return userArray;
    };

    /**
     * 除popup之外的“保存”传参
     * @param node
     * @returns {*}
     */
    var saveTxtFn = function (node, parentCard) {
        var parentNode = parentCard;
        var dataKey = null;
        var dataVal = null;
        var dataValArr = [];
        var dataItem = node.data();
        parentNode.find('input[type=text]').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('input[type=checkbox]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataValArr.push(dataVal);
            dataItem[dataKey] = dataValArr.join(',');
        });
        parentNode.find('input[type=radio]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('textarea').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });
        return dataItem;
    };

    /**
     * 此方法用于行间的编辑按钮调用
     * node:点击调用此方法的按钮dom元素
     * @param node
     */
    var toEditFn = function (node) {
        var editArea = node.parents('tr').find('.toEdit');
        editArea.each(function () {
            var $this = $(this);
            var nowVal = null;
            var nowName = null;
            var editKind = $this.data('edit');
            var editType = $this.data('type');
            switch (editKind) {
                case 'input':
                    nowVal = $this.text();
                    if (nowVal == '--') {
                        nowVal = '';
                    }
                    nowName = $this.attr('name');
                    if (editType == 'long') {
                        $this.removeClass('toEdit').addClass('beEditing').html('<input type="text" class="inputOnlyLong" name="' + nowName + '" value="' + nowVal + '">');
                    } else {
                        $this.removeClass('toEdit').addClass('beEditing').html('<input type="text" class="inputOnlyFloat" name="' + nowName + '" value="' + nowVal + '">');
                    }
                    break;
                case 'select':
                    nowVal = $this.data('this');
                    var optionList = $this.data('select').split(',');
                    var valueList = $this.data('value').split(',');
                    var temHtml = '<select>';
                    for (var i in optionList) {
                        temHtml += '<option value="' + valueList[i] + '"data-show=' + optionList[i] + '>' + optionList[i] + '</option>';
                    }
                    temHtml += '</select>';
                    $this.removeClass('toEdit').addClass('beEditing').html(temHtml).find('select').val(nowVal);
                    break;
                default:
                    break;
            }
        });
    };

    /**
     * 此方法用于行间的编辑按钮保存使用
     * @param node 点击调用此方法的dom元素
     * @param isAjax 是否需要发请求保存 true/false
     * @param url  保存请求地址 '字符串'
     * @param userJson 保存请求所需参数 json
     * @param succ 保存成功后的回调
     */
    var toSaveFn = function (node, isAjax, url, userJson, succ) {
        var editingArea = node.parents('tr').find('.beEditing');
        editingArea.each(function () {
            var $this = $(this);
            var nowShow = null;
            var thisVal = null;
            var editKind = $this.data('edit');
            switch (editKind) {
                case 'input':
                    nowShow = $this.find('input').val();
                    $this.html(nowShow).removeClass('beEditing').addClass('toEdit');
                    break;
                case 'select':
                    nowShow = $this.find('option:selected').data('show');
                    thisVal = $this.find('option:selected').val();
                    $this.html(nowShow).data('this', thisVal).removeClass('beEditing').addClass('toEdit');
                    break;
                default:
                    break;
            }
        });
        if (isAjax) {
            node.packajax({
                ajax_url: url,
                user: userJson,
                succ: succ
            });
        }
    };
    /**
     * 全局变量，用于复制粘贴
     * @type {Array}
     */
    var inputList = [];
    /**
     *  此方法用于行间的复制按钮保存使用
     * @param node 点击调用此方法的dom元素
     * @param copyType 获取值的方式，字符串，beTxt/beVal
     */
    var toCopyFn = function (node, copyType) {
        inputList = [];
        if (copyType == 'beTxt') {
            node.parents('tr').find('td[data-edit]').each(function () {
                inputList.push($(this).text());
            });
        } else if (copyType == 'beVal') {
            node.parents('tr').find('td[data-edit]').each(function () {
                inputList.push($(this).find('input').val());
            });
        }
    };
    /**
     * 此方法用于行间的黏贴按钮保存使用
     * @param node 点击调用此方法的dom元素
     */
    var toPasteFn = function (node) {
        //console.log(inputList);
        node.parents('tr').find('td[data-edit]').each(function (i) {
            $(this).find('input').val(inputList[i]);
        });
    };

    /**
     *  单一按钮传参,需要将按钮本身和父级dom传进来
     * @param node 点击调用此方法的dom元素
     * @param parentNode 内含input，select，textarea的父级dom节点
     * @returns {*}
     */
    var singleBtnFn = function (node, parentNode) {
        var dataItem = node.data();
        parentNode.find('textarea').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('input[type=text]').each(function () {
            dataKey = $(this).attr('name');
            dataVal = $(this).val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('input[type=checkbox]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataValArr.push(dataVal);
            dataItem[dataKey] = dataValArr.join(',');
        });
        parentNode.find('input[type=radio]:checked').each(function () {
            var self = $(this);
            dataKey = self.attr('name');
            dataVal = self.val();
            dataItem[dataKey] = dataVal;
        });
        parentNode.find('select').find('option:selected').each(function () {
            var self = $(this);
            if (self.val()) {
                var dataVal = self.data();
                for (var i in dataVal) {
                    dataItem[i] = dataVal[i];
                }
            }
        });
        return dataItem;
    };

    /**
     * 进入页面时查询商品导入状态,showResult:是否展示导入结果弹窗
     */
    var importStatusFn = function (showResult) {
        $.ajax({
            url: urls.importStatus,
            type: 'get',
            timeout: 2000,
            success: function (data) {
                callbacks.uploadStatusCallback(data, showResult);
            },
            error: function (data) {
                clearIntervalIfNotNull(intervals.skuInterval);
            }
        });
    };
    /**
     * 进入页面时查询图片导入状态,showResult:是否展示导入结果弹窗
     */
    var importImgsStatusFn = function (showResult) {
        $.ajax({
            url: urls.importImgsStatus,
            type: 'get',
            timeout: 2000,
            success: function (data) {
                callbacks.uploadImgsStatusCallback(data, showResult);
            },
            error: function () {
                clearIntervalIfNotNull(intervals.imgInterval);
            }
        });
    };
    /**
     * clearInterval
     */
    var clearIntervalIfNotNull = function (interval) {
        if (interval) {
            clearInterval(interval);
        }
    };

    /**
     * 商品管理 - 根据商品状态切换tab_card按钮状态
     */
    var changeTabButtonStatesFn = function () {
        var wareStatus = $('[name="wareStatus"] option:selected').attr('data-ware-status');
        var parent = $('#b_product_state_tab');
        var batchBtn = parent.find('.ingress_goods_btn');
        var importBtn = parent.find('.import_goods_btn');
        var delBtn = parent.find('.item_del_btn');
        switch (Number(wareStatus)) {
            case 1:
                //待审核
                batchBtn.hide();
                importBtn.hide();
                delBtn.show();
                break;
            case 2:
                //正在售卖（上架）
                batchBtn.show();
                batchBtn.removeClass('btngray').addClass('btnblue').html('批量下架').attr('id', 'batchIngressBtn').data('status', '3');
                importBtn.html('导入下架').attr('id', 'batchImportDownBtn').data('status', '3').show();
                delBtn.hide();
                break;
            case 3:
                //下架
                batchBtn.show();
                batchBtn.removeClass('btngray').addClass('btnblue').html('批量上架').attr('id', 'batchIngressBtn').data('status', '2');
                importBtn.html('导入上架').attr('id', 'batchImportUpBtn').data('status', '2').show();
                delBtn.show();
                break;
            case 8:
                //已驳回
                batchBtn.hide();
                importBtn.hide();
                delBtn.show();
                break;
            default:
                //全部或其他
                batchBtn.show();
                batchBtn.removeClass('btnblue').addClass('btngray').html('批量上/下架').attr('id', '');
                importBtn.hide();
                delBtn.show();
                break;
        }
    };

    /********************************调用函数的分割线*************************************************/

    /* 分页通用 */

    $('.wrapper').delegate('#pageIndexOrder .pageNum', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        userJson[index] = self.text();
        self.parents('ul').find('.current').removeClass('current');
        self.addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //上一页
    $('.wrapper').delegate('#pageIndexOrder ul li.frontPage', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        userJson[index] = parseInt(self.parents('ul').find('.current').text()) - 1;
        self.parents('ul').find('.current').removeClass('current');
        self.parents('#pageIndexOrder').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //下一页
    $('.wrapper').delegate('#pageIndexOrder ul li.nextPage', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        userJson[index] = parseInt(self.parents('ul').find('.current').text()) + 1;
        self.parents('ul').find('.current').removeClass('current');
        self.parents('#pageIndexOrder').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //分页点击跳转
    $('.wrapper').delegate('#pageIndexOrder .smallbtn', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        userJson[index] = self.siblings('.page_skip').find('input').val();
        self.parents('#pageIndexOrder').find('ul').find('.current').removeClass('current');
        self.parents('#pageIndexOrder').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    /*弹窗上的分页通用*/

    $('.popup').delegate('#pageIndexOrder .pageNum', 'click', function () {
        var self = $(this);
        var userJson = searchKeyPopupFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        var thisPin = self.parents('#pageIndexOrder').data('user-pin');
        var thisPurchaseId = self.parents('#pageIndexOrder').data('purchase-id');
        if (thisPin) {
            userJson['userPin'] = thisPin;
            userJson['PurchaseId'] = thisPurchaseId;
        }
        userJson[index] = self.text();
        self.parents('ul').find('.current').removeClass('current');
        self.addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.forDataCallback
        });
    });
    //弹窗上一页
    $('.popup').delegate('#pageIndexOrder ul li.frontPage', 'click', function () {
        var self = $(this);
        var userJson = searchKeyPopupFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        var thisPin = self.parents('#pageIndexOrder').data('user-pin');
        var thisPurchaseId = self.parents('#pageIndexOrder').data('purchase-id');
        if (thisPin) {
            userJson['userPin'] = thisPin;
            userJson['PurchaseId'] = thisPurchaseId;
        }
        userJson[index] = parseInt(self.parents('ul').find('.current').text()) - 1;
        self.parents('ul').find('.current').removeClass('current');
        self.parents('#pageIndexOrder').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.forDataCallback
        });
    });
    //弹窗下一页
    $('.popup').delegate('#pageIndexOrder ul li.nextPage', 'click', function () {
        var self = $(this);
        var userJson = searchKeyPopupFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        var thisPin = self.parents('#pageIndexOrder').data('user-pin');
        var thisPurchaseId = self.parents('#pageIndexOrder').data('purchase-id');
        if (thisPin) {
            userJson['userPin'] = thisPin;
            userJson['PurchaseId'] = thisPurchaseId;
        }
        userJson[index] = parseInt(self.parents('ul').find('.current').text()) + 1;
        self.parents('ul').find('.current').removeClass('current');
        self.parents('#pageIndexOrder').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.forDataCallback
        });
    });
    //弹窗分页点击跳转
    $('.popup').delegate('#pageIndexOrder .smallbtn', 'click', function () {
        var self = $(this);
        var userJson = searchKeyPopupFn(self);
        var index = 'index';
        var thisUrl = self.parents('#pageIndexOrder').data('baseurl');
        var thisPin = self.parents('#pageIndexOrder').data('user-pin');
        var thisPurchaseId = self.parents('#pageIndexOrder').data('purchase-id');
        if (thisPin) {
            userJson['userPin'] = thisPin;
            userJson['PurchaseId'] = thisPurchaseId;
        }
        userJson[index] = self.siblings('.page_skip').find('input').val();
        self.parents('#pageIndexOrder').find('ul').find('.current').removeClass('current');
        self.parents('#pageIndexOrder').find('li').eq(userJson[index]).addClass('current');
        self.packajax({
            ajax_url: thisUrl,
            user: userJson,
            succ: callbacks.forDataCallback
        });
    });

    /**
     * 账期管理
     */
    $('#standingBookSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.standingBookSearch,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    /**
     * 调整记录查询
     */
    $('#paymentSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.paymentSearch,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    /**
     * 逾期查询
     */
    $('#scopeSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.scopeSearch,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //商品-协议价-编辑-test
    $('.main_content').delegate('.edit_discount', 'click', function () {
        var $this = $(this);
        toEditFn($this);
        $this.parents('td').html('<div class="btnblue smallbtn inline save_discount">保存</div>');
    });
    //商品-协议价-保存-test
    $('.main_content').delegate('.save_discount', 'click', function () {
        var $this = $(this);
        var parentNode = $this.parents('tr');
        var userJson = singleBtnFn($this, parentNode);
        toSaveFn($this, true, urls.agreementPriceDModifyUrl, userJson, callbacks.showPopupCallback);
        //$this.parents('td').html('<div class="btnblue medbtn inline del_discount">删除</div> <div class="btnblue medbtn inline edit_discount">修改</div>')
    });
    //商品模块-协议价删除
    $('.main_content').delegate('.del_discount', 'click', function () {
        var self = $(this);
        var userJson = {};
        var userJsonStr = '';
        var skuids = [];
        var nowRow = $(this).parents('.shop_table_list').find('tr').size() - 1;
        var thisRow = parseInt($(this).parents('td').attr('rowspan'));

        if (confirm('是否删除？')) {
            skuids.push($(this).parents('tr').data());
            for (var i = 0; i < thisRow - 1; i++) {
                skuids.push($(this).parents('tr').next().data());
                $(this).parents('tr').next().remove();
            }
            $(this).parents('tr').remove();
            userJson['deletMessage'] = JSON.stringify(skuids);
            self.packajax({
                ajax_url: urls.agreementPriceDeleteUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
    });
    /**
     * 商品区域价：编辑、复制、粘贴、保存 js
     * start
     */
    //编辑
    $('.main_content').delegate('.edit_area_price', 'click', function () {
        var $this = $(this);
        toEditFn($this);
        $this.addClass('save');
        $this.siblings('.copy_area_price').addClass('active');
    });
    //复制
    $('.main_content').delegate('.copy_area_price.active', 'click', function () {
        var $this = $(this);
        if ($this.siblings('.save').length > 0) {
            toCopyFn($this, 'beVal');
        } else {
            toCopyFn($this, 'beTxt');
        }
        $this.parents('table').find('.paste_area_price').addClass('active');
    });
    //粘贴
    $('.main_content').delegate('.paste_area_price.active', 'click', function () {
        var $this = $(this);
        toEditFn($this);
        $this.siblings('.edit_area_price').addClass('save');
        toPasteFn($this);
    });
    //保存
    $('.main_content').delegate('.edit_area_price.save', 'click', function () {
        var $this = $(this);
        var parentNode = $this.parents('tr');
        var userJson = singleBtnFn($this, parentNode);
        toSaveFn($this, true, urls.agreementPriceUpdataUrl, userJson, callbacks.showPopupCallback);
        $this.removeClass('save');
    });

    /**
     * 商品区域价：编辑、复制、粘贴、保存 js
     * end
     */

    //供应商 - 增加商品 - 选择类目
    $('.category_list').category({
        url: '/vender/b/product/category.json',
        select: false
    });
    //从店铺导入-查询-类目
    $('.sort_select').category({
        url: '/vender/b/product/category.json',
        nodata: 'hidden'
    });

    $('#add_goods_s2').on('click', function () {
        var sort3 = $('.sort3 .current');
        if (sort3.length === 1) {
            window.location.href = urls.editPageUrl + '?catId1=' + $('.sort1 .current').attr('cid') + '&catId2=' + $('.sort2 .current').attr('cid') + '&catId3=' + $('.sort3 .current').attr('cid');
        } else {
            alert('请选择三级类目');
        }
    });
    /**
     * 商品模块
     * BEGIN
     */
    //BEGIN
    //供应商 - 我的产品库 - 搜索
    $('#b_product_lib_search_btn').on('click', function () {
        var self = $(this);
        changeTabButtonStatesFn();
        var userJson1 = searchKeyFn(self);
        var userJsonLine = $('.filter_con').find('span.current').data();
        var userJson = $.extend({}, userJson1, userJsonLine);
        self.packajax({
            ajax_url: urls.myProductLibUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //供应商 - 商品sku - 搜索
    $('#b_ware_sku_search_btn').on('click', function () {
        var self = $(this);
        var userJson1 = searchKeyFn(self);
        var userJsonLine = $('.filter_con').find('span.current').data();
        var userJson = $.extend({}, userJson1, userJsonLine);
        self.packajax({
            ajax_url: urls.myProductSKULibUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //供应商 - 我的产品库 - 搜索 filter_con
    $('.filter_con').find('span').on('click', function () {
        var self = $(this);
        var userJson1 = searchKeyFn(self);
        var userJsonLine = self.data();
        var userJson = $.extend({}, userJson1, userJsonLine);
        if (userJson) {
            $('.filter_con').find('.current').removeClass('current');
            self.addClass('current');
            self.packajax({
                ajax_url: urls.myProductLibUrl,
                user: userJson,
                succ: callbacks.searchCallback
            });
        }
    });

    //供应商 - 我的产品库 - 分页
    $('.wrapper').delegate('#b_page_index_my_product_lib ul li', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        userJson[index] = self.text();
        self.packajax({
            ajax_url: urls.myProductLibUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    $('.wrapper').delegate('#b_page_index_my_product_lib .smallbtn', 'click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        var index = 'index';
        userJson[index] = self.siblings('.page_skip').find('input').val();
        self.packajax({
            ajax_url: urls.myProductLibUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //供应商 - 我的产品库 - 上架
    $('.data-return').delegate('.b_product_up_shelf_btn', 'click', function () {
        var self = $(this);
        var userJson = dataItemFn(self);
        self.packajax({
            ajax_url: urls.productUpShelfUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });
    //供应商 - 我的产品库 - 下架
    $('.data-return').delegate('.b_product_down_shelf_btn', 'click', function () {
        var self = $(this);
        var userJson = dataItemFn(self);
        self.packajax({
            ajax_url: urls.productDownShelfUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });

    //供应商 - 我的产品库 - 限销区域 - 编辑
    $('.area_edit_btn').on('click', function () {
        var self = $(this);
        var userJsonArr = batchDataFn(self);
        var wareIds = userJsonArr.join(',');
        if (wareIds.length) {
            window.location.href = '/vender/b/product/editLimit?wareId=' + wareIds;
        } else {
            callbacks.showPopup('商品不能为空，请选择后重新操作！', false);
        }
    });

    //供应商 - 我的产品库 - 限销区域 - 删除
    $('.area_del_btn').on('click', function () {
        var self = $(this);
        var userJsonArr = batchDataFn(self);
        var wareIds = userJsonArr.join(',');
        if (wareIds.length) {
            var userJson = {};
            userJson['wareIds'] = userJsonArr.join(',');
            self.packajax({
                ajax_url: urls.areaDelUrl,
                user: userJson,
                succ: function (r) {
                    if (r && r.result) {
                        callbacks.showPopup('删除成功！', true);
                    } else {
                        callbacks.showPopup(r.messages || '删除失败，请稍后再试！', false);
                    }
                },
                error: function (r) {
                    callbacks.showPopup('系统繁忙，请稍后再试！', false);
                }
            });
        } else {
            callbacks.showPopup('商品不能为空，请选择后重新操作！', false);
        }
    });

    //供应商 - 我的产品库 - 模板下载

    $('#temp_download_btn').on('click', function () {
        //加载模板下载对话框
        var tempObjects = {
            templates: [{
                title: '京东医药城养生保健导入模板',
                fileLink: '//yaojingcai.jd.com/yangsheng.xlsx'
            }, {
                title: '京东医药城药品导入模板',
                fileLink: '//yaojingcai.jd.com/yaopin.xlsx'
            }, {
                title: '京东医药城医疗器械导入模板 ',
                fileLink: '//yaojingcai.jd.com/qixie.xlsx'
            }, {
                title: '商品批量上下架导入模板',
                fileLink: '//yaojingcai.jd.com/shangxiajia.xlsx'
            }]
        };
        var source = $('#template_temp_download').html();
        var template = Handlebars.compile(source);
        var html = template(tempObjects);
        $('.popup').html(html).show();
    });

    //供应商 - 我的产品库 - 商品导入

    //页面初始化，获取导入状态
    importStatusFn();
    $('#importFile').change(function () {
        //显示文件路径
        $('.popup_fileupload .file_txt').html($('#importFile').val());
    });

    $('.popup').delegate('#popup_item_import_btn', 'click', function () {
        if ($(this).hasClass('btngray') || $('#importFile').val().length == 0) return;
        $(this).addClass('btngray');
        //异步加载jquery.form.js
        if (typeof $.fn.ajaxSubmit == 'undefined') {
            $.getScript('//yaojingcai.jd.com/js/jquery.form.min.js', function () {
                $('#importForm').submit();
            });
        } else {
            $('#importForm').submit();
        }
    });
    $('.btnarea').delegate('.triangle', 'click', function () {
        if ($(this).next().attr('id') == 'item_import_btn') {
            //商品导入提示
            callbacks.uploadSuccessPartCallback(null, true);
        } else {
            //图片导入提示
            callbacks.uploadImgsSuccessPartCallback(null, true);
        }
    });

    $('#importForm').submit(function () {
        //商品导入操作
        callbacks.uploadLoadingDisplay();
        $(this).ajaxSubmit({
            type: 'post',
            url: urls.importSkus,
            timeout: 30000,
            success: function (obj) {
                callbacks.uploadLoadingCallback();
                if (obj) {
                    obj = $.parseJSON(obj);
                }
                // HS.modal.progress.close();
                if (obj.isSuccess) {
                    importStatus.skuStatus = 1;
                    callbacks.uploadStatusCallback(1);
                } else {
                    //导入失败
                    callbacks.uploadStatusCallback(importStatus.skuStatus);
                    callbacks.uploadFailedCallback(obj.msg);
                }
            },
            error: function () {
                callbacks.uploadStatusCallback(-999);
                //callbacks.uploadFailedCallback();
                callbacks.uploadFailedCallback('系统繁忙，请稍后再试！');
            }
        });
        return false; //不刷新页面
    });
    $('#item_import_btn').on('click', function () {
        if (importStatus.skuStatus == 1) {
            //导入中
            callbacks.uploadLoadingDisplay();
            callbacks.uploadLoadingCallback();
        } else {
            //导入完成
            var source = $('#template_item_import1').html();
            var template = Handlebars.compile(source);
            var html = template();
            $('.popup').html(html).show();
            $('#importFile').val('');
        }
    });

    //供应商 - 我的产品库 - 图片导入

    //页面初始化，获取导入状态
    importImgsStatusFn();
    $('#importImages').change(function () {
        //显示文件路径
        $('.popup_fileupload .file_txt').html($('#importImages').val());
    });

    $('.popup').delegate('#popup_image_import_btn', 'click', function () {
        if ($(this).hasClass('btngray') || $('#importImages').val().length == 0) return;
        $(this).addClass('btngray');
        //异步加载jquery.form.js
        if (typeof $.fn.ajaxSubmit == 'undefined') {
            $.getScript('//yaojingcai.jd.com/js/jquery.form.min.js', function () {
                $('#importImageForm').submit();
            });
        } else {
            $('#importImageForm').submit();
        }
    });
    $('#importImageForm').submit(function () {
        //图片导入操作
        callbacks.uploadLoadingDisplay(true);
        $(this).ajaxSubmit({
            type: 'post',
            url: urls.importImgs,
            timeout: 30000,
            success: function (obj) {
                // HS.modal.progress.close();
                callbacks.uploadLoadingCallback(true);
                if (obj) {
                    obj = $.parseJSON(obj);
                }
                if (obj.isSuccess) {
                    importStatus.imgStatus = 1;
                    callbacks.uploadImgsStatusCallback(1);
                } else {
                    //导入失败
                    callbacks.uploadImgsStatusCallback(importStatus.skuStatus);
                    callbacks.uploadFailedCallback(obj.msg, true);
                }
            },
            error: function (err) {
                callbacks.uploadImgsStatusCallback(-999);
                //callbacks.uploadFailedCallback('',true);
                callbacks.uploadFailedCallback('系统繁忙，请稍后再试！', true);
            }
        });
        return false; //不刷新页面
    });
    $('#item_images_btn').on('click', function () {
        if (importStatus.imgStatus == 1) {
            //导入中
            callbacks.uploadLoadingDisplay(true);
            callbacks.uploadLoadingCallback(true);
        } else {
            //导入完成
            var source = $('#template_image_import').html();
            var template = Handlebars.compile(source);
            var html = template();
            $('.popup').html(html).show();
            $('#importImages').val('');
        }
    });
    //供应商 - 我的产品库 - 删除（ 已下架/已驳回 ）
    $('.tab_card').delegate('#itemDelBtn', 'click', function () {
        var self = $(this);
        var userJsonArr = batchDataFn(self);
        //非下架或非驳回商品不能删除
        var canDelete = true;
        for (var i = 0; i < userJsonArr.length; i++) {
            var wareState = Number(self.parents('.tab_card').next().find('[data-ids="' + userJsonArr[i] + '"]').attr('data-ware-state'));
            if (wareState == 2) {
                callbacks.showPopup('已上架商品不能删除，请取消选择后重新操作！', false);
                return;
            }
        }
        var userJson = {};
        userJson = self.data();
        userJson['ids'] = userJsonArr.join(',');
        self.packajax({
            ajax_url: urls.itemDelUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });

    //供应商 - 我的产品库 - 批量上/下架
    $('.tab_card').delegate('#batchIngressBtn', 'click', function () {
        var self = $(this);
        var userJsonArr = batchDataFn(self);
        var userJson = {};
        userJson = self.data();
        userJson['ids'] = userJsonArr.join(',');
        self.packajax({
            ajax_url: urls.batchIngressShelfUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });
    //供应商 - 我的产品库 - 导入上/下架
    $('.tab_card').delegate('#batchImportUpBtn', 'click', function () {
        var source = $('#template_item_import6').html();
        var template = Handlebars.compile(source);
        var html = template();
        $('.popup').html(html).show();
        $('#importUpFile').val('');
    });
    $('.tab_card').delegate('#batchImportDownBtn', 'click', function () {
        var source = $('#template_item_import5').html();
        var template = Handlebars.compile(source);
        var html = template();
        $('.popup').html(html).show();
        $('#importDownFile').val('');
    });
    $('#importDownFile,#importUpFile').change(function () {
        //显示文件路径
        $('.popup_fileupload .file_txt').html($(this).val());
    });
    $('.popup').delegate('#popup_item_down_btn', 'click', function () {
        //异步加载jquery.form.js
        if (typeof $.fn.ajaxSubmit == 'undefined') {
            $.getScript('//yaojingcai.jd.com/js/jquery.form.min.js', function () {
                $('#importDownForm').submit();
            });
        } else {
            $('#importDownForm').submit();
        }
    });
    $('.popup').delegate('#popup_item_up_btn', 'click', function () {
        //异步加载jquery.form.js
        if (typeof $.fn.ajaxSubmit == 'undefined') {
            $.getScript('//yaojingcai.jd.com/js/jquery.form.min.js', function () {
                $('#importUpForm').submit();
            });
        } else {
            $('#importUpForm').submit();
        }
    });
    $('#importUpForm').submit(function () {
        callbacks.importCallback('导入上架', '上传执行中');
        $('.popup .btnarea1').hide();
        //导入上架操作
        $(this).ajaxSubmit({
            type: 'post',
            url: urls.importUpShelfUrl,
            timeout: 30000,
            success: function (obj) {
                obj = $.parseJSON(obj);
                if (obj && obj.isSuccess) {
                    if (parseInt(obj.successNum) == parseInt(obj.totalNum)) {
                        $('.popup').find('.tips_red').html('导入成功').removeClass('tips_red').addClass('tips_blue');
                    } else {
                        var source = $('#template_item_import3').html();
                        var template = Handlebars.compile(source);
                        var html = template(obj);
                        $('.popup').html(html);
                        obj.repeatRows.map(function (item) {
                            $('.error_list').append('<li>行 ' + item + ' 失败</li>');
                        });
                        obj.failRows.map(function (item) {
                            $('.error_list').append('<li>行 ' + item + ' 失败</li>');
                        });
                        obj.parseFailRows.map(function (item) {
                            $('.error_list').append('<li>行 ' + item + ' 失败</li>');
                        });
                        $('.popup .btnarea1').show();
                        $('.popup').show();
                    }
                } else {
                    $('.popup').find('.tips_red').html('系统繁忙，请稍后再试！');
                    $('.popup .btnarea1').show();
                }
            },
            error: function (err) {
                $('.popup').find('.tips_red').html('系统繁忙，请稍后再试！');
                $('.popup .btnarea1').show();
            }
        });
        return false; //不刷新页面
    });
    $('#importDownForm').submit(function () {
        callbacks.importCallback('导入下架', '上传执行中');
        $('.popup .btnarea1').hide();
        //导入上架操作
        $(this).ajaxSubmit({
            type: 'post',
            url: urls.importDownShelfUrl,
            timeout: 30000,
            success: function (obj) {
                obj = $.parseJSON(obj);
                if (obj && obj.isSuccess) {
                    if (parseInt(obj.successNum) == parseInt(obj.totalNum)) {
                        $('.popup').find('.tips_red').html('导入成功').removeClass('tips_red').addClass('tips_blue');
                    } else {
                        var source = $('#template_item_import3').html();
                        var template = Handlebars.compile(source);
                        var html = template(obj);
                        $('.popup').html(html);
                        obj.repeatRows.map(function (item) {
                            $('.error_list').append('<li>行 ' + item + ' 失败</li>');
                        });
                        obj.failRows.map(function (item) {
                            $('.error_list').append('<li>行 ' + item + ' 失败</li>');
                        });
                        obj.parseFailRows.map(function (item) {
                            $('.error_list').append('<li>行 ' + item + ' 失败</li>');
                        });
                        $('.popup .btnarea1').show();
                        $('.popup').show();
                    }
                } else {
                    $('.popup').find('.tips_red').html('系统繁忙，请稍后再试！');
                    $('.popup .btnarea1').show();
                }
            },
            error: function (err) {
                $('.popup').find('.tips_red').html('系统繁忙，请稍后再试！');
                $('.popup .btnarea1').show();
            }
        });
        return false; //不刷新页面
    });
    //供应商 - 编辑区域 - 保存
    $('.data-return').delegate('.b_area_cat_save_btn', 'click', function () {
        var self = $(this);
        var userJson = dataItemFn(self);
        self.packajax({
            ajax_url: urls.editAreaCatUrl,
            user: userJson,
            succ: function (data) {
                callbacks.onPopupCallback1.call(self, data);
            }
        });
    });

    //商品模块-搜索区域价格按钮（供应商）
    $('#areaPriceSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.areaPriceSearchUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //商品模块-协议价格查询
    $('#discountSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.agreementPriceSearchUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    /**
     * 商品模块
     * END
     */

    /**
     * 采购单模块
     * BEGIN
     */
    //BEGIN
    //采购模块-搜索按钮（供应商）
    $('#venderBPurchaseSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.venderBPurchaseQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //拒绝
    $('.wrapper').delegate('.disagree_purchase_btn', 'click', function () {
        var self = $(this);
        var parentNode = self.parents('.main_content');
        var userJson = singleBtnFn(self, parentNode);
        self.packajax({
            ajax_url: urls.venderBDisagreePurchaseUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });
    //审核
    $('.wrapper').delegate('.audit_purchase_btn', 'click', function () {
        var self = $(this);
        var parentNode = self.parents('.main_content');
        var userJson = singleBtnFn(self, parentNode);
        self.packajax({
            ajax_url: urls.venderBAuditPurchaseUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });
    //展示商品
    $('.wrapper').delegate('.add_purchase_order_sku_btn', 'click', function () {
        var self = $(this);
        var parentNode = self.parents('.main_content');
        var userJson = singleBtnFn(self, parentNode);
        self.packajax({
            ajax_url: urls.venderBShowProductUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });
    //搜索商品
    $('.popup').delegate('.vender_search_purchase_product_btn', 'click', function () {
        var self = $(this);
        var userJson = searchKeyPopupFn(self);
        self.packajax({
            ajax_url: urls.venderBQueryProductUrl,
            user: userJson,
            succ: callbacks.forDataCallback
        });
    });

    $('.popup').delegate('.reject_purchase_btn', 'click', function () {
        var self = $(this);
        var userJson = popupTxtFn(self);
        var allInput = self.parents('.popup').find('textarea');
        self.checkForm({
            node: allInput,
            errorTips: 'border',
            succ: function () {
                self.packajax({
                    ajax_url: urls.venderBRejectPurchaseUrl,
                    user: userJson,
                    succ: function (data) {
                        callbacks.onPopupCallback1.call(self, data);
                    }
                });
            }
        });
    });

    //保存order
    $('.wrapper').delegate('.modify_purchase_order_btn', 'click', function () {
        var self = $(this);
        var parentNode = self.parents('.order_detail_part');
        var userJson = singleBtnFn(self, parentNode);
        self.packajax({
            ajax_url: urls.venderBModifyPurchseOrderUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });
    //编辑sku
    $('.wrapper').delegate('.edit_purchase_sku_btn', 'click', function () {
        var $this = $(this);
        toEditFn($this);
        $this.parents('td').html('<div class="btnblue smallbtn inline save_purchase_sku_btn">保存</div>');
    });
    //保存sku
    $('.wrapper').delegate('.save_purchase_sku_btn', 'click', function () {
        var self = $(this);
        var parentNode = self.parents('tr'); //父级tr
        var userJson = singleBtnFn(self, parentNode); //拼装数据
        var skuNumDom = parentNode.find('input[name=skuNum]'); //采购数量dom
        var discountDom = parentNode.find('input[name=perSkuReduce]'); //优惠金额dom
        var totalNumDom = parentNode.find('.total_num'); //总价dom
        var eachPriceDom = parentNode.find('.each_price').find('input'); //采购价dom
        var skuNum = Number(skuNumDom.val()); //采购数量
        var eachPrice = Number(eachPriceDom.val()); //采购价
        var discount = Number(discountDom.val()); //优惠价格
        var totalNum = skuNum * eachPrice; //总价= 采购数量*采购价
        var flag = true;

        totalNumDom.html(totalNum); //写入总价

        if (skuNum > 100000) {
            alert('采购数量不能大于10万');
            flag = false;
        }
        if (totalNum > 1000000) {
            alert('单个商品采购总价不能大于100万');
            flag = false;
        }
        if (discount > totalNum) {
            alert('优惠价不能大于总价');
            flag = false;
        }
        if (flag) {
            self.packajax({
                ajax_url: urls.venderBSavePurchseSkuUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
    });
    //删除sku
    $('.wrapper').delegate('.del_purchase_sku_btn', 'click', function () {
        var self = $(this);
        var parentNode = self.parents('tr');
        var userJson = singleBtnFn(self, parentNode);
        if (confirm('是否删除')) {
            self.packajax({
                ajax_url: urls.venderBDelPurchseSkuUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
    });

    //采购--订单查询按钮
    $('#venderBOrderSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.venderBOrderQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    //上药出库操作
    $('.wrapper').delegate('.b_stock_out_btn', 'click', function () {
        var self = $(this);
        var parentNode = self.parents('.main_content');
        var userJson = singleBtnFn(self, parentNode);
        self.packajax({
            ajax_url: urls.venderBStockoutUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
    });
    //END

    /**
     * 卖家管理
     */
    //公司信息-公司资质-经营类目-保证金信息 切换
    $('#sellerManageDetailBtn ul li').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.bSellerDetailSellersUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    /**
     * 渠道管理Start-----------------------------------------------------
     */
    //渠道管理--经销商列表--经销商列表搜索
    $('#bSellerInfoSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.bSellerManageSellersUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //渠道管理--经销商管理--经销商列表--搜索--切换会员状态
    $('#sellerManageAuthStatusBtn ul li').on('click', function () {
        var self = $(this);
        //var userJson1 = tabKeyFn(self);
        //var userJson2 = searchKeyFn($('#bSellerInfoSearchBtn'));
        //var userJson = $.extend({},userJson1,userJson2);
        //for(var key in userJson){
        //	alert(key + "..." + userJson[key]);
        //}

        var userJson = searchKeyFn($('#bSellerInfoSearchBtn')); //搜索框 +Tab
        self.packajax({
            ajax_url: urls.bSellerManageSellersUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //渠道管理--经销商列表--查看--启用经销商
    $('.filter_search').delegate('#bSellerManageDetailUserStatusOnBtn', 'click', function () {
        var userJson = {};
        userJson['userPin'] = $('#userPin').val();
        var self = $(this);
        if (confirm('是否启用？')) {
            self.packajax({
                ajax_url: urls.bSellerManageDetailUserStatusOnUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
        return false; //防止自动刷新
    });

    //渠道管理--经销商列表--查看--禁用经销商
    $('.filter_search').delegate('#bSellerManageDetailUserStatusOffBtn', 'click', function () {
        var userJson = {};
        userJson['userPin'] = $('#userPin').val();
        var self = $(this);
        if (confirm('是否禁用？')) {
            self.packajax({
                ajax_url: urls.bSellerManageDetailUserStatusOffUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
        return false; //防止自动刷新
    });

    //渠道管理--经销商管理 -- 账期维护 -- 效果
    $('.account_detail_part .to_set_account').on('click', function () {
        $('.account_set_item').show();
        $('.account_detail_part.open_account').hide();
    });
    $('.account_detail_part  #amountTotal').on('keyup', function () {
        var num = parseFloat($('#amountTotal').val()).toFixed(2) - parseFloat($('#amountUsed').text()).toFixed(2);
        if (!num) {
            num = '';
        }
        if (num < 0) {
            num = 0;
        }
        $('#amountAvailable').text(num);
    });

    //渠道管理--经销商列表--账期维护--保存账期
    $('.main_content').delegate('.account_set', 'click', function () {

        //如果“账期状态”是关闭，且数据库中的也是“关闭”，那么不能保存
        if ($('#amountStatus').val() == 0 && $('#amountStatusOri').val() == 0) {
            alert('账期已经关闭，不能保存');
            return false;
        }

        if (parseFloat($('#amountTotal').val()) < parseFloat($('#amountUsed').text())) {
            alert('“信用总额”必须大于等于“已用额度”');
            return false;
        }

        var self = $(this);
        var parentCard = self.parents('.account_set_item');
        var userJson = {};
        var allInput = parentCard.find('input');
        var temHtml = '<div class="loading"></div>';
        $(this).checkForm({
            node: allInput,
            errorTips: 'border',
            succ: function () {
                userJson = saveTxtFn(self, parentCard);
                $('body').append(temHtml);
                self.packajax({
                    ajax_url: urls.bSellerManageSaveAccountUrl,
                    user: userJson,
                    succ: callbacks.showPopupCallback
                });
            }
        });
    });

    //渠道管理--首营认证--首营认证列表搜索--搜索
    $('#bSellerFirstSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.bSellerFirstSearchUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //渠道管理--首营认证--首营认证列表搜索--切换审核状态
    $('#sellerFirstCertiStatusBtn ul li').on('click', function () {
        var self = $(this);
        //var userJson1 = tabKeyFn(self);
        //var userJson2 = searchKeyFn($('#bSellerFirstSearchBtn'));
        //var userJson = $.extend({},userJson1,userJson2);

        var userJson = searchKeyFn($('#sellerFirstCertiStatusBtn')); //搜索框 + tab
        self.packajax({
            ajax_url: urls.bSellerFirstSearchUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //渠道管理--首营认证--编辑审核--审核通过
    $('.filter_search').delegate('#bSellerManageDetailAuditPassBtn', 'click', function () {
        var userJson = {};
        userJson['userPin'] = $('#userPin').val();
        userJson['mobile'] = $('#mobile').val();
        userJson['companyName'] = $('#companyName').val();
        var self = $(this);
        if (confirm('是否审核通过？')) {
            self.packajax({
                ajax_url: urls.bSellerManageDetailAuditPassUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
        return false; //防止自动刷新
    });

    //渠道管理--首营认证--编辑审核--进入驳回资质页面
    $('.filter_search').delegate('#bSellerManageDetailToAuditDenyBtn', 'click', function () {
        var userJson = {};
        userJson['userPin'] = $('#userPin').val();
        userJson['mobile'] = $('#mobile').val();
        var self = $(this);
        self.packajax({
            ajax_url: urls.bSellerManageDetailToAuditDenyUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });
        return false; //防止自动刷新
    });

    //渠道管理--首营认证--编辑审核--驳回资质
    $('.popup').delegate('#bSellerManageDetailAuditDenyBtn', 'click', function () {

        if ($('#auditComment').val() == null || $('#auditComment').val() == '') {
            alert('请输入驳回建议');
            return false;
        }

        var userJson = {};
        userJson['userPin'] = $('#userPin').val();
        userJson['mobile'] = $('#mobile').val();
        userJson['auditComment'] = $('#auditComment').val();

        var self = $(this);

        self.packajax({
            ajax_url: urls.bSellerManageDetailAuditDenyUrl,
            user: userJson,
            succ: callbacks.showPopupCallback
        });

        return false; //防止自动刷新
    });

    //渠道管理--采购目录维护--经销商列表搜索
    $('#bSellerWareRelationshipSellersSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.bSellerWareRelationshipSellersSearchUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //渠道管理--采购目录维护--编辑商品--搜索列表
    $('#bSellerWareRelationshipEditBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        userJson['userPin'] = $('#userPin').val();
        self.packajax({
            ajax_url: urls.bSellerWareRelationshipEditBtnUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //渠道管理--采购目录维护--编辑商品--编辑
    $('.main_content').delegate('.edit_channel_catalog_btn', 'click', function () {
        var $this = $(this);
        toEditFn($this);
        $this.parents('td').html('<div class="btnblue medbtn inline save_channel_catalog_btn">保存</div>');
    });

    //渠道管理--采购目录维护--编辑商品--编辑后保存
    $('.main_content').delegate('.save_channel_catalog_btn', 'click', function () {
        var userJson = {};
        var thisTr = $(this).parents('tr');
        userJson = thisTr.data(); //获取id值
        userJson['amountScopeId'] = thisTr.find('select:eq(0)').val(); //获取select值
        var $this = $(this);
        toSaveFn($this, true, urls.bSellerWareRelationshipUpdateUrl, userJson, callbacks.showPopupCallback);
        $this.parents('td').html('<div class="btnblue medbtn inline edit_channel_catalog_btn">编辑</div>' + ' <div class="btnblue medbtn inline">删除</div>');
    });

    //渠道管理--采购目录维护--编辑商品--批量删除商品
    $('.main_content').delegate('#batchDeleteSellerWareRelationshipBtn', 'click', function () {

        var userJson = {};
        var dataItem = {};
        var userArray = [];
        var amountJson = {};
        var amountArray = [];
        var dataVal = null;
        thisNode = $(this).parents('.main_content');
        var beChecked = thisNode.find('.shop_table_list').find('tr');
        if (beChecked.length != 0) {
            var num = 0; //选择条数
            $.each(beChecked, function (i) {
                if (i == 0) {
                    return true; //第一个tr不参与
                }

                //如果checkbox选中
                if (beChecked.eq(i).find('input[type=checkbox]').prop('checked')) {
                    num++; //判断是否有checkbox选中
                    userJson = beChecked.eq(i).data('ids');
                    if (userJson) {
                        userArray.push(userJson);
                    }
                }
            });
            if (num == 0) {
                //如果没有选择记录
                alert('请选择一条或多条记录');
                return false;
            }
            dataVal = userArray.join(',');
            dataItem['ids'] = dataVal;
        }

        var self = $(this);
        //var userJson = pageDataFn(self);

        if (confirm('是否删除')) {
            self.packajax({
                ajax_url: urls.bSellerWareRelationshipBatchDeleteUrl,
                user: dataItem,
                succ: callbacks.showPopupCallback
            });
        }
        return false; //防止刷新页面
    });

    //渠道管理--采购目录维护--编辑商品--单个删除商品
    $('.main_content').delegate('.singleDeleteSellerWareRelationshipBtn', 'click', function () {
        var self = $(this);
        var userJson = dataItemFn(self);
        if (confirm('是否删除')) {
            self.packajax({
                ajax_url: urls.bSellerWareRelationshipSingleDeleteUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
        return false; //防止刷新页面
    });

    //渠道管理--采购目录维护--导入新商品--搜索列表
    $('#bSellerWareRelationshipAddSearchBtn').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        userJson['userPin'] = $('#userPin').val();
        self.packajax({
            ajax_url: urls.bSellerWareRelationshipAddSearchBtnUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });

    //渠道管理--采购目录维护--导入新商品--批量导入商品
    $('.main_content').delegate('#batchSaveSellerWareRelationshipBtn', 'click', function () {

        var userJson = {};
        var dataItem = {};
        var userArray = [];
        var amountJson = {};
        var amountArray = [];
        var dataVal = null;
        var dataVal2 = null;
        thisNode = $(this).parents('.main_content');
        var beChecked = thisNode.find('.shop_table_list').find('tr');
        if (beChecked.length != 0) {
            var num = 0; //选择条数
            var validErr = 0; //错误条数
            $.each(beChecked, function (i) {
                if (i == 0) {
                    return true; //第一个tr不参与
                }

                //如果checkbox选中
                if (beChecked.eq(i).find('input[type=checkbox]').prop('checked')) {
                    num++; //判断是否有checkbox选中
                    userJson = beChecked.eq(i).data('wareIds');
                    if (userJson) {
                        userArray.push(userJson);
                    }
                    //获得账期
                    amountJson = beChecked.eq(i).find('select').val();
                    if (amountJson) {
                        amountArray.push(amountJson);
                    } else {
                        validErr++;
                        alert('请选择账期');
                        return false;
                    }
                }
            });
            if (num == 0) {
                //如果没有选择记录
                alert('请选择一条或多条记录');
                return false;
            }

            if (validErr > 0) {
                //如果验证失败，那么返回false
                return false;
            }
            dataVal = userArray.join(',');
            dataItem['wareIds'] = dataVal;

            dataVa2 = amountArray.join(',');
            dataItem['amountScopeIds'] = dataVa2;
        }
        var self = $(this);
        //var userJson = pageDataFn(self);
        dataItem['userPin'] = $('#userPin').val();
        var temHtml = '<div class="loading"></div>';
        if (confirm('是否导入')) {
            $('body').append(temHtml);
            self.packajax({
                ajax_url: urls.bSellerWareRelationshipBatchSaveUrl,
                user: dataItem,
                succ: callbacks.showPopupCallback
            });
        }
        return false; //防止刷新页面
    });

    //渠道管理--采购目录维护--导入新商品--单个导入商品
    $('.main_content').delegate('.singleSaveSellerWareRelationshipBtn', 'click', function () {
        var self = $(this);
        var userJson = dataItemFn(self);
        userJson['userPin'] = $('#userPin').val();

        //获得账期select
        var amoungtScopeId = $(this).parents('tr').find('select:eq(0)').val();
        if (amoungtScopeId == undefined || amoungtScopeId == '' || amoungtScopeId == null) {
            alert('请选择账期');
            return false;
        }
        userJson['amountScopeId'] = amoungtScopeId; //获取select值
        var temHtml = '<div class="loading"></div>';
        if (confirm('是否导入')) {
            $('body').append(temHtml);
            self.packajax({
                ajax_url: urls.bSellerWareRelationshipSingleSaveUrl,
                user: userJson,
                succ: callbacks.showPopupCallback
            });
        }
        return false; //防止刷新页面
    });

    //渠道管理--会员等级--搜索
    $('#bSellerCategoryIndexQuery').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.bSellerCategoryIndexQueryUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
    /**
     * 渠道管理END-----------------------------------------------------
     */

    //结算统计--搜索
    $('#settleaccountSeacherBnt').on('click', function () {
        var self = $(this);
        var userJson = searchKeyFn(self);
        self.packajax({
            ajax_url: urls.settleAccountSearchUrl,
            user: userJson,
            succ: callbacks.searchCallback
        });
    });
});

/**
 * Created by cdxiaqing1 on 2015/12/23.
 */

(function (w, $) {
    function addGoodsProperty(opts) {
        /**
         * 默认参数配置
         * @type {{node: null}}
         */
        var defaultOpts = {
            node: null
        };
        /**
         * 属性选择容器
         */
        this.node = opts.node;
        this.propertyBox = opts.node.find('.property_item');
        this.imgBox = opts.node.find('.property_img');

        /**
         * 当前勾选属性的index
         */
        this.propertyIndex = 0;
        /**
         * 当前勾选属性的key
         */
        this.propertyKey = 0;
        /**
         * 当前勾选属性的value
         */
        this.propertyVal = 0;
        /**
         * 参数合并
         */
        this.opts = $.extend(opts);

        this._init();
    }

    $.extend(addGoodsProperty.prototype, {
        /**
         * 初始化入口
         * @private
         */
        _init: function () {
            var self = this;
            self.proItem = self.propertyBox.find('.property_goods');
            self.goodsTotal = self.node.find('.goods_total').parents('.item');
            self._addEvent();
            self._setIndex();
            self._propertyManageBind();
        },
        /**
         * 类目tab初始化
         * @private
         */
        _setIndex: function () {
            var self = this;
            self.proItem.each(function (index, item) {
                $(item).attr('index', index);
            });
        },
        /**
         * 渲染
         * @param data
         * @param index
         * @private
         */
        _renderProduct: function (data, index) {},
        _propertyManageBind: function () {
            var self = this;
            //属性管理 0-新增 1-编辑 2-保存 3-取消
            self.node.parents('body').delegate('.add_property', 'click', function () {
                self._attributeManage($(this), 0);
            });

            self.node.parents('body').delegate('.edit_property', 'click', function () {
                self._attributeManage($(this), 1);
            });

            self.node.parents('body').delegate('.save_property', 'click', function () {
                self._attributeManage($(this), 2);
            });

            self.node.parents('body').delegate('.cancel_property', 'click', function () {
                self._attributeManage($(this), 3);
            });
        },
        /**
         * 事件绑定
         * @private
         */
        _addEvent: function () {
            var self = this;

            //勾选属性框事件绑定
            self.proItem.delegate('input[type=checkbox]', 'change', function () {
                var eachValObj = {};
                var $this = $(this);
                var beCheckedLength = self.proItem.find('input[type=checkbox]:checked').length;
                var propertyName = $this.parents('.checktd').siblings('.sort_tree').find('span').data('value');
                eachValObj = $this.data();

                self._goodsTotal(beCheckedLength);
                if ($this.prop('checked')) {
                    self._newSkuImg(eachValObj, propertyName);
                } else {
                    self._delSkuImg(eachValObj);
                }

                var skuDatas = self._getPropertys();
                skuDatas = self._adapterSkuData(skuDatas);
                self._renderPropertyTable(skuDatas, $('#ipt_venderType').val() == 'true');
            });

            //添加库存自动计算
            $('.property_table').delegate('input[name=stock]', 'change', function () {
                self._addTotal();
            });
            //"上传图片"（移动至图片上传区域）按钮事件绑定
            self.node.delegate('.upload_img', 'click', function () {
                var thisImgArea = $(this).parents('.img_show');
                self._moveImgArea(thisImgArea);
            });
            //上传图片功能
            self.node.delegate('.upload_img_btn', 'click', function () {
                $('#uploadImg').on('change', function () {
                    var uploadData = {
                        format: $('.img_size').text()
                    };
                    var lisLi = $('.upload_dom').prev('.img_show').find('ul').find('li');
                    if (lisLi.find('img').length < 6) {
                        self._uploadImg(uploadData);
                    } else {
                        alert('最多只能上传6张哦');
                    }
                });
            });
            //图片空间选择图片
            self.node.delegate('.image_space_list li:not(.current)', 'click', function () {
                var $this = $(this);
                var lisLi = $('.upload_dom').prev('.img_show').find('ul').find('li');
                if (lisLi.find('img').length < 6) {
                    var imgSrc = $this.find('img').attr('src');
                    var lis = lisLi.find('p');
                    $this.addClass('current');
                    lis.eq(0).parent('li').html('<div class="img-icon"><i class="del"></i></div><img src="' + imgSrc + '">');
                } else {
                    alert('最多只能上传6张哦');
                }
            });

            //上传商品資質功能
            self.node.delegate('.upload_qual_btn', 'click', function () {
                $('#uploadQual').on('change', function () {
                    var uploadData = {
                        format: $('.qual_size').text()
                    };
                    var lisLi = $('.upload_qual').prev('.qual_show').find('ul').find('li');
                    if (lisLi.find('img').length < 10) {
                        self._uploadQual(uploadData);
                    } else {
                        alert('最多只能上传10张哦');
                    }
                });
            });
            ////sku数据拼装log
            //self.node.delegate('.property_table th','click',function(){
            //    console.log(self._getPropertysTableData())
            //});
            //保存并铺货
            self.node.delegate('.b_save_post_goods', 'click', function () {
                var $this = $(this);
                var pcDes = self.node.find('.nicEdit-main').html();
                var userJson = self._commitData(true, true);
                var allInput = self.node.find('input,select');
                var temHtml = '<div class="loading"></div>';
                var imgFlag = true;
                if ($.trim(pcDes) == '') {
                    alert('添加商品描述');
                } else {
                    $('.img_show').each(function () {
                        var imgLen = $(this).find('img').length;
                        if (imgLen < 1 || imgLen > 5) {
                            imgFlag = false;
                        }
                    });
                    if (imgFlag) {
                        var spuState = $('#spuState').val();
                        if (typeof spuState == 'undefined') {
                            spuState = 2;
                        }
                        var isStand = $('#isStand').val();
                        var typeStand = $('#type').val();
                        var str = '';
                        if (isStand == '1') {
                            str = '/vender/b/standproduct/publish?spuState=' + spuState + '&type=' + typeStand;
                        } else {
                            str = '/vender/b/product/publish.htm?spuState=' + spuState;
                        }
                        $this.checkForm({
                            node: allInput,
                            errorTips: 'border',
                            failfun: 'scroll',
                            succ: function () {
                                $('body').append(temHtml);
                                $.ajax({
                                    url: str,
                                    data: userJson,
                                    type: 'post',
                                    success: function (data) {
                                        $('.loading').remove();
                                        $('.popup').html(data.messages.popup).show();
                                    },
                                    error: function () {
                                        $('.loading').remove();
                                        alert('商品保存失败，请稍后再试');
                                    }
                                });
                            }
                        });
                    } else if (!imgFlag) {
                        alert('商品图片至少1张，至多5张哦');
                    }
                }
            });
            //删除上传的图片
            self.node.find('.property_img').delegate('.img-icon .del', 'click', function () {
                var $li = $(this).parents('li');
                var $liIndex = $li.index();
                var thisSrc = $li.find('img').attr('src');
                var $list = $('.image_space_list').find('li.current');
                $list.each(function (i) {
                    if (thisSrc == $list.eq(i).find('img').attr('src')) {
                        $list.eq(i).removeClass('current');
                    }
                });
                $li.find('img').remove();
                if ($liIndex === 0) {
                    $li.html('<p>主图</p>');
                } else {
                    $li.html('<p>细节图</p>');
                }
                $(this).remove();
            });
            //使用商品图片
            self.node.find('.property_img').delegate('.use_main_img', 'click', function () {
                var mainHtml = null;
                var $this = $(this);
                $('.img_show').eq(0).find('.img_area').find('li').each(function (i) {
                    mainHtml = $(this).html();
                    $this.parents('.img_show').find('.img_area').find('li').eq(i).html(mainHtml);
                });
            });

            //Input交互
            self.node.find('input').on('keyup', function () {
                var $this = $(this);
                var maxLen = $this.data('maxlength');
                var thisLen = $this.val().length;
                var leftLen = parseInt(maxLen) - parseInt(thisLen);
                if (leftLen >= 0) {
                    var leftLenInt = leftLen > 9 ? leftLen : '0' + leftLen;
                    var lentips = '还能输入' + leftLenInt + '个字';
                    $this.removeClass('error');
                    if (maxLen) {
                        $this.siblings('span').text(lentips).css('visibility', 'visible');
                    }
                }
            });

            //勾选后，编辑商品属性
            self.goodsTotal.delegate('.edit_attr', 'click', function () {
                $(this).parents('.edit_attr_detail').hide();
                self.node.find('.choose_attr_detail').show();
            });
            self.node.find('.property_item').delegate('.choose_attr', 'click', function () {
                $(this).parents('.choose_attr_detail').hide();
                self.node.find('.edit_attr_detail').show();
            });

            //根据经营名称获取经营范围列表
            self.node.find('.range-name').change(function () {
                var catId = $(this).val();
                self.getScopeList(catId, '');
            });

            //选择经营范围
            self.node.find('.range-content').delegate('input[type="radio"]', 'click', function () {
                var scopeObj = $(this).data();
                $(this).parent().siblings().find('input[type="radio"]').attr('checked', false);
                var resultParent = $('.range-result');
                resultParent.find('#scopeId').val(scopeObj.scopeName);
                resultParent.find('#scopeId').removeClass('must');
                resultParent.find('.scopeId').val(scopeObj.scopeId);
                resultParent.find('.scopeName').val(scopeObj.scopeName);
                resultParent.find('.warePoolId').val(scopeObj.warePoolId);
            });

            //筛选经营范围
            self.node.find('.range-condition').delegate('.search_btn', 'click', function () {
                var keyword = $.trim($(this).parent().find('input').val());
                var catId = $.trim($('.range-name').val());
                self.getScopeList(catId, keyword);
            });

            //是否拆零
            self.node.find('#isSplit').change(function () {
                var packTypeHtml = '';
                var splitType = $(this).find('option:selected').attr('data-attr-value');
                switch (splitType) {
                    case '是':
                        packTypeHtml = '\
                        <option selected="" disabled="" value="" class="hide">--请选择--</option>\
                        <option value="1" data-attr-value="不拆零(小包)" data-attr-id="101" data-attr-value-id="1">不拆零(小包)</option>';
                        break;
                    case '否':
                        packTypeHtml = '\
                        <option selected="" disabled="" value="" class="hide">--请选择--</option>\
                        <option value="2" data-attr-value="中包" data-attr-id="101" data-attr-value-id="2">中包</option>\
                        <option value="3" data-attr-value="件装" data-attr-id="101" data-attr-value-id="3">件装</option> ';
                        break;
                    default:
                        packTypeHtml = '<option selected="" disabled="" value="" class="hide">--请选择--</option>';
                }
                self.node.find('#splitUnit').html(packTypeHtml);
            });
        },
        /**
         * 属性管理
         */
        _attributeManage: function (node, index) {
            var self = this;
            var popupCard = node.parents('.popup_card');
            var thisTr = node.parents('tr');
            var cloneTr = popupCard.find('.size_list').find('table').find('tr:last-child');
            var lastTr = popupCard.find('.size_list').find('table');
            var newBtn = '';

            switch (index) {
                case 0:
                    //新增
                    var lastIndex = parseInt(cloneTr.find('.this_index').text());
                    if (isNaN(lastIndex)) {} else {
                        newBtn = '<div class="smallbtn btnblue inline edit_property"><a>编辑</a></div><div class="smallbtn btnblue inline save_property"><a>保存</a></div><div class="smallbtn btnblue inline cancel_property"><a>取消</a></div>';
                        $(lastTr).append(cloneTr.clone());
                        popupCard.find('.size_list').find('table').find('tr:last-child').find('.this_act').html(newBtn);
                        popupCard.find('.size_list').find('table').find('tr:last-child').attr('data-id', '');
                    }

                    break;
                case 1:
                    //编辑
                    newBtn = '<div class="smallbtn btnblue inline save_property"><a>保存</a></div><div class="smallbtn btnblue inline cancel_property"><a>删除</a></div>';

                    thisTr.find('td').not($('.this_act')).not($('.this_index')).not($('.this_color')).each(function () {
                        var thisVal = $(this).text();
                        var thisName = $(this).attr('name');
                        var temHtml = '<input type="text" value="' + thisVal + '"name="' + thisName + '">';
                        $(this).html(temHtml);
                    });
                    node.parents('td').html(newBtn);
                    break;
                case 2:
                    //保存
                    newBtn = '<div class="smallbtn btnblue inline edit_property"><a>编辑</a></div>';
                    thisTr.find('td').not($('.this_act')).not($('.this_index')).not($('.this_color')).each(function () {
                        var thisVal = $(this).find('input').val();
                        $(this).html(thisVal);
                    });
                    node.parents('td').html(newBtn);
                    break;
                case 3:
                    //取消
                    thisTr.remove();
                    break;
                default:
                    break;
            }
            //刷新序号
            popupCard.find('td.this_index').each(function () {
                var updataIndex = $(this).parents('tr').index();
                $(this).html(updataIndex);
            });
        },
        /**
         * 库存总数input框逻辑
         * @param num
         * @private
         */
        _goodsTotal: function (num) {
            var self = this;

            //有勾选属性时 总库存禁止输入
            if (num > 0) {
                self.goodsTotal.find('.edit_attr_detail').show();
                self.goodsTotal.find('input').attr('disabled', 'disabled');
                self._addTotal();
            } else {
                self.goodsTotal.find('input').removeAttr('disabled');
                self.goodsTotal.find('.edit_attr_detail').hide();
            }
        },
        _addTotal: function () {
            var self = this;
            var stockTotal = 0;
            $('.property_table').find('input[name=stock]').each(function () {
                stockTotal += Number($(this).val());
            });
            self.goodsTotal.find('.goods_total').find('input').val(stockTotal);
        },
        /**
         * 根据勾选的获取sku数据
         * @returns {Array}
         * @private
         */
        _getPropertys: function () {
            var self = this;
            var datas = [];
            var obj = {};
            self.proItem.each(function (i, item) {
                obj = {};
                var $item = $(item);
                var property = $item.find('.sort_tree span');
                var checkboxs = $item.find('.checktd input');
                var checkbox;
                var checkboxData = [];
                var checkboxObj = {};

                for (var i = 0; i < checkboxs.length; i++) {
                    if (checkboxs.eq(i).prop('checked')) {
                        checkbox = checkboxs.eq(i);
                        checkboxObj = {};
                        checkboxObj.attrId = checkbox.attr('data-id');
                        checkboxObj.value = checkbox.attr('data-value');
                        // checkboxObj.value = checkbox.parents('td').text();
                        checkboxData.push(checkboxObj);
                    }
                }

                if (checkboxData.length) {
                    obj.checkboxs = checkboxData;
                    datas.push(obj);
                    obj.attrId = property.attr('data-id');
                    // obj.key = property.attr('data-attr-key');
                    obj.value = property.attr('data-value');
                    // obj.value = property.text();
                }
            });
            //console.log(datas);
            return datas;
        },
        /**
         * 适配为渲染table所需的数据格式
         * @param propertys
         * @returns {{headData: Array, list: *}}
         * @private
         */

        _adapterSkuData: function (propertys) {
            var self = this;
            var headData = [];
            var skuListData = [];
            var item = {};
            var nowTableTr = $('.property_table').find('tr[data-key]');
            var nowTableArr = [];

            var obj1, obj2;

            if (!propertys.length) {
                console.log('选择的销售属性为空');
            }

            obj1 = propertys[0];
            for (var i = 0; i < propertys.length; i++) {
                if (i == 0) {
                    obj1 = self._renderData(obj1);
                } else {
                    obj2 = propertys[i];
                    obj1 = self._renderData(obj1, obj2);
                }
                var headTd = {};
                headTd.text = propertys[i].value;
                headData.push(headTd);
            }

            for (var j = 0, nl = nowTableTr.size(); j < nl; j++) {
                var trEach = nowTableTr[j];
                var nowTableObj = {};
                var nowKey = $(trEach).data('key');
                var nowPrice = $(trEach).find('input[name=price]').val();
                var nowWholesalePrice = $(trEach).find('input[name=wholesalePrice]').val();
                var nowstock = $(trEach).find('input[name=stock]').val();
                var nowPackageNum = $(trEach).find('input[name=packageNum]').val();
                var nowskuAlias = $(trEach).find('input[name=skuAlias]').val();
                nowTableObj.nowKey = nowKey;
                nowTableObj.nowPrice = nowPrice;
                nowTableObj.nowWholesalePrice = nowWholesalePrice;
                nowTableObj.nowstock = nowstock;
                nowTableObj.nowPackageNum = nowPackageNum;
                nowTableObj.nowskuAlias = nowskuAlias;
                nowTableArr.push(nowTableObj);
            }

            for (var k in obj1) {
                var newTrData = obj1[k];
                //console.log(newTrData.key);
                for (var m in nowTableArr) {
                    var nowTrData = nowTableArr[m];
                    //console.log(nowTrData.nowKey);
                    if (newTrData.key == nowTrData.nowKey) {
                        //console.log(nowTrData.nowPrice);
                        newTrData.price = nowTrData.nowPrice;
                        newTrData.wholesalePrice = nowTrData.nowWholesalePrice;
                        newTrData.stock = nowTrData.nowstock;
                        newTrData.packageNum = nowTrData.nowPackageNum;
                        newTrData.skuAlias = nowTrData.nowskuAlias;
                    }
                }
            }

            //console.log(obj1);

            // return obj1;
            return {
                headData: headData,
                list: obj1
            };
        },
        /**
         * 适配为渲染table所需的数据格式
         * @param obj1
         * @param obj2
         * @returns {Array}
         * @private
         */
        _renderData: function (obj1, obj2) {
            var result = [];
            var obj = {};
            var saleAttr = {};
            var nowTableTr = $('.property_table').find('tr[data-key]');
            if (!obj2) {
                // console.log('第一个初始化的情况');
                for (var i = 0; i < obj1.checkboxs.length; i++) {
                    var check1 = obj1.checkboxs[i];

                    obj = {};
                    obj.tds = [];
                    var td2 = {};
                    td2.rowspan = 1;
                    td2.text = check1.value;
                    obj.tds.push(td2);

                    obj.saleAttrs = [];
                    saleAttr = {};
                    saleAttr.saleAttr = {};
                    saleAttr.saleAttr.attrId = obj1.attrId;
                    saleAttr.saleAttr.value = obj1.value;
                    saleAttr.children = [{
                        attrId: check1.attrId,
                        value: check1.value
                    }];
                    obj.saleAttrs.push(saleAttr);

                    if (obj1.value == '颜色') {
                        obj.color = check1.attrId;
                    }

                    obj.key = check1.attrId;
                    obj.value = check1.value;

                    //if(nowTableTr[i]){
                    //    var tr1 = nowTableTr[i];
                    //    if($(tr1).data('key') == check1.attrId){
                    //        obj.price = $(tr1).find('input[name=price]').val();
                    //        obj.stock = $(tr1).find('input[name=stock]').val();
                    //        obj.skuAlias = $(tr1).find('input[name=skuAlias]').val();
                    //    }
                    //}

                    result.push(obj);
                }
                return result;
            }
            // console.log('大于1个的情况');
            for (var i = 0; i < obj1.length; i++) {
                var check1 = obj1[i];
                for (var j = 0; j < obj2.checkboxs.length; j++) {
                    var check2 = obj2.checkboxs[j];
                    var saleAttrs1 = check1.saleAttrs;

                    obj = {};
                    obj.tds = [];
                    var td2 = {};
                    td2.rowspan = 1;
                    td2.text = check2.value;
                    obj.tds.push(td2);

                    obj.saleAttrs = saleAttrs1.concat([]);

                    var saleAttr2 = {};
                    saleAttr2.saleAttr = {};
                    saleAttr2.saleAttr.attrId = obj2.attrId;
                    saleAttr2.saleAttr.value = obj2.value;
                    saleAttr2.children = [{
                        attrId: check2.attrId,
                        value: check2.value
                    }];
                    obj.saleAttrs.push(saleAttr2);

                    if (check1.color) {
                        obj.color = check1.color;
                    }
                    if (obj2.value == '颜色') {
                        obj.color = check2.attrId;
                    }

                    obj.key = check1.key + '-' + check2.attrId;

                    obj.value = check2.value;

                    result.push(obj);
                }

                for (var k = check1.tds.length - 1; k >= 0; k--) {
                    var td1 = check1.tds[k];
                    // console.log(td1.rowspan);
                    td1.rowspan = td1.rowspan * obj2.checkboxs.length;
                    result[i * j].tds.unshift(td1);
                }
            }

            //console.log(result);
            return result;
        },
        /**
         * 渲染表格
         * @param data
         * @returns {boolean}
         * @private
         */
        _renderPropertyTable: function (data, showWholesale) {
            //console.log(data);
            var self = this;
            if (!data.list) {
                $('.property_table').html('').data('skuDatas', null);
                return false;
            }
            var tmp;
            if (showWholesale) {
                tmp = ['<table>', '<thead>', '<tr>', '{{#each headData}}<th>{{text}}</th>{{/each}}', '<th>零售价</th>', '<th>批发价</th>', '<th>库存</th>', '<th class="hide">包装数量</th>', '<th>sku别名</th>', '</tr>', '</thead>', '<tbody>', '{{#each list}}<tr {{#if color}} data-color="{{color}}"{{/if}} data-key="{{key}}">', '{{#each tds}}<td rowspan="{{rowspan}}">{{text}}</td>{{/each}}', '<td><input class="inputOnlyFloat" type="text" name="price" maxlength="8" value="{{price}}"></td>', '<td><input class="inputOnlyFloat" type="text" name="wholesalePrice" maxlength="8"  value="{{wholesalePrice}}" placeholder="此项为必填项" data-must="must"></td>', '<td><input class="inputOnlyLong" type="text" name="stock" maxlength="9" value="{{stock}}"></td>', '<td class="hide"><input type="text" name="packageNum" value="1"></td>', '<td><input type="text" name="skuAlias" value="{{skuAlias}}"></td>', '</tr>{{/each}}', '</tbody>', '</table>'].join('');
            } else {
                tmp = ['<table>', '<thead>', '<tr>', '{{#each headData}}<th>{{text}}</th>{{/each}}', '<th>价格</th>', '<th>库存</th>', '<th>包装数量</th>', '<th>sku别名</th>', '</tr>', '</thead>', '<tbody>', '{{#each list}}<tr {{#if color}} data-color="{{color}}"{{/if}} data-key="{{key}}">', '{{#each tds}}<td rowspan="{{rowspan}}">{{text}}</td>{{/each}}', '<td><input class="inputOnlyFloat" type="text" name="price" maxlength="8" value="{{price}}"></td>', '<td><input class="inputOnlyLong" type="text" name="stock" maxlength="9" value="{{stock}}"></td>', '<td><input type="text" name="packageNum" value="{{packageNum}}"></td>', '<td><input type="text" name="skuAlias" value="{{skuAlias}}"></td>', '</tr>{{/each}}', '</tbody>', '</table>'].join('');
            }

            template = Handlebars.compile(tmp);
            html = template(data);
            $('.property_table').html(html).data('skuDatas', data.list);

            //更新库存量
            var stockTotal = 0;
            $('.property_table').find('input[name=stock]').each(function () {
                stockTotal += Number($(this).val());
            });
            self.goodsTotal.find('.goods_total').find('input').val(stockTotal);
        },
        /**
         * 新增颜色新增组图
         * @param eachValObj
         * @param name
         * @private
         */
        _newSkuImg: function (eachValObj, name) {
            var self = this;
            var imgAreaNode = self.node.find('.img_goods');
            var imgHtml = '<div class="img_show clear">' + '<div class="title fl">' + '<p data-key="' + eachValObj.id + '" data-color="' + eachValObj.value + '" data-color-id="' + eachValObj.id + '"><i class="need">*</i>' + eachValObj.value + '</p>' + '<span>至少5张</span>' + '</div>' + '<div class="img_area">' + '<ul>' + '<li><p>主图</p></li>' + '<li><p>细节图</p></li>' + '<li><p>细节图</p></li>' + '<li><p>细节图</p></li>' + '<li><p>细节图</p></li>' + '<li><p>细节图</p></li>' + '</ul>' + '</div>' + '<div class="btnblue medbtn fr use_main_img">使用商品图片</div>' + '<div class="upload_img fr">上传图片<div class="upload_btn"></div></div>' + '</div>';

            if (name === '颜色') {
                $(imgAreaNode).append(imgHtml);
            }
        },
        /**
         * 取消颜色check删除组图
         * @param eachValObj
         * @param name
         * @private
         */
        _delSkuImg: function (eachValObj) {
            $('.property_img').find('.img_show').each(function () {
                var key = $(this).find('p').data('key');
                if (key == eachValObj.id) {
                    $(this).remove();
                }
            });
        },
        /**
         * 获取表格的值
         * @returns {*}
         * @private
         */
        _getPropertysTableData: function () {
            var self = this;
            var trs = $('.property_table tbody tr');
            var skuDatas = null;

            if ($('.property_table').data('skuDatas')) {
                skuDatas = $('.property_table').data('skuDatas');
            } else {
                var data = self._adapterSkuData(self._getPropertys());
                skuDatas = data.list;
                //self._renderPropertyTable(skuDatas);
            }

            var result = [];
            if (!trs.length) {
                return [];
            }
            trs.each(function (i, el) {
                var tr = $(el);
                var obj = {};
                var key = tr.attr('data-key');
                obj.stock = tr.find('input[name=stock]').val();
                obj.price = tr.find('input[name="price"]').val();
                obj.wholesalePrice = tr.find('input[name="wholesalePrice"]').val();
                obj.packageNum = tr.find('input[name="packageNum"]').val();
                obj.skuAlias = tr.find('input[name="skuAlias"]').val();
                for (var i = 0; i < skuDatas.length; i++) {
                    if (key == skuDatas[i].key) {
                        obj.saleAttrs = skuDatas[i].saleAttrs;
                    }
                }

                if (tr.attr('data-color')) {

                    self.imgBox.find('.img_show').each(function () {
                        var $this = $(this);
                        var imgData = $this.find('p').data('color-id');
                        var imgDataColor = imgData == tr.attr('data-color');

                        //console.log(imgData);
                        if (imgDataColor) {
                            var skuImages = [];
                            $this.find('.img_area').find('img').each(function () {
                                var skuImagesObj = {};
                                var imgSrc = $(this).attr('src');
                                var imgSrcIndex = $(this).parents('li').index();
                                if (imgSrc) {
                                    skuImagesObj.imagePath = imgSrc;
                                    skuImagesObj.imageIndex = imgSrcIndex + 1;
                                    skuImagesObj.colorId = imgData;
                                }
                                skuImages.push(skuImagesObj);
                            });
                            obj.skuImages = skuImages;
                        }
                    });
                }

                result.push(obj);
            });
            // console.log('skuList:', result);
            return result;
        },
        _getAddTableData: function () {
            $table = $('addTable'); //后来添加的table数据
            var priceList = [];
            //
            $table.find('input').each(function (index, obj) {
                var a = {},
                    $t = $(obj);
                a.priceLevel = $t.attr('data-priceLevel');
                a.levelName = $t.attr('data-levelName');
                a.priceValue = $t.attr('data-priceValue');
            });
            return priceList;
        },
        /**
         * 获取商品资质数据
         * @returns {*}
         * @private
         */
        _getWareQualifiesData: function () {
            var self = this;
            var obj = [];

            self.imgBox.find('.qual_show').each(function () {
                var $this = $(this);
                $this.find('.img_area').find('img').each(function () {
                    var skuImagesObj = {};
                    var imgSrc = $(this).attr('src');
                    var imgSrcIndex = $(this).parents('li').index();
                    if (imgSrc) {
                        skuImagesObj.imagePath = imgSrc;
                        skuImagesObj.imageIndex = imgSrcIndex + 1;
                    }
                    obj.push(skuImagesObj);
                });
            });
            return obj;
        },
        /**
         * 移动“上传图片模块”至当前组图下方
         * @private
         */
        _moveImgArea: function (node) {
            var self = this;
            var imgAreaNode = self.node.find('.upload_dom');
            $(node).after(imgAreaNode);
        },

        /**
         * 上传图片
         * @param uploadData
         * @private
         */
        _uploadImg: function (uploadData) {
            $.ajaxFileUpload({
                type: 'POST', //当要提交自定义参数时，这个参数要设置成POST
                //url: '/vender/image/upload.htm', //用于文件上传的服务器端请求地址
                url: '/vender/image/upload.htm', //用于文件上传的服务器端请求地址
                data: uploadData, //自定义参数
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'uploadImg', //文件上传域的id
                dataType: 'text', //返回值类型 一般设置为json
                success: function (data, status) {
                    data = eval('(' + data + ')');
                    if (data.result == true) {
                        var images = data.messages.list;
                        var lis = $('.upload_dom').prev('.img_show').find('ul').find('li p');
                        for (var i = 0; i < images.length; i++) {
                            if (images[i].code == 0) {
                                lis.eq(i).parent('li').html('<div class="img-icon"><i class="del"></i></div><img src="' + images[i].imgName + '">');
                            } else {
                                // alert(images[i].msg);
                            }
                        }
                    }
                },
                error: function (e) {
                    // console.log(e);
                }
            });
        },
        /**
         * 上传商品資質
         * @param uploadData
         * @private
         */
        _uploadQual: function (uploadData) {
            $.ajaxFileUpload({
                type: 'POST', //当要提交自定义参数时，这个参数要设置成POST
                //url: '/vender/image/upload.htm', //用于文件上传的服务器端请求地址
                url: '/vender/image/uploadQual.htm', //用于文件上传的服务器端请求地址
                data: uploadData, //自定义参数
                secureuri: false, //是否需要安全协议，一般设置为false
                fileElementId: 'uploadQual', //文件上传域的id
                dataType: 'text', //返回值类型 一般设置为json
                success: function (data, status) {
                    data = eval('(' + data + ')');
                    if (data.result == true) {
                        var images = data.messages.list;
                        var lis = $('.upload_qual').prev('.qual_show').find('ul').find('li p');
                        for (var i = 0; i < images.length; i++) {
                            if (images[i].code == 0) {
                                lis.eq(i).parent('li').html('<div class="img-icon"><i class="del"></i></div><img src="' + images[i].imgName + '">');
                            } else {
                                alert(images[i].msg);
                            }
                        }
                    }
                },
                error: function (e) {}
            });
        },
        /**
         * 拼接SPU数据
         * @returns {{}}
         * @private
         */
        _spuData: function () {
            var self = this;
            var spuJson = {}; //spu


            //写入input数据
            self.node.find('input[type=text]').each(function () {
                var $this = $(this);
                if ($this.val() != '' && $this.data('sort') == 'bWare') {
                    var spuKey = $this.attr('name');
                    var spuVal = $this.val();
                    spuJson[spuKey] = spuVal;
                }
            });
            //写入selcet数据
            self.node.find('select').find('option:selected').each(function () {
                var $this = $(this);
                if ($this.val() != '' && $this.parents('select').data('sort') == 'bWare') {
                    var spuKey = $this.data();
                    for (var i in spuKey) {
                        spuJson[i] = spuKey[i];
                    }
                }
            });
            //spu主图
            self.imgBox.find('.img_show').each(function () {
                var $this = $(this);
                var imgDataColor = $this.find('p').attr('data-sort') == 'bWare';
                var spuImages = [];

                if (imgDataColor) {
                    $this.find('.img_area').find('img').each(function () {
                        var spuImagesObj = {};
                        var imgSrc = $(this).attr('src');
                        var imgSrcIndex = $(this).parents('li').index();
                        if (imgSrc) {
                            spuImagesObj.imagePath = imgSrc;
                            spuImagesObj.imageIndex = imgSrcIndex + 1;
                        }
                        spuImages.push(spuImagesObj);
                    });

                    spuJson.images = spuImages;
                }
            });
            //富文本编辑器内容
            self.node.find('.nicEdit-main').each(function () {
                var $this = $(this);
                var spuVal = $this.html();
                spuJson.pcDes = spuVal;
            });

            // console.log('spuJson:',spuJson);
            return spuJson;
        },
        /**
         * 拼装attr数据
         * @returns {Array}
         * @private
         */
        _attrData: function () {
            var self = this;
            //写入商品属性数据
            var attrs = []; //商品属性

            self.node.find('.spu_attrs').find('option:selected').each(function () {
                var $this = $(this);
                //经营范围单独获取，不在attrs字段里面
                if ($this.val() != '' && !$this.parent().hasClass('range-name')) {
                    var attrData = $this.data();
                    attrs.push(attrData);
                }
            });
            self.node.find('.spu_attrs').find('input').each(function () {
                var $this = $(this);
                var thisKey = $this.attr('name');
                if ($this.val() != '' && typeof thisKey !== 'undefined') {
                    var attrData = {};
                    attrData[thisKey] = $this.val();
                    attrData['attrKey'] = $this.data('attr-key');
                    attrs.push(attrData);
                }
            });
            //console.log('attrs:',attrs);

            return attrs;
        },
        /**
         * 拼装scope数据
         * @returns {Array}
         * @private
         */
        _scopeData: function () {
            var parent = $('.range-result');
            return {
                scopeId: parent.find('.scopeId').val(),
                scopeName: parent.find('.scopeName').val(),
                warePoolId: parent.find('.warePoolId').val()
            };
        },
        /**
         * 数据提交
         * @private
         */
        _commitData: function (scopeNeeded) {
            var self = this;
            var commitData = {};
            var commitDataResult = {};
            commitData.bWare = self._spuData();
            commitData.attrs = self._attrData();
            if (scopeNeeded) {
                commitData.scopeVOs = self._scopeData();
            }
            commitData.skuList = self._getPropertysTableData();
            commitData.priceList = self._getAddTableData();
            commitData.qualifyList = self._getWareQualifiesData();
            commitDataResult.products = JSON.stringify(commitData);
            // console.log(commitDataResult);

            return commitDataResult;
        },
        /**
         * 重新加载
         */
        reload: function () {
            this._init();
        },
        /**
         * 根据经营名称获取经营范围列表
         * scopesList由页面输出
         * @returns
         * @private
         */
        getScopeList: function (catId, keyword) {
            var self = this;
            if (typeof scopesList == 'undefined' || scopesList == null) return;
            for (var i = 0; i < scopesList.length; i++) {
                var scopeObj = scopesList[i];
                if (scopeObj.categoryId == catId) {
                    var scopeList = scopeObj.scopeVOs;
                    var newScopeList = [];
                    if (keyword.length) {
                        newScopeList = scopeList.filter(function (scope) {
                            return scope.scopeName.indexOf(keyword) !== -1 ? true : false;
                        });
                    } else {
                        newScopeList = scopeList;
                    }
                    self.renderScopeList(newScopeList);
                    break;
                }
            }
        },
        /**
         * 渲染经营范围列表
         * @returns
         * @private
         */
        renderScopeList: function (scopeList) {
            var scopeHtml = '';
            for (var i = 0; i < scopeList.length; i++) {
                var scopeItem = scopeList[i];
                scopeHtml += '<label><input type="radio" data-scope-id="' + scopeItem.scopeId + '" data-scope-name="' + scopeItem.scopeName + '" data-ware-pool-id="' + scopeItem.warePoolId + '">' + scopeItem.scopeName + '</label>';
            }
            $('.range .range-content').html(scopeHtml);
        }
    });

    /**
     * 暴露全局变量
     */
    if (!w.addGoodsProperty) {
        w.addGoodsProperty = function () {
            new addGoodsProperty({
                node: $('.add_goods_s2')
            });
        };
    }

    /**
     * 商品推荐入口
     */
    $(function () {
        w.addGoodsProperty();
    });
})(window, jQuery);
/**
 * Created by cdxiaqing1 on 2015/12/17.
 */
$(function () {
    /**
     * 渠道管理-经销商详情-tabCard切换
     */
    $('.sy_channel_detail').delegate('.tab_card ul li', 'click', function () {
        var $this = $(this);
        var $thisIndex = $this.index();
        $('.detail_card').hide();
        switch ($thisIndex) {
            case 0:
                $('.register_info').show();
                break;
            case 1:
                $('.basic_info').show();
                break;
            case 2:
                $('.qualify_info').show();
                break;
            case 3:
                $('.address_info').show();
                break;
            case 4:
                $('.invoice_info').show();
                break;
        }
    });

    /**
     * 渠道管理-经销商详情-资质信息-查看缩略图
     */
    $('.sy_channel_detail').delegate('.qualify_img', 'click', function () {
        var node = $(this).find('img');
        var nodeName = $(this).find('p').text();
        showBigImg(node, nodeName);
    });

    function showBigImg(node, nodeName) {
        var src = node.attr('src');
        var showPopupHtml = '<div class="popup_card freight_popup ">' + '<div class="popup_close"><div class="close_css"></div></div>' + '<div class="popup_sure">' + '<div class="popup_title">' + nodeName + '</div>' + '<div class="imgarea"><img src="' + src + '">' + '</div>' + '</div>' + '</div>';
        node.parents('body').find('.popup').html(showPopupHtml).show();
    }
});
/**
 * Created by cdxiaqing1 on 2015/12/17.
 */
$(function () {

    if (!placeholderSupport()) {
        $('[placeholder]').blur(function () {
            var input = $(this);
            if (input.val() == '' || input.val() == input.attr('placeholder')) {
                input.addClass('title');
                input.attr('title', input.attr('placeholder'));
            }
        }).blur();
    }

    function placeholderSupport() {
        return 'placeholder' in document.createElement('input');
    }

    /*
     $('[placeholder]').parents('form').submit(function() {
     $(this).find('[placeholder]').each(function() {
     var input = $(this);
     if (input.val() == input.attr('placeholder')) {
     input.val('');
     }
     })
     });*/
    /**
     * 渠道管理-经销商详情-tabCard切换
     */
    $('.sy_vender_detail').delegate('.tab_card ul li', 'click', function () {
        var $thisIndex = $(this).index();
        $('.detail_card').eq($thisIndex).show().siblings().hide();
    });
});
/**
 * Created by cdxiaqing1 on 2016/1/7.
 */
/**
 * 新增商品协议价 start
 */

$(function () {
    //渲染li的mok数据
    var mok = {
        'result': true,
        'messages': {
            'wareList': [{
                'wareId': 'spu222',
                'wareName': 'test222',
                'userPin': 'pin222'
            }, {
                'wareId': 'spu111',
                'wareName': 'test111',
                'userPin': 'pin111'
            }]
        }
    };

    /**
     * 模糊搜索框的输入事件
     */
    $('.filter_item').delegate('input', 'click', function (e) {
        var $this = $(this);
        $this.siblings('.search_keyup_box').find('ul li').show();
        e.stopPropagation();
    });
    $('.filter_item').delegate('input', 'keyup', function () {
        var $this = $(this);
        var thisVal = $this.val();
        $this.siblings('.search_keyup_box').find('ul li').hide().filter(':contains("' + thisVal + '")').show();
    });
    /**
     * 选择公司后发请求拿到药品的数据（格式如mok）
     */
    $('.main_content').delegate('#filter_com_list li', 'click', function (e) {
        var $this = $(this);
        chooseLiFn($this);
        var userJson = $this.data();
        $this.packajax({
            ajax_url: '/vender/b/product/wareList.htm',
            user: userJson,
            succ: renderLiFn
        });
        //renderLiFn(mok);
        e.stopPropagation();
    });
    $('body').on('click', function () {
        var $this = $(this);
        $this.find('.search_keyup_box').find('ul li').hide();
    });
    $('.main_content').delegate('#filter_goods_list li', 'click', function () {
        var $this = $(this);
        chooseLiFn($this);
    });

    /**
     * 搜索-渲染表格
     */
    $('.main_content').delegate('#choose_discount_search', 'click', function () {
        var $this = $(this);
        var comName = $.trim($('#discount_add_choose_com').val());
        var goodsName = $.trim($('#goodsName').val());
        if (comName != '' && goodsName != '') {
            var userJson = $('#goodsName').data();
            var nowTableTr = $('.area_price_list').find('tr');
            var newDataWare = $('#goodsName').data('ware-id');
            var newDataUser = $('#goodsName').data('user-pin');
            var flag = true;
            //console.log(newDataUser);
            nowTableTr.each(function () {
                var thisWareId = $(this).data('ware-id');
                var thisUserPin = $(this).data('user-pin');
                if (thisWareId) {
                    if (thisWareId == newDataWare && thisUserPin == newDataUser) {
                        flag = false;
                    }
                }
            });
            if (flag) {
                $this.packajax({
                    ajax_url: '/vender/b/product/newCreateWare.htm',
                    user: userJson,
                    succ: discountSearchCallback
                });
            } else {
                alert('已经添加过该商品了');
            }
        } else {
            alert('请选择公司及商品');
        }
    });
    /**
     * 录入
     */
    $('.main_content').delegate('#set_add_discount', 'click', function () {
        var $this = $(this);
        var userArray = [];
        var eachTrJson = {};
        var userJson = {};
        var temHtml = '<div class="loading"></div>';
        $('.area_price_list').find('tr').each(function () {
            var $thisTr = $(this);
            eachTrJson = $thisTr.data();
            $thisTr.find('input').each(function () {
                var inputKey = $(this).attr('name');
                var inputVal = $(this).val();
                if (inputKey) {
                    eachTrJson[inputKey] = inputVal;
                }
            });
            if (!$.isEmptyObject(eachTrJson)) {
                userArray.push(eachTrJson);
            }
        });
        userJson['discountList'] = JSON.stringify(userArray);
        $('body').append(temHtml);
        $this.packajax({
            ajax_url: '/vender/b/product/save.htm',
            user: userJson,
            succ: showPopupCallback
        });
    });
    /**
     * 删除商品
     */
    $('.main_content').delegate('.dis_del_btn', 'click', function () {
        var nowRow = $(this).parents('.shop_table_list').find('tr').size() - 1;
        var thisRow = parseInt($(this).parents('td').attr('rowspan'));
        for (var i = 0; i < thisRow - 1; i++) {
            $(this).parents('tr').next().remove();
        }
        if (thisRow == nowRow) {
            $(this).parents('.shop_table_list').addClass('hide');
        }
        $(this).parents('tr').remove();
    });
    /**
     * 选择列表中的值
     * @param node
     */
    var chooseLiFn = function (node) {
        var thisVal = node.text();
        var thisData = node.data();
        node.parents('.search_keyup_box').siblings('input').val(thisVal).data(thisData);
        node.parents('.search_keyup_box').find('li').hide();
    };
    /**
     * 渲染药品列表
     * @param data
     */
    var renderLiFn = function (data) {
        if (data.result) {
            var list = data.messages.wareList;
            var listLen = list.length;
            var listHtml = '';
            for (var i = 0; i < listLen; i++) {
                var eachlist = list[i];
                listHtml += '<li title="' + eachlist.wareName + '"data-ware-id="' + eachlist.wareId + '" data-user-pin="' + eachlist.userPin + '">' + eachlist.wareName + '</li>';
            }
            $('#filter_goods_list').html(listHtml);
        }
    };

    /**
     * 搜索回调
     * @param data
     */
    var discountSearchCallback = function (data) {
        var tableBox = $('.data-return').find('.area_price_list');
        tableBox.removeClass('hide');
        tableBox.find('tbody').append(data);
    };
    /**
     * 弹窗回调
     */
    var showPopupCallback = function (data) {
        $('.popup').html(data.messages.popup).show();
        $('.loading').remove();
    };

    /**
     * 有效期-只能勾选今天以后的日期
     * <input class="laydate-icon fromNow" name="">
     */
    $('.main_content').delegate('.fromNow', 'click', function (event) {
        laydate(fromNow);
    });

    var fromNow = {
        min: laydate.now()
    };
});

/**
 * 新增商品协议价 end
 */
/**
 * Created by cdxiaqing1 on 2015/12/29.
 */

$(function () {

    /**
     * 经销商列表-修改地区逻辑 start
     */

    $('.wrapper').delegate('.choose_area', 'click', function () {
        var self = $(this);
        var trData = self.parents('tr').data();
        self.parents('tr').attr('data-now', 'now');

        var isEdit = self.val();
        $('.popup').find('input[type=checkbox]:not(":disabled")').prop('checked', false);
        $('.popup').data(trData);
        if (isEdit == '') {} else {
            freightEditCity(self);
        }
        $('.special_freight_info').parents('.popup').show();
    });

    //勾选一级类目时： 1可选子集全选逻辑；2可选被选子集勾选数量
    $('.popup').delegate('.special_freight_info input[type=checkbox]:not(".area_city")', 'change', function () {
        var $this = $(this);
        var beCheckedLength = null;
        var $thisName = $this.attr('data-name');
        var newName = [];
        var check_all_list = $this.siblings('.freight_city').find('input[type=checkbox]:not(":disabled")');

        $('.freight_city').hide();
        //$this.siblings('.freight_city').show();

        if ($this.prop('checked')) {
            check_all_list.prop('checked', true);
        } else {
            check_all_list.prop('checked', false);
        }

        //beCheckedLength = $this.siblings('.freight_city').find('input[type=checkbox]:not(":disabled"):checked').length;
        //$this.siblings('.freight_city').find('input[type=checkbox]:not(":disabled"):checked').each(function(){
        //    var shopName = $(this).attr('data-name');
        //    var eachName = $thisName + shopName;
        //    newName.push(eachName);
        //});
        //if(beCheckedLength > 0){
        //    $this.siblings('.ad_num').text('('+beCheckedLength+')');
        //    $this.data('name',newName);
        //}else{
        //    $this.siblings('.ad_num').text('');
        //}
    });

    //二级勾选框逻辑：二级地区的个数显示在一级地区旁
    //$('.popup').delegate('.freight_city input[type=checkbox]','change',function(){
    //    var $this = $(this);
    //    var $thisParent = $this.parents('.freight_city').siblings('.ad_num').siblings(':checkbox');
    //    var $thisName = $thisParent.attr('data-name');
    //    var beCheckedLength = $this.parents('.freight_city').find('input[type=checkbox]:not(":disabled"):checked').length;
    //    var newName = [];
    //    $this.parents('.freight_city').find('input[type=checkbox]:not(":disabled"):checked').each(function(){
    //        var shopName = $(this).attr('data-name');
    //        var eachName = $thisName + shopName;
    //        newName.push(eachName);
    //    });
    //    $this.parents('.freight_city').siblings('.ad_num').text('('+beCheckedLength+')');
    //    $thisParent.data('name',newName);
    //    if ($this.prop('checked')) {
    //        $thisParent.prop('checked',true);
    //    }
    //});

    //弹窗确认按钮
    $('.popup').delegate('.set_site_btn', 'click', function () {
        var $this = $(this);
        var area = '';
        var areaList = [];
        var cityId = null;
        var shopIdList = [];
        var shopIdObj = {};
        var nowTr = $('.main_content').find('.shop_table_list').find('tr[data-now]');
        var trData = $this.parents('.popup').data();
        var shopIdJson = {};
        var userJson = {};
        $this.parents('.popup').find('.special_freight_info input[type=checkbox]:not(".area_city"):not(":disabled"):checked').each(function () {
            $that = $(this);
            shopIdList = [];
            areaList.push($that.data('name'));
            cityId = $that.data('area-id');
            $that.siblings('.freight_city').find('input.area_city:not(":disabled"):checked').each(function () {
                shopIdList.push($(this).data('sale-type'));
            });
            shopIdObj[cityId] = shopIdList;
            $that.siblings('.ad_num').text('');
        });
        //参数合并
        shopIdJson['shopChecked'] = JSON.stringify(shopIdObj);
        userJson['areaCatDTOString'] = JSON.stringify($.extend({}, trData, shopIdJson));

        //console.log(userJson);
        $this.packajax({
            ajax_url: '/vender/b/product/editAreaCat.htm',
            user: userJson,
            succ: function (data) {
                if (data.result) {
                    $('.popup').html(data.messages.popup).show();
                    //area = areaList.join(',');
                    //$that.parents('.popup').hide();
                    //$that.removeAttr('checked');
                    //$that.parents('.popup').find('.freight_city').hide();
                    //nowTr.find('.choose_area').val(area).attr('title',area);
                    //nowTr.find('.choose_area').data('checked',shopIdObj);
                    //nowTr.removeAttr('data-now');
                }
            }
        });
    });

    //关闭二级地区浮层
    $('.popup').delegate('i.city_close', 'click', function () {
        $(this).parents('.freight_city').hide();
    });
    //关闭弹窗-移除data-now
    $('.popup').delegate('popup_close', 'click', function () {
        var nowTr = $('.main_content').find('.shop_table_list').find('tr[data-now]');
        nowTr.removeAttr('data-now');
    });

    //编辑“选择城市”
    function freightEditCity(node) {
        var nowShopId = node.data('checked');
        for (var areaId in nowShopId) {
            var shopIdList = nowShopId[areaId];
            $('.popup').find('input[type=checkbox]:not(".area_city")[data-area-id=' + areaId + ']').removeAttr('disabled').prop('checked', true);
            //$('.popup').find('input[type=checkbox]:not(".area_city")[data-area-id='+areaId+']').siblings('.ad_num').text('('+ shopIdList.length +')');
            for (var i = 0; i < shopIdList.length; i++) {
                $('.popup').find('input[type=checkbox]:not(".area_city")[data-area-id=' + areaId + ']').siblings('.freight_city').find('input[type=checkbox][data-sale-type=' + shopIdList[i] + ']').prop('checked', true);
            }
        }
    }

    /**
     * 经销商列表-修改地区逻辑 end
     */
});
/**
 * Created by cdxiaqing1 on 2016/01/08.
 */

(function (w, $) {
    function splitOrder(opts) {
        /**
         * 默认参数配置
         * @type {{node: null}}
         */
        var defaultOpts = {
            node: null
        };
        /**
         * 属性选择容器
         */
        this.node = opts.node;

        /**
         * 参数合并
         */
        this.opts = $.extend(opts);

        this._init();
    }

    $.extend(splitOrder.prototype, {
        /**
         * 初始化入口
         * @private
         */
        _init: function () {
            var self = this;

            self.btnBox = self.node.find('.btnarea');
            self.splitActiveBtn = self.btnBox.find('#split_order_active');
            self.splitDoneBtn = self.btnBox.find('#split_order_done');
            self.orderTable = self.node.find('.order_goods_split');
            self._render();
            self._addEvent();
        },
        /**
         * 渲染
         * @private
         */
        _render: function () {
            var self = this;
            var totalNum = 0;
            var unitPrice = 0;
            self.orderTable.find('.price').each(function () {
                var $this = $(this);
                totalNum = parseInt($this.parents('tr').find('.total_num').html());
                unitPrice = Number($(this).parents('tr').find('.unit').html());
                $this.html((totalNum * unitPrice).toFixed(2));
            });
        },

        /**
         * 事件绑定
         * @private
         */
        _addEvent: function () {
            var self = this;
            self.splitActiveBtn.on('click', function () {
                self._splitActiveFn();
            });
            self.splitDoneBtn.on('click', function () {
                self._splitDoneFn();
            });
            self.orderTable.delegate('input[type=checkbox]', 'change', function () {
                var $this = $(this);
                self._changeCheckFn($this);
            });
            self.orderTable.delegate('.spilt_num', 'blur', function () {
                var $this = $(this);
            });
            self.node.parents('body').find('.popup').delegate('#order_add_goods', 'click', function () {
                var $this = $(this);
                var userArray = self._pageDataFn($this);
                var userJson = {};
                var ids = userArray.join(',');
                userJson = $this.data();
                userJson['skuIds'] = ids;
                if (ids) {
                    $this.packajax({
                        ajax_url: '/vender/b/purchase/remote/addPurchaseSku.htm',
                        user: userJson,
                        succ: self._showPopupCallback
                    });
                } else {
                    alert('请至少选择一条');
                }
            });
        },
        /**
         * 改变勾选状态时的fn
         * @param node
         * @private
         */
        _changeCheckFn: function (node) {
            if (node.is(':checked')) {
                node.parents('tr').find('.spilt_num').removeAttr('disabled');
            } else {
                node.parents('tr').find('.spilt_num').attr('disabled', 'disabled');
            }
        },
        _changeNumFn: function (node, totalNum) {
            var spilt_num = parseInt(node.val());
            var newTotalNum = totalNum - spilt_num; //新的总数
            if (newTotalNum >= 0) {
                node.parents('tr').find('.total_num').html(newTotalNum);
                node.val(newTotalNum);
            } else {
                alert('订单中没有这么多商品哦。');
            }
        },
        /**
         * 点击拆分按钮时执行的操作
         * @private
         */
        _splitActiveFn: function () {
            var self = this;
            var orderIndex = self.node.find('.shop_table_list').size();
            var nowSize = self.orderTable.find('tr').size() - 1;
            var checkedHtml = null; //被选中的tr的html
            var nowHtml = ''; //过滤掉checkbox及输入框后的新的html
            var spiltNumDom = null; //拆分数量输入框的dom
            var spiltNum = 0; //拆分数量的值
            var spiltNumStr = ''; //拆分数量dom的html字符串
            var unitTotalPrice = 0; //新拆分数量乘以单价后的新总价
            var totalNum = 0; //原有订单中的商品总数
            var thisSize = self.orderTable.find('input[type=checkbox]:checked').length; //被选中的数量
            var checkedDom = self.orderTable.find('input[type=checkbox]:checked').parents('tr'); //被选中的dom
            if (thisSize > 0) {
                if (self._checkOrder(checkedDom)) {
                    self.node.append(self._newOrderTable(orderIndex));
                    self.orderTable.find('input[type=checkbox]:checked').each(function (i) {
                        totalNum = parseInt($(this).parents('tr').find('.total_num').html());

                        checkedHtml = $(this).parents('tr').prop('outerHTML');
                        spiltNumDom = $(this).parents('tr').find('.spilt_num');
                        spiltNum = spiltNumDom.val();

                        unitTotalPrice = (Number(spiltNum) * Number($(this).parents('tr').find('.unit').html())).toFixed(2);
                        spiltNumStr = spiltNumDom.parents('td').prop('outerHTML');
                        nowHtml = checkedHtml.replace('<td><input type="checkbox"></td>', '').replace(spiltNumStr, '');

                        self._divideNewOrder(nowHtml, orderIndex, spiltNum, unitTotalPrice, i);

                        if (nowSize > thisSize) {
                            if (spiltNum == totalNum) {
                                self._changeNumFn(spiltNumDom, totalNum);
                                $(this).parents('tr').remove();
                            } else {
                                $(this).parents('tr').find('input[type=checkbox]').prop('checked', false);
                                $(this).parents('tr').find('input[type=number]').attr('disabled', 'disabled');
                                self._changeNumFn(spiltNumDom, totalNum);
                            }
                        } else {
                            if (spiltNum == totalNum) {
                                self._changeNumFn(spiltNumDom, totalNum);
                                $(this).parents('tr').remove();
                                if (self.orderTable.find('tr').size() - 1 == 0) {
                                    self.orderTable.html('<p>没有可以拆分的订单了</p>');
                                }
                            } else {
                                $(this).parents('tr').find('input[type=checkbox]').prop('checked', false);
                                $(this).parents('tr').find('input[type=number]').attr('disabled', 'disabled');
                                self._changeNumFn(spiltNumDom, totalNum);
                            }
                        }
                    });
                };
            } else {
                alert('请至少选择一条');
            }
            self._render();
        },
        /**
         * 点击提交审核按钮时的事件
         * @private
         */
        _splitDoneFn: function () {
            var self = this;
            var leftSize = self.orderTable.find('tr').size();
            if (leftSize > 0) {
                alert('该采购单中还存在未拆分的商品，请继续拆单。');
            } else {
                self._commitData();
            }
        },
        /**
         * 检查子订单的合法性：
         * 1，账期是否一致；
         * 2，多个sku总价是否超过100W
         * @param checkedDom
         * @returns {boolean}
         * @private
         */
        _checkOrder: function (checkedDom) {
            var checkeDays = []; //检查账期
            var checkePrice = 0; //检查总价
            var inputNum = 0; //拆单数量
            var totalNum = 0; //原有订单中的商品总数
            var flag = true;
            checkedDom.each(function () {
                var $this = $(this);
                checkeDays.push($this.find('.days').html());
                inputNum = $this.find('.spilt_num').val();
                totalNum = parseInt($this.find('.total_num').html());
                var unitTotalPrice = Number($this.find('.spilt_num').val()) * Number($this.find('.unit').html());
                checkePrice += unitTotalPrice;
                if (inputNum == 0) {
                    alert('拆单数量不能为0');
                    flag = false;
                } else if (inputNum > totalNum) {
                    alert('拆单数量不能大于订单数量');
                    flag = false;
                }
            });
            if (checkePrice > 1000000) {
                alert('子订单的总金额不能大于100万，请重新选择商品进行拆单。');
                flag = false;
            }
            for (var i = 0, ilen = checkeDays.length; i < ilen; i++) {
                for (var j = i + 1; j < ilen; j++) {
                    if (checkeDays[i] != checkeDays[j]) {
                        alert('该子订单中所选商品账期不一致，请重新选择账期相同的商品进行拆单。');
                        flag = false;
                    }
                }
            }
            return flag;
        },
        /**
         * 生成新的子订单的box-dom
         * @param orderIndex
         * @returns {string}
         * @private
         * payType为2时为账期支付，为1时为在线支付
         */
        _newOrderTable: function (orderIndex) {
            var self = this;
            var temHtml = '';
            var payType = self.node.find('.pay_type').data('pay-type');
            if (payType == 2) {
                temHtml = '<div class="shop_table_list order' + orderIndex + '"data-index=' + orderIndex + '>' + '<div class="table_title">子订单' + orderIndex + '</div>' + '<table><tbody>' + '<tr><th>商品名称</th><th>商品SKU</th><th>数量</th><th>单价</th><th>采购价</th><th>总价格</th><th>购买方式</th><th>账期</th></tr>' + '</tbody></table>' + '<div>';
            } else if (payType == 1) {
                temHtml = '<div class="shop_table_list order' + orderIndex + '"data-index=' + orderIndex + '>' + '<div class="table_title">子订单' + orderIndex + '</div>' + '<table><tbody>' + '<tr><th>商品名称</th><th>商品SKU</th><th>数量</th><th>单价</th><th>采购价</th><th>总价格</th><th>购买方式</th></tr>' + '</tbody></table>' + '<div>';
            }

            return temHtml;
        },
        /**
         * 生成新的子订单的tr-dom
         * @param strHtml
         * @param orderIndex
         * @private
         */
        _divideNewOrder: function (strHtml, orderIndex, totalNum, unitTotalPrice, index) {
            var newClass = '.order' + orderIndex;
            $(newClass).find('table').append(strHtml);
            $(newClass).find('.total_num').eq(index).html(totalNum).attr('title', totalNum);
            $(newClass).find('.price').eq(index).html(unitTotalPrice).attr('title', unitTotalPrice);
        },
        /**
         * 弹窗上的批量添加传参
         * @param node
         * @returns {Array}
         * @private
         */
        _pageDataFn: function (node) {
            var userJson;
            var userArray = [];
            var beChecked = node.parents('.popup').find('.shop_table_list').find('input[type=checkbox]:checked');
            $.each(beChecked, function (i) {
                userJson = beChecked.eq(i).parents('tr').data('ids');
                if (userJson) {
                    userArray.push(userJson);
                }
            });
            return userArray;
        },
        /**
         * 添加到表格上的回调
         * @param data
         * @private
         */
        _renderTable: function (data) {
            var tableBox = $('.data-return').find('.shop_table_list');
            $('.popup').hide();
            tableBox.removeClass('hide');
            tableBox.find('tbody').append(data);
        },
        /**
         * 弹窗回调
         * @param data
         * @private
         */

        _showPopupCallback: function (data) {
            $('.popup').html(data.messages.popup).show();
        },

        /**
         * 数据提交 格式如下
         * {
                "purchaseId":10000,
                "group":[
                    {
                        "orderNo":1,
                        "skuInfos":[
                            {
                                "skuId":100000,
                                "skuNum":111
                            },
                            {
                                "skuId":1000001,
                                "skuNum":111
                            }
                        ]
                    },
                    {
                        "orderNo":2,
                        "skuInfos":[
                            {
                                "skuId":100000,
                                "skuNum":44
                            }
                        ]
                    }
                ]
            }
         * @private
         */
        _commitData: function () {
            var self = this;
            var userJsonStr = '';
            var eachUserJson = {};
            var userJson = {};
            var group = [];
            var temHtml = '<div class="loading"></div>';
            eachUserJson = self.node.find('.order_detail_part').data();
            $('.shop_table_list:not(".order_goods_split")').each(function () {
                var eachOrder = {};
                var skuIdList = [];
                eachOrder['orderNo'] = $(this).data('index');
                $(this).find('tr').each(function () {

                    if ($(this).data('sku-id')) {
                        var eachSku = {};
                        eachSku['skuId'] = $(this).data('sku-id');
                        eachSku['skuNum'] = $(this).find('.total_num').html();
                        skuIdList.push(eachSku);
                    }
                });
                eachOrder['skuInfos'] = skuIdList;

                group.push(eachOrder);
            });
            eachUserJson['group'] = group;
            userJsonStr = JSON.stringify(eachUserJson);
            userJson['splitContent'] = userJsonStr;
            $('body').append(temHtml);
            $(this).packajax({
                ajax_url: '/vender/b/purchase/remote/splitAudit.htm',
                user: userJson,
                succ: self._showPopupCallback
            });
        },
        /**
         * 弹窗回调
         */
        _showPopupCallback: function (data) {
            $('.popup').html(data.messages.popup).show();
            $('.loading').remove();
        },
        /**
         * 重新加载
         */
        reload: function () {
            this._init();
        }
    });

    /**
     * 暴露全局变量
     */
    if (!w.splitOrder) {
        w.splitOrder = function () {
            new splitOrder({
                node: $('.main_content')
            });
        };
    }

    /**
     * 商品推荐入口
     */
    $(function () {
        w.splitOrder();
    });
})(window, jQuery);
/***
 * jiangsonglin 2016-07-11
 */
(function (w, $) {
    function yaoOrderDeliver(opts) {
        /**
         * 默认参数配置
         * @type {{node: null}}
         */
        var defaultOpts = {
            node: null
        };
        /**
         * 属性选择容器
         */
        this.node = opts.node;

        /**
         * 参数合并
         */
        this.opts = $.extend(opts);

        this._init();
    }

    $.extend(yaoOrderDeliver.prototype, {
        /**
         * 初始化入口
         * @private
         */
        _init: function () {
            var self = this;

            self.shipmentTypeSelect = $('#yao_order_deliver_shipment_select');
            self.deliverBtn = $('#yao_order_deliver_btn');

            if (self.shipmentTypeSelect.find('option:selected').length && self.shipmentTypeSelect.find('option:selected').val().length) {
                self._selectShipmentType();
            }

            self._addEvent();
        },

        _errorClass: 'border: 2px solid #E13B41!important',

        _needOrNot: function (type, obj) {
            if (type == false) {
                if (obj[0].tagName == 'INPUT') {
                    obj.removeClass('error');
                } else {
                    obj.attr('style', '');
                }
            } else {
                if (obj[0].tagName == 'INPUT') {
                    obj.addClass('error');
                } else {
                    obj.attr('style', yaoOrderDeliver.prototype._errorClass);
                }
            }
        },

        _getExpressSelectHtml: function (expressList) {
            var html = '<option selected="" disabled="" value="" class="hide">选择物流公司</option>';
            for (var i = 0; i < expressList.length; i++) {
                companyInfo = expressList[i];
                var companyId = companyInfo['logisticsId'];
                var companyName = companyInfo['logisticsName'];
                html += '<option value="' + companyId + '">' + companyName + '</option>';
            }
            return html;
        },
        /**
         * 事件绑定
         * @private
         */
        _addEvent: function () {
            var self = this;

            self.shipmentTypeSelect.on('change', function () {
                self._selectShipmentType();
            });

            self.deliverBtn.on('click', function () {
                self._deliver();
            });

            $('body').delegate('#yao_order_deliver_expressCompany_select', 'change', function () {
                self._expressCompanySelect();
            });
        },

        // 配送方式select选择
        _selectShipmentType: function () {
            var expressNumberInput = $('input[name="expressNumber"]');
            //var customerCodeInput = $('input[name="customerCode"]');
            var shipmentTypeSelect = $('#yao_order_deliver_shipment_select');
            var expressCompanySelect = $('#yao_order_deliver_expressCompany_select');

            var shipmentType = shipmentTypeSelect.find('option:selected').val();
            //var customerCode = $.trim(customerCodeInput.val());
            // 去掉配送方式select上的红框
            yaoOrderDeliver.prototype._needOrNot(false, shipmentTypeSelect);
            yaoOrderDeliver.prototype._needOrNot(false, expressNumberInput);
            // 京配
            if (shipmentType == 1) {
                expressCompanySelect.hide();
                //if (!customerCode) {
                //    yaoOrderDeliver.prototype._needOrNot(true, customerCodeInput);
                //    //shipmentTypeSelect.val('');
                //    customerCodeInput.show();
                //}
                //else {
                $.ajax({
                    type: 'POST',
                    cache: false,
                    url: '/vender/b/pop_purchase_ajax/queryDeliverId',
                    //data    : {
                    //    customerCode: customerCode
                    //},
                    dataType: 'json',
                    success: function (data) {
                        if (data['deliverId']) {
                            expressNumberInput.val(data['deliverId']);
                            //expressCompanySelect.hide();
                            expressNumberInput.attr('disabled', true);
                            //customerCodeInput.attr("disabled", true);
                            //customerCodeInput.show();
                        } else {
                            alert('京配运单号获取失败');
                        }
                    },
                    error: function () {
                        alert('京配运单号获取失败');
                    }
                });
                //yaoOrderDeliver.prototype._needOrNot(false, customerCodeInput);
                //}
            }
            // 第三方快递
            else if (shipmentType == 3) {
                    //customerCodeInput.hide();
                    //yaoOrderDeliver.prototype._needOrNot(false, customerCodeInput);
                    $.ajax({
                        type: 'POST',
                        cache: false,
                        url: '/vender/b/pop_purchase_ajax/queryExpress',
                        data: {},
                        dataType: 'json',
                        success: function (data) {
                            if (data['expressList']) {
                                var html = yaoOrderDeliver.prototype._getExpressSelectHtml(data['expressList']);
                                expressCompanySelect.html(html);
                                expressCompanySelect.show();
                                expressNumberInput.val('');
                                //customerCodeInput.val('');
                                expressNumberInput.attr('disabled', false);
                                //customerCodeInput.attr("disabled", false);
                            } else {
                                alert('快递公司获取失败');
                            }
                        },
                        error: function () {
                            alert('快递公司获取失败');
                        }
                    });
                }
        },

        _expressCompanySelect: function () {
            var expressCompanySelect = $('#yao_order_deliver_expressCompany_select');
            yaoOrderDeliver.prototype._needOrNot(false, expressCompanySelect);
            //var customerCodeInput = $('input[name="customerCode"]');
            //customerCodeInput.hide();
            expressCompanySelect.show();
        },

        _deliver: function () {
            var expressNumberInput = $('input[name="expressNumber"]');
            var customerCodeInput = $('input[name="customerCode"]');
            var shipmentTypeSelect = $('#yao_order_deliver_shipment_select');
            var expressCompanySelect = $('#yao_order_deliver_expressCompany_select');

            var shipmentType = shipmentTypeSelect.find('option:selected').val();
            var customerCode = $.trim(customerCodeInput.val());
            var expressNum = $.trim(expressNumberInput.val());
            // 必须选择配送方式
            if (!shipmentType) {
                yaoOrderDeliver.prototype._needOrNot(true, shipmentTypeSelect);
                return;
            }
            if (shipmentType == 3) {
                var expressCompanyNum = expressCompanySelect.find('option:selected').val();
                var expressCompanyName = expressCompanySelect.find('option:selected').text();
                if (!expressCompanyNum || !expressCompanyName) {
                    expressCompanySelect.attr('style', yaoOrderDeliver.prototype._errorClass).show();
                    return;
                }
            }
            if (!expressNum) {
                yaoOrderDeliver.prototype._needOrNot(true, expressNumberInput);
                return;
            }
            // 开始出库
            $.ajax({
                type: 'POST',
                cache: false,
                url: '/vender/b/pop_purchase_ajax/deliver',
                data: {
                    purchaseId: $.trim($('#yao_purchase_order_id').val()),
                    shipmentType: shipmentType,
                    expressCompanyNum: expressCompanyNum,
                    expressCompanyName: expressCompanyName,
                    customerCode: customerCode,
                    expressNum: expressNum
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success == true) {
                        alert('出库成功');
                        window.location.href = $.trim($('#orderListUrl').val());
                    } else {
                        alert('出库失败');
                    }
                },
                error: function () {
                    alert('出库失败');
                }
            });
        },

        reload: function () {
            this._init();
        }
    });

    /**
     * 暴露全局变量
     */
    if (!w.yaoOrderDeliver) {
        w.yaoOrderDeliver = function () {
            new yaoOrderDeliver({
                node: $('.main_content')
            });
        };
    }

    /**
     * 商品推荐入口
     */
    $(function () {
        w.yaoOrderDeliver();
    });
})(window, jQuery);
/***
 * jiangsonglin 2016-07-11
 */

var yaoPurchaseDetailJS = {};

yaoPurchaseDetailJS.wareSearchResultInfo = null;
yaoPurchaseDetailJS.wareInfo = null;

(function (w, $) {
    function yaoPurchaseDetail(opts) {
        /**
         * 默认参数配置
         * @type {{node: null}}
         */
        var defaultOpts = {
            node: null
        };
        /**
         * 属性选择容器
         */
        this.node = opts.node;

        /**
         * 参数合并
         */
        this.opts = $.extend(opts);

        this._init();
    }

    $.extend(yaoPurchaseDetail.prototype, {
        /**
         * 初始化入口
         * @private
         */
        _init: function () {
            var self = this;

            self.wareTable = $('#yao_purchase_edit_ware_table');
            self.updateAndApproveBtn = $('#yao_purchase_order_update_approve_btn');
            self.updateAndApproveBtn1 = $('#yao_purchase_order_update_approve_btn1');
            self.auditApproveBtn = $('#yao_purchase_approve_btn');
            self.auditRejectPopupBtn = $('#yao_purchase_reject_popup_btn');

            yaoPurchaseDetailJS.wareInfo = self._getWarePriceInfo();

            self._addEvent();
        },

        /**
         * 事件绑定
         * @private
         */
        _addEvent: function () {
            var self = this;

            self.wareTable.delegate('.yao_purchase_eidt_ware_btn', 'click', function () {
                self._toEdit($(this));
            });

            self.wareTable.delegate('.yao_purchase_add_ware_btn', 'click', function () {
                var purchaseId = $(this).attr('data-purchase-id');
                purchaseId = typeof purchaseId == 'undefined' ? '' : purchaseId;
                self._popAddWareWindow(purchaseId);
            });

            self.wareTable.delegate('.yao_purchase_del_selected_ware_btn', 'click', function () {
                self._deleteSelectWare($('#yao_purchase_edit_ware_table'));
            });

            self.wareTable.delegate('.yao_purchase_del_ware_btn', 'click', function () {
                self._deleteWare($(this));
            });

            self.wareTable.delegate('.yao_purchase_ware_eidt_save_btn', 'click', function () {
                self._saveWarePriceAndNum($(this));
            });

            $('body').delegate('.yao_purchase_order_search_ware_btn', 'click', function () {
                self._popupSearchWare();
            });

            $('body').delegate('#yao_add_ware_to_table_btn', 'click', function () {
                self._addWareToPurcahseWareList();
            });

            self.updateAndApproveBtn.on('click', function () {
                if ($('#hasCoupons').val() == 'true') {
                    self._checkCoupons(function () {
                        self._updateAndApprove(0);
                    });
                } else {
                    self._updateAndApprove(0);
                }
            });
            self.updateAndApproveBtn1.on('click', function () {
                if ($('#hasCoupons').val() == 'true') {
                    self._checkCoupons(function () {
                        self._updateAndApprove(0);
                    });
                } else {
                    self._updateAndApprove(0);
                }
            });

            self.auditApproveBtn.on('click', function () {
                self._auditApprove(0);
            });

            self.auditRejectPopupBtn.on('click', function () {
                self._auditRejectPopup();
            });

            $('body').delegate('#yao_purchase_reject_btn', 'click', function () {
                self._auditReject();
            });
        },

        // 更新当前页面价格和商品的展示
        _updateDisplay: function () {
            var self = this;
            var wareInfoList = yaoPurchaseDetailJS.wareInfo;
            var html = '';
            for (var i in wareInfoList) {
                var wareInfo = wareInfoList[i];
                if (wareInfo.skuName) {
                    var editHtml = '';
                    if (wareInfo.disabled) {
                        editHtml = '<div class="btngray smallbtn inline">编辑</div> ' + '<div class="btngray smallbtn inline">删除</div>';
                    } else {
                        editHtml = '<div class="btnblue smallbtn yao_purchase_eidt_ware_btn inline">编辑</div> ' + '<div class="btnblue smallbtn yao_purchase_del_ware_btn inline">删除</div>';
                    }
                    html = html + '<tr class="' + (wareInfo.disabled ? 'disabled' : '') + '">' + '<td><input type="checkbox" name="edit_purchase_del_checkbox"></td>' + '<td title="' + wareInfo.skuName + '" name="skuName">' + wareInfo.skuName + '<input type="text" class="hide" value="' + wareInfo.cat3Id + '" name="cat3Id">' + '<input type="text" class="hide" value="' + wareInfo.guid + '" name="guid">' + '<input type="text" class="hide" value="' + wareInfo.type + '" name="type">' + '<input type="text" class="hide" value="' + wareInfo.skuId + '" name="skuId">' + '<input type="text" class="hide" value="' + wareInfo.isLimitArea + '" name="isLimitArea">' + '<input type="text" class="hide" value="' + wareInfo.skuName + '" name="skuName">' + '</td>' + '<td title="' + wareInfo.skuPrice + '" name="skuPrice">' + wareInfo.skuPrice + '</td>' + '<td title="' + wareInfo.purchasePrice + '" name="purchasePrice" class="to_edit">' + wareInfo.purchasePrice + '</td>' + '<td title="' + wareInfo.discount + '" name="discount">' + wareInfo.discount + '</td>' + '<td title="' + wareInfo.purchaseNum + '" name="purchaseNum" class="to_edit">' + wareInfo.purchaseNum + '</td>' + '<td title="' + wareInfo.money + '" name="shouldPay">' + wareInfo.shouldPay + '</td>' + '<td>' + editHtml + '</td>' + '</tr>';
                }
            }
            self.wareTable.find('tbody tr:not(:first)').remove();
            self.wareTable.find('tbody').append(html);
            $('#purchaseOrderTotalMoney').html(wareInfoList['totalMoney']);
            //$("#purchaseOrderTotalMoney1").html(wareInfoList["totalMoney"]);
            $('#purchaseOrderTotalDiscount').html(wareInfoList['totalDiscount']);
            $('#purchaseOrderShouldPay').html(wareInfoList['shouldPay']);
            $('#purchaseOrderShouldPay1').html(wareInfoList['shouldPay']);
        },

        // 删除商品
        _deleteWare: function (node) {
            var skuArray = this._getWareSkus();
            if (skuArray.length <= 1) {
                alert('至少保留一个商品!');
                return false;
            }
            var trNode = node.parent().parent();
            if (confirm('是否删除此商品!')) {
                var skuId = trNode.find('input[name="skuId"]').val();
                var type = trNode.find('input[name="type"]').val();
                this._removeWareFromObj(skuId + '_' + type); // 从对象中删除商品
                this._updateDisplay();
            }
        },
        _deleteSelectWare: function (parentNode) {
            var selectBoxes = $('input[name="edit_purchase_del_checkbox"]:checked'),
                trs = $('#yao_purchase_edit_ware_table tbody tr');
            if (selectBoxes.length == trs.length - 1) {
                alert('至少保留一个商品!');
            } else {
                if (selectBoxes.length && confirm('是否删除所选商品？')) {
                    for (var i = 0; i < selectBoxes.length; i++) {
                        var skuId = selectBoxes.eq(i).parents('tr').find('input[name="skuId"]').val();
                        var type = selectBoxes.eq(i).parents('tr').find('input[name="type"]').val();
                        this._removeWareFromObj(skuId + '_' + type); // 从对象中删除商品
                    }
                    this._updateDisplay();
                }
            }
        },
        // 添加商品
        _addWare: function (wareInfoFromTable) {
            var self = this;
            var skuId = wareInfoFromTable['shopSkuId'];
            var type = wareInfoFromTable['type'];
            //如果该商品是不可编辑状态，返回
            var skuItems = $('#yao_purchase_edit_ware_table').find('tr');
            for (var i = 0; i < skuItems.length; i++) {
                var skuItem = skuItems.eq(i);
                if (skuItem.find('[name="skuId"]').val() == skuId && skuItem.find('[name="type"]').val() == type && skuItem.hasClass('disabled')) {
                    return;
                }
            }
            var wareForAdd = {
                skuId: wareInfoFromTable['shopSkuId'],
                purchasePrice: wareInfoFromTable['wholesalePrice'].toFixed(2),
                skuPrice: wareInfoFromTable['wholesalePrice'].toFixed(2),
                shouldPay: wareInfoFromTable['wholesalePrice'].toFixed(2),
                discount: '0.00',
                purchaseNum: 1,
                skuName: wareInfoFromTable['spuName'],
                cat3Id: wareInfoFromTable['cat3'],
                guid: wareInfoFromTable['guid'],
                type: wareInfoFromTable['type'],
                disabled: wareInfoFromTable['disabled'],
                isLimitArea: wareInfoFromTable['isLimitArea']
            };
            if (yaoPurchaseDetailJS.wareInfo[skuId + '_' + type]) {
                yaoPurchaseDetail.prototype._removeWareFromObj(skuId + '_' + type);
            }
            yaoPurchaseDetailJS.wareInfo[skuId + '_' + type] = wareForAdd;

            yaoPurchaseDetailJS.wareInfo['totalMoney'] = (yaoPurchaseDetailJS.wareInfo['totalMoney'] * 1 + wareForAdd['skuPrice'] * wareForAdd['purchaseNum']).toFixed(2);
            yaoPurchaseDetailJS.wareInfo['shouldPay'] = (yaoPurchaseDetailJS.wareInfo['shouldPay'] * 1 + wareForAdd['purchasePrice'] * wareForAdd['purchaseNum']).toFixed(2);
            yaoPurchaseDetailJS.wareInfo['totalDiscount'] = (yaoPurchaseDetailJS.wareInfo['totalMoney'] - yaoPurchaseDetailJS.wareInfo['shouldPay']).toFixed(2);
        },

        _removeWareFromObj: function (skuId) {
            var self = this;
            var deleteWareInfo = yaoPurchaseDetailJS.wareInfo[skuId];
            delete yaoPurchaseDetailJS.wareInfo[skuId];
            yaoPurchaseDetailJS.wareInfo['totalMoney'] = (yaoPurchaseDetailJS.wareInfo['totalMoney'] - deleteWareInfo['skuPrice'] * deleteWareInfo['purchaseNum']).toFixed(2);
            yaoPurchaseDetailJS.wareInfo['shouldPay'] = (yaoPurchaseDetailJS.wareInfo['shouldPay'] - deleteWareInfo['purchasePrice'] * deleteWareInfo['purchaseNum']).toFixed(2);
            yaoPurchaseDetailJS.wareInfo['totalDiscount'] = (yaoPurchaseDetailJS.wareInfo['totalMoney'] - yaoPurchaseDetailJS.wareInfo['shouldPay']).toFixed(2);
        },

        // 获取当前商品列表中存在的sku
        _getWareSkus: function () {
            var skuArray = [];
            this.wareTable.find('[name="skuId"]').each(function () {
                skuArray.push($.trim($(this).val()));
            });
            return skuArray;
        },

        // 获取当前列表中商品价格和数量信息
        _getWarePriceInfo: function () {
            var wareInfoMap = {};
            var skuId, skuPrice, purchasePrice, purchaseNum, cat3, guid, type, isLimitArea;
            var totalMoney = 0;
            var shouldPay = 0;
            var trs = $('#yao_purchase_edit_ware_table').find('tbody tr');
            trs.each(function () {
                var shopSkuId = $.trim($(this).find('input[name="skuId"]').val());
                if (shopSkuId) {
                    var wareInfo = {};
                    skuId = shopSkuId;
                    skuPrice = $.trim($(this).find('[name="skuPrice"]').text()) * 1;
                    purchasePrice = $.trim($(this).find('[name="purchasePrice"]').text()) * 1;
                    purchaseNum = $.trim($(this).find('[name="purchaseNum"]').text()) * 1;
                    cat3 = $.trim($(this).find('[name="cat3Id"]').val());
                    guid = $.trim($(this).find('[name="guid"]').val());
                    type = $.trim($(this).find('[name="type"]').val()); //type=0主商品,type=2赠品
                    isLimitArea = $.trim($(this).find('[name="isLimitArea"]').val());
                    if (typeof type == 'undefined' || type == '') {
                        type = 0;
                    }

                    wareInfo['skuId'] = shopSkuId;
                    wareInfo['skuName'] = $.trim($(this).find('[name="skuName"]').text());
                    wareInfo['skuPrice'] = skuPrice.toFixed(2);
                    wareInfo['purchasePrice'] = purchasePrice.toFixed(2);
                    wareInfo['purchaseNum'] = purchaseNum;
                    wareInfo['discount'] = (skuPrice - purchasePrice).toFixed(2);
                    wareInfo['money'] = (skuPrice * purchaseNum).toFixed(2);
                    wareInfo['shouldPay'] = (purchasePrice * purchaseNum).toFixed(2);
                    wareInfo['cat3Id'] = cat3;
                    wareInfo['guid'] = typeof guid == 'undefined' ? '' : guid;
                    wareInfo['type'] = type;
                    wareInfo['isLimitArea'] = isLimitArea;
                    wareInfo['disabled'] = $(this).hasClass('disabled');

                    totalMoney = totalMoney + parseFloat(wareInfo['money']);
                    shouldPay = shouldPay + parseFloat(wareInfo['shouldPay']);

                    wareInfoMap[skuId + '_' + type] = wareInfo;
                }
            });
            wareInfoMap['totalMoney'] = totalMoney.toFixed(2);
            wareInfoMap['totalDiscount'] = (totalMoney - shouldPay).toFixed(2);
            wareInfoMap['shouldPay'] = shouldPay.toFixed(2);

            return wareInfoMap;
        },

        // 将价格与数量变为可编辑状态
        _toEdit: function (node) {
            var editArea = node.parent().parent().find('.to_edit');
            editArea.each(function () {
                var $this = $(this);
                var nowVal = null;
                var editKind = 'input';
                switch (editKind) {
                    case 'input':
                        nowVal = $this.text();
                        $this.removeClass('to_edit').addClass('beEditing').html('<input type="text" value="' + nowVal + '">');
                        break;
                    default:
                        break;
                }
            });
            node.parent().html('<div class="btnblue smallbtn inline yao_purchase_ware_eidt_save_btn">保存</div>');
        },

        // 保存当前的修改
        _saveWarePriceAndNum: function (node) {
            var _self = this;
            var editArea = node.parent().parent().find('.beEditing');

            var skuId = $.trim(node.parent().parent().find('[name="skuId"]').val());
            var price = $.trim(node.parent().parent().find('[name="purchasePrice"]').children().val()) * 1;
            var num = $.trim(node.parent().parent().find('[name="purchaseNum"]').children().val()) * 1;

            if (!yaoPurchaseDetail.prototype._isPositiveNum(num)) {
                alert('数量输入不正确');
                return false;
            }
            if (!yaoPurchaseDetail.prototype._jdmoney(price)) {
                alert('价格输入不正确');
                return false;
            }
            //使用优惠券时进行判断
            if ($('#hasCoupons').val() == 'true') {
                _self._checkCoupons(function () {
                    editArea.each(function () {
                        var $this = $(this);
                        var nowShow = $.trim($this.find('input').val()) * 1;
                        var editKind = 'input';
                        switch (editKind) {
                            case 'input':
                                $this.html(nowShow).removeClass('beEditing').addClass('to_edit');
                                break;
                            default:
                                break;
                        }
                    });
                    node.parent().html('<div class="btnblue smallbtn yao_purchase_eidt_ware_btn inline">编辑</div> ' + '<div class="btnblue smallbtn yao_purchase_del_ware_btn inline">删除</div>');
                    yaoPurchaseDetail.prototype._updatePriceInfoAfterEdit();
                });
            } else {
                editArea.each(function () {
                    var $this = $(this);
                    var nowShow = $.trim($this.find('input').val()) * 1;
                    var editKind = 'input';
                    switch (editKind) {
                        case 'input':
                            $this.html(nowShow).removeClass('beEditing').addClass('to_edit');
                            break;
                        default:
                            break;
                    }
                });
                node.parent().html('<div class="btnblue smallbtn yao_purchase_eidt_ware_btn inline">编辑</div> ' + '<div class="btnblue smallbtn yao_purchase_del_ware_btn inline">删除</div>');
                yaoPurchaseDetail.prototype._updatePriceInfoAfterEdit();
            }
        },

        //是否为正整数
        _isPositiveNum: function (s) {
            var re = /^[0-9]*[1-9][0-9]*$/;
            return re.test(s);
        },
        // 判断是否为正实数。
        _jdmoney: function (money) {
            var t = /^\d+(\.\d+)?$/;
            return t.test(money);
        },

        // 修改商品信息后, 更新价格信息
        _updatePriceInfoAfterEdit: function () {
            var warePriceInfo = yaoPurchaseDetail.prototype._getWarePriceInfo();
            yaoPurchaseDetailJS.wareInfo = warePriceInfo;
            // 更新商品table
            var trs = $('#yao_purchase_edit_ware_table').find('tbody tr');
            trs.each(function () {
                var shopSkuId = $.trim($(this).find('input[name="skuId"]').val());
                var type = $.trim($(this).find('input[name="type"]').val());
                if (shopSkuId) {
                    var warePrice = warePriceInfo[shopSkuId + '_' + type];
                    $(this).find('td[name="purchasePrice"]').html(warePrice['purchasePrice']);
                    $(this).find('td[name="discount"]').html(warePrice['discount']);
                    $(this).find('td[name="shouldPay"]').html(warePrice['shouldPay']);
                }
            });
            // 更新采购单信息
            $('#purchaseOrderTotalMoney').html(warePriceInfo['totalMoney']);
            //$('#purchaseOrderTotalMoney1').html(warePriceInfo["totalMoney"]);
            $('#purchaseOrderTotalDiscount').html(warePriceInfo['totalDiscount']);
            $('#purchaseOrderShouldPay').html(warePriceInfo['shouldPay']);
            $('#purchaseOrderShouldPay1').html(warePriceInfo['shouldPay']);
        },

        // 弹出添加拒绝窗口
        _auditRejectPopup: function () {
            var popWindowHtml = $('#yao_purchase_order_reject_html').html();
            $('.popup').html(popWindowHtml).show();
        },
        // 弹出添加商品的窗口
        _popAddWareWindow: function (purchaseId) {
            $.ajax({
                type: 'POST',
                cache: false,
                url: '/vender/b/pop_purchase_ajax/popupAdd',
                data: {
                    purchaseId: purchaseId
                },
                dataType: 'html',
                success: function (data) {
                    $('.popup').html(data).show();
                },
                error: function () {
                    alert('获取商品列表失败，请稍后再试');
                }
            });
        },

        // 弹出窗口翻页
        _searchWare: function () {
            $.ajax({
                type: 'POST',
                cache: false,
                url: '/vender/b/pop_purchase_ajax/queryWare',
                data: {},
                dataType: 'html',
                success: function (data) {
                    $('.data-return-dup .clear').html(data);
                },
                error: function () {
                    alert('queryWare失败，请稍后再试');
                }
            });
        },

        _getChooseWare: function () {
            var chooseRadio = $('input[name="edit_purchase_add_radio"]:checked');
            if (chooseRadio) {
                var skuId = $.trim(chooseRadio.val());
                var price = $.trim(chooseRadio.parent().next().next().text());
                var spuname = $.trim(chooseRadio.parent().next().text());
                var cat3 = $.trim(chooseRadio.parent().find('input[name=\'cid3\']').val());
                var guid = $.trim(chooseRadio.parent().find('input[name=\'guid\']').val());
                var type = $.trim(chooseRadio.parent().find('input[name=\'type\']').val());
                if (typeof type == 'undefined' || type == '') {
                    type = 0;
                }
                var isLimitArea = chooseRadio.parent().find('input[name=\'isLimitArea\']').val();
                var disabled = $('input[value="' + skuId + '"]').parents('tr').hasClass('disabled'); //添加商品是否允许编辑
                yaoPurchaseDetailJS.wareSearchResultInfo = {
                    shopSkuId: skuId,
                    wholesalePrice: price * 1,
                    spuName: spuname,
                    cat3: cat3,
                    guid: typeof guid == 'undefined' ? '' : guid,
                    type: type, //若无type，默认为主商品0
                    disabled: disabled,
                    isLimitArea: isLimitArea
                };
            }
        },

        // 将搜索结果加入到商品列表
        _addWareToPurcahseWareList: function () {
            var tbody = this.wareTable.find('tbody');
            yaoPurchaseDetail.prototype._getChooseWare();
            if (!yaoPurchaseDetailJS.wareSearchResultInfo) {
                alert('请选择商品');
                return;
            }
            if (yaoPurchaseDetailJS.wareSearchResultInfo['wholesalePrice'] <= 0) {
                alert('商品价格错误');
                return;
            }
            if (yaoPurchaseDetailJS.wareSearchResultInfo['isLimitArea'] == 'true') {
                alert('超出卖家销售区域，请核实购买');
                return;
            }

            this._addWare(yaoPurchaseDetailJS.wareSearchResultInfo);

            this._updateDisplay();
            $('.popup').hide();
        },

        //检查优惠券：编辑保存时没有callback，保存并审核执行callback
        _checkCoupons: function (callback) {
            var trs = this.wareTable.find('tbody tr');
            var warePriceInfo = yaoPurchaseDetail.prototype._getWarePriceInfo();
            var totalMoney = warePriceInfo['totalMoney'];
            var totalDiscount = warePriceInfo['totalDiscount'];
            var shouldPay = warePriceInfo['shouldPay'];
            if (totalMoney * 1 >= 100000000.00 || totalDiscount * 1 >= 100000000.00 || shouldPay * 1 >= 100000000.00) {
                alert('金额过高, 请修改商品信息后再试');
                return false;
            }

            var purchaseWareArray = [];
            trs.each(function () {
                var shopSkuId = $(this).find('input[name="skuId"]').val();
                if (shopSkuId) {
                    var purchaseWareInfo = {};
                    var purchasePrice = $(this).find('[name="purchasePrice"]').hasClass('beEditing') ? $(this).find('[name="purchasePrice"]').children().val() : $(this).find('[name="purchasePrice"]').text();
                    var purchaseNum = $(this).find('[name="purchaseNum"]').hasClass('beEditing') ? $(this).find('[name="purchaseNum"]').children().val() : $(this).find('[name="purchaseNum"]').text();
                    var cat3Id = $(this).find('[name="cat3Id"]').val();

                    purchaseWareInfo['shopSkuId'] = shopSkuId;
                    purchaseWareInfo['purchasePrice'] = purchasePrice;
                    purchaseWareInfo['purchaseNum'] = purchaseNum;
                    purchaseWareInfo['cat3Id'] = cat3Id;

                    purchaseWareArray.push(purchaseWareInfo);
                }
            });

            // 检查优惠券
            var purchaseId = $.trim($('#edit_purchase_order_id').val());
            $.ajax({
                type: 'POST',
                cache: false,
                traditional: true,
                //url        : '/vender/b/pop_purchase_ajax/updateAndApprove',
                url: '/vender/b/pop_purchase_ajax/checkCoupon',
                data: {
                    purchaseId: purchaseId,
                    wareInfos: JSON.stringify(purchaseWareArray)
                },
                dataType: 'json',
                async: false,
                success: function (data) {
                    if (data.success == true) {
                        //alert("审核成功");
                        //typeof callback !== "undefined" && callback &&
                        callback();
                        //window.location.reload();
                    } else {
                        alert(data.msg);
                    }
                },
                error: function () {
                    alert('checkCoupon失败，请稍后再试');
                }
            });
        },

        _updateAndApprove: function (confirmAgain) {
            //confirm 0:接口校验包装单位完整性 1:跳过包装单位完整性校验
            // 获取当前商品信息
            var self = this;
            //有商品正在编辑
            if (self.wareTable.find('.yao_purchase_ware_eidt_save_btn').length) {
                alert('请先保存正在编辑的商品再进行审核！');
                return;
            }
            var trs = $('#yao_purchase_edit_ware_table').find('tbody tr');
            var warePriceInfo = yaoPurchaseDetail.prototype._getWarePriceInfo();
            var totalMoney = warePriceInfo['totalMoney'];
            var totalDiscount = warePriceInfo['totalDiscount'];
            var shouldPay = warePriceInfo['shouldPay'];
            if (totalMoney * 1 >= 100000000.00 || totalDiscount * 1 >= 100000000.00 || shouldPay * 1 >= 100000000.00) {
                alert('金额过高, 请修改商品信息后再试');
                return;
            }

            var purchaseWareArray = [];
            var limitAreaItems = [];
            trs.each(function () {
                var shopSkuId = $(this).find('input[name="skuId"]').val();
                if (shopSkuId) {
                    var purchaseWareInfo = {};
                    var purchasePrice = $(this).find('[name="purchasePrice"]').text();
                    var purchaseNum = $(this).find('[name="purchaseNum"]').text();
                    var cat3Id = $(this).find('[name="cat3Id"]').val();
                    var guId = $(this).find('[name="guid"]').val();
                    var type = $(this).find('[name="type"]').val();
                    var isLimitArea = $(this).find('[name="isLimitArea"]').val();
                    var skuName = $.trim($(this).find('input[name="skuName"]').val());

                    purchaseWareInfo['shopSkuId'] = shopSkuId;
                    purchaseWareInfo['purchasePrice'] = purchasePrice;
                    purchaseWareInfo['purchaseNum'] = purchaseNum;
                    purchaseWareInfo['cat3Id'] = cat3Id;
                    purchaseWareInfo['guid'] = guId;
                    purchaseWareInfo['type'] = type;
                    purchaseWareInfo['skuName'] = skuName;

                    purchaseWareArray.push(purchaseWareInfo);

                    if (isLimitArea == 'true') {
                        limitAreaItems.push(skuName);
                    }
                }
            });

            if (limitAreaItems.length) {
                alert(limitAreaItems.join('、') + '超出卖家销售区域，请核实后购买。');
                return;
            }

            var purchaseId = $.trim($('#edit_purchase_order_id').val());
            $.ajax({
                type: 'POST',
                cache: false,
                traditional: true,
                url: '/vender/b/pop_purchase_ajax/updateAndApprove',
                data: {
                    purchaseId: purchaseId,
                    wareInfos: JSON.stringify(purchaseWareArray),
                    confirm: confirmAgain
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success == true) {
                        alert('审核成功');
                        window.location.reload();
                    } else {
                        if (typeof data.packageFailed !== 'undefined' && data.packageFailed) {
                            var r = confirm(data.msg);
                            if (r) {
                                self._updateAndApprove(1);
                            }
                        } else {
                            alert(data.msg);
                        }
                    }
                },
                error: function (r) {
                    alert('审核失败，请稍后再试');
                }
            });
        },

        // 直接审核通过
        _auditApprove: function (confirmAgain) {
            //confirm 0:接口校验包装单位完整性 1:跳过包装单位完整性校验
            var self = this;
            var purchaseId = $.trim($('#yao_purchase_order_id').val());

            $.ajax({
                type: 'POST',
                cache: false,
                traditional: true,
                url: '/vender/b/pop_purchase_ajax/auditApprove',
                data: {
                    purchaseId: purchaseId,
                    confirm: confirmAgain
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success == true) {
                        alert('审核成功');
                        window.location.reload();
                    } else {
                        if (typeof data.packageFailed !== 'undefined' && data.packageFailed) {
                            var r = confirm('审核失败.' + data.msg);
                            if (r) {
                                self._auditApprove(1);
                            }
                        } else {
                            alert('审核失败.' + data.msg);
                        }
                    }
                },
                error: function () {
                    alert('审核失败，请稍后再试');
                }
            });
        },

        _auditReject: function () {
            var textArea = $('.popup').find('textarea[name="checkContent"]');
            var comment = $.trim(textArea.val());
            if (comment.length == 0) {
                textArea.addClass('error');
                return;
            }
            var purchaseId = $.trim($('#yao_purchase_reject_btn').attr('data-purchase-id'));
            $.ajax({
                type: 'POST',
                cache: false,
                traditional: true,
                url: '/vender/b/pop_purchase_ajax/auditReject',
                data: {
                    purchaseId: purchaseId,
                    comment: comment
                },
                dataType: 'json',
                success: function (data) {
                    if (data.success == true) {
                        alert('驳回成功');
                        window.location.reload();
                    } else {
                        alert('驳回失败.');
                    }
                },
                error: function () {
                    alert('驳回失败，请稍后再试');
                }
            });
        },

        reload: function () {
            this._init();
        }
    });

    /**
     * 暴露全局变量
     */
    if (!w.yaoPurchaseDetail) {
        w.yaoPurchaseDetail = function () {
            new yaoPurchaseDetail({
                node: $('.main_content')
            });
        };
    }

    /**
     * 商品推荐入口
     */
    $(function () {
        w.yaoPurchaseDetail();
    });
})(window, jQuery);

/***
 * jiangsonglin 2016-07-11
 */
(function (w, $) {
    function yaoPurchaseList(opts) {
        /**
         * 默认参数配置
         * @type {{node: null}}
         */
        var defaultOpts = {
            node: null
        };
        /**
         * 属性选择容器
         */
        this.node = opts.node;

        /**
         * 参数合并
         */
        this.opts = $.extend(opts);

        this._init();
    }

    $.extend(yaoPurchaseList.prototype, {
        /**
         * 初始化入口
         * @private
         */
        _init: function () {
            var self = this;

            self.searchBtn = $('#yao_purchase_list_search_btn');
            self.searchOrderBtn = $('#yao_order_list_search_btn');
            self.exportBtn = $('#yao_order_list_export_btn');

            self._addEvent();
        },

        /**
         * 事件绑定
         * @private
         */
        _addEvent: function () {
            var self = this;

            self.searchBtn.on('click', function () {
                self._searchPurchaseList();
            });
            self.searchOrderBtn.on('click', function () {
                self._searchOrderList();
            });
            self.exportBtn.on('click', function () {
                self._exportOrderList();
            });
        },
        // 采购单列表
        _searchPurchaseList: function () {
            var param = yaoPurchaseList.prototype._getSearchParam();
            $.ajax({
                type: 'POST',
                cache: false,
                url: '/vender/b/pop_purchase/query.htm',
                data: param,
                dataType: 'html',
                success: function (data) {
                    if (data) {
                        $('#purchase_order_list_table').html(data);
                    }
                },
                error: function () {
                    alert('获取采购单列表失败，请稍后再试');
                }
            });
        },
        // 订单列表
        _searchOrderList: function () {
            var param = yaoPurchaseList.prototype._getSearchParam();
            $.ajax({
                type: 'POST',
                cache: false,
                url: '/vender/b/pop_purchase/orderQuery.htm',
                data: param,
                dataType: 'html',
                success: function (data) {
                    if (data) {
                        $('#order_list_table').html(data);
                    }
                },
                error: function () {
                    alert('获取订单列表失败，请稍后再试');
                }
            });
        },

        _getSearchParam: function () {
            var searchItem = $('div .filter_search_info');
            var userJson = {};
            //写入input数据
            searchItem.find('input').each(function () {
                var self = $(this);
                if (self.val()) {
                    var searchKey = self.attr('name');
                    var searchVal = $.trim(self.val());
                    userJson[searchKey] = searchVal;
                }
            });
            //写入selcet数据
            searchItem.find('select').each(function () {
                var select = $(this);
                var searchKey = select.attr('name');
                select.find('option:selected').each(function () {
                    var self = $(this);
                    if (self.val()) {
                        userJson[searchKey] = self.val();
                    }
                });
            });
            return userJson;
        },

        // 导出数据
        _exportOrderList: function () {
            var param = yaoPurchaseList.prototype._getSearchParam();
            param['type'] = this.exportBtn.attr('type');

            var form = $('<form>'); //定义一个form表单

            form.attr('style', 'display:none');
            form.attr('target', '');
            form.attr('method', 'post');
            form.attr('action', '/vender/b/pop_purchase_ajax/exportOrder');
            // 参数
            for (var attrName in param) {
                if (!param.hasOwnProperty(i)) {
                    var input = $('<input>');
                    input.attr('type', 'hidden');
                    input.attr('name', attrName);
                    input.attr('value', param[attrName]);
                    form.append(input);
                }
            }

            $('body').append(form); //将表单放置在web中
            form.submit(); //表单提交
        },

        reload: function () {
            this._init();
        }
    });

    /**
     * 暴露全局变量
     */
    if (!w.yaoPurchaseList) {
        w.yaoPurchaseList = function () {
            new yaoPurchaseList({
                node: $('.main_content')
            });
        };
    }

    /**
     * 商品推荐入口
     */
    $(function () {
        w.yaoPurchaseList();
    });
})(window, jQuery);
//# sourceMappingURL=main.js.map
