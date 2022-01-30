"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unary = exports.Literal = exports.Grouping = exports.Binary = void 0;
class Binary {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitBinaryExpr(this);
    }
}
exports.Binary = Binary;
class Grouping {
    constructor(expression) {
        this.expression = expression;
    }
    accept(visitor) {
        return visitor.visitGroupingExpr(this);
    }
}
exports.Grouping = Grouping;
class Literal {
    constructor(value) {
        this.value = value;
    }
    accept(visitor) {
        return visitor.visitLiteralExpr(this);
    }
}
exports.Literal = Literal;
class Unary {
    constructor(operator, right) {
        this.operator = operator;
        this.right = right;
    }
    accept(visitor) {
        return visitor.visitUnaryExpr(this);
    }
}
exports.Unary = Unary;
