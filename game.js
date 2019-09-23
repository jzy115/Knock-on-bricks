function onLoad() {
    gGame = new Game();
    gGame.render();
    gGame.update();
}
function Game() {
    var _this = this;
    this.map = null;
    this.brick = null;
    this.bar = null;
    this.ball = [];
    this.tool = null;
    this.temp = 0;
    this.mouseX = 0;
    this.id = 0;
    this.tools = [true,false,false,false,false];
    this.toolsId = [];
    this.render = function () {
        _this.map = new Map();
        _this.map.savePos();
        _this.brick = new Brick();
        _this.bar = new Bar();
        _this.ball.push(new Ball());
        _this.tool = new Tool();
    };
    cvs.onmousemove = function (e) {
        _this.mouseX = e.clientX;
    };
    cvs.onclick = function () {
        _this.temp = 1;
    };

    this.update = function () {
        _this.id = parseInt(Math.random() * 6);
        ctx.clearRect(0,0,cvs.width,cvs.height);
        //画砖块
        _this.brick.draw(_this.map.brickX,_this.map.brickY);
        //板
        _this.bar.updatePos(_this.mouseX);
        _this.bar.judgePos();
        _this.bar.draw();
        //球
        for (var i = 0 ; i < _this.ball.length; i++){
            _this.ball[i].judgeCollision(_this.temp,_this.bar.positionX,_this.bar.positionY,_this.map.brickX,_this.map.brickY);
            _this.ball[i].updatePos(_this.mouseX,_this.temp);
            _this.ball[i].draw();
            if (_this.ball[i].positionY > cvs.height - 50){
                _this.ball.splice(i,1);
            }
        }
        //球与砖碰撞
        if (num != null){
            if (_this.tools[parseInt(Math.random() * 5)] == true) {
                _this.tool.savePos(_this.map.brickX,_this.map.brickY);
                _this.toolsId.unshift(_this.id);
            }
            _this.map.brickX.splice(num,1);
            _this.map.brickY.splice(num,1);
            score += 10;
            num = null;
        }
        //道具
        _this.tool.updatePos(_this.toolsId);
        _this.tool.draw(_this.toolsId);
        _this.tool.judgeCollision(_this.toolsId,_this.bar.positionX,_this.bar.positionY);
        if (num2 != null) {
            _this.tool.toolX.splice(num2,1);
            _this.tool.toolY.splice(num2,1);
            _this.toolsId.splice(num2,1);
            num2 = null;
        }
        if (map == 1){
            _this.map = new Map();
            _this.map.savePos();
            map = 0;
        }
        if (map == 2){
            _this.ball.push(new Ball());
            map = 0;
        }

        //判断游戏结束
        if (_this.ball.length == 0) {
            over = 1;
            _this.toolsId.forEach(function (val) {
                if (val == 5) {
                    over = 0;
                }
            });
            if (over == 1){
               location.href = 'gameOver.html';
            } 
        }
		if (_this.map.brickX.length == 0) {
			location.href = 'gameOver.html';
		}
        div.innerHTML = '得分：' + score;
        window.requestAnimationFrame(_this.update);
    };

}