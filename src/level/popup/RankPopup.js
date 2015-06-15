/**
 * @file 排行榜 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/ui/Popup');

    var RankPopup = function (game, options) {
        Popup.call(
            this, game,
            {
                hasHeader: true,
                headerType: 'icon',
                headerIcon: 'icon-podium',
                title: '世界排行榜',
                height: 427
            }
        );

        this.rowHeight = 65;

        this._init();
    };
    util.inherits(RankPopup, Popup);

    RankPopup.prototype._initContent = function () {
        // if (global.getMode() === 'dev') {
        //     var res = {
        //         me: 2,
        //         list: [
        //             {nickname: '武小盼', highest: 250},
        //             {nickname: 'devyumao', highest: 249},
        //             {nickname: 'ishowshao', highest: 244},
        //             {nickname: '姜饼仔', highest: 233},
        //             {nickname: '姜饼妹', highest: 190}
        //         ]
        //     };
        //     this._preprocessData(res);
        // }
        // else {}
        var me = this;
        require('common/ajax').get({
            url: require('common/url').GET_RANK,
            success: function (res) {
                res = JSON.parse(res);
                me._preprocessData(res);
            }
        });
    };

    RankPopup.prototype._preprocessData = function (data) {
        var list;

        var myRank = data.me;
        
        if (myRank > 5) {
            list = data.list.slice(0, 4);
            
            list.push({
                nickname: global.getNickname(),
                highest: global.getHighest(),
                rank: myRank
            });
            // this._setHeight(this.height + this.rowHeight);
        }
        else {
            list = data.list.slice(0, 5);
        }
        
        this._initRows(list);
    };

    RankPopup.prototype._initRows = function (rankData) {
        var game = this.game;
        var container = this.container;

        var marginTop = 20;
        var rowHeight = this.rowHeight;
        var rowWidth = this.width - 2 * this.paddingHorz;

        var myNickname = global.getNickname();

        rankData.forEach(function (data, index) {
            var row = game.add.image(
                0, marginTop + rowHeight * index,
                index % 2 === 0 ? 'pixel-dark-beige' : 'transparent'
            );
            row.scale.set(rowWidth, rowHeight);
            container.addChild(row);

            var rowCtn = game.add.image(row.x, row.y);
            container.addChild(rowCtn);

            var rankText = game.add.text(
                15, rowHeight / 2,
                (data.rank ? data.rank : index + 1) + '',
                {
                    font: 'bold 30px ' + global.fontFamily,
                    fill: color.get('coffee'),
                    strokeThickness: 6,
                    stroke: color.get('white')
                }
            );
            rankText.alpha = 0.7;
            rankText.anchor.set(0, 0.5);
            if (data.rank && data.rank > 99) { // 三位数及以上缩放
                rankText.scale.set(56/rankText.width);
            }
            rowCtn.addChild(rankText);

            var nameText = game.add.text(
                85, rowHeight / 2,
                data.nickname,
                {
                    font: 'bold 24px ' + global.fontFamily,
                    fill: color.get('coffee')
                }
            );
            nameText.anchor.set(0, 0.5);
            rowCtn.addChild(nameText);

            if (data.nickname === myNickname) {
                var meTip = game.add.image(
                    nameText.x + nameText.width + 10,
                    rowHeight / 2,
                    'me-tip'
                );
                meTip.anchor.set(0, 0.5);
                rowCtn.addChild(meTip);

                var meText = game.add.text(
                    meTip.width - 5, 0,
                    'me',
                    {
                        font: 'bold 18px ' + global.fontFamily,
                        fill: color.get('white')
                    }
                );
                meText.anchor.set(1, 0.5);
                meTip.addChild(meText);
            }

            var scoreText = game.add.text(
                rowWidth - 15, rowHeight / 2,
                data.highest + '',
                {
                    font: 'bold 26px ' + global.fontFamily,
                    fill: color.get('white'),
                    strokeThickness: 8,
                    stroke: color.get('coffee')
                }
            );
            scoreText.anchor.set(1, 0.5);
            rowCtn.addChild(scoreText);
        });
    };

    return RankPopup;

});
