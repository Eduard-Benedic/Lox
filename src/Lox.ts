import { readFileSync } from 'fs'
import readlineSync from 'readline-sync'
import { Expr } from './Expr'
import { Interpreter } from './Interpreter'
import { Parser } from './Parser'
import { Scanner } from './Scanner'
import { Token } from './Token'
import { TokenType } from './TokenType'

export default class Lox {
  hadError: boolean
  interpreter:  Interpreter

  constructor() {
    this.hadError = false
    this.interpreter = new Interpreter()
    this.init()
  }

  init() {
    const [nodePath, programPath, filePath] = process.argv
    if (process.argv.length > 3) {
      throw new Error('Too many arguments')
    } else if (process.argv.length === 3) {
      this.runFile(filePath)
    } else {
      this.runPrompt()
    }
  }

  runFile(path: string) {
    const source = readFileSync(path, 'utf-8')
    console.log(source)
    this.run(source)
    if (this.hadError) throw new Error('It had error')
  }
  runPrompt() {
    for(;;) {
      console.log('> ')
      const line = readlineSync.question()
      if (line === null) break;
      this.run(line)
      this.hadError = false
    }
  }

  run(source: string) {
    const scanner = new Scanner(source)
    const tokens = scanner.scanTokens()
    const parser: Parser = new Parser(tokens)
    const expression = parser.parse()
    
    if (this.hadError) return;

    if (expression) {
      this.interpreter.interpret(expression)
    }
  }

  static error(token: Token, message: string) : void {
    if (token.type === TokenType.EOF) {
      this.report(token.line, "", message)
    } else {
      this.report(token.line, " at '" + token.lexeme + "'", message)
    }
  }
  //
  static report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`)
  }
}

const lox = new Lox()
