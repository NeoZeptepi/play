// JavaScript Document

// global variables
var m_logoFXcnt		= 0;
var o_master		= {number: 0, showing: 0, hidden: 0, remaining: "", tracking: new Array(11)};
var o_stone			= {width: 40, height: 30};
var o_hand			= {width: 800, height: 400, top_hidden: -400, left_hidden: 
						-800, top_half: -155, left_half:	-340};
var o_hidden_box	= {left: 25, top: 25, width: 350, height: 170}
var o_showing_box	= {left: 410, top: 180, width: 350, height: 150};
var a_pad			= new Array(10);

// load number pad animation positional data
a_pad[0]			= {left: 0, 	top: 0, 	left_start: -250, 	top_start: -100}
a_pad[1]			= {left: 100, 	top: 0, 	left_start: 100, 	top_start: -100}
a_pad[2]			= {left: 200, 	top: 0, 	left_start: 450, 	top_start: -100}
a_pad[3]			= {left: 0, 	top: 80, 	left_start: -250, 	top_start: 80}
a_pad[4]			= {left: 100, 	top: 80, 	left_start: 100, 	top_start: 80}
a_pad[5]			= {left: 200, 	top: 80, 	left_start: 450, 	top_start: 80}
a_pad[6]			= {left: 0, 	top: 160, 	left_start: -250,	top_start: 260}
a_pad[7]			= {left: 100, 	top: 160, 	left_start: 200,	top_start: 260}
a_pad[8]			= {left: 200, 	top: 160, 	left_start: 450,	top_start: 260}
a_pad[9]			= {left: 100, 	top: 240, 	left_start: 0,		top_start: 340}

// populate the tracking environment
for (i=1; i<11; i++) {
	o_master.tracking[i] = new Array(i+1);
	for (j=0; j<i+1; j++) {
		o_master.tracking[i][j] = new Object();
		o_master.tracking[i][j].correct = 0;
		o_master.tracking[i][j].incorrect = 0;
	}
};

$(document).ready(function() {

	// innitialize
	numberPad('init',false);
	numberPad('show',false);
	
	// number selection
	$('.pad_number').click( function() {
		o_master.number		= $('.pad_number').index(this)+1;
		numberPad('hide',true);
		clearTracking();
		o_master.remaining	= digitsRemaining();
		o_master.hidden 	= nextNumber();
		o_master.showing	= o_master.number - o_master.hidden;
		placeStones(o_master.number,o_master.showing,'half');

				
		updateDebug('master #',o_master.number);
		updateDebug('showing #',o_master.showing);
	})

	// answer capture
	$('.number').click(function() {
		o_master.remaining = digitsRemaining();
		if (o_master.remaining!='') {
			processAnswer($(this).index());
		}
	})
	
	// effects test
	$('#d_fx').click(function() {
		m_logoFXcnt += 1;
		if (m_logoFXcnt>3) {m_logoFXcnt = 1};
		logoFX(m_logoFXcnt);
	});
	
	// display hide/show boxes for testing
	// NOTE: need to be placed into css and scrapped
	$('#d_hidden').css({
		top:	o_hidden_box.top,
		left:	o_hidden_box.left,
		width:	o_hidden_box.width,
		height:	o_hidden_box.height});
	$('#d_showing').css({
		top:	o_showing_box.top,
		left:	o_showing_box.left,
		width:	o_showing_box.width,
		height:	o_showing_box.height});
});

// process answer
function processAnswer(m_answer) {
	updateDebug('answer',m_answer);
	if (m_answer==o_master.hidden) {
		// correct answer, for now show new random stones with current master number
		o_master.tracking[o_master.number][o_master.hidden].correct++;
		o_master.remaining	= digitsRemaining();
		if (o_master.remaining!='') {
			o_master.hidden 	= nextNumber();
			o_master.showing	= o_master.number - o_master.hidden;
			placeStones(o_master.number,o_master.showing,'half');
		} else {
			updateResult();
			numberPad('show');
			$('#d_showing').fadeIn(1000);
			$('#d_hand').animate({top: o_hand.top_hidden, left: o_hand.left_hidden},1000);
			logoFX(3);
		}
		
		updateDebug('master #',o_master.number);
		updateDebug('showing #',o_master.showing);
		numberFX(m_answer,true);
	} else {
		// wrong answer, show hidden stones
		//logoFX(2); - need something more appropriate
		numberFX(m_answer,false);
		o_master.tracking[o_master.number][o_master.hidden].incorrect++;
		$('#d_hidden').fadeOut(250);
		$('#d_hand').animate({top: o_hand.top_hidden, left: o_hand.left_hidden},500)
		.animate({top: o_hand.top_hidden, left: o_hand.left_hidden},1000, 'swing',
		function() {$('#d_hidden').fadeIn(250)})
		.animate({top: o_hand.top_half, left: o_hand.left_half},500)
		numberFX('no');
	}

	// debug answer processing info
	m_temp1 = " ";
	m_temp2 = " ";
	for (j=0; j<o_master.tracking[o_master.number].length; j++) {
		m_temp1 += o_master.tracking[o_master.number][j].correct;
		m_temp2 += o_master.tracking[o_master.number][j].incorrect;
	}
	updateDebug("correct___" + o_master.number, m_temp1);
	updateDebug("incorrect_" + o_master.number, m_temp2);
}

// next number
function nextNumber() {
	m_temp = 0;
	m_temp_count = 0;
	m_found = false;

	while (!m_found) {
		m_return = Math.floor(Math.random()*(o_master.number+1)); 
		m_temp = m_return + '|';
		if (o_master.remaining.indexOf(m_temp)>-1) {
			m_found=true;
		}
		m_temp_count += 1;
		updateDebug('nn loop',m_temp_count);
	}
	updateDebug('Remaining',o_master.remaining);
	return m_return;
}

// clear tracking information for the selected number
function clearTracking() {
	for (j=0; j<o_master.tracking[o_master.number].length; j++) {
		o_master.tracking[o_master.number][j].correct = 0;
		o_master.tracking[o_master.number][j].incorrect = 0;
	}
}

// establish digits remaining
function digitsRemaining() {
	m_temp = ""
	for (i=0; i<o_master.number+1; i++) {
		if (o_master.tracking[o_master.number][i].correct-o_master.tracking[o_master.number][i].incorrect<3) {
			m_temp += i + "|";
		}
	}
	return m_temp;
}

// update results in upper right-hand corner
function updateResult() {
	var m_missed = 0;
	for (i=0; i<o_master.number+1; i++) {
		m_missed += o_master.tracking[o_master.number][i].incorrect
	}
	var m_text = '#' + o_master.number + ' - ' + m_missed + ' missed';
	$('#d_results').last().append('<div class="result_entry">' + m_text + '</div>');
}

// display hand, clear stones, place new stones, remove hand
function placeStones(m_stoneCount,m_showing,m_hand) {
	var m_current	= 1;
	var m_top		= 130;
	var m_left		= 220;
	var a_top		= new Array(0,0,0,0,0,0,0,0,0,0);
	var a_left		= new Array(0,0,0,0,0,0,0,0,0,0);
	var m_works		= false;
	var m_top_fail	= false;
	var m_left_fail	= false;
	var m_loopCnt	= 0;
	var m_fail		= 0;
	
	updateDebug('loop cnt',0);
	updateDebug('m_fail',0);
	
	if (m_hand=='half') {
		m_hand_top 	= o_hand.top_half;
		m_hand_left	= o_hand.left_half; 
	} else {
		m_hand_top	= o_hand.top_hidden;
		m_hand_left	= o_hand.left_hidden;
	}

	$('#d_hand').animate({top: 0,left: 0},600,function() {
		$('#d_showing').fadeIn(50)
		$('.stones').hide().removeClass('stone-hidden');
		while (m_current <= m_stoneCount) {
			if (m_current <= m_showing) {
				m_top_offset	= o_showing_box.top;
				m_top_window	= o_showing_box.height - o_stone.height;
				m_left_offset	= o_showing_box.left;
				m_left_window	= o_showing_box.width - o_stone.width;
			} else {
				m_top_offset	= o_hidden_box.top;
				m_top_window	= o_hidden_box.height - o_stone.height;
				m_left_offset	= o_hidden_box.left;
				m_left_window	= o_hidden_box.width - o_stone.width;
			}
			m_works = false;
			while (!m_works) {
				m_count	= 0
				m_works	= true;
				m_top	= m_top_offset+Math.floor(Math.random()*m_top_window);
				m_left	= m_left_offset+Math.floor(Math.random()*m_left_window);
				while (m_count < m_current) {
					m_top_fail	= !(m_top+o_stone.height<a_top[m_count] || 
									m_top-o_stone.height>a_top[m_count]);
					m_left_fail	= !(m_left+o_stone.width<a_left[m_count] || 
									m_left-o_stone.width>a_left[m_count]);
					if (m_top_fail && m_left_fail) {
						m_fail++;
						updateDebug('m_fail',m_fail);
						m_works = false;
					}
					m_count++;
					m_loopCnt++;
					updateDebug('loop cnt',m_loopCnt);
				}
			}
			a_top[m_current]	= m_top;
			a_left[m_current]	= m_left;
			m_currentStone = $('#stone'+m_current.toString());
			m_currentStone.css({top: m_top, left: m_left});
			if (m_current <= m_showing) {
				m_currentStone.show();
			} else {
				m_currentStone.addClass('stone-hidden').hide();
			}
			m_current++;
		}
	}).animate({top: -10,left: -10},100)
	.animate({top: 0,left: -20},100)
	.animate({top: 0,left: 0},100)
	.animate({top: -20,left: 0},100)
	.animate({top: 0,left: 0},100,'swing', 
	function() {$('#d_showing').fadeOut(500)})
	.animate({top: m_hand_top,left: m_hand_left},600);
};

// Helper to reveal all previously hidden stones (invoke if logic later requires)
function revealHiddenStones() {
	$('.stone-hidden').show().removeClass('stone-hidden');
}

// numberpad functions
function numberPad(m_function, m_showNum) {
	switch (m_function) {
		case 'init':
			$('#d_pad').hide()
			for (i=0; i<$('.pad_number').length; i++) {
				$('.pad_number').eq(i).css({
					left: a_pad[i].left_start, 
					top: a_pad[i].top_start,
				});
			}
			break;
		case 'show':
			$('#d_numbers').fadeOut(500);
			$('#d_pad_number_selected').fadeOut(500);
			$('#d_pad').fadeIn(500);
			for (i=0; i<$('.pad_number').length; i++) {
				$('.pad_number').eq(i).animate({
					left: a_pad[i].left, 
					top: a_pad[i].top,
				},250,'easeOutCubic');
			}
			break;
		case 'hide':
			if (m_showNum) {
				$('#d_pad_number_selected img').attr('src','images/numbers/'+o_master.number+'.png')
				$('#d_pad_number_selected').css({
					left: a_pad[o_master.number-1].left + 250,
					top: a_pad[o_master.number-1].top + 150
				}).show().animate({
					left: 675,
					top: 5
				},750,'swing');
			}
			$('#d_numbers').fadeIn(500);
			$('#d_pad').fadeOut(250);
			for (i=0; i<$('.pad_number').length; i++) {
				$('.pad_number').eq(i).animate({
					left: a_pad[i].left_start, 
					top: a_pad[i].top_start,
				},250,'swing');
			}
			logoFX(1);
			break;
	}
}

// process logo effects
function logoFX(m_effect) {
	switch (m_effect) {
		case 1:
			$('#logoFX01').css({left: -40});
			$('#logoFX01').animate({left: 420},1000,'swing');
			break;
		case 2:
			$('#logoFX02').css({left: 0, top: -10})
			.animate({top: [55, 'easeOutBounce'], left: [420, 'linear']},1000);
			//.animate({top: 55}, {queue:false, duration: 750, easing: 'easeOutBounce'})
			//.animate({left: 420},750,'linear');
			break;
		case 3:
			$('#logoFX03img').css({width: 20, height: 20})
			.animate({width: 120, height: 120},1000)
			.animate({width: 20, height: 20},1000);
			$('#logoFX03').css({left: -20, top: 0})
			.animate({left: 420}, {queue: false, duration: 2000, easing: 'linear'})
			.animate({top: 20},250,'easeInOutCubic')
			.animate({top: 0},250,'easeInOutCubic')
			.animate({top: 10},250,'easeInOutCubic')
			.animate({top: -10},250,'easeInOutCubic')
			.animate({top: 10},250,'easeInOutCubic')
			.animate({top: 0},250,'easeInOutCubic')
			.animate({top: 20},250,'easeInOutCubic')
			.animate({top: 0},250,'easeInOutCubic')
			break;
		case 4:
			break;
	}
}

// process correct/number effects
function numberFX(m_number,m_correct) {
	$('#d_number_yes, #d_number_no').css({top: 30, left: 90 + (m_number * 60)});
	$('#d_num_fx_star1, #d_num_fx_star2, #d_num_fx_star3').css({width: 10, height: 10, left: -5, top: 0});
	switch (m_correct) {
		case true:
			$('#d_number_yes').show().animate({top: -100},{queue:false, duration:1000}).fadeOut(1000);
			$('#d_num_fx_star1').show().animate({width: '60px',height: '60px',left: '-17px',top: '-20px'},
			{queue:false, duration:1000}).fadeOut(1000,'easeInExpo');
			$('#d_num_fx_star2').show().animate({width: '60px',height: '60px',left: '-40px',top: '-0px'},
			{queue:false, duration:1000}).fadeOut(1000,'easeInExpo');
			$('#d_num_fx_star3').show().animate({width: '60px',height: '60px',left: '10px',top: '-10px'},
			{queue:false, duration:1000}).fadeOut(1000,'easeInExpo');
			break;
		case false:
			$('#d_number_no').show().animate({top: '-=100',},{queue:false, duration:1000}).fadeOut(1000); 
			break;
	}
}

// heartBeat function that checks state every second and updates model as needed
function heartBeat() {
	// fade in/out for 1 second, then call heartBeat again
	$('#d_heartBeat').fadeIn(250).fadeOut(250,function() {
		heartBeat();
	});
};

// debug: add label/value pair if it does not exist. update the value otherwise.
function updateDebug(m_label,m_value) {
	// only update if debug is enabled
	if ($('#ds_enable').html()=='disable') {
		if ($('.dtd_label:contains("' + $.trim(m_label) + ':' + '")').length>0) {
			$('.dtd_label:contains("' + $.trim(m_label) + ':' + '")').parent().children().next().text(m_value);
		} else {
			$('#dt_debug').last().append('<tr class="dtd_entry"><td class="dtd_label">' + 
			$.trim(m_label) + ':' + '</td><td class="dtd_value">' + $.trim(m_value) +'</td></tr>');
		};
	}
};