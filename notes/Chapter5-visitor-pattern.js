"use strict";
class Pastry {
}
class Ecler extends Pastry {
    accept(visitor) {
        visitor.visitEcler(this);
    }
}
class Cruller extends Pastry {
    accept(visitor) {
        visitor.visitCruller(this);
    }
}
