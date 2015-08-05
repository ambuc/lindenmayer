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

function translate(instructions, lookup){
	ret = [];
	for(var i = 0; i < instructions.length; i++){
		ret.push(lookup[instructions.charAt(i)]);
	}
	console.log(ret);
	return ret;
}

function clear(){
	$('canvas#canvas')[0].getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

function draw(){
	clear();

    var depth = Math.floor($('#depth').val());
	var seg_len = $('#length').val();
	var stroke = $('#stroke').val();

    e_lookup = {'A':'A-B--B+A++AA+B-' , 'B':'+A-BB--B-A++A+B'};
	t_lookup = {'A':'p.go(seg_len);', 'B':'p.go(seg_len);', '+':'p.turn(60);', '-':'p.turn(-60);'};
    initial = 'A';

	var p = new Pen("canvas");

	p.begin().pendown();
	p.fillstyle("white").pensize(stroke);
	p.jump(canvas.width/2, canvas.height/2);

    var full_instructions = increase_depth(initial, e_lookup, depth);
	
	var translated_instruction = translate(full_instructions, t_lookup);

	for(var i = 0; i < translated_instruction.length; i++){
		if(translated_instruction[i]){
			eval(translated_instruction[i]);
			// console.log(translated_instruction[i]);
		}
	}

	p.draw();

}

$( document ).ready(function() {

    console.log( "ready!" );
    draw();

});

$('a#draw').click(function(){
	draw();	
});
$('a#clear').click(function(){
	clear();	
});


