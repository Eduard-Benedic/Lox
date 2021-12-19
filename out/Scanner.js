"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Scanner = void 0;
const Token_1 = require("./Token");
const TokenType_1 = require("./TokenType");
const Lox_1 = __importDefault(require("./Lox"));
class Scanner {
    constructor(source) {
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.source = source;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token_1.Token(TokenType_1.TokenType.EOF, '', null, this.line));
        return this.tokens;
    }
    scanToken() {
        let c = this.advance();
        switch (c) {
            case '(':
                this.addToken(TokenType_1.TokenType.LEFT_PAREN);
                break;
            case ')':
                this.addToken(TokenType_1.TokenType.RIGHT_PAREN);
                break;
            case '{':
                this.addToken(TokenType_1.TokenType.LEFT_BRACE);
                break;
            case '}':
                this.addToken(TokenType_1.TokenType.RIGHT_BRACE);
                break;
            case ',':
                this.addToken(TokenType_1.TokenType.COMMA);
                break;
            case '.':
                this.addToken(TokenType_1.TokenType.DOT);
                break;
            case '-':
                this.addToken(TokenType_1.TokenType.MINUS);
                break;
            case '+':
                this.addToken(TokenType_1.TokenType.PLUS);
                break;
            case ';':
                this.addToken(TokenType_1.TokenType.SEMICOLON);
                break;
            case '*':
                this.addToken(TokenType_1.TokenType.STAR);
                break;
            case '!':
                this.addToken(this.match('=') ? TokenType_1.TokenType.BANG_EQUAL : TokenType_1.TokenType.BANG);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType_1.TokenType.EQUAL_EQUAL : TokenType_1.TokenType.EQUAL);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType_1.TokenType.LESS_EQUAL : TokenType_1.TokenType.LESS);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType_1.TokenType.GREATER_EQUAL : TokenType_1.TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd())
                        this.advance();
                }
                else {
                    this.addToken(TokenType_1.TokenType.SLASH);
                }
                break;
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;
            case '"':
                this.addString();
                break;
            default:
                if (this.isDigit(c)) {
                    this.addNumber();
                }
                else if (this.isAlpha(c)) {
                    this.identifier();
                }
                else {
                    Lox_1.default.error(this.line, 'Unexpected character.');
                }
                break;
        }
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    addToken(type, literal) {
        const text = this.source.substring(this.start, this.current);
        if (!literal) {
            this.tokens.push(new Token_1.Token(type, text, null, this.line));
        }
        else {
            this.tokens.push(new Token_1.Token(type, text, literal, this.line));
        }
    }
    addString() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == '\n')
                this.line++;
            this.advance();
        }
        if (this.isAtEnd()) {
            Lox_1.default.error(this.line, 'Unterminated string');
            return;
        }
        this.advance();
        const val = this.source.substring(this.start + 1, this.current - 1);
        this.addToken(TokenType_1.TokenType.STRING, val);
    }
    addNumber() {
        while (this.isDigit(this.peek()))
            this.advance();
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance();
            while (this.isDigit(this.peek()))
                this.advance();
        }
        this.addToken(TokenType_1.TokenType.NUMBER, Number(this.source.substring(this.start, this.current)));
    }
    identifier() {
        while (this.isAlphaNumeric(this.peek()))
            this.advance();
        const text = this.source.substring(this.start, this.current);
        let keywordType = TokenType_1.KeywordsMap[text] || null;
        if (keywordType == null)
            keywordType = TokenType_1.TokenType.IDENTIFIER;
        this.addToken(keywordType);
    }
    isAlpha(c) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            c == '_';
    }
    isAlphaNumeric(c) {
        return this.isAlpha(c) || this.isDigit(c);
    }
    match(expected) {
        if (this.isAtEnd())
            return false;
        // the current actually points to one ahead
        if (this.source.charAt(this.current) != expected)
            return false;
        // if matches we first increment thus jumping over the lexem and then return true.
        this.current++;
        return true;
    }
    peek() {
        if (this.isAtEnd())
            return '\0';
        return this.source.charAt(this.current);
    }
    peekNext() {
        if (this.current + 1 >= this.source.length)
            return '\0';
        return this.source.charAt(this.current + 1);
    }
    isDigit(char) {
        return char >= '0' && char <= '9';
    }
    isAtEnd() {
        return this.current >= this.source.length;
    }
}
exports.Scanner = Scanner;
