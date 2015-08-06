var lib = {

	'Dragon Curve' : {
		rules : {
			'X' : 'X+YF+',
			'Y' : '-FX-Y'
		},
		alphabet : {
			'X' : '',
			'Y' : '',
			'+' : 'right',
			'-' : 'left',
			'F' : 'forward'
		},
		initial : 'FX',
		turnLeft : -90,
		turnRight : 90,
		depth: 7
	},

	'Peano-Gosper Curve':{
		rules : {
			"X" : "X+YF++YF-FX--FXFX-YF+",
			"Y" : "-FX+YFYF++YF+FX--FX-Y"
		},
		initial : 'YF',
		turnLeft : -60,
		turnRight : 60,
		depth: 2
	},

	'Square Curve':{
		rules : {
			"X" : "XF-F+F-XF+F+XF-F+F-X"
		},
		initial : 'X',
		turnLeft : -90,
		turnRight : 90,
		depth: 2
	},


	'Koch Snowflake':{
		rules : {
			"F" : "F+F--F+F"
		},
		initial : 'F-F-F-F-F-F',
		turnLeft : -60,
		turnRight : 60,
		depth: 1
	},

	'Sierpinski Arrowhead Curve':{
		rules : {
			"X" : "YF+XF+Y", 
			"Y" : "XF-YF-X"
		},
		initial : 'YF',
		turnLeft : -60,
		turnRight : 60,
		depth: 4
	},

	'Square System': {
		rules : {
			'L':'+RF-LFL-FR+', 
			'R':'-LF+RFR+FL-'
		},
		alphabet : {
			'L':'', 
			'R':'', 
			'+' : 'right',
			'-' : 'left',
			'F' : 'forward'
		},
		initial : 'L',
		turnLeft : -90,
		turnRight : 90,
	    depth : 3
	},


	'Double Back System' : {
		rules : {
			"X" : "XFYFX+F+YFXFY-F-XFYFX", 
			"Y" : "YFXFY-F-XFYFX+F+YFXFY"
		},
		alphabet : {
			'X' : '',
			'Y' : '',
			'+' : 'right',
			'-' : 'left',
			'F' : 'forward'
		},
		initial: 'X',
		turnLeft : -90,
		turnRight : 90,
	    depth : 1
	}
};

var size_min = 5000;
var size_max = 1000;
var size = 1500;
var seg_len = 20;
var stroke = 5;

function rewrite(str, lookup, depth){
	if(depth==0){
		steps = '';
		for(var i = 0; i < str.length; i++){
			if (str.charAt(i) in lookup){
				steps += lookup[str.charAt(i)];
			} else {
				steps += str.charAt(i);
			}
		}
		return steps;
	} else {
		return rewrite(rewrite(str, lookup, 0), lookup, depth-1);
	}
}

function translate(steps, length, turnRight, turnLeft){
	commands = [];
	for(var i = 0; i < steps.length; i++){
		commands.push(interpret(steps.charAt(i),length,turnRight,turnLeft));
	}
	return commands;
}

function interpret(str, length, turnRight, turnLeft){
	switch(str){
		case 'F':
			return 'p.go('+length+');';
			break;
		case '-':
			return 'p.turn('+turnLeft+');';
			break;
		case '+':
			return 'p.turn('+turnRight+');';
			break;
		default:
			return '';
			break;
	}

}

function clear(){
	$('canvas#canvas')[0].getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function draw(system){
	clear();

	canvas.width = size;
	canvas.height = size;

    var depth = Math.floor($('input#depth').val());
	var length = $('input#length').val();
	var stroke = $('input#stroke').val();
	var turnRight = $('input#turn_r').val();
	if($('input#sym').prop('checked')==true){
		console.log('true');
		$('input#turn_l').prop('disabled', 'disabled');
		var turnLeft = -$('input#turn_r').val();
		$('input#turn_l').val(-$('input#turn_r').val())
	} else {
		console.log('false');
		$('input#turn_l').prop('disabled', '');
		var turnLeft = $('input#turn_l').val();
	}

	_.each(_.keys(system.rules), function(key){
		system.rules[key] = $('input#'+key).val();
	})
	system.initial = $('input#initial').val();

	var p = new Pen("canvas");

	p.begin().pendown();
	p.fillstyle("#FFFFFF").pensize(stroke);
	p.jump(canvas.width/2, canvas.height/2);

    var steps = rewrite(system.initial, system.rules, depth);
	
	if(steps.length > 8000){
		depth = depth - 1;
		$('input#depth').val(depth);
		draw(system);
		return;
	}

	var instructions = translate(steps, length, turnRight, turnLeft);

	for(var i = 0; i < instructions.length; i++){
		if(instructions[i]){
			eval(instructions[i]);
		}
	}
	p.draw();
}

function setZoom(){
	var z = ( 1 - (size - size_max) / (size_min - size_max) ) * 100;
	$('input#zoom').val(z);
}
 
function updateSize(){
	var val = $('input#zoom').val();
	size = size_max - (100 - val) / 100 * (size_max - size_min);
}

function newSystem(lib){
	system = lib[$('select#library').val()];
	$('input#depth').val(system.depth);
	$('input#sym').prop('checked', true);
	$('input#turn_l').val(system.turnLeft);
	$('input#turn_r').val(system.turnRight);
	$('input#length').val(seg_len);
	$('input#stroke').val(stroke);

	$('span.rules').empty();

	var width = Math.floor(10.0/_.keys(system.rules).length);

	_.each(_.keys(system.rules), function(key){
		$('span.rules').append('<div class="input-field col s'+width+'"> <input id="'+key+'" type="text" value="'+system.rules[key]+'"/> <label for="'+key+'">'+key+' &#x2192; </label> </div>');
	});

	_.each(_.keys(system.rules), function(key){
		$('input#'+key).focus();
	})

	$('html').focus();

	$('input').keyup(function(){
		draw(system);
	});

	$('#sym').click(function(){
		draw(system);
	});

	$('input#a').val(system.rules['A']);
	$('input#b').val(system.rules['B']);
	$('input#initial').val(system.initial);

	return system;
}

function save(){
	var canvas = $('#canvas')[0];
	var img = canvas.toDataURL();

	myWindow = window.open(img, "_blank");
	myWindow.focus();
}

$( document ).ready(function() {
	
	var canvas = $('canvas#canvas')[0];
	setZoom();

	var system = lib.hex;

	_.each(_.keys(lib), function(book){
		$('select#library').append("<option value='"+book+"'>"+book+"</option>");
	});

	system = newSystem(lib);
	draw(system);

    $('a#draw').click(function(){ draw(system); });

	$('a#clear').click(function(){ clear(); });

	$('a#save').click(function(){ save(); });

    $('a#info').leanModal();

	$( "select#library" ).change(function() {
		system = newSystem(lib);
		draw(system);
	});

	$("p.zoom input").mouseup(function () {
        updateSize();
        draw(system);
	});	

});