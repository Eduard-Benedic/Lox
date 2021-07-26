import { argv } from 'process'
import { readFileSync } from 'fs'
import { Scanner } from './Scanner'
import { Token } from './Token'

export default class Lox {
    static hadError = false

    static error (line: number, message: string) : void {
        this.report(line, "", message)
    }
    private static report (
        line: number,
        where: string,  
        message: string
    ) : void {
        console.log("[line " + line + "] Error" + where + ": " + message)
        this.hadError = true
    }

    public run() : void {
        if(!argv[2]) {
            throw new Error('Please provide a file')
        }
        if (typeof argv[2] == 'string') {
            this._runFile(argv[2])
            return
        }
    }
    private _runFile(path: string) : void {
        const code = readFileSync(path, { encoding: 'utf-8'});
        this._run(code)
    }
    private _run(source: string) : void {
        const scanner : Scanner = new Scanner(source)
        const tokens : Array<Token> = scanner.scanTokens()
        for (const token  of tokens) {
            console.log(token)
            
        }
    }

}

const lox = new Lox()
lox.run()