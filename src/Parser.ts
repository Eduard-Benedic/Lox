import { Token } from "./Token";
import { TokenType } from "./TokenType";
import { Expr, Binary, Unary, Literal, Grouping } from './Expr'
import Lox from "./Lox";

export class Parser {
  tokens: Array<Token>
  current: number = 0

  static error(token: Token, message: string): void {
    Lox.error(token, message)
    throw new Error(message)
  }

  constructor(tokens: Array<Token>) {
    this.tokens = tokens
  }

  parse(): Expr | null {
    try {
      return this.expression()
    } catch(e) {
      return null
    }
  }

  private expression(): Expr {
    return this.equality()
  }

  /** equality → comparison ( ( "!=" | "==" ) comparison )* ; */
  private equality() {
    let expr = this.comparison()

    while(this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      const operator : Token = this.previous()
      const right = this.comparison()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }

  /** comparison → term ( ( ">" | ">=" | "<" | "<=" ) term )* ; */
  comparison(): Expr {
    let expr = this.term()

    while(this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator : Token = this.previous()
      const right = this.term()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }

  /** term -> factor ( ( "-" | "+" ) factor )*; */
  private term(): Expr {
    let expr = this.factor()

    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator : Token = this.previous()
      const right = this.factor()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }

  /** factor -> unary ( ( "/" | "*" ) unary )*; */
  private factor(): Expr {
    let expr = this.unary()
    while(this.match(TokenType.SLASH, TokenType.STAR)) {
      const operator : Token = this.previous()
      const right : Expr = this.unary()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }

  /** unary -> ("!" | "-") unary | primary */
  private unary(): Expr {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      const operator : Token = this.previous()
      const right: Expr = this.unary()
      return new Unary(operator, right)
    }
    return this.primary()
  }

  private primary(): Expr {
    if (this.match(TokenType.FALSE)) return new Literal(false)
    if (this.match(TokenType.TRUE)) return new Literal(true)
    if (this.match(TokenType.NIL)) return new Literal(null as any)
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal as Object)
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      const expr : Expr = this.expression()
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression")
      return new Grouping(expr)
    }
    throw Parser.error(this.peek(), 'Expect expression...')
  }

  private match(...types: TokenType[]): boolean {
    for (const tokenType of types) {
      if (this.check(tokenType)) {
        this.advance()
        return true
      }
    }
    return false
  }

  /** consumes the current Token and returns it */
  private advance(): Token {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }

  /** simply checks the current token, never consumes it */
  private check(tokenType: TokenType): boolean {
    if (this.isAtEnd()) return false
    return this.peek().type == tokenType
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  private consume(tokenType: TokenType, message: string): Token | any {
    if (this.check(tokenType)) return this.advance()
    Parser.error(this.peek(), message)
  }
}
