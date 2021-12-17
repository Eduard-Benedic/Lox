# Lox language overview

## Automatic memory management

There are 2 main techniques:
1. Reference counting
2. Tracing Garbage Collection (garbage collection or GC)

Lox uses Tracing Garbace Collection

## Data Types

Lox implements the following data types:
* Booleans
represented as *true* and *false*
* Numbers
Lox only has one type of numbers: double precision floating point.
* Nil

## Expressions

### Arithemetic expressions

add + me;
subtract - me;
multiply * me;
divide / me;

**Operands** - add, me... The subexpressions on either side of the operator.
Because there are two operands we call these operators **binary**
Because the operator is in the middle its called **infix**

Some operators have 3 operands and are called *conditional* or *ternary*.

### Comparison and Equality

less < than;
lessThan <= orEqual;
greater > than;
greaterThan >= orEqual;

### Logical operators

The not operator - !true - false; !false - true

!true;  // false.
!false; // true.
true and false; // false.
true and true;  // true.