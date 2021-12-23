# Representing code

Lexical grammar
  * rules used to get **raw source code** and convert to a new representation (like a list of tokens)

Syntactic grammar
  * rules to get the result produced by the lexical grammar (through my scanner class) and convert it into an enhanced representation
  * each rule is called a production (it produces a string). A rule has:
    * head
    * body - list of symbols. A body can be
      * terminal (end point)
      * non-terminal - points to another production

Convention of writing these rules

person      -> name "is" age "years old"
name      -> firstName lastName
firstName -> "John"
firstName -> "Jane"
lastName -> "Doe"
age     -> 120

Ehnancements
  * '-' to separate terminals or rules
  * '*' to repeat 0 or more times
  * '+' to repeat 1 or more times
  * '?' to repeat 0 or 1 times

E.g
person    -> name "is" age "years old"
name      -> firstName+ lastName
firstName -> "John" | "Jane" | "San" | "Ja"
lastName  -> "Doe"
age       -> 120

The production (string) is -> "John" "is" 120 "years old"

## A grammar for Lox expressions

Segment of the syntax grammar.

* Literals - Number, Strings, Booleans and nil
* Unary expressions - Like ! (not) and - (minus)
* Binary expressions - Such as - (arithmethic minus), + (plus), *, / etc.
* Parentheses - pair of ( ) wrapper arround an expressions

Grammar

expression      -> literal | unary | binary | grouping;
literal         -> NUMBER | STRING | "true" | "false" | "nil";
grouping        -> "(" expression ")";
unary           -> ( "!" | "-" ) expression;
binary          -> expression operator expression;
operator        ->  "==" | "!=" | "<" | "<=" | ">" | ">=" | "+"  | "-"  | "*" | "/" ;

A lexeme whose textual representation can vary is written as uppercase.

