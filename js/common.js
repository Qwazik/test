// елементы верстки
var tplContainer = $("<div class='bets'></div>");
var tplList = $("<div class='bets__list'></div>");
var tplItem;
var tplItemHeader;
var tplItemBody;
var tplItemCol = $("<div class='bets__col'></div>");

//получаем JSON
var eventsJSON = $.getJSON('data.json', function(data){ 
	values = data.Value; // помещаем параметры в переменную
	events = data.Value.Events; // помещаем параметры в переменную
	console.log(values);

	// собираем все имеющиеся id групп
	var allGroupsId = [] //переменная для всех ид
	var tmpId = ''; // переменная с временем значением для отсеивания повторяющихся id
	for(groups in events){ 
		var groupsBets = events[groups];
		if(tmpId != events[groups]['G']){
			tmpId = events[groups]['G'];
			allGroupsId.push(events[groups]['G']);
		}
	}

	
	for(groupId in allGroupsId){
		var currentId = allGroupsId[groupId]; // id текущей группы
		var currenGroup = betsModel[currentId]; // текущая группа
		var currentGroupName = currenGroup['G']; // имя текущей группы

		var tplItem = $("<div class='bets__item'></div>");
			var tplItemHeader = $("<div></div>", {
				class: 'bets__header',
				on: {
					click: function(){
						$(this).siblings('.bets__body').slideToggle();
					}
				}
			});
			var tplItemBody = $("<div class='bets__body'></div>");
		
		// добавляем элементы в шаблон
		$(tplItemHeader).append(currentGroupName); 
		$(tplItem).append(tplItemHeader);
		$(tplItem).append(tplItemBody);
		$(tplList).append(tplItem);

		
		for(var i = 0; i<events.length; i++){ // преребиваем все группы
			var betsGroups = events[i]; // переменная с группой
			if(betsGroups['G'] == currentId){
				var bet = currenGroup; // подгруппа со значениями ставки
				var betCof = betsGroups['C']; // коэффициент ставки
				var betIndex = betsGroups['T'];  // ид ставки


				// добавляем в шаблон
				var tplItemCol = $("<div></div>", {
					class: 'bets__col',
					on:{
						click: function(){
							if(!$(this).hasClass('selected')){

							
							var eventNum = values.Num,
								eventName = values.Champ,
								eventOpp1 = values.Opp1,
								eventOpp2 = values.Opp2,
								betsGroup = $(this).closest('.bets__item').find('.bets__header').text(),
								betsHeader = $(this).find('.bet__name').text(),
								betRatio = $(this).find('.bet__value').text();
								couponAdd(eventNum, eventName, eventOpp1, eventOpp2, betsGroup, betsHeader, betRatio, $(this));

								$('.coupon-button').fadeIn();
								$(this).addClass('selected');
							}
						}
					}
				});
				$(tplItemCol).append("<span class='bet__name'>"+bet['B'][betIndex]['N']+"</span><span class='bet__value'>"+betCof+"</span>");
				$(tplItemBody).append(tplItemCol);
			}
			
		}
	}
})
eventsJSON.done(function(){
	console.log('json received successfully'); //если получили json удачно
})
eventsJSON.fail(function(){
	console.log('json dont received'); //если не получили json 
})

$(tplContainer).append(tplList);
$('body').prepend(tplContainer);


//купон события
$('.coupon-button').click(function(){
	$('.overlay').fadeIn();
	$('#coupon').fadeIn();
})

$('.overlay').click(function(){
	$('#coupon').fadeOut();
	$('.overlay').fadeOut();
})

$('.coupon__del').click(function(){
	$('#coupon .coupon__row').each(function(){
		$(this).remove();
		couponCalcRatio();
		winCalc();
	})
	$('.bets .bets__col').each(function(){
		$(this).removeClass('selected');
	})
	$('#coupon .coupon-calc__input').val(0);
})

$('#coupon .coupon-calc__input').on('keyup', winCalc);

//формируем купон

function couponAdd(eventNum, eventName, eventOpp1, eventOpp2, betsGroup, betsHeader, betRatio, self){
	$('coupon__button').fadeIn(300);
	var couponRow = $('<div class="coupon__row"></div>'),
		coponEvent = $('<div class="coupon__event">'+eventNum+'.'+eventName+'.'+eventOpp1 +'-'+ eventOpp2+'</div>'),
		couponBetGroup = $('<div class="coupon__bet-group">'+betsGroup+'</div>'),
		couponBet = $('<div class="coupon__bet clearfix"><span class="fl-left">'+betsHeader+'</span><span class="fl-right">'+betRatio+'</span></div>');

		$(couponRow).append(coponEvent);
		$(couponRow).append(couponBetGroup);
		$(couponRow).append(couponBet);
		$(couponRow).append($('<div></div>',{
			text: 'x',
			class: 'row-close',
			on: {
				click: function(){
					$(this).closest('.coupon__row').remove();	
					couponCalcRatio();
					$(self).removeClass('selected');
					winCalc();
				}
			}
		}))
		$('#coupon .coupon__top').prepend(couponRow);
		couponCalcRatio();
		winCalc();
		// console.log(eventNum, eventName, eventOpp1, eventOpp2, betsGroup, betsHeader, betRatio);
}


//расчитываем итоговую ставку
 function couponCalcRatio(){
 	var finnalyRatio = 0;
 	$('#coupon .coupon__bet').each(function(){
		finnalyRatio += +$(this).find('.fl-right').text();
	})
	$('#coupon .coupon-calc__ratio').text((finnalyRatio).toFixed(2));
	console.log(finnalyRatio);
 }

 //рассчитываем сумму выйгрыша
 

function winCalc(){
 	var inputVal = $('#coupon .coupon-calc__input').val();

 	var finnalyRatio = $('.coupon__foot').find('.coupon-calc__ratio').text();
 	console.log(inputVal, finnalyRatio);
 	$('#coupon').find('.coupon-calc__win').text((+inputVal * +finnalyRatio).toFixed(2));
 }