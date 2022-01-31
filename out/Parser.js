"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const TokenType_1 = require("./TokenType");
const Expr_1 = require("./Expr");
const Lox_1 = __importDefault(require("./Lox"));
class Parser {
    constructor(tokens) {
        this.current = 0;
        this.tokens = tokens;
    }
    static error(token, message) {
        Lox_1.default.error(token, message);
        throw new Error(message);
    }
    parse() {
        try {
            return this.expression();
        }
        catch (e) {
            return null;
        }
    }
    expression() {
        return this.equality();
    }
    /** equality → comparison ( ( "!=" | "==" ) comparison )* s;s */
    equality() {
        let expr = this.comparison();
        while (this.match(TokenType_1.TokenType.BANG_EQUAL, TokenType_1.TokenType.EQUAL_EQUAL)) {
            const operator = this.previous();
            const right = this.comparison();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /** comparison → term ( ( ">" | ">=" | "<" | "<=" ) term )* ; */
    comparison() {
        let expr = this.term();
        while (this.match(TokenType_1.TokenType.GREATER, TokenType_1.TokenType.GREATER_EQUAL, TokenType_1.TokenType.LESS, TokenType_1.TokenType.LESS_EQUAL)) {
            const operator = this.previous();
            const right = this.term();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /** term -> factor ( ( "-" | "+" ) factor )*; */
    term() {
        let expr = this.factor();
        while (this.match(TokenType_1.TokenType.MINUS, TokenType_1.TokenType.PLUS)) {
            const operator = this.previous();
            const right = this.factor();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /** factor -> unary ( ( "/" | "*" ) unary )*; */
    factor() {
        let expr = this.unary();
        while (this.match(TokenType_1.TokenType.SLASH, TokenType_1.TokenType.STAR)) {
            const operator = this.previous();
            const right = this.unary();
            expr = new Expr_1.Binary(expr, operator, right);
        }
        return expr;
    }
    /** unary -> ("!" | "-") unary | primary */
    unary() {
        if (this.match(TokenType_1.TokenType.BANG, TokenType_1.TokenType.MINUS)) {
            const operator = this.previous();
            const right = this.unary();
            return new Expr_1.Unary(operator, right);
        }
        return this.primary();
    }
    primary() {
        if (this.match(TokenType_1.TokenType.FALSE))
            return new Expr_1.Literal(false);
        if (this.match(TokenType_1.TokenType.TRUE))
            return new Expr_1.Literal(true);
        if (this.match(TokenType_1.TokenType.NIL))
            return new Expr_1.Literal(null);
        if (this.match(TokenType_1.TokenType.NUMBER, TokenType_1.TokenType.STRING)) {
            return new Expr_1.Literal(this.previous().literal);
        }
        if (this.match(TokenType_1.TokenType.LEFT_PAREN)) {
            const expr = this.expression();
            this.consume(TokenType_1.TokenType.RIGHT_PAREN, "Expect ')' after expression");
            return new Expr_1.Grouping(expr);
        }
        throw Parser.error(this.peek(), 'Expect expression...');
    }
    match(...types) {
        for (const tokenType of types) {
            if (this.check(tokenType)) {
                this.advance();
                return true;
            }
        }
        return false;
    }
    /** consumes the current Token and returns it */
    advance() {
        if (!this.isAtEnd())
            this.current++;
        return this.previous();
    }
    /** simply checks the current token, never consumes it */
    check(tokenType) {
        if (this.isAtEnd())
            return false;
        return this.peek().type == tokenType;
    }
    isAtEnd() {
        return this.peek().type === TokenType_1.TokenType.EOF;
    }
    peek() {
        return this.tokens[this.current];
    }
    previous() {
        return this.tokens[this.current - 1];
    }
    consume(tokenType, message) {
        if (this.check(tokenType))
            return this.advance();
        Parser.error(this.peek(), message);
    }
}
exports.Parser = Parser;
