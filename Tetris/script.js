function Tetris(){
	this.box = null;
	this.tetromino = [
		[0x0f00,0x4444,0x0f00,0x4444],//I
		[0x04e0,0x0464,0x00e4,0x04c4],//T
		[0x4620,0x6c00,0x4620,0x6c00],//反Z
		[0x2640,0xc600,0x2640,0xc600],//Z
		[0x6220,0x1700,0x2230,0x0740],//7
		[0x6440,0x0e20,0x44c0,0x8e00],//反7
		[0x0660,0x0660,0x0660,0x0660]//O
	];
	this.pob = [3,4,5,6,13,14,15,16,23,24,25,26,33,34,35,36];//方块出现区域
	this.body = [];//当前移动方块的位置
	this.s = [];
	this.next = null;//方块样式
	this.specific = null;//方块具体方向
	this.timer = null;
	this.speed = 500;
	this.flag = true;//是否应该生成新的方块
	this.go = null;
}
Tetris.prototype = {
	init:function(id){
		this.box = document.getElementById(id);
		var ul = "";
		for(var i=0 ; i<20 ; i++){
			var row = '';
			for(var j=0 ; j<10 ; j++){
				if(j==0){
					row += "<ul><li id='" + "li_"+(i*10+j) + "'></li>";
				}else{
					row += "<li id='" + "li_"+(i*10+j)+ "'></li>";
				}
				if(j == 9){
					row += "</ul>";
				}
			}
			ul += row;
		}
		this.box.innerHTML += ul;
	},
	//矩阵不足16位时在前方添加0
	addZero:function(arr){
		var temp = arr;
		for( ; ; ){
			if(temp.length < 16) temp = '0' + temp;
			else break;
		}
		return temp;
	},
	//设置目标的class
	setClassName:function(num,str){
		document.getElementById("li_"+num).className = str;
	},
	//随机生成方块类型
	random:function(){
		this.next = Math.floor(Math.random() * 7 + 0);
		this.specific = Math.floor(Math.random() * 4 + 0);
		var matrix = this.tetromino[this.next][this.specific].toString(2);
		this.body.length = 0;
		matrix = this.addZero(matrix);
		this.end(matrix);
		for(var i=0 ; i<matrix.length ; i++){
			if(matrix[i] == 1){
				this.setClassName(this.pob[i],"on");
				this.body.push(this.pob[i]);
			}
		}
		for(var i=0 ; i<this.pob.length ; i++){
			this.s[i] = this.pob[i];
		}
	},
	run:function(){
		this.flag = false;
		var stop = false;
		var that = this;
		clearInterval(this.timer);
		this.timer = setInterval(function(){
			console.log(that.body);
			for(var i=that.body.length-1 ; i>=0 ; i--){
				if(that.body[i]+10>=200 || document.getElementById("li_"+(that.body[i]+10)).className == "off"){
					stop = true;
					break;
				}
			}
			if(!stop){
				for(var i=that.body.length-1 ; i>=0 ; i--){
					that.setClassName(that.body[i],'');
					that.body[i] += 10;
					that.setClassName(that.body[i],"on");
				}
				for(i = 0 ; i<that.s.length ; i++){
					that.s[i]+=10;
				}
			}else{
				that.flag = true;
				for(var j=0 ; j<that.body.length ; j++){
					that.setClassName(that.body[j],"off");
				}
				console.log(parseInt(that.body[that.body.length-1]));
				that.remove(parseInt(that.body[that.body.length-1]/10));
				clearInterval(that.timer);
			}
		},that.speed);
	},
	play:function(){
		var that = this;
		this.go = setInterval(function(){
			if(that.flag){
				that.random();
				that.run();
			}
		},1000)
	},
	key:function(){
		var that = this;
		document.body.onkeydown = function(event){
			var event = event || window.event;
			switch(event.keyCode){
				case 37:
					that.move('l');
					break;
				case 39:
					that.move('r');
					break;
				case 40:
					that.move('d');
					break;
				case 38:
					that.turn();
					break;
			}
		}
	},
	move:function(path){
		var grid = 0;
		var flag = true;//允许移动
		switch(path){
			case 'l':
				grid = -1;
				break;
			case 'r':
				grid = 1;
				break;
			case 'd':
				grid = 10;
				break;
		}
		for(var i=0 ; i<this.body.length ; i++){
			if(document.getElementById("li_"+(this.body[i]+grid)).className == "off"){
				flag = false;
				break;
			}else{
				if(grid!=10 && parseInt(this.body[i]/10) != parseInt((this.body[i]+grid)/10)){
					flag = false;
					break;
				}
				flag = true;
			}
		}
		if(flag){
			for(i=0 ; i<this.body.length ; i++){
				this.setClassName(this.body[i],'');
				this.body[i] += grid;
			}
			for(i=0 ; i<this.s.length ; i++){
				this.s[i] += grid;
			}
			for(i=0 ; i<this.body.length ; i++)
				this.setClassName(this.body[i],"on");
		}
	},
	remove:function(level){
		var down = 0;
		var flag;//是否该消除
		for(var i=level ; i>=level-5 ; i--){
			flag = true;
			for(var j=0 ; j<10 ; j++){
				var num = i*10+j;
				if(document.getElementById("li_"+num).className == ''){
					flag = false;
					break;
				}
			}
			if(flag){
				for(var j=i*10+9 ; j>=0 ; j--){
					if(j>=10){//不是最上一行
						this.setClassName(j,document.getElementById("li_"+(j-10)).className);
					}else{
						this.setClassName(j,'');
					}
				}
				i++;
			}
		}
	},
	//旋转方块
	turn:function(){
		var temp = [];
		var flag = false;
		var getturn = true;
		this.specific+1==4 ? this.specific = 0 : this.specific++;
		var matrix = this.tetromino[this.next][this.specific].toString(2);
		matrix = this.addZero(matrix);
		for(var i=0 ; i<16 ; i++){
			if(matrix[i] == 1) temp.push(this.s[i]);
		}
		for(i=0 ; i<temp.length ; i++){
			if (temp[i]%10 == 9) {
				flag = true;
			}
			if((temp[i]%10 == 0 && flag) || document.getElementById("li_"+temp[i]).className == "off"){
				getturn = false;
			}
		}
		if(getturn){
			for(i=0 ; i<this.body.length ; i++){
				this.setClassName(this.body[i],"");
			}
			for (i=0 ; i<this.body.length ; i++) {
				this.setClassName(temp[i],"on");
			}
			this.body = temp;
		}
	},
	end:function(matrix){
		for(var i=0 ; i<this.pob.length ; i++){
			if(document.getElementById("li_"+this.pob[i]).className == "off" && matrix[i] == '1'){
				clearInterval(this.timer);
				clearInterval(this.go);
				alert("YOU DIED!");
				return false;
			}
		}
	},
	start:function(){
		this.play();
		this.key();
	}
}
window.onload = function(){
	var tetris = new Tetris();
	tetris.init("box");
	tetris.start();
}