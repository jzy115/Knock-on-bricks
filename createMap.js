function Map() {
    var _this = this;
    this.positionX = 25;
    this.positionY = 50;
    this.brickX = [];
    this.brickY = [];
    this.savePos = function () {
        for (var j = 0; j < 6; j++){
            for (var i = 0; i < 12; i++){
                _this.brickX.push(_this.positionX);
                _this.brickY.push(_this.positionY);
                _this.positionX += 105;
            }
            _this.positionX = 25;
            _this.positionY += 40;
        }
    };
}
function Brick() {
    var _this = this;
    this.draw = function (brickX,brickY) {
        for (var i = 0; i < brickX.length; i++){
            ctx.beginPath();
            ctx.fillStyle = 'red';
            ctx.shadowColor = "black";
            ctx.shadowBlur = 2;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            ctx.fillRect(brickX[i],brickY[i],100,30);
        }
    };
}
function Bar() {
    var _this = this;
    this.positionX = cvs.width/2 - 100;
    this.positionY = cvs.height - 100;
    this.draw = function () {
        ctx.beginPath();
        ctx.moveTo(_this.positionX, _this.positionY);
        ctx.lineTo(_this.positionX + barWidth, _this.positionY);
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'cornflowerblue';
        ctx.stroke();
    };
    this.updatePos = function (mouseX) {
        _this.positionX = mouseX - 300 - barWidth / 2;
    };
    this.judgePos = function () {
        if (_this.positionX >= cvs.width - barWidth - 5) {
            _this.positionX = cvs.width - barWidth - 5;
        } else if (_this.positionX <= 5) {
            _this.positionX = 5;
        }
    }
}
function Ball() {
    var _this = this;
    this.arr = [true,false];
    this.positionX = cvs.width / 2;
    this.positionY = cvs.height - 116;
    this.directionX = _this.arr[parseInt(Math.random() * 2)];
    this.directionY = true;
    this.draw = function () {
        ctx.beginPath();
        ctx.arc(_this.positionX,_this.positionY,10,0,Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
    };
    this.updatePos = function (mouseX,temp) {
        if (temp == 0) {
            _this.positionX = mouseX - 300;
            if (_this.positionX >= cvs.width - 5 - barWidth / 2) {
                _this.positionX = cvs.width - 5 - barWidth / 2;
            } else if (_this.positionX <= 5 + barWidth / 2) {
                _this.positionX = 5 + barWidth / 2;
            }
        } else {
            if (_this.directionX) {
                _this.positionX += speed;
            } else {
                _this.positionX -= speed;
            }
            if (_this.directionY) {
                _this.positionY -= speed;
            } else {
                _this.positionY += speed;
            }
        }
    };
    this.judgeCollision = function (temp,barX,barY,brickX,brickY) {
        if (temp != 0) {
            //球撞墙
            if (_this.positionX >= cvs.width - 10 || _this.positionX <= 10){
                _this.directionX = !_this.directionX;
            } else if (_this.positionY <= 10) {
                _this.directionY = !_this.directionY;
            }
            //球与板相撞
            ctx.beginPath();
            ctx.rect(barX - 5,barY - 10,barWidth + 10,barHeight);
            if(ctx.isPointInPath(_this.positionX,_this.positionY + 5)){
                _this.directionY = !_this.directionY;
            }
            //球与砖相撞
            for (var i = 0; i < brickX.length; i++){
                ctx.beginPath();
                ctx.rect(brickX[i],brickY[i],100,30);
                //砖的下边界
                if(ctx.isPointInPath(_this.positionX,_this.positionY - 5)){
                    _this.directionY = !_this.directionY;
                    num = i;
                }
                //砖的上边界
                else if (ctx.isPointInPath(_this.positionX,_this.positionY + 5)){
                    _this.directionY = !_this.directionY;
                    num = i;
                }
                //砖的右边界
                else if (ctx.isPointInPath(_this.positionX - 5,_this.positionY)){
                    _this.directionX = !_this.directionX;
                    num = i;
                }
                //砖的左边界
                else if (ctx.isPointInPath(_this.positionX + 5,_this.positionY)){
                    _this.directionX = !_this.directionX;
                    num = i;
                }
            }
        }
    }
}
function Tool() {
    var _this = this;
    this.toolX = [];
    this.toolY = [];
    this.color = ['green', 'yellow', 'pink', 'black', 'purple','orange'];
    this.savePos = function (brickX, brickY) {
        _this.toolX.unshift(brickX[num] + 40);
        _this.toolY.unshift(brickY[num]);
    };
    this.draw = function (toolsId) {
        for (var i = toolsId.length - 1; i >= 0; i--) {
            ctx.beginPath();
            ctx.rect(_this.toolX[i], _this.toolY[i], 20, 30);
            ctx.fillStyle = _this.color[toolsId[i]];
            ctx.fill();
        }
    };
    this.updatePos = function (toolsId) {
        for (var i = toolsId.length - 1; i >= 0; i--) {
            _this.toolY[i] += 1;
        }
    };
    this.judgeCollision = function (toolsId,barX, barY) {
        //道具与板相撞
        for (var i = toolsId.length - 1; i >= 0; i--) {
            ctx.beginPath();
            ctx.rect(barX - 5, barY - 10, barWidth + 10, 20);
            if (ctx.isPointInPath(_this.toolX[i] + 10, _this.toolY[i] + 30)) {
                score += 100;
                if (toolsId[i] == 0) {
                    barWidth *= 2;
                    if (barWidth >= 300) {
                        barWidth = 300;
                    }
                } else if (toolsId[i] == 1) {
                    speed -= 5;
                    barHeight = -5;
                    if (speed <= 5) {
                        speed = 5;
                    }
                    if (barHeight <= 5) {
                        barHeight = 5;
                    }
                } else if (toolsId[i] == 2) {
                    speed += 5;
                    barHeight += 5;
                    if (speed >= 15) {
                        speed = 15;
                    }
                    if (barHeight >= 15) {
                        barHeight = 15;
                    }
                } else if (toolsId[i] == 3) {
                    barWidth /= 2;
                    if (barWidth <= 75) {
                        barWidth = 75;
                    }
                }
                else if (toolsId[i] == 4) {
                    map = 1;
                }
                else if (toolsId[i] == 5) {
                    map = 2;
                }
                num2 = i;
            }
            ctx.beginPath();
            ctx.rect(0, barY + 30, cvs.width, 10);
            if (ctx.isPointInPath(_this.toolX[i] + 10, _this.toolY[i] + 30)) {
                num2 = i;
            }
        }
    }
}