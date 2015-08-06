var lib = {

	'Dragon Curve' : {
		e_lookup : {
			'X' : 'X+YF+',
			'Y' : '-FX-Y'
		},
		t_lookup : {
			'X' : '',
			'Y' : '',
			'+' : 'right',
			'-' : 'left',
			'F' : 'forward'
		},
		initial : 'FX',
		turn_l : -90,
		turn_r : 90,
		depth: 7
	},

	'Peano-Gosper Curve':{
		e_lookup : {
			"X" : "X+YF++YF-FX--FXFX-YF+",
			"Y" : "-FX+YFYF++YF+FX--FX-Y"
		},
		initial : 'YF',
		turn_l : -60,
		turn_r : 60,
		depth: 2
	},

	'Square Curve':{
		e_lookup : {
			"X" : "XF-F+F-XF+F+XF-F+F-X"
		},
		initial : 'X',
		turn_l : -90,
		turn_r : 90,
		depth: 2
	},


	'Koch Snowflake':{
		e_lookup : {
			"F" : "F+F--F+F"
		},
		initial : 'F-F-F',
		turn_l : -60,
		turn_r : 60,
		depth: 1
	},

	'Sierpinski Arrowhead Curve':{
		e_lookup : {
			"X" : "YF+XF+Y", 
			"Y" : "XF-YF-X"
		},
		initial : 'YF',
		turn_l : -60,
		turn_r : 60,
		depth: 4
	},

	'Square System': {
		e_lookup : {
			'L':'+RF-LFL-FR+', 
			'R':'-LF+RFR+FL-'
		},
		t_lookup : {
			'L':'', 
			'R':'', 
			'+' : 'right',
			'-' : 'left',
			'F' : 'forward'
		},
		initial : 'L',
		turn_l : -90,
		turn_r : 90,
	    depth : 3
	},


	'Double Back System' : {
		e_lookup : {
			"X" : "XFYFX+F+YFXFY-F-XFYFX", 
			"Y" : "YFXFY-F-XFYFX+F+YFXFY"
		},
		t_lookup : {
			'X' : '',
			'Y' : '',
			'+' : 'right',
			'-' : 'left',
			'F' : 'forward'
		},
		initial: 'X',
		turn_l : -90,
		turn_r : 90,
	    depth : 1
	}
};

var size_min = 5000;
var size_max = 1000;
var size = 1500;
var seg_len = 20;
var stroke = 5;

function increase_depth(base, lookup, d){
	if(d==0){
		ret = '';
		for(var i = 0; i < base.length; i++){
			if (base.charAt(i) in lookup){
				ret += lookup[base.charAt(i)];
			} else {
				ret += base.charAt(i);
			}
		}
		return ret;
	} else {
		return increase_depth(increase_depth(base, lookup, 0), lookup, d-1);
	}
}

function translate(instructions, lookup, len, turn_r, turn_l){
	ret = [];
	// console.log(turn_r);
	for(var i = 0; i < instructions.length; i++){
		// console.log(interpret(lookup[instructions.charAt(i)]));
		ret.push(interpret(instructions.charAt(i),len,turn_r,turn_l));
		// ret.push(lookup[instructions.charAt(i)]);
	}
	// console.log(ret);
	return ret;
}

function interpret(str, len, turn_r, turn_l){
	// console.log(str);
	switch(str){
		case 'F':
			return 'p.go('+len+');';
			break;
		case '-':
			return 'p.turn('+turn_l+');';
			break;
		case '+':
			return 'p.turn('+turn_r+');';
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
	var seg_len = $('input#length').val();
	var stroke = $('input#stroke').val();
	var turn_r = $('input#turn_r').val();
	var turn_l = $('input#turn_l').val();
	// console.log(system);
	_.each(_.keys(system.e_lookup), function(key){
		system.e_lookup[key] = $('input#'+key).val();
	})
	system.initial = $('input#initial').val();

	var p = new Pen("canvas");

	p.begin().pendown();
	p.fillstyle("white").pensize(stroke);
	p.jump(canvas.width/2, canvas.height/2);

    var full_instructions = increase_depth(system.initial, system.e_lookup, depth);
	
	var translated_instruction = translate(full_instructions, system.t_lookup, seg_len, turn_r, turn_l);

	for(var i = 0; i < translated_instruction.length; i++){
		if(translated_instruction[i]){
			eval(translated_instruction[i]);
			// console.log(translated_instruction[i]);
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

function libraryChange(lib){
	// console.log( "Handler for .change() called." );
	system = lib[$('select#library').val()];
	$('input#depth').val(system.depth);
	$('input#turn_l').val(system.turn_l);
	$('input#turn_r').val(system.turn_r);
	$('input#length').val(seg_len);
	$('input#stroke').val(stroke);

	// console.log(system.e_lookup);

	$('span.rules').empty();

	var width = Math.floor(10.0/_.keys(system.e_lookup).length);

	_.each(_.keys(system.e_lookup), function(key){
		// console.log(key, width);
		$('span.rules').append('<div class="input-field col s'+width+'"> <input id="'+key+'" type="text" value="'+system.e_lookup[key]+'"/> <label for="'+key+'">'+key+' &#x2192; </label> </div>');
	});

	$('input').keyup(function(){
		draw(system);
	});

	$('input#a').val(system.e_lookup['A']);
	$('input#b').val(system.e_lookup['B']);
	$('input#initial').val(system.initial);

	draw(system);
	// console.log(system);
	return system;
}

function save(){
	console.log('saving');
	var canvas = $('#canvas')[0];
	var img = canvas.toDataURL();

	// document.write();
	console.log(img);
	myWindow = window.open(img, "_blank");
	myWindow.focus();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$( document ).ready(function() {
	
	var canvas = $('canvas#canvas')[0];
	setZoom();

	var system = lib.hex;

	_.each(_.keys(lib), function(book){
		// console.log(book);
		$('select#library').append("<option value='"+book+"'>"+book+"</option>");
	});

	//this draws too
	system = libraryChange(lib);
	$('select#library option').first().prop("selected", true);

	console.log(getParameterByName('butts'));

    $('a#draw').click(function(){
		draw(system);
	});

	$('a#clear').click(function(){
		clear();	
	});

	$('a#save').click(function(){
		save();	
	});

    $('a#info').leanModal();

	$( "select#library" ).change(function() {
		system = libraryChange(lib);
		_.each(_.keys(system.e_lookup), function(key){
			$('input#'+key).focus();
		})
		$('html').focus();

	});

	$("p.zoom input").mousedown(function () {
	    $(this).mousemove(function () {
	        // console.log($('input#zoom').val());
	    });
	}).mouseup(function () {
	    $(this).unbind('mousemove');
        updateSize();
        draw(system);
	}).mouseout(function () {
	    $(this).unbind('mousemove');
	});	

});

