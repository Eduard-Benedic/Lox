import { Token } from './Token'
import { TokenType, KeywordsMap } from './TokenType'
import Lox from './Lox'

export class Scanner {
  source: string
  tokens: Array<Token> = []
  start: number = 0
  current: number = 0
  line: number = 1

  constructor(source: string) {
    this.source = source
  }

  scanTokens() : Array<Token> {
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }
    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
    return this.tokens
  }

  scanToken() {
    let c = this.advance()

    switch(c) {
      case '(':
        this.addToken(TokenType.LEFT_PAREN);
        break
      case ')':
        this.addToken(TokenType.RIGHT_PAREN)
        break
      case '{':
        this.addToken(TokenType.LEFT_BRACE)
        break
      case '}':
        this.addToken(TokenType.RIGHT_BRACE)
        break
      case ',':
        this.addToken(TokenType.COMMA)
        break
      case '.':
        this.addToken(TokenType.DOT)
        break
      case '-':
        this.addToken(TokenType.MINUS)
        break
      case '+':
        this.addToken(TokenType.PLUS)
        break
      case ';':
        this.addToken(TokenType.SEMICOLON)
        break
      case '*':
        this.addToken(TokenType.STAR)
        break
      case '!':
        this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
        break
      case '=':
        this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
        break
      case '<':
        this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
        break
      case '>':
        this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
        break
      case '/':
        if (this.match('/')) {
          while (this.peek() != '\n' && !this.isAtEnd()) this.advance()
        } else {
          this.addToken(TokenType.SLASH)
        }
        break;
      case ' ':
      case '\r':
      case '\t':
        break;
      case '\n':
        this.line++
        break
      case '"':
        this.addString()
        break
      default:
        if (this.isDigit(c)) {
          this.addNumber()
        } else if(this.isAlpha(c)) {
          this.identifier()
        }
        else {
          Lox.error(this.line, 'Unexpected character.');
        }
        break;
    }
  }

  advance() {
    return this.source.charAt(this.current++)
  }

  addToken(type: TokenType, literal?: Object | string | number| null) {
    const text = this.source.substring(this.start, this.current)
    if (!literal) {
      this.tokens.push(new Token(type, text, null, this.line))
    } else {
      this.tokens.push(new Token(type, text, literal, this.line))
    }
  }

  addString() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == '\n') this.line++
      this.advance()
    }
    if (this.isAtEnd()) {
      Lox.error(this.line, 'Unterminated string')
      return
    }
    this.advance()

    const val : string = this.source.substring(this.start + 1, this.current - 1)
    this.addToken(TokenType.STRING, val)
  }

  addNumber() {
    while (this.isDigit(this.peek())) this.advance()

    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      this.advance()

      while (this.isDigit(this.peek())) this.advance()
    }

    this.addToken(TokenType.NUMBER, Number(this.source.substring(this.start, this.current)))
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance()
    const text = this.source.substring(this.start, this.current) 
    let keywordType : number | null = (KeywordsMap as any)[text] || null
    if (keywordType == null) keywordType = TokenType.IDENTIFIER

    this.addToken(keywordType)
  }

  isAlpha(c: string) {
    return (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
     c == '_'
  }

  isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c)
  }

  match(expected: string) : boolean {
    if (this.isAtEnd()) return false;
    // the current actually points to one ahead
    if (this.source.charAt(this.current) != expected) return false;
    // if matches we first increment thus jumping over the lexem and then return true.
    this.current++
    return true
  }

  peek() : string {
    if (this.isAtEnd()) return '\0'
    return this.source.charAt(this.current)
  }

  peekNext() : string {
    if (this.current + 1 >= this.source.length) return '\0'
    return this.source.charAt(this.current + 1)
  }

  isDigit(char: string) : boolean {
    return char >= '0' && char <= '9'
  }

  isAtEnd() : boolean {
    return this.current >= this.source.length
  }
}