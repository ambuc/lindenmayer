from turtle import *

# recursively rewrites $str to a given $depth using an $alphabet
def rewrite(str, alphabet, depth):
    if depth == 0:
        steps = ''
        for char in str:
            if char in alphabet:
                steps += alphabet[char]
            else:
                steps += char
        return steps
    else:
        return rewrite(rewrite(str, alphabet, 0), alphabet, depth-1)

# translates a series of $steps into commands using an $alphabet
def translate(steps, alphabet):
    commands = []
    for char in steps:
        commands.append(alphabet[char])
    return commands

if __name__ == '__main__':
    T = Turtle()
    T.speed("fastest")
    segmentLength = 10
    depth = 3

    //the entire fractal is here
    rewritingRules = {
        'L' : '+RF-LFL-FR+' , 
        'R' : '-LF+RFR+FL-'
    }
    alphabet = {
        'L' : '' , 
        'R' : '' , 
        '+' : 'T.lt(90)' ,
        '-' : 'T.rt(90)' , 
        'F' : 'T.fd(segmentLength)'
    }
    seed = 'L'

    steps = rewrite(seed, rewritingRules, depth)

    instructions = translate(steps, alphabet)

    for item in instructions:
        if item:
            eval(item)