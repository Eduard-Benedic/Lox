abstract class Pastry {
  abstract accept(visitor: PastryVisitor): void
}

class Ecler extends Pastry {
  accept(visitor: PastryVisitor) {
    visitor.visitEcler(this)
  }
}
class Cruller extends Pastry {
  accept(visitor: PastryVisitor) {
    visitor.visitCruller(this)
  }
}

interface PastryVisitor {
  visitEcler(ecler: Ecler): void
  visitCruller(cruller: Cruller): void
}

