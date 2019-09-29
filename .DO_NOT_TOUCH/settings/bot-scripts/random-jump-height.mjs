
this.setName('Random Jump Height Bot');

this.makeMove = function() {
  /*
    * Scene Width: 800
    * Scene Height: 480
    */
  this.jump(1+parseInt(Math.random()*10));
};
