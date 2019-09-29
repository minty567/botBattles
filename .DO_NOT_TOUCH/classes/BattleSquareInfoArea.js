/**
 * @author       Kris Gano <kris@pyxld.com>
 * @copyright    2019 Dev Launchers
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Phaser from "phaser";

export default class BattleSquareInfoArea {
  constructor(scene, battleSquare, x, y) {
    this.battleSquare = battleSquare;

    this.nameText = scene.add
      .text(x, y, battleSquare.name, {
        fontSize: "32px",
        fontFamily: '"Press Start 2P"',
        align: "center",
        padding: { x: 1, y: 1 },
        backgroundColor: "transparent",
        fill: "#000000",
        stroke: "#000000",
        strokeThickness: 0
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setResolution(3) // Makes text more crisp
      .setScale(0.5) // Makes text more crisp
      .setDepth(100);

    // Trigger a display update whenever important data is changed about battleSquare
    battleSquare.events.on("datachange", this.updateDisplay, this);
  }

  updateDisplay() {
    this.nameText.setText(this.battleSquare.name);
  }

  destroy() {
    // Remove this object's update listener from the scene
    this.battleSquare.events.off("datachange", this.updateDisplay, this);

    // Call this object's parent class destroy method
    super.destroy();
  }
}
