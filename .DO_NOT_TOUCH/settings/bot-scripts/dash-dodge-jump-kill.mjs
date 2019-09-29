// Difficulty rating: 7.5

this.setName('The Kris Special');

this.makeMove = function() {
  /*
    * Scene Width: 800
    * Scene Height: 480
    */
  var myBot = this;
  var opponent = this.opponent; // Easier access
  if (opponent.y < 250 && this.distanceFrom(opponent) < 400) {
    // If opponent is above us and we're in danger, jump out of the way
    if (this.distanceFrom(opponent) < 300 && (opponent.isMovingToward(this) || opponent.isMovingDown() || !opponent.isActive())) {
      if (this.x < 200)
        this.dashRight(6);
      else if (this.x > 600)
        this.dashLeft(6);
      else
        this.dashAwayFrom(opponent, 6);
    }
    else {
      this.jumpAwayFrom(opponent, 2);
    }
  } else if (this.distanceFrom(opponent) < 200) {
    // too close to opponent, dash away a bit
    this.dashAwayFrom(opponent, 4);
  } else if (this.distanceFrom(opponent) < 350) {
    // If opponent is low to the ground, we're not in danger, and
    // we're close enough to strike. Jump toward
    this.jumpToward(opponent, 10);
  } else {
    // Too far. Do small dashes toward
    this.dashToward(opponent, 4);
  }
};