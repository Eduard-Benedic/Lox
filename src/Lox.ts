import { readFileSync } from 'fs'
import readlineSync from 'readline-sync'
import { Scanner } from './Scanner'

export default class Lox {
  hadError: boolean

  constructor() {
    this.hadError = false
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
    console.log(tokens)
  }

  static error(line: number, message: string) : void {
    this.report(line, "", message)
  }

  static report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error ${where}: ${message}`)
  }
}

const lox = new Lox()
