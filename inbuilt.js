/**
 * @type { { [x: string]: (({type: 'function', value: (...args: Operand[]) => Operand, inbuilt: true }) | ({type: 'function', args: { name: string, default?: Operand }[] , value: Expresssion, inbuilt: false}) | Operand ) } }
 */
module.exports = {
    abs: {
		type: 'function',
		value: (x) => {
			return { type: 'operand', value: Math.abs(x.value) }
		},
		inbuilt: true
	},
	acos: {
		type: 'function',
		value: (x) => {
			return { type: 'operand', value: Math.acos(x.value) }
		},
		inbuilt: true
	},
	acosh: {
		type: 'function',
		value: (x) => {
			return { type: 'operand', value: Math.acosh(x.value) }
		},
		inbuilt: true
	},
	asin: {
		type: 'function',
		value: (x) => {
			return { type: 'operand', value: Math.asin(x.value) }
		},
		inbuilt: true
	},
	asinh: {
		type: 'function',
		value: (x) => {
			return { type: 'operand', value: Math.asinh(x.value) }
		},
		inbuilt: true
	},
	atan: {
		type: 'function',
		value: (x) => {
			return { type: 'operand', value: Math.atan(x.value) }
		},
		inbuilt: true
	},
	atanh: {
		type: 'function',
		value: (x) => {
			return { type: 'operand', value: Math.atanh(x.value) }
		},
		inbuilt: true
	},
	ceil: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.ceil(x.value) }
		},
		inbuilt: true
	},
	cbrt: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.cbrt(x.value) }
		},
		inbuilt: true
	},
	cos: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.cos(x.value) }
		},
		inbuilt: true
	},
	cosh: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.cosh(x.value) }
		},
		inbuilt: true
	},
	exp: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.exp(x.value) }
		},
		inbuilt: true
	},
	floor: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.floor(x.value) }
		},
		inbuilt: true
	},
	hypot: {
		type: 'function',
		value: (x, y) => {
			return { type: 'operand', value: Math.hypot(x.value, y.value) }
		},
		inbuilt: true
	},
	imul: {
		type: 'function',
		value: (x, y) => {
			return { type: 'operand', value: Math.hypot(x.value, y.value) }
		},
		inbuilt: true
	},
	max: {
		type: 'function',
		value: (...args) => {
			return { type: 'operand', value: Math.max(...args) }
		},
		inbuilt: true
	},
	min: {
		type: 'function',
		value: (...args) => {
			return { type: 'operand', value: Math.min(...args) }
		},
		inbuilt: true
	},
	pow: {
		type: 'function',
		value: (x, y) => {
			return { type: 'operand', value: Math.pow(x.value, y.value) }
		},
		inbuilt: true
	},
	random: {
		type: 'function',
		value: (x, y) => {
			return { type: 'operand', value: Math.random(x.value) }
		},
		inbuilt: true
	},
	round: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.round(x.value) }
		},
		inbuilt: true
	},
	sign: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.sign(x.value) }
		},
		inbuilt: true
	},
	sin: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.sin(x.value) }
		},
		inbuilt: true
	},
	sinh: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.sinh(x.value) }
		},
		inbuilt: true
	},
	sqrt: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.sqrt(x.value) }
		},
		inbuilt: true
	},
	tan: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.tan(x.value) }
		},
		inbuilt: true
	},
	tanh: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.tanh(x.value) }
		},
		inbuilt: true
	},
	trunc: {
		type: 'function',
				value: (x) => {
			return { type: 'operand', value: Math.trunc(x.value) }
		},
		inbuilt: true
	},
	log: {
        type: 'function',
        inbuilt: true,
        value: (x, y) => {
            return { type: 'operand', value: Math.log(x.value) / (y?.value ? Math.log(y.value) : 1) }
        }
    },
    pi: {
        type: 'operand',
        value: Math.PI,
    },
    rad: {
        type: 'function',
        inbuilt: true,
        value: (x) => {
            return { type: 'operand', value: x.value / 180 * Math.PI }
        }
    },
    e: {
        type: 'operand',
        value: Math.E
    },
	deg: {
		type: 'function',
		inbuilt: true,
		value: (x) => {
            return { type: 'operand', value: x.value * 180 / Math.PI }
        }
	}
}