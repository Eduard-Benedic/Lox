import { Token } from './Token'
interface Expr {
  this.left : any
  this.operator : Token
  this.right : any
}

class Binary {
	constructor (left : Expr, operator : Token, right : Expr) {
		this.left : Expr = this.left
		this. operator : Token = this. operator
		this. right : Expr = this. right
	}
}

class Grouping {
	constructor (expression : Expr) {
		this.expression : Expr = this.expression
	}
}

class Literal {
	constructor (value : Object) {
		this.value : Object = this.value
	}
}

class Unary {
	constructor (operator : Token, right : Expr) {
		this.operator : Token = this.operator
		this. right : Expr = this. right
	}
}

