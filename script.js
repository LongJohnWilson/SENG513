const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator__keys')
const display = document.querySelector('.calculator__display')
const expression = document.querySelector('.calculator__expression')
var newExp = true, error = false
var lastResult = 0

//wait for button click
keys.addEventListener('click', e => {
	if (e.target.matches('button')) {
		const key = e.target
		const action = key.dataset.action
		const keyContent = key.textContent
		const displayedNum = display.textContent
		const expContent = expression.textContent
		//when the user presses a number or operator
		if (action !== "clear" && action !== "calculate") {
			//for the start of a new expression
			if (newExp) {
				//for number buttons
				if (!action) {
					display.textContent = key.textContent
				//for operators
				} else {
					display.textContent = lastResult + key.textContent
				}
				//no longer a new expression
				newExp = false
			//for adding to an existing expression
			} else {
				//if the display content is only 0, replace it. Otherwise, add to it.
				if (display.textContent !== "0") {
					display.textContent += key.textContent
				} else if (display.textContent === "0" && action) {
					display.textContent += key.textContent
				} else {
					display.textContent = key.textContent
				}
			}
		}
		//when the user clears
		if (action === 'clear') {
			display.textContent = "0"
			expression.textContent = "0"
		}
		//when the user presses the equals button
		if (action === 'calculate') {
			//display the entered expression in the bar
			expression.textContent = display.textContent + "="
			if (!newExp) {
				//calculate the answer
				lastResult = calculate(display.textContent)
			}
			//if it is invalid, display an error message. Otherwise display the last expression and the answer
			if (error) {
				expression.textContent += "ERROR"
				display.textContent = "0"
				newExp = false
				error = false
			} else {
				lastResult = Math.floor(lastResult * 1000000000)/1000000000
				display.textContent = lastResult
			}
			//the next expression will be a new one
			newExp = true
		}
	}
})

//Function to calculate the line entered by the user
function calculate(line) {
	//test for equal brackets
	var openBracket = (line.match(/\(/g) || []).length
	var closeBracket = (line.match(/\)/g) || []).length
	if(openBracket !== closeBracket) {
		error = true
		return "err"
	}
	//check for errors in the equation
	if (errorCheck(line)) {
		error = true
		return "err"
	}
	//Due to the algorithm being recursive, the call order is opposite of order of operations
	//Check for subtraction
	var parts = line.split(/-(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "-", parts[1])
	}
	//Check for addition
	parts = line.split(/\+(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "+", parts[1])
	}
	//Check for multiplication
	parts = line.split(/X(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "X", parts[1])
	}
	//Check for division
	parts = line.split(/\/(.+)/)
	if (parts.length > 1) {
		return calc(parts[0], "/", parts[1])
	}
}

//Function to calculate two terms with an operation. If one of the terms contains an equation,
//it calls itself recursively to solve all sub-parts. Order of operations is again reversed.
function calc(term1, op, term2) {
	//An error is thrown if you use the .includes method on a float, so a try-catch is required
	try {
		//Look for subtraction in the first and second terms
		if(term1.includes("-")) {
			var parts = term1.split(/-(.+)/)
			term1 = calc(parts[0], "-", parts[1])
		}
		if(term2.includes("-")) {
			var parts = term2.split(/-(.+)/)
			term2 = calc(parts[0], "-", parts[1])
		}
		//Look for addition in the first and second terms
		if(term1.includes("+")) {
			var parts = term1.split(/\+(.+)/)
			console.log(parts)
			term1 = calc(parts[0], "+", parts[1])
		}
		if(term2.includes("+")) {
			var parts = term2.split(/\+(.+)/)
			term2 = calc(parts[0], "+", parts[1])
		}
		//Look for multiplication in the first and second terms
		if(term1.includes("X")) {
			var parts = term1.split(/X(.+)/)
			term1 = calc(parts[0], "X", parts[1])
		}
		if(term2.includes("X")) {
			var parts = term2.split(/X(.+)/)
			term2 = calc(parts[0], "X", parts[1])
		}
		//Look for division in the first and second terms
		if(term1.includes("/")) {
			var parts = term1.split(/\/(.+)/)
			term1 = calc(parts[0], "/", parts[1])
		}
		if(term2.includes("/")) {
			var parts = term2.split(/\/(.+)/)
			term2 = calc(parts[0], "/", parts[1])
		}
	} catch(err) {}
	//Perform the appropriate operation on the two terms once they are just numbers
	if (op === "X") {
		return parseFloat(term1)*parseFloat(term2)
	} else if (op === "/") {
		//Don't allow division by 0
		if (term2 === 0 || term2 === "0") {
			error = true
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

//Function to check for syntax errors
function errorCheck(line) {
	//Illegal tokens
	var badTokens = ["//", "/*", "/+", "/-", "*/", "**", "*+", "*-", "+/", "+*", "++", "+-", "-/", "-*", "-+", "--",
	"(/", "(*", "(+", "(-",]
	for (const token of badTokens) {
		if (line.includes(token)) {
			return true
		}
	}
	//The expression can't end with an operator
	var operators = ["/", "*", "+", "-"]
	for (const op of operators) {
		if (line.endsWith(op)) {
			return true
		}
	}
	return false
}