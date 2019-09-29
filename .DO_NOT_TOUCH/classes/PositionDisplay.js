/**
 * @author       Kris Gano <kris@pyxld.com>
 * @copyright    2019 Dev Launchers
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Phaser from "phaser";
var Color = Phaser.Display.Color;

export default class PositionDisplay {
  constructor(scene, trackedObject) {
    this.scene = scene;

    this.trackedObject = trackedObject;

    this.xText = scene.add
      .text(trackedObject.x, 15, trackedObject.x, {
        fontSize: "32px",
        fontFamily: '"Press Start 2P"',
        align: "center",
        padding: { x: 1, y: 1 },
        backgroundColor: "transparent",
        fill: Color.IntegerToColor(trackedObject.color).rgba,
        stroke: "#000000",
        strokeThickness: 0
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setResolution(3) // Makes text more crisp
      .setScale(0.5) // Makes text more crisp
      .setDepth(100)
      .setAlpha(0.25);

    this.yText = scene.add
      .text(45, trackedObject.y, trackedObject.y, {
        fontSize: "32px",
        fontFamily: '"Press Start 2P"',
        align: "center",
        padding: { x: 1, y: 1 },
        backgroundColor: "transparent",
        fill: Color.IntegerToColor(trackedObject.color).rgba,
        stroke: "#000000",
        strokeThickness: 0
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setResolution(3) // Makes text more crisp
      .setScale(0.5) // Makes text more crisp
      .setDepth(100)
      .setAlpha(0.25);

    // Make sure the scene calls this object's update function every frame
    this.updateListener = scene.events.on("update", this.update, this);
  }

  setTint(tint) {
    this.xText.setFill(Color.IntegerToColor(tint).rgba);
    this.yText.setFill(Color.IntegerToColor(tint).rgba);
  }

  update(time, delta) {
    this.xText.x = this.trackedObject.x;
    this.yText.y = this.trackedObject.y;

    this.xText.setText("|\nx:" + parseInt(this.trackedObject.x));
    this.yText.setText("-y:" + parseInt(this.trackedObject.y));
  }
}
