function Demo(){
	this.data = [];
	this.box = null;
}
Demo.prototype = {
	init:function(id){
		this.box = document.getElementById(id);
		var ul = document.createElement("ul");
		for(var i=0 ; i<this.data.length ; i++){
			var li = "";
			var items = this.data[i];
			for(var j=0 ; j< items.length ; j++){
				var son = items[j];
				if(j == 0){
					li += "<li class='' style='height:35px;'><h2>" + son.title + "</h2><ul>";
				}else{
					li += "<li><a href='" + son.url + "' target='_blank'>" + son.text + "</a></li>";
				}
				if(j == items.length-1){
					li += "</ul></li>";
				}
			}
			ul.innerHTML += li;
		}
		this.box.appendChild(ul);
	},
	mouseAction:function(){
		var btn = this.box.querySelectorAll("ul li");
		for(var i=0 ; i<btn.length ; i++){
			btn[i].onclick = function(){
				if(this.className == "on"){
					this.classList.remove("on");
					this.style.height = "35px";
				}else{
					for(var j=0;j<btn.length;j++){
						btn[j].classList.remove("on");
						btn[j].style.height = "35px";
					}
					this.classList.add("on");
					var childCount = this.getElementsByTagName("li").length;
					this.style.height = 35 * childCount + 37 + "px";
					this.style.transition = ".5s";
				}
			}
		}
	}
}
window.onload = function(){
	var demo = new Demo();
	demo.data = [
		[
			{title:"拖动效果"},
			{url:"drag/01/index.html",text:"可拖动并改变大小的窗体"},
			{url:"drag/02/index.html", text:"滑动验证"}
		],
		[
			{title:"常用图片轮换"},
			{url:"slide/01/index5.html", text:"仿淘宝首页图片轮换"},
			{url:"slide/02/index.html", text:"多个图片轮换"},
			{url:"slide/03/index.html", text:"仿亚马逊首页图片轮换"}
		],
		[
			{title:"移动端效果"},
			{url:"mobile/index.html",text:"移动端效果展示"}
		],
		[
			{title:"web小程序"},
			{url:"calculator/index.html", text:"web计算器"}
		],
		[
			{title:"其他"},
			{url:"page/index2.html",text:"页码效果"}
		]
	];
	demo.init("warp");
	demo.mouseAction();
}