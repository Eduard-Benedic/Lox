import { writeFileSync } from "fs"

class ASTGenerator {
  constructor() {
    if (process.argv.length !== 3) {
      throw new Error('Make sure you pass the directory')
    }
    this.defineAST(process.argv[2], 'Expr', [
      'Binary: left@Expr, operator@Token, right@Expr',
      'Grouping: expression@Expr',
      'Literal: value@Object',
      'Unary: operator@Token, right@Expr'
    ])
  }

  private defineAST(dirname: string, baseName: string, types: string[]) {
    const EXTENSION = '.ts'
    const path: string = `${dirname}/${baseName}${EXTENSION}`

    try {
      let content = 'import { Token } from \'./Token\'\n\n'
      content += `interface Expr { }\n\n`
      content += types.map((typedef: string) => {
        const name = typedef.split(':')[0].trim()
        const fields = typedef.split(':')[1].trim()
        return `class ${name} {\n\t${this.classFields(fields)}\n\t${this.defineType(fields)}\n}\n\n`
      }).join('')
      writeFileSync(path, content, { flag: 'w+' })
    } catch(err) {
      console.log(err)
    }
  }

  classFields(fields: string) {
    return fields.split(',').map(field => {
      return field.replace('@', ' : ').trim()
    }).join('\n\t')
  }

  defineFields(fields: string) {
    return fields.split(',').map((field: string, index: number) => {
      if (index === (fields.split(',').length - 1)) {
        return `this.${(field.split('@')[0].trim())} = ${(field.split('@')[0].trim())}\n\t`
      }
      return `this.${(field.split('@')[0].trim())} = ${(field.split('@')[0].trim())}\n\t\t`
    }).join('')
  }

  private defineType(fields: string) {
    return `constructor (${fields.replace(/@/gi, ' : ')}) {\n\t\t${this.defineFields(fields)}}`
  }
}

new ASTGenerator()
