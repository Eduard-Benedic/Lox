"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
class ASTGenerator {
    constructor() {
        if (process.argv.length !== 3) {
            throw new Error('Make sure you pass the directory');
        }
        const dirname = process.argv[2];
        const baseName = 'Expr';
        const types = [
            'Binary: left@Expr, operator@Token, right@Expr',
            'Grouping: expression@Expr',
            'Literal: value@Object',
            'Unary: operator@Token, right@Expr'
        ];
        this.defineAST(dirname, baseName, types);
    }
    defineVisitor(baseName, types) {
        let visitor = '';
        visitor += ' interface Visitor<T> {' + '\n\t';
        types.map((type, index) => {
            const typeName = type.split(':')[0].trim();
            if (index === (types.length - 1)) {
                visitor += `visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}) : T\n`;
            }
            else {
                visitor += `visit${typeName}${baseName}(${baseName.toLowerCase()}: ${typeName}) : T\n\t`;
            }
        });
        return visitor + '}\n';
    }
    defineAST(dirname, baseName, types) {
        const EXTENSION = '.ts';
        const path = `${dirname}/${baseName}${EXTENSION}`;
        try {
            let content = 'import { Token } from \'./Token\'\n\n';
            content += this.defineVisitor(baseName, types);
            content += `interface Expr {\n\taccept<T>(visitor: Visitor<T>): T \n}\n\n`;
            content += types.map((typedef) => {
                const name = typedef.split(':')[0].trim();
                const fields = typedef.split(':')[1].trim();
                return this.defineClass(name, baseName, fields);
            }).join('');
            (0, fs_1.writeFileSync)(path, content, { flag: 'w+' });
        }
        catch (err) {
            console.log(err);
        }
    }
    defineClass(name, baseName, fields) {
        let classDef = `class ${name} implements ${baseName} {\n\t${this.classFields(fields)}\n\t${this.defineType(fields)}`;
        classDef += `\n\taccept<T>(visitor: Visitor<T>): T {\n\t\treturn visitor.visit${name}${baseName}(this)\n\t}`;
        classDef += '\n}\n\n';
        return classDef;
    }
    classFields(fields) {
        return fields.split(',').map(field => {
            return field.replace('@', ' : ').trim();
        }).join('\n\t');
    }
    defineFields(fields) {
        return fields.split(',').map((field, index) => {
            const isLast = index === (fields.split(',').length - 1);
            return `this.${(field.split('@')[0].trim())} = ${(field.split('@')[0].trim())}\n\t${isLast === true ? '' : '\t'}`;
        }).join('');
    }
    defineType(fields) {
        return `constructor (${fields.replace(/@/gi, ' : ')}) {\n\t\t${this.defineFields(fields)}}`;
    }
}
new ASTGenerator();
