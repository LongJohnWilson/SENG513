const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator__keys')
const display = document.querySelector('.calculator__display')
const expression = document.querySelector('.calculator__expression')
var newExp = true
var lastResult = 0

keys.addEventListener('click', e => {
	if (e.target.matches('button')) {
		const key = e.target
		const action = key.dataset.action
		const keyContent = key.textContent
		const displayedNum = display.textContent
		const expContent = expression.textContent
		if (action !== "clear" && action !== "calculate") {
			if (newExp) {
				if (!action) {
					display.textContent = key.textContent
				} else {
					display.textContent = lastResult + key.textContent
				}
				newExp = false
			} else {
				if (display.textContent !== "0") {
					display.textContent += key.textContent
				} else {
					display.textContent = key.textContent
				}
			}
		}
		if (action === 'clear') {
			display.textContent = "0"
			expression.textContent = "0"
		}
		if (action === 'calculate') {
			//calculate("blah blah blah")
			newExp = true
			expression.textContent = display.textContent + "="
			lastResult = calculate(display.textContent)
			if (lastResult === "err") {
				expression.textContent += "ERROR"
				display.textContent = "0"
				newExp = false
			} else {
				lastResult = Math.floor(lastResult * 1000000000)/1000000000
				display.textContent = lastResult
			}
		}
	}
})

function calculate(line) {
	var openBracket = (line.match(/\(/g) || []).length
	var closeBracket = (line.match(/\)/g) || []).length
	if(openBracket !== closeBracket) {
		return "err"
	}
	var parts = line.split(/X(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "X", parts[1])
	}
	parts = line.split(/\/(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "/", parts[1])
	}
	parts = line.split(/-(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "-", parts[1])
	}
	parts = line.split(/\+(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "+", parts[1])
	}
	console.log(line)
}

function calc(term1, op, term2) {
	console.log(term1 + ", " + op + ", " + term2)
	try {
		if(term1.includes("X")) {
			var parts = term1.split(/X(.+)/)
			term1 = calc(parts[0], "X", parts[1])
		}
		if(term1.includes("/")) {
			var parts = term1.split(/\/(.+)/)
			term1 = calc(parts[0], "/", parts[1])
		}
		if(term2.includes("X")) {
			var parts = term2.split(/X(.+)/)
			term2 = calc(parts[0], "X", parts[1])
		}
		if(term2.includes("/")) {
			var parts = term2.split(/\/(.+)/)
			term2 = calc(parts[0], "/", parts[1])
		}
		if(term1.includes("-")) {
			var parts = term1.split(/-(.+)/)
			term1 = calc(parts[0], "-", parts[1])
		}
		if(term1.includes("+")) {
			var parts = term1.split(/\+(.+)/)
			console.log(parts)
			term1 = calc(parts[0], "+", parts[1])
		}
		if(term2.includes("-")) {
			var parts = term2.split(/-(.+)/)
			term2 = calc(parts[0], "-", parts[1])
		}
		if(term2.includes("+")) {
			var parts = term2.split(/\+(.+)/)
			term2 = calc(parts[0], "+", parts[1])
		}
	} catch(err) {}
	if (op === "X") {
		return parseFloat(term1)*parseFloat(term2)
	} else if (op === "/") {
		if (term2 === 0 || term2 === "0") {
			return "err"
		} else {
			return parseFloat(term1)/parseFloat(term2)
		}
	} else if (op === "-") {
		return parseFloat(term1)-parseFloat(term2)
	} else if (op === "+") {
		return parseFloat(term1)+parseFloat(term2)
	}
}