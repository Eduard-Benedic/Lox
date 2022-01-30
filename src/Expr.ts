import { Token } from './Token'

 interface Visitor<T> {
	visitBinaryExpr(expr: Binary) : T
	visitGroupingExpr(expr: Grouping) : T
	visitLiteralExpr(expr: Literal) : T
	visitUnaryExpr(expr: Unary) : T
}
interface Expr {
	accept<T>(visitor: Visitor<T>): T 
}

class Binary implements Expr {
	left : Expr
	operator : Token
	right : Expr
	constructor (left : Expr, operator : Token, right : Expr) {
		this.left = left
		this.operator = operator
		this.right = right
	}
	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitBinaryExpr(this)
	}
}

class Grouping implements Expr {
	expression : Expr
	constructor (expression : Expr) {
		this.expression = expression
	}
	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitGroupingExpr(this)
	}
}

class Literal implements Expr {
	value : Object
	constructor (value : Object) {
		this.value = value
	}
	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitLiteralExpr(this)
	}
}

class Unary implements Expr {
	operator : Token
	right : Expr
	constructor (operator : Token, right : Expr) {
		this.operator = operator
		this.right = right
	}
	accept<T>(visitor: Visitor<T>): T {
		return visitor.visitUnaryExpr(this)
	}
}

