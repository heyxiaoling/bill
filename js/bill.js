var WX={
	
};

function Bill(){
	this.sta=null;
	this.ans=null;
	this.sor=null;
	this.ino=null;
	this.settings={
		usd:21+parseInt(Math.random()*40),
		cny:1000+parseInt(Math.random()*1000),
		s_page:false,//直接跑到排行榜
		ac_s:false,//电话号码控制器
		o_time:null,//定时器
		a_num:0,//做题次数
		a_ri:false,//是否答对
		i_fo:false,//用户名和电话号码是否完整
		so_m:null,//排名
		username:null,//用户名
		i_oh:null,//电话
		time:{
			_time:90,//限定答题时间
			_time_c:0,//重新加时所用时间
			_time_s:0,//提交答案有效时间
			_time_w:0,//提交答案时间
		},
		style:{
			dH:$(document).height(),
			dW:$(document).width(),
			wW:$(window).width(),
			wH:$(window).height(),
			sH:$(window).scrollTop(),
		}
	};
}

Bill.prototype.init=function(ele,opt){
	//初始化
	this.sta=$(ele.start);
	this.ans=$(ele.answer);
	this.sor=$(ele.sort);
	this.ino=$(ele.info);
	this.settings=$.extend(true,{},this.settings,opt);
	this._set();
}
Bill.prototype._set=function(){
	//设置样式。一些参数
	var _this=this;

	//直接跳到排行榜
	if(parseInt(_this.settings.style.wH)>1008){
		$('.page').height(_this.settings.style.wH);
	}

	if(window.location.href.split("?")[1]=="sort"){
		_this.settings.s_page=true;
		$('#welcome').animate({'opacity':0},1000,function(){
        	$(this).remove();
        });
        $('#spinner').animate({'opacity':0},1000,function(){
        	$(this).remove();
        	_this._s_s();
        });
		
		return false;
	}

	_this.ans.find('.bo-bg .blackboard p cite').html(_this.settings.usd);
	_this.ans.find('.bo-bg .blackboard p em').html(_this.settings.cny);
	

	_this.load();
}
Bill.prototype.load=function(){
	//加载动画
	var _this=this;
	window.onload=function(){
		$('#welcome').animate({'opacity':0},1000,function(){
        	$(this).remove();
        });
        $('#spinner').animate({'opacity':0},1000,function(){
        	$(this).remove();
        	_this._start();
        });
	}		
}
Bill.prototype._start=function(){
	//开始
	var _this=this;
	_this.sta.css({'visibility':'visible'}).addClass('startin');
	_this.sta.find('.bo-bg .start-btn')[0].addEventListener('click',function(){
		//查看规则
		_this._rule();	
	},false);
}



Bill.prototype._rule=function(){
	var _this=this;
	var bd=$('body');

	if($("div[name=mask]").length!=0){
        return false;
    }

    var _mask = "<div class='mask' id='mask' name='mask'></div>";
    var _msg = "<div class='_rule' id='_rule'><cite></cite></div>";
    bd.append(_mask);
    bd.append(_msg);

    var mask=$('#mask'),msg=$('#_rule');
    
    function hidemsg(){
        mask.animate({'opacity':0},1000,function(){
        	mask.remove();
        });
        msg.animate({'opacity':0},1000,function(){
        	msg.remove();
        	_this._down();
        });
    }

    msg.find('cite')[0].addEventListener('touchstart',function(){
    	//关闭窗口
		hidemsg();
	},false);
}


Bill.prototype._down=function(){
	//答题倒计时
	var _this=this;
	var bd=$('body');

	if($("div[name=mask]").length!=0){
        return false;
    }
    var _mask = "<div class='mask' id='mask' name='mask'></div>";
    var _msg = "<div class='down' id='down'><span class='span1'></span></div>";
    bd.append(_mask);
    bd.append(_msg);

    var mask=$('#mask'),msg=$('#down');
    var s=new TimeLine();
    s.add(600,function(){
    	msg.append("<span class='span2'></span>");
    },'2');

    s.add(1200,function(){
    	msg.append("<span class='span3'></span>");
    },'3');

    s.add(1600,function(){
    	mask.remove();
		msg.remove();
		_this.sta.addClass('startout');
    },'4');

    s.add(3200,function(){
    	_this.sta.css({'visibility':'hidden'});
		_this.ans.css({'visibility':'visible'}).addClass('answerin');
    },'5');

    s.add(4400,function(){
    	_this._answer();
    },'6');
	
	s.start();
}

Bill.prototype._answer=function(){
	//答题
	var _this=this;
	var date=new Date().getTime();
	_this.settings.a_num+=1;
	_this.settings.o_time=setInterval(function(){
		var _date=new Date().getTime();
		if((_this.settings.time._time-10)*1000<=(_date-date)){
			//闹铃开始,闹钟抖动
			_this.ans.find('#audio')[0].play();
			_this.ans.find('.clock').addClass('clockin');
		}

		if(_this.settings.time._time*1000<=(_date-date)){
			//时间到了
			//闹铃停止
			_this.ans.find('#audio')[0].pause();
			_this.ans.find('.clock').removeClass('clockin');
			_this.ans.find('.clock span').text(_time(_this.settings.a_num*_this.settings.time._time*1000));
			_this._ans_t_o();
			//停止定时器
			clearInterval(_this.settings.o_time);

			return false;
		}else{
			_this.ans.find('#audio')[0].pause();
			_this.ans.find('.clock span').text(_time((_date-date)+(_this.settings.a_num-1)*_this.settings.time._time*1000));
		}
		
	},1);

	_this.ans.find('.bo-bg .ans span')[0].addEventListener('touchstart',function(){
		// $.post(path+"=2",{},function(msg){
	                                
		// },'json');
		_this._ans_form();
	});
	_this._input_in(_this.ans.find('#usd'));
	_this._input_out(_this.ans.find('#usd'));
	_this._input_in(_this.ans.find('#cny'));
	_this._input_out(_this.ans.find('#cny'));
	
}

Bill.prototype.n_answer=function(){
	//答题
	var _this=this;
	var date=new Date().getTime();
	
	_this.settings.o_time=setInterval(function(){
		var _date=new Date().getTime();
		if((_this.settings.time._time-10)*1000<=(_date-date)){
			//闹铃开始,闹钟抖动
			_this.ans.find('#audio')[0].play();
			_this.ans.find('.clock').addClass('clockin');
		}

		if(_this.settings.time._time*1000<=(_date-date)){
			//时间到了
			//闹铃停止
			_this.ans.find('#audio')[0].pause();
			_this.ans.find('.clock').removeClass('clockin');
			_this.ans.find('.clock span').text(_time(_this.settings.time._time*1000));
			_this._ans_t_o();
			//停止定时器
			clearInterval(_this.settings.o_time);

			return false;
		}else{
			_this.ans.find('#audio')[0].pause();
			_this.ans.find('.clock span').text(_time(_date-date));
		}
		
	},1);

	_this.ans.find('.bo-bg .ans span')[0].addEventListener('touchstart',function(){
		// $.post(path+"=2",{},function(msg){
	                                
		// },'json');
		_this._ans_form();
	});
	
}

Bill.prototype._input_in=function(obj){
	obj.focus(function(event) {
		$(this).css({'border-color':'#f08850'});
		$(this).siblings('cite').hide();
	});
}
Bill.prototype._input_out=function(obj){
	obj.blur(function(event) {
		$(this).css({'border-color':'#7287e0'});
	});
}
Bill.prototype._ans_form=function(){
	var _this=this;
	var usd=_this.ans.find('#usd').val();
	var cny=_this.ans.find('#cny').val();
	var cite1=_this.ans.find('.ans-list li').eq(0).find('cite');
	var cite2=_this.ans.find('.ans-list li').eq(1).find('cite');


	if(usd==""){
		cite1.show();
		return false;
	}
	if(cny==""){
		cite2.show();
		return false;
	}

	_this.ans.find('#usd').blur();
	_this.ans.find('#cny').blur();

	if((_this.settings.usd-20)==parseInt(usd)&& _this.settings.cny==parseInt(cny)){
		//答对了,跳到填写信息页面
		clearInterval(_this.settings.o_time);
		_this.settings.time._time_s=_this.ans.find('.clock span').text();
		setTimeout(function(){	
			_this._r_box();
		},300);
		return false;
	}else{
		//答错了
		setTimeout(function(){
			_this._ans_wr();
		},300);
		return false;
	}
}


Bill.prototype._r_box=function(){
	var _this=this;
	_this.settings.a_ri=true;

	var bd=$('body');

	if($("div[name=mask]").length!=0){
        return false;
    }

    var _mask = "<div class='mask' id='mask' name='mask'></div>";
    var _msg = "<div class='a-ri' id='a-ri'></div><div class='a-ri-l' id='a-ri-l'></div>";
    bd.append(_mask);
    bd.append(_msg);
    var mask=$('#mask'),msg=$('#a-ri'),light=$('#a-ri-l');
    setTimeout(function(){
    	mask.animate({'opacity':0},1000,function(){
        	mask.remove();
        	light.remove();
        	msg.remove();
        	_this._info();
        });
        msg.animate({'opacity':0},1000);
        light.animate({'opacity':0},1000);

    },2000);

}

Bill.prototype._ans_wr=function(){
	var _this=this;
	var bd=$('body');

	if($("div[name=mask]").length!=0){
        return false;
    }

    var _mask = "<div class='mask' id='mask' name='mask'></div>";
    var _msg = "<div class='key' id='key'><div class='key-wro'><p></p><em></em><span>发给小伙伴找寻真相</span><strong>查看排行榜</strong></div><cite></cite></div>";
    bd.append(_mask);
    bd.append(_msg);

    var mask=$('#mask'),msg=$('#key');
    function hidemsg(){
        mask.animate({'opacity':0},1000,function(){
        	mask.remove();
        });
        msg.animate({'opacity':0},1000,function(){
        	msg.remove();
        });
        $('#share1').remove();
    }

    wx.onMenuShareTimeline({
		title:'我参加了搜航网“算积分，赢话费”活动，答对一道题就有可能赢得百元话费。', 
		link:'http://www.sofreight.com/Static/Weixin/bill.html', 
		imgUrl:'http://www.sofreight.com/resource/wx/images/bill.jpg', 
		success: function () { 
		    
		},
		cancel: function () { 
		   
		}
	});

    msg.find('cite')[0].addEventListener('touchstart',function(){
    	//关闭窗口
		hidemsg();
		if(s_time(_this.ans.find('.clock span').text())<_this.settings.time._time*1000){
			_this.c_ans();
			//继续答题
		}else{
			_this._ans_c();
		}
		
	},false);

	msg.find('.key-wro strong')[0].addEventListener('touchstart',function(){
		//查看牌行榜
		hidemsg();
		clearInterval(_this.settings.o_time);
		_this._s_s();
	},false);

	msg.find('.key-wro span')[0].addEventListener('touchstart',function(){
		//分享给小朋友
		clearInterval(_this.settings.o_time);
		_this._share_l();
	},false);
	

}
Bill.prototype._ans_t_o=function(){
	var _this=this;
	var bd=$('body');

	if($("div[name=mask]").length!=0){
        return false;
    }

    var _mask = "<div class='mask' id='mask' name='mask'></div>";
    var _msg = "<div class='key' id='key'><div class='key-wrr'><p></p><em></em><span>加时重做</span></div><cite></cite></div>";
    bd.append(_mask);
    bd.append(_msg);

    var mask=$('#mask'),msg=$('#key');
    

    function hidemsg(){
        mask.animate({'opacity':0},1000,function(){
        	mask.remove();
        });
        msg.animate({'opacity':0},1000,function(){
        	msg.remove();
        });
    }

    msg.find('cite')[0].addEventListener('touchstart',function(){
    	//关闭窗口
		hidemsg();
		_this._ans_c();
	},false);

	msg.find('.key-wrr span')[0].addEventListener('touchstart',function(){
		//加时重做
		hidemsg();
		_this._ans_c();
	},false);
}

Bill.prototype._ans_c=function(){
	var _this=this;
	clearInterval(_this.settings.o_time);
	var _now_time=s_time(_this.ans.find('.clock span').text());
	var date=new Date().getTime();
	_this.settings.o_time=setInterval(function(){
		var _date=new Date().getTime();
		_this.ans.find('.clock span').text(_time(_date-date+_now_time));
	},1);
}

Bill.prototype.c_ans=function(){
	var _this=this;
	clearInterval(_this.settings.o_time);
	var _now_time=s_time(_this.ans.find('.clock span').text());
	var date=new Date().getTime();
	_this.settings.o_time=setInterval(function(){
		var _date=new Date().getTime();
		if((_this.settings.time._time-10)*1000<=(_date-date+_now_time)){
			//闹铃开始,闹钟抖动
			_this.ans.find('#audio')[0].play();
			_this.ans.find('.clock').addClass('clockin');
		}

		if(_this.settings.time._time*1000<=(_date-date+_now_time)){
			//时间到了
			//闹铃停止
			_this.ans.find('#audio')[0].pause();
			_this.ans.find('.clock').removeClass('clockin');
			_this.ans.find('.clock span').text(_time(_this.settings.a_num*_this.settings.time._time*1000));
			_this._ans_t_o();
			//停止定时器
			clearInterval(_this.settings.o_time);

			return false;
		}else{
			_this.ans.find('.clock span').text(_time((_date-date+_now_time)+(_this.settings.a_num-1)*_this.settings.time._time*1000));
		}
		_this.ans.find('.clock span').text(_time(_date-date+_now_time));
	},1);
}

Bill.prototype._info=function(){
	var _this=this;
	_this.ans.css({'visibility':'hidden'});
	_this.ino.css({'visibility':'visible'}).addClass('infoin');
	_this.ans.removeClass('answerin');

	_this._input_in(_this.ino.find('.sub-list li').eq(0).find('input'));
	_this._input_out(_this.ino.find('.sub-list li').eq(0).find('input'));
	_this._input_in(_this.ino.find('.sub-list li').eq(1).find('input'));
	_this._input_out(_this.ino.find('.sub-list li').eq(1).find('input'));


	_this.ino.find('.bo-bg span')[0].addEventListener('touchstart',function(){
		//提交答案
		_this._info_form();
	},false);
}

Bill.prototype._info_form=function(){
	var _this=this;
	var name=_this.ino.find('.sub-list li').eq(0).find('input').val();
	var tel=_this.ino.find('.sub-list li').eq(1).find('input').val();
	var cite1=_this.ino.find('.sub-list li').eq(0).find('cite');
	var cite2=_this.ino.find('.sub-list li').eq(1).find('cite');
	
	if(name==""){
		//验证用户名
		cite1.show();
		return false;
	}

	if(tel!=""&&!checkMobile(tel)){
		//验证电话号码
		cite2.show();
		return false;
	}else if(checkMobile(tel)){
		_this.settings.ac_s=true;
		_this.settings.i_fo=true;
	}

	_this.ino.find('.sub-list li').eq(0).find('input').blur();
	_this.ino.find('.sub-list li').eq(1).find('input').blur();

	if(!_this.settings.ac_s){
		_this.settings.ac_s=true;
		_this.ino.find('.i-text').css({'opacity':1});
		return false;
	}


	_this.settings.username=name;
	_this.settings.i_oh=tel;

	_this._sort();
}

Bill.prototype._sort=function(){
	var _this=this;
	// $.post(path2,{username:_this.settings.username,mobile:_this.settings.i_oh,score:_this.settings.time._time_s},function(dd){
	// 	if(dd.status==1){
	// 		//保存成功
	// 		var _sort_data="";
	// 		for(var i=0; i<dd.data.rankList.length;i++){
	// 			if(i>=3){
	// 				_sort_data+="<dd><p><em>"+(i+1)+"</em></p><p>"+dd.data.rankList[i].username+"</p><p>"+dd.data.rankList[i].score+"</p></dd>";
	// 			}else{
	// 				_sort_data+="<dd><p><em></em></p><p>"+dd.data.rankList[i].username+"</p><p>"+dd.data.rankList[i].score+"</p></dd>";
	// 			}
				
	// 		}
	// 		_this.sor.find('.brand-list dd').remove();
	// 		_this.sor.find('.brand-list').append(_sort_data);
	// 		if(_this.settings.a_ri){
	// 			_this.settings.time._time_w=_this.ans.find('.clock span').text();
	// 			_this.sor.find('.time span').eq(0).find('em').html(_this.settings.time._time_w);
	// 			_this.sor.find('.time span').eq(1).find('em').html(dd.data.rank);
	// 			_this.settings.so_m=dd.data.rank;
	// 			_this.sor.find('.time').css({'opacity':1});
	// 		}
	// 		_this._s_s();
	// 	}else if(dd.status==0){
	// 		_this.ino.find('.sub-list li').eq(0).find('cite').text(dd.info);
	// 		_this.ino.find('.sub-list li').eq(0).find('cite').show();
	// 		return false;
	// 	}else if(dd.status==(-1)){
	// 		_this.ino.find('.sub-list li').eq(1).find('cite').text(dd.info);
	// 		_this.ino.find('.sub-list li').eq(1).find('cite').show();
	// 		return false;
	// 	} 	         
	// },'json');
	_this._s_s();
}

Bill.prototype._s_s=function(){
	var _this=this,bd=$('body');
	if(_this.settings.a_ri){
		var _mask = "<div class='mask' id='mask' name='mask'></div>";
		var _s_box="<div class='sort-box' id='sort-box'><strong>"+_this.settings.username+"</strong><p>您用时: <span>"+_this.settings.time._time_w+"</span></p><p>排名：<span>第"+_this.settings.so_m+"名</span></p></div>";
	    bd.append(_mask);
	    bd.append(_s_box);
	    var mask=$('#mask'),s_box=$('#sort-box');
	    setTimeout(function(){
	    	 mask.animate({'opacity':0},1000,function(){
	        	mask.remove();
	        });
	        s_box.animate({'opacity':0},1000,function(){
	        	s_box.remove();
	        });
	    },2000);
	}

	if(_this.settings.a_ri&&parseInt(_this.settings.so_m)>7){
    	wx.onMenuShareTimeline({
			title:'我在搜航网“算积分，赢话费”活动中暂排第'+_this.settings.so_m+'，离话费大奖还有距离，你也来挑战吧', 
			link:'http://www.sofreight.com/Static/Weixin/bill.html', 
			imgUrl:'http://www.sofreight.com/resource/wx/images/bill.jpg', 
			success: function () { 
			    
			},
			cancel: function () { 
			   
			}
		});
    }else if(_this.settings.a_ri&&parseInt(_this.settings.so_m)<7){
    	wx.onMenuShareTimeline({
			title:'我在搜航网“算积分，赢话费”活动中暂排第'+_this.settings.so_m+'，话费大奖唾手可得，你也来参加吧！', 
			link:'http://www.sofreight.com/Static/Weixin/bill.html', 
			imgUrl:'http://www.sofreight.com/resource/wx/images/bill.jpg', 
			success: function () { 
			    
			},
			cancel: function () { 
			   
			}
		});
    }

	_this.ans.css({'visibility':'hidden'});
	_this.ino.css({'visibility':'hidden'});
	_this.sor.css({'visibility':'visible'}).addClass('sortin');
	_this.ans.removeClass('answerin');
	_this.ino.removeClass('infoin');
	_this.ino.find('.i-text').css({'opacity':0});

	_this.sor.find('.bo-bg span')[0].addEventListener('touchstart',function(){
		_this._share();
	},false);
}

Bill.prototype._share=function(){
	var _this=this;
	var bd=$('body');

	// $.post(path+"=3",{},function(msg){
                       
	// },'json');

	if($("div[name=mask]").length!=0){
        return false;
    }

    var _mask = "<div class='mask' id='mask' name='mask'></div>";
    var share;
    if(_this.settings.s_page){
		share="<div class='share' id='share'></div>";
    }else{
    	share="<div class='share' id='share'><span></span></div>";
    }


    bd.append(_mask);
    bd.append(share);
    var sh=$('#share'),mask=$('#mask');
    mask[0].addEventListener('touchstart',function(){
    	mask.animate({'opacity':0},1000,function(){
        	mask.remove();
        	sh.remove();
        });
    },false);
    sh.find('span')[0].addEventListener('touchstart',function(){
    	mask.animate({'opacity':0},1000,function(){
        	mask.remove();
        });
        sh.animate({'opacity':0},1000,function(){
        	sh.remove();
        	_this.n_start();
        });
    },false);
}
Bill.prototype.n_start=function(){
		var _this=this;
		_this.settings.usd=21+parseInt(Math.random()*40);
		_this.settings.cny=1000+parseInt(Math.random()*1000);
		_this.ans.find('.bo-bg .blackboard p cite').html(_this.settings.usd);
		_this.ans.find('.bo-bg .blackboard p em').html(_this.settings.cny);
		_this.ans.find('.clock span').text("00:00:00");
		_this.sor.find('.time').css({'opacity':0});
		_this.settings.ac_s=false;
		_this.sor.css({'visibility':'hidden'}).removeClass('sortin');
		_this.ans.css({'visibility':'visible'}).addClass('answerin');
		
		setTimeout(function(){
			_this.n_answer();
		},1200);
}

Bill.prototype._share_l=function(){
	// $.post(path+"=3",{},function(msg){
                       
	// },'json');
	var share="<div class='share1' id='share1'></div>";
	var bd=$('body');
	bd.append(share);
}



function _time(time){
	var time_='00:00:00';
	var _ms,_s,_m,_h,_time;
	if(time<1000){
		if(time<10){
			time="0"+time;
		}
		time_="00:00:"+time;
		
	}else if(time>=1000&&time<60000){
		_ms=time%(1000);//毫秒
		_time=parseInt(time/1000);
		_s=_time%(60);//秒
		if(_ms<10){
			_ms="0"+_ms;
		}
		if(_s<10){
			_s="0"+_s;
		}
		time_="00:"+_s+":"+_ms;
		
	}else if(time>=60000&&time<3600000){
		_ms=time%(1000);//毫秒
		_time=parseInt(time/1000);
		_s=parseInt(_time%(60));//秒
		_m=parseInt((_time/60))%60;//分
		if(_ms<10){
			_ms="0"+_ms;
		}
		if(_s<10){
			_s="0"+_s;
		}
		if(_m<10){
			_m="0"+_m;
		}
		time_=""+_m+":"+_s+":"+_ms;

	}else if(time>=3600000&&time<14400000){
		_ms=time%(1000);//毫秒
		_time=parseInt(time/1000);
		_s=parseInt(_time%(60));//秒
		_m=parseInt((_time/60))%60;//分
		_h=parseInt(_time/60/60)%60; //时
		if(_ms<10){
			_ms="0"+_ms;
		}
		if(_s<10){
			_s="0"+_s;
		}
		if(_m<10){
			_m="0"+_m;
		}
		if(_h<10){
			_h="0"+_h;
		}

		time_=""+_h+":"+_m+":"+_s+":"+_ms;

	}
	return time_;
}

function s_time(str){
		var n_str=str.split(":");
		var _str=[];

		for(var i=0;i<n_str.length;i++){
			_str[i]=parseInt(n_str[n_str.length-1-i]);
		}
		var time=0;
		switch(_str.length){
			case 0:
				return time=0;
			break;
			case 1:
				return time=_str[0];
			break;
			case 2:
				return time=_str[0]+_str[1]*1000;
			break;
			case 3:
				return time=_str[0]+_str[1]*1000+_str[2]*60*1000;
			break;
			case 4:
				return time=_str[0]+_str[1]*1000+_str[2]*60*1000+_str[3]*60*60*1000;
			break;
			default:
				return time=0;
		}

}

function checkMobile(str){
    var re=/^1\d{10}$/
    if(re.test(str)){
        return true;
    }else{
       return false;
    }
}


function TimeLine(){
	this.order=[];	
}

TimeLine.prototype.add=function(timeout,func,log){
	this.order.push({
		timeout:timeout,
		func:func,
		log:log
	});
}

TimeLine.prototype.start=function(ff){
	for(s in this.order){
		(function(me){
			var timeout=me.timeout;
			var fn=me.func;
			var log=me.log;
			timeout=Math.max(timeout-(ff||0),0)
			setTimeout(fn,timeout);
			setTimeout(function(){
				console.log('time->',timeout,"log->",log);
			},timeout);

		})(this.order[s]);
	}
}