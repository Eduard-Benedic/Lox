# Scanning

Raw source code -> series of chunks called *tokens*

## Lexems
A Scanner takes in raw source code and chunks relevant characters together.
E.g. var a = 30; var-lexeme, a - lexeme...

Each blog of characters = lexeme.

A lexeme is only the raw substring of the source code.

Lexeme + other useful information = Token

## Token

A token is an object that contains additional information on top of the lexeme.
It has:
* type - enum value
* lexeme - the substring associated with this token
* literal - the runtime value
* line - the line in the source code where it was identified

**Lexical grammar** - rules that determine how groups of characters are grouped together. E.g != means not equal because of the lexical grammar.

**Reserved word** - Identifier reserved by the lexical grammar (or, class etc)