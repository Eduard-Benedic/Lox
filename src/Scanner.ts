import { TokenType } from "./types/TokenType";
import { Token } from './Token'
import Lox from './Lox'

export class Scanner {
    private source: string
    private tokens: Array<Token> = []
    private start: number = 0
    private current: number = 0
    private line: number = 1

    constructor(source: string) {
        this.source = source
    }

    public scanTokens() : Array<Token> {
        while(!this.isAtEnd()) {
            this.start = this.current 
            this.scanToken()
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens
    }
    private isAtEnd() : boolean {
        return this.current >= this.source.length
    }

    private scanToken() : void {
        let c : string = this.advance()

        switch(c) {
            case '(': this.addToken(TokenType.LEFT_PAREN); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN); break;
            case '{': this.addToken(TokenType.LEFT_BRACE); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE); break;
            case ',': this.addToken(TokenType.COMMA); break;
            case '.': this.addToken(TokenType.DOT); break;
            case '-': this.addToken(TokenType.MINUS); break;
            case '+': this.addToken(TokenType.PLUS); break;
            case ';': this.addToken(TokenType.SEMICOLON); break;
            case '*': this.addToken(TokenType.STAR); break; 
            default:
                Lox.error(this.line, "Unexpected character.");
            break;
        }
    }

    private advance() : string {
        return this.source.charAt(this.current++)
    }

    private addToken(type: TokenType) {
        this.addTokenHelper(type, null)
    }
    private addTokenHelper(type: TokenType, literal: Object) {
        let text : string = this.source.substring(this.start, this.current)
        this.tokens.push(new Token(type, text, literal, this.line))
    }

}