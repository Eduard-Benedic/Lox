"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class ASTGenerator {
    constructor() {
        if (process.argv.length !== 3) {
            throw new Error('Make sure you pass the directory');
        }
        this.defineAST(process.argv[2], 'Expr', [
            'Binary: left@Expr, operator@Token, right@Expr',
            'Grouping: expression@Expr',
            'Literal: value@Object',
            'Unary: operator@Token, right@Expr'
        ]);
    }
    defineAST(dirname, baseName, types) {
        const EXTENSION = '.ts';
        const path = `${dirname}/${baseName}${EXTENSION}`;
        try {
            let content = 'import { Token } from \'./Token\'\n';
            content += `interface Expr {
  this.left : any
  this.operator : Token
  this.right : any
}\n\n`;
            content += types.map((typedef) => {
                const name = typedef.split(':')[0].trim();
                const fields = this.defineType(typedef.split(':')[1].trim());
                return `class ${name} {\n\t${fields}\n}\n\n`;
            }).join('');
            (0, fs_1.writeFileSync)(path, content, { flag: 'w+' });
        }
        catch (err) {
            console.log(err);
        }
    }
    defineType(fields) {
        const fieldsDef = fields.split(',').map((field, index) => {
            if (index === (fields.split(',').length - 1)) {
                return `this.${field.split('@')[0]} : ${field.split('@')[1]} = this.${field.split('@')[0]}\n\t`;
            }
            return `this.${field.split('@')[0]} : ${field.split('@')[1]} = this.${field.split('@')[0]}\n\t\t`;
        }).join('');
        return `constructor (${fields.replace(/@/gi, ' : ')}) {\n\t\t${fieldsDef}}`;
    }
}
new ASTGenerator();
