
this.setName('Measured Long Jump\nAttack Bot');

this.makeMove = function() {
  /*
    * Scene Width: 800
    * Scene Height: 480
    */
  var opponent = this.opponent; // Easier access
  if (
    !this.isLeftOf(opponent) &&
    !this.isRightOf(opponent) &&
    opponent.y < this.y
  ) {
    // Opponent is directly above. Jump away!
    if (this.x < 400) this.jumpRight(6);
    else this.jumpLeft(6);
  }
  if (opponent.y < 350 && this.distanceFrom(opponent) < 400) {
    // If opponent is above us and we're in danger, jump out of the way
    this.jumpAwayFrom(opponent, 6);
  } else if (this.distanceFrom(opponent) < 200) {
    // too close to opponent, jump away
    this.jumpAwayFrom(opponent, 2);
  } else if (this.distanceFrom(opponent) < 450) {
    // If opponent is low to the ground, we're not in danger, and
    // we're close enough to strike. Jump toward
    this.jumpToward(opponent, 10);
  } else {
    // Too far. Do small hops toward
    this.jumpToward(opponent, 4);
  }
};
