"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const readline_sync_1 = __importDefault(require("readline-sync"));
const Interpreter_1 = require("./Interpreter");
const Parser_1 = require("./Parser");
const Scanner_1 = require("./Scanner");
const TokenType_1 = require("./TokenType");
class Lox {
    constructor() {
        this.hadError = false;
        this.interpreter = new Interpreter_1.Interpreter();
        this.init();
    }
    init() {
        const [nodePath, programPath, filePath] = process.argv;
        if (process.argv.length > 3) {
            throw new Error('Too many arguments');
        }
        else if (process.argv.length === 3) {
            this.runFile(filePath);
        }
        else {
            this.runPrompt();
        }
    }
    runFile(path) {
        const source = (0, fs_1.readFileSync)(path, 'utf-8');
        console.log(source);
        this.run(source);
        if (this.hadError)
            throw new Error('It had error');
    }
    runPrompt() {
        for (;;) {
            console.log('> ');
            const line = readline_sync_1.default.question();
            if (line === null)
                break;
            this.run(line);
            this.hadError = false;
        }
    }
    run(source) {
        const scanner = new Scanner_1.Scanner(source);
        const tokens = scanner.scanTokens();
        const parser = new Parser_1.Parser(tokens);
        const expression = parser.parse();
        if (this.hadError)
            return;
        if (expression) {
            this.interpreter.interpret(expression);
        }
    }
    static error(token, message) {
        if (token.type === TokenType_1.TokenType.EOF) {
            this.report(token.line, "", message);
        }
        else {
            this.report(token.line, " at '" + token.lexeme + "'", message);
        }
    }
    //
    static report(line, where, message) {
        console.log(`[line ${line}] Error ${where}: ${message}`);
    }
}
exports.default = Lox;
const lox = new Lox();
