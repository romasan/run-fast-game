var DWIDTH, DHEIGHT, SCALINGFACTOR, BANNERHEIGHT, GAMEWIDTH, GAMEHEIGHT;
var LEFT  = -1,
	RIGHT = 1;
var POINTS = 0;
var debug = {
	stoprepeater : false
}
var levels = [];
var Game = {

	S : {
		shelf : {
			w : 120,//for 320x480 display
			h : 30
		},
		hero : {
			size : 50,
			w : 45,
			h : 60,
			jump : 120,
			_jump : 120,
			jumpstart : false,
			jumpstartX : 0,
			jumpstartY : 0,
			step : 1,
			stepx : 1.2,
			t : function() {
				return this.b + this.h;
			},
			b : 0,
			l : 0,
			r : function() {
				return this.l + this.w;
			},
			hp : 100,
			_hp : 100,
			footage : 9,
			runto : 5,
			jumpstep : 5,
			jumpa : 5,
			isjump : false,
			jumpfinish : 8,
			astep : 0,
			stepnum : 0,
			jumpstepnum : 1,
			stepfrequency : 7
		},
		point : {
			size : 20,
			//frequency : 60,
			//anisteps : 2,
			costen : 15
		},
		box : {
			size : 40,
			index : [
				{//box
					force : 0,
					size : 40
				},
				{//stakes
					force : 3,
					size : 40
				}
			]
		}//,
		//bonus : {
		//	size : 20
		//}
	},
	hp : {
		_count : 7,
		count : 7,
		size : 20
	},
	N : {
		shelf : [],
		point : [],
		box : []
	},
	gamename : "catjumper",
	width : 5000,//px
	scroll : 0,
	direction : RIGHT,
	animation : false,
	init : function() {
		if( 
			typeof localStorage[this.gamename + 'level'] == 'undefined' &&
			typeof localStorage[this.gamename + 'points'] == 'undefined' 
		) {
			localStorage[this.gamename + 'level'] = 0;
			localStorage[this.gamename + 'points'] = 0;
		}
		var SCALINGW = GAMEWIDTH / 480;
		var SCALINGH = GAMEHEIGHT / 320;
		Game.S.shelf.w         *= SCALINGW;
		Game.S.shelf.h         *= SCALINGH;
		Game.S.box.size		   *= SCALINGH;
		for(i in Game.S.box.index) {
			Game.S.box.index[i].size *= SCALINGH;
		}
		Game.S.point.size	   *= SCALINGH;
		Game.S.hero.size       *= SCALINGH;
		Game.S.hero.w		   *= SCALINGW;
		Game.S.hero.h		   *= SCALINGH;
		Game.S.hero._jump      *= SCALINGH;
		Game.S.hero.jump        = Game.S.hero.jump;
		//console.log('****************', Game.S.hero._jump);
		if(GAMEWIDTH > 1000) {
			Game.S.hero.stepx /= 3;
			Game.S.hero.step /= 3;
		}
		//Game.S.hero.step       *= SCALINGFACTOR;
		//Game.S.hero.stepx      *= SCALINGFACTOR;
		/*
		if(GAMEWIDTH > 700) {
			Game.S.hero.step       /= SCALINGFACTOR;
			Game.S.hero.stepx      /= SCALINGFACTOR;
		}
		*/
		//Game.S.point.size      *= SCALINGFACTOR;
		//Game.S.point.frequency *= SCALINGFACTOR;
		Game.hp.size		   *= SCALINGH;
	},
	/*
	win : function() {
		$('#message').html(lang.youwin);
		$('#splash').show();
		var l = parseInt( localStorage[Game.gamename + 'level'] );
		var p = parseInt( localStorage[Game.gamename + 'points'] );
		localStorage[Game.gamename + 'level'] = l + 1;
		localStorage[Game.gamename + 'points'] = p + POINTS;
		setTimeout(function(){
			Game.startgame();
			$('#splash').hide();
		}, 3000);
	},
	*/
	win : function() {
		//alert('boobs');
		debug.stoprepeater = true;
		clearTimeout(Game.repeatmotionf);
		//localStorage[this.gamename + 'level']
		localStorage[Game.gamename + 'level'] = parseInt(localStorage[Game.gamename + 'level']) + 1;
		localStorage[Game.gamename + 'points'] = POINTS;
		this.splash(GAMEWIDTH / 2, GAMEHEIGHT / 2, "YOU WIN", function() {
			document.location.reload();
		}, 1000);
	},
	gameover : function() {
		
		debug.stoprepeater = true;
		clearTimeout(Game.repeatmotionf);
		
		$('#hero').addClass('herod').css({
			'background-size' : '100% 100%'
		}).animate({
			bottom : '+=15px',
		}).animate({
			//top : '-=' + Game.S.hero.w / 2 + 'px',
			bottom : '0px',
			//left : '-=' + Game.S.hero.h / 2 + 'px',
			//width : '+=' + Game.S.hero.w * 2 + 'px',
			//height : '+=' + Game.S.hero.h * 2 + 'px',
			//'background-position' : '0px 0px'
		});
		
		this.splash(GAMEWIDTH / 2, GAMEHEIGHT / 2, "GAMEOVER", function() {
			document.location.reload();
		}, 1000);
		/*
		$('#message').html(lang.gameover);
		$('#splash').show();
		setTimeout(function() {
			Game.startgame();
			$('#splash').hide();
		}, 3000);
		*/
	},
	splash : function(x, y, s, f, t) {
		t = (typeof t == 'undefined') ? 1000 : t;
		//if(x == 'center') {x = G.w / 2;}
		//if(y == 'center') {x = G.h / 2;}
		$('body').append(
			$('<div>')
				.css({
					position : 'absolute',
					top : y - 50 + 'px',
					left : x - 150 + 'px',
					'text-align' : 'center',
					width : '300px',
					height : '100px',
					'line-height' : '100px',
					'font-size' : '1pt',
					'text-shadow' : '0px 1px #fff'
				})
				.html(s)
				.attr({id : 'splash'})
				.animate({
					'font-size' : '27pt'
				}, function() {
					setTimeout(function() {
						$('#splash')
							.animate({
								'font-size' : '1pt'
							}, function() {
								$('#splash').remove();
								if(typeof f == 'function') {f();}
							})
					}, t);
				})
		);
	},
	inchp : function(i) {
		this.hp.count += 100;
		setTimeout(function() {
			Game.inchp()
		}, 1000);
	},
	dechp : function(i) {
		this.hp.count -= i;
		if(this.hp.count <= 0) {
			this.gameover();
		}
		this.drawhp(this.hp.count);
	},
	drawhp : function(hp) {
		//redraw hp
		$('#hp').html('');
		for(i = 1; i < this.hp._count + 1; i++) {
			$('#hp').append(
				$('<div>')
					.addClass('hp')
					.addClass((hp >= i)?'hpfull':'hpempty')
					.attr({id : 'hp' + i})
					.css({
						width : Game.hp.size + 'px',
						height : Game.hp.size + 'px',
					})
			)
		}
	},
	draw : function() {
		this.drawhp(this.hp._count);
		$('#map').html('');
		// height
		var hero = $('<div>')
			.attr('id', 'hero')
			.addClass('el hero')
			.css({
				width : Game.S.hero.w,
				height : Game.S.hero.h,
				'background-size' : (Game.S.hero.w * Game.S.hero.footage) + 'px ' + Game.S.hero.h + 'px',
				'background-position' : '0px 0px'
			});
		var shelf = $('<div>')
			.addClass('el shelf')
			.css({
				width : Game.S.shelf.w,
				height : Game.S.shelf.h
			});
		var point = $('<div>')
			.addClass('el point')
			.css({
				width : Game.S.point.size,
				height : Game.S.point.size,
//				'background-size' : ( Game.S.point.size + 'px ' + ( Game.S.point.size * Game.S.point.anisteps ) + 'px' )
			});
		var box = $('<div>')
			.addClass('el box');
//			.css({
//				width : Game.S.box.size,
//				height : Game.S.box.size,
//			});
		var b = 0;//Game.S.shelf.h;
		var l = 0;//( Math.random() * (GAMEWIDTH - Game.S.shelf.w) )|0;
		Game.N.shelf.push({
			left : l,
			bottom : b
		});
		$('#map').append(
			$(shelf).clone().css({
				left : l,
				bottom : b
			})
			.addClass('shelf1')
		);
		b = Game.S.shelf.h;
		Game.S.hero.b = b;
		l = 0;//l + ( Game.S.shelf.w - Game.S.hero.size ) / 2;
		Game.S.hero.l = l;
		$('#map').append(
			$(hero).css({
				left : l,
				bottom : b
			})
		);
		
		var _b = b;
		
		var justnow = true;
		var shelfis = true;
		for(;l < Game.width;) {
		
			l = l + Game.S.shelf.w;// + 20 + (( Math.random() * 30/*( Game.S.hero.jump - Game.S.shelf.w)*/ )|0);//-shelf.h
			//var lastb = Game.N.shelf[Game.N.shelf.left - 1];
			
			if(justnow)  {
				justnow = false;
				shelfis = true;
			} else {
				if(Math.random() > .5) {
					justnow = true;
					shelfis = false;
				}
			}
			//ставим полку или нет
			if(shelfis) {
				//if(justnow) {
					var _upper = b;
					b = (Math.random() * b + Game.S.hero._jump * 0.7 - Game.S.shelf.h)|0;
					_upper = (b > _upper);
				//} else {
				//	b = (Math.random() * b)|0;
				//}
				
				var gb = ( GAMEHEIGHT - Game.S.hero.h - Game.S.shelf.h );
				b = ( b > gb ) ? gb : b;
				
				Game.N.shelf.push({
					left : l,
					bottom : b
				});
				
				/*
				$('#map').append(
					$('<div>')
					.addClass('el wall')
					.css({
						bottom : '0px',
						left : (l + 5) + 'px',
						width : (Game.S.shelf.w - 10) + 'px',
						height : (b + Game.S.shelf.h / 3) + 'px'
					})
				);
				*/
				$('#map').append(
					$(shelf).clone().css({
						left : l,
						bottom : b
					})
					.addClass('shelf1'/* + (1 + (Math.random() * 4)|0)*/)
				);
				
				//ставим коробку/бонус или нет
				if( Math.random() > .5 ) {
					//коробку или бонус
					
					var _b = b + Game.S.shelf.h;
					if( Math.random() > .5 ) {
						var _l = l + (Math.random() * (Game.S.shelf.w - Game.S.box.size))|0;
						var boxtype = (Math.random() * 2)|0;
						Game.N.box.push({
							left : _l,
							bottom : _b,// + Game.S.shelf.h,
							//top : ( GAMEHEIGHT - b ),
							removed : false,
							'boxtype' : boxtype
						});
						$('#map').append(
							$(box)
								.clone()
								.attr({id : 'box' + Game.N.box.length})
								.addClass('box' + boxtype)
								.css({
									left : _l + 'px',
									bottom : _b + 'px',
									width : Game.S.box.index[boxtype].size + 'px',
									height : Game.S.box.index[boxtype].size + 'px'
								})
						);
					} else {
						var _l = l + (Math.random() * (Game.S.shelf.w - Game.S.point.size))|0;
						_bt = _b + (Math.random() * Game.S.hero._jump)|0;
						Game.N.point.push({
							left : _l,
							bottom : _bt,// + Game.S.shelf.h,
							//top : ( GAMEHEIGHT - b ),
							removed : false
						});
						$('#map').append(
							$(point)
								.clone()
								.attr({id : 'point' + Game.N.point.length})
								.addClass('point1'/* + (1 + (Math.random() * 5)|0)*/)
								.css({
									left : _l + 'px',
									bottom : _bt + 'px'
								})
						);
					}
					
					
				}
			} else {
				l = l - Game.S.shelf.w / 2;
			}
			
		}
		
//		this.repeatanimation('.point', Game.S.point.size, 0, 2);
	},
	repeatanimation : function(el, h, s, sa) {
		//console.log(el, h, s, sa);
		$(el).css({
			'background-position' : '0px ' + h * s + 'px'
		});
		s = (s < sa - 1)?(s + 1):0;
		var f = function() {
			Game.repeatanimation(el, h, s, sa);
		}
		Game.animation = setTimeout(f, 100);
	},
	progon : function(el, w, step, startstep, finishstep, f) {//animation with running function in end
		//console.log('progon', step, startstep, endstep, typeof f);
		//console.log(el, h, s, sa);
		$(el).css({
			'background-position' : -(w * step) + 'px 0px'
		});
		if(step >= finishstep) {
			f();
			console.log('end progon');
		} else {
			step++;
			var ff = function() {
				Game.progon(el, w, step, startstep, finishstep, f);
			}
			Game.animation = setTimeout(ff, 0);
		}
	},
	/*
	iscontactq : function(ca, sa, cb, sb) {
		if( 
			( ca.x + sa > cb.x 		&& ca.x < cb.x 		&& ca.y + sa > cb.y 		&& ca.y < cb.y   ) || 
			( ca.x + sa > cb.x 		&& ca.x < cb.x 		&& ca.y + sa > cb.y + sb && ca.y < cb.y + sb ) || 
			( ca.x + sa > cb.x + sb && ca.x < cb.x + sb && ca.y + sa > cb.y 		&& ca.y < cb.y   ) || 
			( ca.x + sa > cb.x + sb && ca.x < cb.x + sb	&& ca.y + sa > cb.y + sb && ca.y < cb.y + sb ) 
		) { return true; }
		return false;
	},
	*/
	speed : {
//		start : 0,
		end : 0,
		step : 0
	},
	speedcontrolf : false,
	speedcontrol : function() {
		//console.log('distance:', (Game.S.hero.l - this.speed.end), 'in', this.speed.step, 'steps');
		//Game.S.hero.stepx = 
		this.speed.step = 0;
		$('#bar').html|(Game.S.hero.l - this.speed.end);
		this.speed.end = Game.S.hero.l;
		this.speedcontrolf = setTimeout(function() {Game.speedcontrol();}, 1000);
	},
	repeatmotionf : false,
	repeatmotionpause : false,
	repeatmotion : function() {
		window.scrollTo(0, 1);
		if(debug.stoprepeater) {return;}
		this.speed.step++;
		var middleline = GAMEWIDTH / 2;
		var map = $('#map');
		var hero = $('#hero');
		if(!this.repeatmotionpause) {
//---------------------------------------------------------------------------------------------------
			if(Game.x) {
				//if( Game.S.hero.l > Game.scroll + middleline ) {
				if( Game.S.hero.l > middleline && Game.S.hero.l < Game.width - middleline ) {
					Game.scroll = Game.S.hero.l - middleline;// - Game.scroll - middleline;
					$('#map').css({
						left : -Game.scroll + 'px',
						'background-position' : (-Game.scroll * 0.5) + 'px 0px',
					});
				}
				
				Game.S.hero.l += Game.x * Game.S.hero.stepx;
				$(hero).css({
					left : Game.S.hero.l + 'px'
				});
				if( Game.S.hero.l >= Game.width - Game.S.hero.w ) {
					Game.x = 0;
					console.log('finish:)');
					Game.win();
				}
				
			}

			var f = false,
			box_f = false;
			
			/*
			if(Game.S.hero.l + Game.S.hero.size >= Game.N.box[0].left) {
				//clearTimeout(Game.repeatmotionf);
				return;
			}
			*/
//---------------------------------------------------------------------------------------------------		
	//		if(Game.y) {
		
			if( Game.y > 0 ) {
				if(Game.S.hero.jumpstart == false) {
					//console.log('jumpstart y > 0');
					Game.S.hero.jumpstar
					Game.S.hero.jumpstart = true;
					Game.S.hero.jumpstartX = Game.S.hero.l;
					Game.S.hero.jumpstartY = Game.S.hero.b;
					//Game.S.hero.jump = 0;
				}
				if(Game.S.hero.jumpstart == true) {
					var _x = (Game.S.hero.l - Game.S.hero.jumpstartX) * 2,
						_y = Game.S.hero.b - Game.S.hero.jumpstartY,
						_n = Game.S.hero._jump - _x,
						_m = Math.sqrt(Game.S.hero._jump * Game.S.hero._jump - _n * _n);
						//console.log('N', _m|0, _n|0, _x|0, _y|0);
					
					if(_n <= 0) {
						//console.log('-jump-top-');
						Game.S.hero.jumpstart = false;
						Game.y = -10;
						console.log('-------------------------------------------');
					}
					Game.S.hero.b = Game.S.hero.jumpstartY + _m;
					// trail
					
				}
				//Game.S.hero.jump -= Game.S.hero.step;
				//console.log( 'Game.S.hero.jump', Game.S.hero.jump );
				
				/*
				if(Game.S.hero.jump <= 0) {
					Game.y = 0;
					setTimeout(function() {Game.y = -1;}, 300);
				}
				*/
			}
			//console.log('Game.y', Game.y);
				
//---------------------------------------------------------------------------------------------------		
			if(Game.y <= 0) {
			
				for(i in Game.N.shelf) {
					var l   = Game.N.shelf[i].left;//$(this).offset().left;
					var r   = l + Game.S.shelf.w;
					var _tb = Game.N.shelf[i].bottom;//( Game.height - $(this).position().top );// + Game.scroll;
					var tb  = _tb + Game.S.shelf.h;// + Game.scroll;
					//console.log('***', Game.S.hero.b, tb, i);	
					if(
						(
							( Game.S.hero.l + Game.S.hero.w <= r && Game.S.hero.l + Game.S.hero.w >= l ) || 
							( Game.S.hero.l 				<= r && Game.S.hero.l 				  >= l ) 
						) && 
						//(
						//	(Game.S.hero.t() > tb && Game.S.hero.b < _tb) ||
						//	(Game.S.hero.b	 < tb && Game.S.hero.b > _tb) 
						//) &&
						//Game.S.hero.b != tb
						
						Game.S.hero.b <= tb && 
						Game.S.hero.b >= _tb 
					) {
						if(
							/*
							Game.y == 0 && 
							&& Game.S.hero.b < tb - Game.S.shelf / 2
							*/
							tb != Game.S.hero.b && 
							Game.y 			== 0 && 
							//tb				!= Game.S.hero.b && 
							Game.S.hero.t() >  tb// &&
							//Game.S.hero.b	>= _tb
						) {
							console.log('climb animation, pause running');
							/*
							this.repeatmotionpause = true;
							setTimeout(function() {
								Game.repeatmotionpause = false;
							}, 1000);
							*/
						}
						
						/*
						if(Game.y == 0 && tb != Game.S.hero.b) {
							this.progon('#hero', Game.S.hero.h, 2, 2, 5, function() {
								Game.repeatmotionpause = false;
								Game.S.hero.b = tb2;
								$(hero).css({
									bottom : Game.S.hero.b + 'px',
								});
								if(Game.y < 0) {Game.y = 0;}
								if(Game.x == 0) {Game.x = 1;}
								Game.S.hero.jumpstart = false;
							});
							this.repeatmotionpause = true;
							//setTimeout(function() {
							//	Game.repeatmotionpause = false;
							//}, 1000);
						}
						*/
						
						f = true;
						
						Game.S.hero.b = tb;
						$(hero).css({
							bottom : Game.S.hero.b + 'px',
							//'background-position' : '0px ' + Game.S.hero.h + 'px' )
						});
						Game.y = 0;
						if(Game.x == 0) {Game.x = 1;}
						Game.S.hero.jumpstart = false;
					}
				}
				
				for(i in Game.N.box) {
					var _i	  = Game.N.box[i].boxtype
					var l     = Game.N.box[i].left;//$(this).offset().left;
					var r     = l + Game.S.box.index[_i].size;
					var _tb   = Game.N.box[i].bottom;//( Game.height - $(this).position().top );// + Game.scroll;
					var tb    = _tb + Game.S.box.index[_i].size;// + Game.scroll;
					var hl = Game.S.hero.l + 30;
					var hr = Game.S.hero.l + Game.S.hero.w - 30;
					if(
						(
							(hr <= r && hr >= l) || 
							(hl <= r && hl >= l)
						) && 
						Game.S.hero.b <= tb && Game.S.hero.b >= _tb	
					) {
						
						if(_i == 0){
							Game.S.hero.b = tb;
							$(hero).css({
								bottom : Game.S.hero.b + 'px',
							});
							if(Game.y < 0) {Game.y = 0;}
							if(Game.x == 0) {Game.x = 1;}
							Game.S.hero.jumpstart = false;
							f = true;
						}
						
						if(Game.N.box[i].removed == false) {
							//var tb2 = tb;
							console.log('you', i, Game.N.box.length);
							Game.N.box[i].removed = true;
							if(_i > 0) {
								this.dechp(Game.S.box.index[_i].force);
							}
							
							//Game.S.hero.hp -= Game.S.box.index[i].force;
							/*
							if(Game.y == 0 && tb != Game.S.hero.b) {
								this.progon('#hero', Game.S.hero.h, 2, 2, 5, function() {
									Game.repeatmotionpause = false;
									Game.S.hero.b = tb2;
									$(hero).css({
										bottom : Game.S.hero.b + 'px',
									});
									if(Game.y < 0) {Game.y = 0;}
									if(Game.x == 0) {Game.x = 1;}
									Game.S.hero.jumpstart = false;
								});
								this.repeatmotionpause = true;
							} else {
							*/

							//}
						}
					}
				}
				
				//console.log('574c9');
				//console.log('b', Game.S.hero.b);
				//return;
			
			}
			
			for(i in Game.N.point) {
				var l     = Game.N.point[i].left;//$(this).offset().left;
				var r     = l + Game.S.point.size;
				var _tb   = Game.N.point[i].bottom;//( Game.height - $(this).position().top );// + Game.scroll;
				var tb    = _tb + Game.S.point.size;// + Game.scroll;
				if(
					(l <= Game.S.hero.r() && l >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
					(r <= Game.S.hero.r() && r >= Game.S.hero.l && _tb <= Game.S.hero.t() && _tb >= Game.S.hero.b) ||
					(r <= Game.S.hero.r() && r >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b) ||
					(l <= Game.S.hero.r() && l >= Game.S.hero.l && tb <= Game.S.hero.t() && tb >= Game.S.hero.b)
					//(
					//	( Game.S.hero.l + Game.S.hero.w <= r && Game.S.hero.l + Game.S.hero.w >= l ) || 
					//	( Game.S.hero.l 				<= r && Game.S.hero.l 				  >= l ) || 
					//	( Game.S.hero.l					<= l && Game.S.hero.l + Game.S.hero.w >= r ) 
					//) && 
					//Game.S.hero.b <= tb && Game.S.hero.b >= _tb	
				) {
					
					if(Game.N.point[i].removed == false) {
						Game.N.point[i].removed = true;
						$('#point' + (parseInt(i) + 1)).hide();
						POINTS += Game.S.point.costen;
						$('#points').html(POINTS);
					}
				}
			}
//---------------------------------------------------------------------------------------------------
			if(Game.y < 0) {

				if(Game.x > 0) {
					if(Game.S.hero.jumpstart == false) {
						console.log('jumpstart y < 0');
						Game.S.hero.jumpstart = true;
						Game.S.hero.jumpstartX = Game.S.hero.l;
						Game.S.hero.jumpstartY = Game.S.hero.b;
						//Game.S.hero.jump = 0;
					}
					if(Game.S.hero.jumpstart == true) {
						//console.log('jump y < 0');
					
						var _n = ( Game.S.hero.l - Game.S.hero.jumpstartX ) * 2,
							_y = Game.S.hero.jumpstartY - Game.S.hero._jump;// - Game.S.hero.b,
							//_n = _x,
							_m = Math.sqrt(Game.S.hero._jump * Game.S.hero._jump - _n * _n);
							//console.log('N>       ', _m, (_m <= 0), _n|0, _y|0);
						if(_n >= Game.S.hero.jump) {
							//console.log('-jump-finish-');
							Game.S.hero.jumpstart = false;
							
							Game.x = 0;
							
						}
						Game.S.hero.b = Game.S.hero.jumpstartY - Game.S.hero._jump + (_m ? _m : 0);
					}
				} else {
					Game.S.hero.b += Game.y * Game.S.hero.step;
				}
				
			}
//---------------------------------------------------------------------------------------------------
				
			Game.S.hero.stepnum++;
			//Game.S.hero.jumpstepnum++;
			Game.S.hero.jumpstep = Game.S.hero.jumpfinish;
			if(Game.y == 0) {
				Game.S.hero.isjump = false;
			} else if(Game.y > 0){
				var a7 = 9;
				if(Game.S.hero.isjump == false && !f) {
					// first step of jump animation

					Game.repeatmotionpause = true;
					this.progon('#hero', Game.S.hero.w, Game.S.hero.jumpa, Game.S.hero.jumpa, Game.S.hero.jumpfinish, function() {Game.repeatmotionpause = false;});
					//this.repeatmotionpause = true;
					
					Game.S.hero.jumpstep = Game.S.hero.jumpstart;
					console.log('*1', Game.S.hero.jumpstep);
					
				}
				Game.S.hero.isjump = true;
			}
			/*
			if(Game.S.hero.isjump) {
				if(Game.S.hero.jumpstepnum % Game.S.hero.stepfrequency == 0) {
					Game.S.hero.jumpstep = (Game.S.hero.jumpstep >= Game.S.hero.jumpfinish) ? Game.S.hero.jumpfinish : Game.S.hero.jumpstep + 1;
					console.log('*2', Game.S.hero.jumpstep);
				}
			}
			*/
			if(Game.S.hero.stepnum % Game.S.hero.stepfrequency == 0) {
				Game.S.hero.astep = (Game.S.hero.astep >= Game.S.hero.runto) ? 0 : Game.S.hero.astep + 1;
			}
			$(hero).css({
				'bottom' : Game.S.hero.b + 'px',
				//'background-position' : (-Game.S.hero.w * /*((Game.y == 0) ? Game.S.hero.astep : Game.S.hero.jumpstep)*/(Game.S.hero.isjump)?Game.S.hero.astep:Game.S.hero.jumpstep) + 'px 0px'
				'background-position' : (-Game.S.hero.w * ((!Game.S.hero.isjump && Game.y >= 0)?Game.S.hero.astep:Game.S.hero.jumpstep)) + 'px 0px'
			});
//---------------------------------------------------------------------------------------------------		
			
			if(Game.y == 0 && !f) {
				//console.log('---', Game.y, f);
				Game.y = -1;
				Game.S.hero.jumpstart = false;
			}
		
		}//repeatmotionpause
		
		if( Game.S.hero.b <= 0 ) {
			//console.log('----------------');
			Game.gameover();
			Game.x = 0;
			Game.y = 0;
			//return
		} else {
			Game.repeatmotionf = setTimeout(function(){Game.repeatmotion();}, 0);
		}
			
	},
	startgame : function() {
		
		//clearTimeout(Game.animation);
		clearTimeout(Game.repeatmotionf);
		$('#map').css({bottom : '0px'});
		
		POINTS = parseInt( localStorage[Game.gamename + 'points'] );
		Game.N.shelf = [];
		Game.N.point = [];
		Game.scroll = 0;
		//Game.S.hero._jump = Game.S.hero.jump;
		$('#points').html(POINTS);
		$('#level').html(localStorage[Game.gamename + 'level']);
		$('#hp').html(Game.S.hero.hp);
		
		// debug
		/*
		var scrollline = GAMEHEIGHT / 2;
		$('#debug').css({
			position : 'fixed',
			top : '0px',
			left : '0px',
			width : GAMEWIDTH,
			height : ( scrollline ),
			background  : '#39f',
			opacity : '0.1',
			'border-bottom' : '1px dashed #aaa'
		});
		*/
		$('#map')
			//.click(function() {
			.swipe({
				swipeStatus : function(event, phase, direction, distance, duration, fingers) {
					if( phase == 'start' ) {
						//console.log('click', Game.y);
						//console.log('********************************************************', Game.y);
			
			//			if( Game.y == 0 ) {
							//if(Game.S.hero.jumpstart) {return;}
							//console.log('click', Game.y);
							if(Game.y != 0) {return;}
							console.log('jumpstart', Game.S.hero.jumpstart);
							Game.S.hero.jump = Game.S.hero._jump;
							Game.S.hero.jumpstart = false;
							Game.y = 1;
			//			}
			
					}
				}
			});
/*
		$('#left')
			.css({
				left : '0px',
				width : ( GAMEWIDTH / 2 ) + 'px',
				height : GAMEHEIGHT + 'px',
			})
			.addClass('lrbut')
			.swipe({
				swipeStatus : function(event, phase, direction, distance, duration, fingers) {
					if( phase == 'start' ) {
						Game.x = LEFT;
						Game.direction = LEFT;
						$('#hero').css({
							'background-position' : ( '0px ' + ( (Game.y == 0)?Game.S.hero.height:0 ) + 'px' )
						});//.addClass('herol').removeClass('heror');
					}
					if( phase == 'end' ) {Game.x = false;}
					
				}
			});
		$('#right')
			.css({
				left : ( GAMEWIDTH / 2 ) + 'px',
				width : ( GAMEWIDTH / 2 ) + 'px',
				height : GAMEHEIGHT + 'px'
			})
			.addClass('lrbut')
			.swipe({
				swipeStatus : function(event, phase, direction, distance, duration, fingers) {
					if( phase == 'start' ) {
						Game.x = RIGHT;
						Game.direction = RIGHT;
						$('#hero').css({
							'background-position' : ( Game.S.hero.height + 'px ' + ( (Game.y == 0)?Game.S.hero.height:0 ) + 'px' )
						});//.addClass('heror').removeClass('herol');
					}
					if( phase == 'end' ) {Game.x = false;}
				}
			});
*/
		this.draw();
		this.repeatmotion();
		this.speedcontrol();
		setTimeout(function(){
			Game.x = 1;
			Game.y = 0;
		}, 500);

		
	}
}
//Function.prototype.toString = function() {return this.call();}
/*
Object.defineProperty(Game.S.hero, "r", {
    get: function() {
        return this.l + this.w;//alert("hello world");
    },
    set: undefined
});
*/
$(document).ready(function() {
	
	DWIDTH = document.body.clientWidth;
	DHEIGHT	= document.body.clientHeight;
	SCALINGFACTOR = DWIDTH / 320;
	BANNERHEIGHT = SCALINGFACTOR * 50;
	GAMEWIDTH = DWIDTH;
	GAMEHEIGHT = DHEIGHT;
	//GAMEHEIGHT = DHEIGHT - BANNERHEIGHT;
	
	Game.init();
	
	$('#map').css({
		width : Game.width + 'px',
		height : DHEIGHT + 'px',
		bottom : '0px'
	});
	
	$('#message').css({
		width : ( DWIDTH - 55 + 'px' ),
		margin : ( (DHEIGHT / 2) + 'px 15px 0px 15px' )
	});
	
	$('#playbutton')
		.css({
			width : (50 * SCALINGFACTOR) + 'px',
			height : (50 * SCALINGFACTOR) + 'px',
			left : (DWIDTH / 2/* - 25 * SCALINGFACTOR*/) + 'px',
			bottom : 30 * SCALINGFACTOR
		})
		.click(function(){
			$('#screen').show();
			$('#startscreen').hide();
			Game.startgame();
		});
		
	//Game.startgame();
	
});