
expression     → literal
               | unary
               | binary
               | grouping

literal        → NUMBER | STRING | "true" | "false" | "nil"
grouping       → "(" expression ")"
unary          → ( "-" | "!" ) expression
binary         → expression operator expression
operator       → "==" | "!=" | "<" | "<=" | ">" | ">="
               | "+"  | "-"  | "*" | "/"

6 / 3 - 1

The line above can generate different syntax trees based on what operators you wish to follow in what order.

To avoid ambiguity people introduced **precedence** and **associativity**

* Precedence - decides what operator to use first in a series of different operators. E.g 3 + 5 / 5. 5 /5 will be executed first because of the precedence rule
* Associativity - if multiple operators of the same type are in sequence, associativity determins the direction.
Left-associative - operators on the left evaluate before those on the right. Addition is left-asscotiative but assignment is right associative.

3 == 5 == 21

## Lox rules with precedence and associativity

expression            -> equality

equality              -> comparison( ( "!=" | "==" ) comparison )*

comparison            -> term ( ( ">" | ">=" | "<" | "<=" ) term )*

term                  -> factor ( ( "-" | "+" ) factor )*

factor                -> unary ( ( "/" | "*" ) unary )*

unary                 -> ("!" | "-") unary | primary

primary               -> NUMBER | STRING | "true" | "false" | "nil" | "(" expression ")"