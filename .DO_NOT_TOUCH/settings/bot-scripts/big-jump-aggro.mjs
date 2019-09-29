
this.setName('Big Jump Aggro Bot');

this.makeMove = function() {
  /*
    * Scene Width: 800
    * Scene Height: 480
    */
  var opponent = this.opponent; // Easier access
  if (opponent.y < 200)
  {
    if (this.x < 400){
      this.jumpRight(10);
    } 
    else {
      this.jumpLeft(10);
    }
  }
  else {
    this.jumpToward(opponent, 10);
  }
};