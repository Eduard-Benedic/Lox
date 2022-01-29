import { Token } from './Token'

interface Expr { }

class Binary {
	left : Expr
	operator : Token
	right : Expr
	constructor (left : Expr, operator : Token, right : Expr) {
		this.left = left
		this.operator = operator
		this.right = right
	}
}

class Grouping {
	expression : Expr
	constructor (expression : Expr) {
		this.expression = expression
	}
}

class Literal {
	value : Object
	constructor (value : Object) {
		this.value = value
	}
}

class Unary {
	operator : Token
	right : Expr
	constructor (operator : Token, right : Expr) {
		this.operator = operator
		this.right = right
	}
}

