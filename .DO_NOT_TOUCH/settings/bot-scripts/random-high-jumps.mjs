
this.setName('Random High Jumps Bot');

this.makeMove = function() {
  /*
    * Scene Width: 800
    * Scene Height: 480
    */
  let energyToUse = 6 + parseInt(Math.random() * 5);
  let rand = Math.random();
  if (rand < 0.33) this.jumpRight(energyToUse);
  else if (rand < 0.66) this.jumpLeft(energyToUse);
  else this.jump(energyToUse);
};
