import { Binary, Expr, Grouping, Literal, Unary, Visitor } from "./Expr";
import Lox from "./Lox";
import { Token } from "./Token";
import { TokenType } from "./TokenType";


export class Interpreter implements Visitor<Object>  {

  public interpret(expression: Expr) {
    try {
      const value: Object = this.evaluate(expression)
      console.log(value)
    } catch(e) {
      console.log(e)
    }
  }

  visitLiteralExpr(expr: Literal): Object {
    return expr.value
  }

  visitGroupingExpr(expr: Grouping): Object {
    return this.evaluate(expr.expression)
  }

  visitUnaryExpr(expr: Unary): Object  {
    const right: Object = this.evaluate(expr.right)

    switch(expr.operator.type) {
      case TokenType.BANG: {
        return !this.isTruthy(right)
      }
      case TokenType.MINUS:
        return -(right as number)
    }

    return Object(null)
  }

  visitBinaryExpr(expr: Binary): Object {
      const left : Object = this.evaluate(expr.left)
      const right: Object = this.evaluate(expr.right)

      switch(expr.operator.type) {
        case TokenType.GREATER:
          this.checkNumberOperands(expr.operator, left, right)
          return (left as number) > (right as number)
        case TokenType.GREATER_EQUAL:
          this.checkNumberOperands(expr.operator, left, right)
          return (left as number) >= (right as number)
        case TokenType.LESS:
          this.checkNumberOperands(expr.operator, left, right);
          return (left as number) < (right as number)
        case TokenType.LESS_EQUAL:
          this.checkNumberOperands(expr.operator, left, right);
          return (left as number) <= (right as number)
        case TokenType.BANG_EQUAL:
          return !this.isEqual(left, right)
        case TokenType.EQUAL_EQUAL:
          return this.isEqual(left, right)
        case TokenType.MINUS:
          this.checkNumberOperands(expr.operator, left, right);
          this.checkNumberOperand(expr.operator, right)
          return (left as number) - (right as number)
        case TokenType.PLUS:
          if ( (typeof left === 'number') && (typeof right === 'number') ) {
            return (left as number) + (right as number)
          }

          if ((typeof left === 'string') && (typeof right === 'string')) {
            return (left as string) + (right as string)
          }
          throw new Error(`${expr.operator} operands must be two numbers or two integers`)
          break;
        case TokenType.SLASH:
          this.checkNumberOperands(expr.operator, left, right);
          return (left as number) / (right as number)
        case TokenType.STAR:
          this.checkNumberOperands(expr.operator, left, right);
          return (left as number) * (right as number)
      }

      return Object(null)
  }

  evaluate(expr: Expr): Object {
    return expr.accept(this as any)
  }

  private isTruthy(object: Object) {
    if (object == null) return false
    if (typeof object === "boolean") return object as boolean
    return true
  }

  private isEqual(a: Object, b: Object): boolean {
    if (a == null && b == null) return true
    if (a == null) return false

    return a == b
  }

  private checkNumberOperand(operator: Token, operand: Object) {
    if (typeof operand === 'string') return;
    throw new Error(`${operator} Operand must be a number`)
  }

  private checkNumberOperands(operator: Token, left: Object, right: Object) {
    if ((typeof left === 'number') && (typeof right === 'number')) return
    throw new Error(`${operator} Operands must be number`)
  }
}
