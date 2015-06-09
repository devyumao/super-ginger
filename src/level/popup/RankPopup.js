/**
 * @file 排行榜 弹框
 * @author yumao [zhangyu38@baidu.com]
 */

define(function (require) {

    var global = require('common/global');
    var color = require('common/color');
    var util = require('common/util');
    var Popup = require('common/Popup');

    var RankPopup = function (game, options) {
        Popup.call(
            this, game,
            {
                hasHeader: true,
                headerType: 'icon',
                headerIcon: 'icon-podium',
                title: '英雄榜',
                height: 427
            }
        );
    };
    util.inherits(RankPopup, Popup);

    RankPopup.prototype._initContent = function () {
        var game = this.game;
        var container = this.container;
        
        var rankData = [
            {
                name: '武小盼',
                score: 250
            },
            {
                name: 'devyumao',
                score: 249
            },
            {
                name: 'ishowshao',
                score: 244
            },
            {
                name: '姜饼仔',
                score: 233
            },
            {
                name: '姜饼妹',
                score: 190
            }
        ];

        var marginTop = 20;
        var rowHeight = 65;
        var rowWidth = this.width - 2 * this.paddingHorz;

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
                35, rowHeight / 2,
                index + 1 + '',
                {
                    font: 'bold 30px ' + global.fontFamily,
                    fill: color.get('black'),
                    strokeThickness: 6,
                    stroke: color.get('white')
                }
            );
            rankText.alpha = 0.7;
            rankText.anchor.set(1, 0.5);
            rowCtn.addChild(rankText);

            var nameText = game.add.text(
                70, rowHeight / 2,
                data.name,
                {
                    font: 'bold 24px ' + global.fontFamily,
                    fill: color.get('coffee')
                }
            );
            nameText.anchor.set(0, 0.5);
            rowCtn.addChild(nameText);

            var scoreText = game.add.text(
                rowWidth - 15, rowHeight / 2,
                data.score,
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
