//mobile button
$(function(){
	$('.js-mobile-btn').click(function(){
		$('.js-mobile-nav').toggleClass('main-header__nav-wrapper_active')
		$(this).toggleClass('mobile-nav-btn_active')
	});
});

//anchors
$(function(){
	$('.js-anchor-link').click(function(){
		var target = $(this).attr('href');
		$('body, html').animate({
			scrollTop: $(target).offset().top
		},1000);
		$('.js-mobile-btn').click();
		return false;
	});
});

//password input
$(function(){
	function PasswordInput(element){
		this.$element = $(element);
		this.passwordInput = this.$element.find('.js-password-input'),
		this.passwordShow = this.$element.find('.js-password-show'),
		this.passwordIndicator = this.$element.find('.js-password-indicator'),
		this.passwordMessage = this.$element.find('.js-password-message'),
		this.passwordPercent = this.$element.find('.js-password-percent'),
		this.passwordGradient = this.$element.find('.js-password-gradient'),
		this.password = this.passwordInput.val(),
		this.passwordSecLevel = 0

		this.classes = {
			passwordShowActive: 'input-password__show_active'
		}

		this.messages = [
			{
				level: 0,
				message: 'Введите пароль',
				indicator: 0
			},
			{
				level: 1,
				message: 'Очень простой',
				indicator: 20
			},
			{
				level: 2,
				message: 'Простой',
				indicator: 40
			},
			{
				level: 3,
				message: 'Средний',
				indicator: 60
			},
			{
				level: 4,
				message:  'Сложный',
				indicator: 80
			},
			{
				level: 5,
				message:  'Очень сложный',
				indicator: 100
			}
		]

		this.init();
	}

	PasswordInput.prototype.setGradWidth = function () {
		this.passwordGradient.width(0);
		this.passwordGradient.width(this.passwordIndicator.width());
	}

	PasswordInput.prototype.init = function(){
		this.setGradWidth();
		this.checkPassword();
		this.events();
		this.$element.data('password-input', this);
	}

	PasswordInput.prototype.events = function(){
		var self = this;
		$(window).on({
			load: function(){
				self.checkPassword();
			},
			resize: function(){
				self.setGradWidth();
			}
		})
		this.passwordShow.click(function(){
			console.log(1111);
			self.showPassword();
		})
		this.passwordInput.keyup(function(){
			self.password = self.passwordInput.val();
			self.checkPassword();
		});
		this.passwordInput.change(function(){
			self.password = self.passwordInput.val();
			self.checkPassword();
		});
	}
	
	PasswordInput.prototype.showPassword = function(){
		if (this.passwordInput.attr('type') === 'password') {
			this.passwordInput.attr('type', 'text');
		} else {
			this.passwordInput.attr('type', 'password');
		}
	}
	
	PasswordInput.prototype.checkPassword = function(){
		this.passwordSecLevel = 0;
		if (this.password.match(/[A-ZА-Я]/)) this.passwordSecLevel++;
		if (this.password.match(/[./<>?;:"'`!@#$%^&*()\[\]{}_+=|\\-]/)) this.passwordSecLevel++;
		if (this.password.match(/[0-9]/)) this.passwordSecLevel++;
		if (this.password.length < 6) this.passwordSecLevel=1;
		else this.passwordSecLevel++;
		if (this.password.length > 6) this.passwordSecLevel++;

		this.setMessage();
	}

	PasswordInput.prototype.setMessage = function(){
		var passwordObject = this.messages.filter(function(item){
			return item.level === this.passwordSecLevel;
		}, this)[0];
		this.passwordMessage.text(passwordObject.message);
		this.passwordIndicator.width() / 100 * passwordObject.indicator;
		this.passwordPercent.width(passwordObject.indicator+'%');
		this.setGradWidth();
	}

	$('.js-password').each(function(){
		var passwordInput = new PasswordInput(this);
	});
});

//fancybox
$(function(){
	$('.js-fancybox').click(function(){
		$.fancybox.close(true);
		$.fancybox.open({
			src: $(this).attr('href'),
			opts: {
				afterShow: function (instance, current) {
					var inputPassword = current.$content.find('.js-password');
					if(inputPassword.length) {
						inputPassword.data('password-input').checkPassword();
					}
				}
			}
		})
	});
});

//select
$(function(){
	$('.js-select').each(function(){
		var theme = $(this).data('theme'),
				placeholder = $(this).data('placeholder'),
				settings = {
					minimumResultsForSearch: -1,
					theme: theme
				};
		if (placeholder) settings.placeholder = placeholder;

		console.log(settings);

		$(this).select2(settings);
	});
});


//user menu
$(function(){
	$('.js-user-menu').each(function(){
		var $this = $(this),
				user = $this.find('.js-user-menu-user'),
				classes = {
					menu: {
						active: 'user-menu--open'
					}
				}
		
		user.click(function(){
			$this.toggleClass(classes.menu.active);
		});

		$(document).click(function(e){
			if ($(e.target).closest('.js-user-menu').length) return false;
			$this.removeClass(classes.menu.active);
		});
	});
});

//lk info
$(function(){
	$('.js-lk-info').each(function(){
		var $this = $(this),
				slide = $this.find('.js-lk-slide'),
				slideButton = $this.find('.js-lk-slide-button');

		slideButton.click(function(){
			$(this).toggleClass('lk-info__slide-button--active');
			slide.slideToggle();
		});
	});
});


//dot-nav
$(function(){
	var closeAll = [];
	$('.js-dot-nav').each(function(){

		var $this = $(this),
				button = $this.find('.js-dot-nav-button'),
				menu = $this.find('.js-dot-nav-menu'),
				classes = {
					button: {
						active: 'dot-nav__button_active'
					}
				}

		button.click(function(){
			if($(this).is('.'+classes.button.active)) {
				hideMenu();
			}else{
				showMenu();
			}
		});
		$('.js-pay-list').scroll(function(){
			setMenuPosition()
		});
		$(window).on({
			'resize': function(){
				setMenuPosition()
			},
			'scroll': function(){
				setMenuPosition()
			}
		});

		$(document).click(function(e){
			if ($(e.target).closest('.js-dot-nav').length) {
				return false;
			}
			hideMenu();
		});

		function showMenu(){
			for (f in closeAll) {
				closeAll[f]();
			}
			button.addClass(classes.button.active);
			menu.fadeIn();
			setMenuPosition();
			
		}

		function hideMenu(){
			button.removeClass(classes.button.active);
			menu.fadeOut();
		}

		closeAll.push(hideMenu);

		function setMenuPosition(){
			var 
					windowScrollLeft = $(window).scrollLeft(),
					windowScrollTop = $(window).scrollTop(),
					buttonOffsetTop = button.offset().top,
					buttonOffsetLeft = button.offset().left,
					buttonOffsetRight = buttonOffsetLeft + button.outerWidth() - windowScrollLeft,
					buttonOffsetBottom = buttonOffsetTop + button.outerHeight() - windowScrollTop;
					buttonOffsetRightAlignRight = buttonOffsetLeft + button.outerWidth() - windowScrollLeft - menu.width();

			console.log(menu.width());
			
			menu.css({
				'position': 'fixed',
				'top': buttonOffsetBottom,
				'left': buttonOffsetRightAlignRight
			});
		}
	});
});


//filter
$(function () {
	var closeAll = [];
	$('.js-filter').each(function () {

		var $this = $(this),
			button = $this.find('.js-filter-button'),
			menu = $this.find('.js-filter-drop'),
			close = $this.find('.js-filter-close'),
			classes = {
				button: {
					active: 'dot-nav__button_active'
				}
			}
		close.click(function(){
			hideMenu();
		});
		button.click(function () {
			if ($(this).is('.' + classes.button.active)) {
				hideMenu();
			} else {
				showMenu();
			}
		});
		$('.js-filter-parent').scroll(function () {
			setMenuPosition()
		});
		$(window).on({
			'resize': function () {
				setMenuPosition()
			},
			'scroll': function () {
				setMenuPosition()
			}
		});

		$(document).click(function (e) {
			if ($(e.target).closest('.js-filter').length) {
				return false;
			}
			hideMenu();
		});

		function showMenu() {
			for (f in closeAll) {
				closeAll[f]();
			}
			button.addClass(classes.button.active);
			menu.fadeIn();
			setMenuPosition();

		}

		function hideMenu() {
			button.removeClass(classes.button.active);
			menu.fadeOut();
			console.log(1);
		}

		closeAll.push(hideMenu);

		function setMenuPosition() {
			var
				windowScrollLeft = $(window).scrollLeft(),
				windowScrollTop = $(window).scrollTop(),
				buttonOffsetTop = button.offset().top,
				buttonOffsetLeft = button.offset().left,
				buttonOffsetRight = buttonOffsetLeft + button.outerWidth() - windowScrollLeft,
				buttonOffsetBottom = buttonOffsetTop + button.outerHeight() - windowScrollTop;
				buttonOffsetRightAlignRight = buttonOffsetLeft + button.outerWidth() - windowScrollLeft - menu.width();

			console.log(menu.width());

			menu.css({
				'position': 'fixed',
				'top': buttonOffsetBottom,
				'left': buttonOffsetLeft
			});
		}
	});
});

//datepicker
$(function(){
	$('.js-input-date').each(function(){
		var $this = $(this);
		$this.datepicker();
	});
});


//js share link
$(function(){
	$('.js-share-link').each(function(){
		var $this = $(this),
				button = $this.find('.js-share-link-button'),
				text = $this.find('.js-share-link-text');
		
		button.click(function(){
			text[0].select();
			text[0].setSelectionRange(0, 99999); /*For mobile devices*/
			document.execCommand("copy");
			return false;
		});
	});
});

//parsley
$(function(){
	$('form').each(function(){
		if ($(this).length) $(this).parsley();
	});
});