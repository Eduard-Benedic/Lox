"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Binary {
    constructor(left, operator, right) {
        this.left = left;
        this.operator = operator;
        this.right = right;
    }
}
class Grouping {
    constructor(expression) {
        this.expression = expression;
    }
}
class Literal {
    constructor(value) {
        this.value = value;
    }
}
class Unary {
    constructor(operator, right) {
        this.operator = operator;
        this.right = right;
    }
}
