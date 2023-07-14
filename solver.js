const inbuilt = require("./inbuilt")

const perc = {
    '+': 0,
    '-': 0,
    '*': 1,
    '/': 1,
    '^': 2,
    '_+': 3,
    '_-': 3
}


let callStack = []

Array.prototype.upush = function (item) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].value == item.value) {
            item.type = 'Recusion Error'
            item.reason = 'Indirect recusion detected'
            return { type: 'error', value: item }
        }
    }
    this.push(item)
}


/**
 * @type { { [x: string]: (({type: 'function', value: (...args: Operand[]) => Operand, inbuilt: true }) | ({type: 'function', args: { name: string, default?: Operand }[] , value: Expresssion, inbuilt: false}) | Operand ) } }
 */
const memory = {}

/**
 * @typedef { { type: string, value: any, col: number, length: number } } Token
 * @typedef { { type: 'error', value: Token & { reason: string } } } ErrorToken
 * @typedef { { type: 'sucess', value: number } } ResultToken 
 */

/**
 * @typedef { Token & { type: 'operator', value: string } } Operator
 * @typedef { Token & { type: 'operand', value: number } } Operand
 * @typedef { Token & { type: 'bracket', value: '(' | ')' }} Bracket
 * @typedef { Token & { type: 'symbol', value: string } } Symbol
 * @typedef { Token & { type: 'variable', value: string } } Variable
 * @typedef { Token & { type: 'call', name: Variable, args: Expresssion[] } } Call
 * @typedef { (Operand | Operator | Variable | Call )[] } Expresssion
 */

/**
 * 
 * @param { string } str 
 * @returns { ErrorToken | ( Operand | Operator | Variable | Bracket )[] }
 */
const tokenize = (str) => {
    if (!str || !str.trim().length) return -1

    let i = 0;
    /**
     * @type { (Operand | Operator | Variable | Bracket | Symbol)[] }
     */
    let tokens = []
    while (i < str.length) {
        if (/[0-9]/.test(str[i])) {
            let j = i;
            let v = 0;
            while (j < str.length) {
                if (!/[0-9]/.test(str[j])) break
                v = str[j] - 0 + 10 * v
                j++
            }
            tokens.push({ type: 'operand', value: v, col: i, length: j - i })
            i = j - 1
        } else if (/[-+/*^]/.test(str[i])) {
            if (str[i] == '+' || str[i] == '-') {
                if (tokens[tokens.length - 1]) {
                    let prev = tokens[tokens.length - 1]
                    if (prev.type == 'operator' || (prev.type == 'bracket' && prev.value == '(')) {
                        tokens.push({ type: 'operator', value: `_${str[i]}`, col: i, length: 1 })
                    } else {
                        tokens.push({ type: 'operator', value: str[i], col: i, length: 1 })
                    }
                } else {
                    tokens.push({ type: 'operator', value: `_${str[i]}`, col: i, length: 1 })
                }
            } else tokens.push({ type: 'operator', value: str[i], col: i, length: 1 })
        } else if (/[\(\)]/.test(str[i])) {
            tokens.push({ type: 'bracket', value: str[i], col: i, length: 1 })
        } else if (/[a-zA-Z]/.test(str[i])) {
            let j = i;
            let v = [];
            while (j < str.length) {
                if (!/[a-zA-Z]/.test(str[j])) break
                v.push(str[j])
                j++
            }
            tokens.push({ type: 'variable', value: v.join(''), col: i, length: j - i })
            i = j - 1
        } else if (str[i] == ',' || str[i] == '=') {
            tokens.push({ type: 'symbol', value: str[i], col: i, length: 1 })
        } else if (!/\s/.test(str[i])) {
            return { type: 'error', value: { type: 'Syntax Error', reason: `'${str[i]}' was unexpected`, value: str[i], col: i, length: 1 } }
        }
        i++
    }
    return tokens
}


/**
 * 
 * @param { (Operand | Operator | Bracket | Variable | Symbol )[] } tokens 
 * @returns { ErrorToken | Expresssion }
 */
const postfix = (tokens) => {
    /**
     * @type { Expresssion }
     */
    let expr = []
    /**
     * @type { ( Operator | Bracket )[] }
     */
    let stk = []
    for (let i = 0; i < tokens.length; i++) {
        let toke = tokens[i]
        if (toke.type == 'operator') {
            while (stk.length && perc[stk[stk.length - 1].value] > perc[toke.value]) {
                expr.push(stk.pop())
            }
            stk.push(toke)
        } else if (toke.type == 'bracket') {
            if (toke.value == '(') stk.push(toke)
            else {
                while (stk.length && stk[stk.length - 1].type != 'bracket' && stk[stk.length - 1].value != ')') {
                    expr.push(stk.pop())
                }
                if (!stk.length) {
                    toke.type = 'Syntax Error'
                    toke.reason = 'Unexpected \')\' recieved'
                    return { type: 'error', value: toke }
                }
                stk.pop()
            }
        } else if (toke.type == 'symbol') {
            if (expr.length) {
                let f = expr.pop()
                if (f.type == 'call') {
                    f.subtype = 'function'
                } else {
                    f.subtype = 'variable'
                }

                f.type = 'definition'

                let l = tokens.slice(i + 1)
                if (!l.length) {
                    toke.type = 'Syntax Error'
                    toke.reason = 'Assignment expression doesn\'t exist'
                    return { type: 'error', value: toke }
                }
                f.body = postfix(l)
                for (let j = 0; j < f.body.length; j++) {
                    if (f.body[j].type == 'call' && f.body[j].name.value == f.name.value) {
                        f.body[j].name.type = 'Recusion Error'
                        f.body[j].name.reason = 'Function called itself in the definition'
                        return { type: 'error', value: f.body[j].name }
                    }
                }
                return [f]
            } else {
                toke.type = 'Syntax Error'
                toke.reason = 'Assignment variable doesn\'t exist'
                return { type: 'error', value: toke }
            }
        } else {
            if (tokens[i + 1]?.type == 'bracket') {
                let st = 0
                let v = []
                let endindex = -1
                for (let j = i + 2; j < tokens.length; j++) {
                    if (tokens[j].type == 'bracket') {
                        if (tokens[j].value == ')') {
                            if (!st) {
                                endindex = j
                                break
                            } else {
                                st--
                            }
                        } else {
                            st++
                        }
                    } else {
                        v.push(tokens[j])
                    }
                }
                if (endindex == -1) {
                    tokens[i + 1].type = 'Syntax Error'
                    tokens[i + 1].reason = 'Unexpected \'(\' recieved'
                    return { type: 'error', value: tokens[i + 1] }
                }
                expr.push({ type: 'call', args: parse_params(v), name: toke, col: tokens[i].col, length: tokens[endindex].col })
                i = endindex
            } else expr.push(toke)
        }
    }
    while (stk.length) {
        let v = stk.pop()
        if (v.type == 'bracket') {
            v.type = 'Syntax Error'
            v.reason = 'Unexpected \'(\' recieved'
            return { type: 'error', value: v }
        }
        expr.push(v)
    }
    return expr
}

/**
 * 
 * @param { (Expresssion | (Symbol | Bracket)[])} tokens 
 */
const parse_params = (tokens) => {
    let stk = 0
    let args = []
    let final_args = []
    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].type == 'symbol') {
            if (tokens[i].value == ',') {
                if (!stk) {
                    final_args.push(postfix(args))
                    args = []
                }
            } else {
                args.push(tokens[i])
            }
        } else if (tokens[i].type == 'bracket') {
            if (tokens[i].value == '(') {
                stk++
            } else {
                stk--
            }
        } else {
            args.push(tokens[i])
        }
    }

    if (args.length) {
        final_args.push(postfix(args))
    }

    return final_args
}

/**
 * 
 * @param { Call } call
 * @returns { ErrorToken | Operand } 
 */
const parse_calls = (call) => {
    if (!memory[call.name.value] && !inbuilt[call.name.value]) {
        call.nametype = 'Reference Error'
        call.name.reason = `\'${call.name.value}\' isn't defined`
        callStack = []
        return { type: 'error', value: call.name }
    }

    if (memory[call.name.value]) {
        if (memory[call.name.value].type != 'function') {
            call.nametype = 'Reference Error'
            call.name.reason = `\'${call.name.value}\' isn't a function`
            callStack = []
            return { type: 'error', value: call.name }
        }

        let v = callStack.upush(call.name)
        if (v) {
            callStack = []
            return v
        }

        if (memory[call.name.value].inbuilt) {
            let args = []
            for (let i = 0; i < call.args.length; i++) {
                let v = parse(call.args[i])
                if (v.type == 'error') {
                    callStack = []
                    return v
                }

                args.push(v)
            }
            return memory[call.name.value].value(...args)
        } else {
            let args = {}
            for (let i = 0; i < call.args.length; i++) {
                let v = parse(call.args[i])
                if (v.type == 'error') {
                    callStack = []
                    return v
                }

                args[memory[call.name.value].args[i].name] = v
            }

            let clone = structuredClone(memory[call.name.value])

            for (let i = 0; i < clone.args.length; i++) {
                if (clone.value[i].type == 'variable') {
                    if (!(clone.value[i].value in args)) {
                        if (clone.args[i].default !== undefined) {
                            args[clone.args[i].name] = clone.args[i].default
                        } else {
                            if (memory[clone.args[i].name]) {
                                let toke = memory[clone.args[i].name]
                                if (toke.type == 'function') {
                                    toke.type = 'Type Error'
                                    toke.reason = `Variable '${clone.args[i].name}' is a function`
                                    callStack = []
                                    return { type: 'error', value: toke }
                                }
                                args[clone.args[i].name] = toke.value
                            } else {
                                let toke = clone.args[i]
                                toke.type = 'Reference Error'
                                toke.reason = `Variable '${clone.args[i].name}' is not defined`
                                callStack = []
                                return { type: 'error', value: toke }
                            }
                        }
                    }
                }
            }

            for (let i = 0; i < clone.value.length; i++) {
                if (clone.value[i].type == 'variable') {
                    if (args[clone.value[i].value]) {
                        clone.value[i] = args[clone.value[i].value]
                    } else {
                        let toke = clone.value[i]
                        toke.col = call.col
                        toke.length = call.length
                        toke.type = 'Reference Error'
                        toke.reason = `Variable '${clone.value[i].value}' is not defined`
                        callStack = []
                        return { type: 'error', value: toke }
                    }
                }
            }

            let r = parse(clone.value)
            callStack.pop()
            return r
        }
    } else {
        if (inbuilt[call.name.value].type != 'function') {
            call.nametype = 'Reference Error'
            call.name.reason = `\'${call.name.value}\' isn't a function`
            callStack = []
            return { type: 'error', value: call.name }
        }

        let v = callStack.upush(call.name)
        if (v) {
            callStack = []
            return v
        }

        if (inbuilt[call.name.value].inbuilt) {
            let args = []

            for (let i = 0; i < call.args.length; i++) {
                let v = parse(call.args[i])
                if (v.type == 'error') {
                    callStack = []
                    return v
                }

                args.push(v)
            }

            let r = inbuilt[call.name.value].value(...args)
            callStack.pop()
            return r
        }
    }
}

const validate_expr = (tokens) => {
    let counter = 0;
    for (let i = 0; i < tokens.length; i++) {
        let toke = tokens[i]
        if (['operand', 'call', 'variable'].includes(toke.type)) counter++
        else {
            if (toke.type == 'definition') {
                toke.type = 'Syntax Error'
                toke.reason = 'Unexpcted definition found inside another definition'
                return { type: 'error', value: toke }
            }

            if (!['_+', '_-'].includes(toke[i])) counter--
        }

        if (counter < 0) {
            toke.type = 'Syntax Error'
            toke.reason = `Unxpected operand found \`${toke.value}\``
            return { type: 'error', value: toke }
        }
    }

    if (counter != 1) {
        let toke = tokens[tokens.length - 2]
        toke.type = 'Syntax Error'
        toke.reason = `Unxpected operator found \`${toke.value}\``
        return { type: 'error', value: toke }
    }

    return { type: 'success' }
}

/**
 * @param { Expresssion } tokens 
 * @returns { ErrorToken | Operand }
 */
const parse = (tokens) => {
    // console.log(tokens)
    /**
     * @type { (Operand | Call)[] }
     */
    let stk = []

    for (let i = 0; i < tokens.length; i++) {
        let toke = tokens[i]
        if (toke.type == 'operator') {
            if (toke.value == '_+' || toke.value == '_-') {
                let v = stk.pop()

                if (!v) {
                    toke.value = toke.value[1]
                    toke.type = 'Syntax Error'
                    toke.reason = `Arguments missing for a binary operator \'${toke.value}\'`
                    return { type: 'error', value: toke }
                }

                if (toke.value == '_+') {
                    stk.push({ type: 'operand', value: +v.value })
                } else {
                    stk.push({ type: 'operand', value: -v.value })
                }
            } else {
                let rhs = stk.pop(), lhs = stk.pop()

                if (!rhs || !lhs) {
                    toke.type = 'Syntax Error'
                    toke.reason = `Operand(s) missing for a binary operator \'${toke.value}\'`
                    return { type: 'error', value: toke }
                }

                if (lhs.type == 'call') {
                    lhs = parse_calls(lhs)
                }

                if (rhs.type == 'call') {
                    rhs = parse_calls(rhs)
                }

                switch (toke.value) {
                    case '+':
                        stk.push({ type: 'operand', value: lhs.value + rhs.value })
                        break
                    case '-':
                        stk.push({ type: 'operand', value: lhs.value - rhs.value })
                        break
                    case '*':
                        stk.push({ type: 'operand', value: lhs.value * rhs.value })
                        break
                    case '/':
                        if (rhs.value == 0) {
                            rhs.type = 'Value Error'
                            rhs.reason = 'Division by zero'
                            return { type: 'error', value: rhs }
                        }
                        stk.push({ type: 'operand', value: lhs.value / rhs.value })
                        break
                    case '^':
                        if (lhs.value == 0 && rhs.value == 0) {
                            rhs.type = 'Value Error'
                            rhs.reason = 'Zero raised to Zero'
                            return { type: 'error', value: rhs }
                        }
                        stk.push({ type: 'operand', value: lhs.value ** rhs.value })
                        break
                    default:
                        break;
                }
            }
        } else if (toke.type == 'definition') {
            if (toke.subtype == 'function') {
                let args = []
                for (let i = 0; i < toke.args.length; i++) {
                    if (toke.args[i].length > 1) {
                        toke.args[i][0].type = 'Syntax Error'
                        toke.args[i][0].reason = `Function parameters cannot be expression`
                        return { type: 'error', value: toke.args[i][0] }
                    } else {
                        let ag = toke.args[i][0]
                        if (ag.type == 'definition') {
                            if (ag.subtype == 'variable') {
                                let def = parse(ag.body)
                                if (def.type == 'error') return def
                                args.push({ name: ag.value, default: def })
                            } else {
                                ag.type = 'Syntax Error'
                                ag.reason = 'Found a function definition in parameter list'
                                return { type: 'error', value: ag }
                            }
                        } else if (ag.type == 'variable') {
                            args.push({ name: ag.value })
                        } else {
                            ag.type = 'TypeError'
                            ag.reason = `'${ag.value}' cannot be a variable name`
                            return { type: 'error', value: ag }
                        }
                    }
                }

                let val = validate_expr(toke.body)
                if (val.type == 'success') {
                    memory[toke.name.value] = {
                        col: toke.col,
                        length: toke.length,
                        args: args,
                        type: 'function',
                        value: toke.body,
                        inbuilt: false
                    }
                    return { type: 'operand', value: 'Successfully declared function' }
                }
                return val
            } else {
                let val = validate_expr(toke.body)
                if (val.type == 'success') {
                    memory[toke.value] = {
                        col: toke.col,
                        length: toke.length,
                        type: 'operand',
                        value: parse(toke.body).value,
                        inbuilt: false
                    }
                    return { type: 'operand', value: `'${toke.value}' is now set to '${memory[toke.value].value}'` }
                }
                return val
            }
        } else {
            if (toke.type == 'variable') {
                if (memory[toke.value]) {
                    stk.push(memory[toke.value])
                } else if (inbuilt[toke.value]) {
                    stk.push(inbuilt[toke.value])
                } else {
                    toke.type = 'Reference Error'
                    toke.reason = `\'${toke.value}\' isn't defined`
                    return { type: 'error', value: toke }
                }
            } else {
                stk.push(toke)
            }
        }
    }

    if (stk.length > 1) {
        stk[1].type = 'Syntax Error'
        stk[1].reason = `Unexpected token \'${stk[1].value}\'`
        return { type: 'error', value: stk[1] }
    }

    if (stk[0].type == 'call') {
        stk[0] = parse_calls(stk[0])
    }

    return stk[0]
}

/**
 * @param { string } expr
 * @returns { ErrorToken | ResultToken }
 */
const solve = (expr) => {
    let tokens = tokenize(expr)

    if (tokens.type == 'error') return tokens

    let pfx = postfix(tokens)

    if (pfx.type == 'error') return pfx

    let sol = parse(pfx)

    if (sol.type == 'error') return sol

    return { type: 'success', value: sol.value }
}

module.exports = {
    postfix, solve, tokenize, parse
}