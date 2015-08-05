from turtle import *

def increase_depth(base, lookup, depth):
    if depth == 0:
        ret = ''
        for char in base:
            if char in lookup:
                ret += lookup[char]
            else:
                ret += char
        return ret
    else:
        return increase_depth(increase_depth(base, lookup, 0), lookup, depth-1)

def translate(instructions, lookup):
    ret = []
    for char in instructions:
        ret.append(lookup[char])
    return ret

if __name__ == '__main__':
    T = Turtle()
    T.speed("fastest")
    seg_len = 10

    expand_lookup = {'L':'+RF-LFL-FR+', 'R':'-LF+RFR+FL-'}
    translate_lookup = {'L':'', 'R':'', '+':'T.lt(90)','-':'T.rt(90)', 'F':'T.fd(seg_len)'}
    full_instructions = increase_depth('L', expand_lookup, 3)

    translated_instruction = translate(full_instructions, translate_lookup)
    for item in translated_instruction:
        if item:
            eval(item)



#    expand_lookup = {'A':'A-B--B+A++AA+B-' , 'B':'+A-BB--B-A++A+B',}
#    translate_lookup = {'A':'T.fd(seg_len)', 'B':'T.fd(seg_len)', '+':'T.lt(60)', '-':'T.rt(60)'}
#    full_instructions = increase_depth('A', expand_lookup, 3)