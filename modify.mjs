/**** WELCOME! *********************************************/
/**
 * Program your Bot to defeat a series of opponents! 
 * 
 * Game Summary:
 *  - Every .5 seconds, each Bot is able to make a
 * movement if they are touching the ground. Each movement expends 
 * a certain amount of energy when made, defined by the code running
 * the Bot. Higher energy used == bigger movement. A movement is either 
 * a jump or a dash. Bots gain a point when they jump on top of another
 * Bot or when their opponent Bot runs out of energy. For each round, 
 * the first Bot to 3 points wins!
 * 
 * Use the "Activity Documentation" button to read more about 
 * all the different ways you can control your bot
 * 
 * ----------------------------------------------------------
 * After making a change: save this file, then press the refresh
 * button above the game window!
 * ----------------------------------------------------------
 */

var myBot = this; // More readable/easier access
var opponent = this.opponent; // More readable/easier access


/**************** Start Modifying Here! *********************/

myBot.setName('My Bot');
myBot.setColor(0x00ffff);
myBot.makeMove = function() {
  /*
    * Scene Width: 800
    * Scene Height: 480
    */
  if(opponent.isAlive() === false && myBot.distanceFrom(opponent) <300) {
    // If opponent is dead, then dash left
    myBot.dashLeft(5);
    return;
  }

  if (myBot.getY(opponent)=== 200){
    // If myBot is above opponent, then dash right
    myBot.dashRight(5);
  }
  else if (opponent.getX()< 200 && opponent.getY()< 200) {
    myBot.dashToward(opponent,10)
    }
  else if (myBot.xDistanceFrom(opponent) < 200) {
    // If myBot is 200x from opponent, then dash left
    myBot.dashAway(opponent,5)
  }
  else if (opponent.getY()< 250 && myBot.distanceFrom(opponent) < 300) {
   // If opponent is above myBot and myBot is 200 away, then jump away from opponent
    myBot.jumpAway(opponent,7);
  }
  
  else if (myBot.distanceFrom(opponent) > 250) {
    // If myBot is 200 from opponent, then jump toward opponent
    myBot.jumpToward(opponent, 10);
  }
  else{
    myBot.dashAwayFrom(opponent, 5);
  }
};

// On level 4 my character won't stop backing up when the opponent advances


/**** GOODBYE! ************************************************/
