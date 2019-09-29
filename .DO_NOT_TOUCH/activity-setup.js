import Phaser from "phaser";
import DevLaunchers from "./classes/dev-launchers";
import BattleSquare from "./classes/BattleSquare.js";
import StageManager from "./classes/StageManager";

// Load specific game stuff here that will be used in
// this file, or in 'modify.mjs'

/* Lift classes to global scope */
(function() {
  // We have to lift classes we need access to into the
  //   global scope (stupid module scoping issue)
  // This is done so students can code in a clean script file (without
  //    having to use imports/exports, etc.)
  //
  // ie. window.Animal = Animal;
})();

export function setupActivity(scene) {
  /* Any pre setup code (additional from the game code) or
   * scene injection code needed to run this activity
   * should be executed here */

  let stageManager = new StageManager(scene);

  let player1 = stageManager.addBot(50, 50);
  player1.setTint(0x00ff00);
  let player2 = stageManager.addBot(750, 50);
  player2.setTint(0x666666);

  player1.setOpponent(player2);
  player2.setOpponent(player1);

  // And now load the code students will be modifying
  loadModifyCode(player1);

  stageManager.init();
}

/***************************/
/* HELPER FUNCTIONS FOLLOW */
/***************************/

/*
 * evalWithinContext()
 * Allows a string of javascript code to be executed within the given scope/context
 * Used after fetching student code in order to run it within the current Phaser scene
 *     (Keeps student coding interface clean)
 */
var evalWithinContext = function(context, code) {
  (function(code) {
    eval(code);
  }.apply(context, [code]));
};

/*
 * loadModifyCode()
 * Loads the 'modify.mjs' file students will be making changes in, and executes it in the
 * current module's scope. We're using this method instead of import to maintain scene scope
 * and keep import/export out of the modify.js script. This makes it more simple for the
 * students to work with.
 */
// Let's load the modify.js script and run it in this scope!
// using this method instead of import to maintain scene scope and keep import/export
//    out of the modify.js script. More simple for students to work with
function loadModifyCode(scene) {
  loadScriptWithinContext("../modify.mjs", scene);
}
function loadScriptWithinContext(path, context) {
  /* eslint-disable */
  let codeText = fetch(path)
    .then(function(response) {
      return response.text();
    })
    .then(function(textString) {
      evalWithinContext(context, textString);
    });
  /* eslint-enable */
}
