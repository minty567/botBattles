/**
 * @author       Kris Gano <kris@pyxld.com>
 * @copyright    2019 Dev Launchers
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Phaser from "phaser";

export default class FloatingMessage extends Phaser.GameObjects.Text {
  constructor(scene, x, y, text, style) {
    // Set our default style here, and allow the passed in style parameter to overwrite any of these
    style = style ? style : {};
    style.fontSize = style.fontSize ? style.fontSize : "32px";
    style.fontFamily = style.fontFamily ? style.fontFamily : '"Press Start 2P"';
    style.align = style.align ? style.align : "center";
    style.fill = style.fill ? style.fill : "#ffffff";
    style.padding = style.padding ? style.padding : { x: 1, y: 1 };
    style.backgroundColor = style.backgroundColor
      ? style.backgroundColor
      : "transparent";

    super(scene, x, y, text, style);

    this.updateCounter = 0;
    this.xVel = 4 - parseInt(Math.random() * 8);

    this.scene = scene;
    scene.add.existing(this);

    this.setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setResolution(3) // Makes text more crisp
      .setScale(0.5) // Makes text more crisp
      .setDepth(100);

    // Make sure the scene calls this object's update function every frame
    this.updateListener = scene.events.on("update", this.update, this);
  }

  update() {
    this.updateCounter++;

    this.y -= 1;
    //if (this.updateCounter % 5 == 0)
    //  this.x += 1 - parseInt(Math.random() * 3) + this.xVel;

    this.setAlpha(1 - this.updateCounter / 100);

    if (this.updateCounter > 100) {
      this.destroy();
    }
  }

  destroy() {
    // Remove this object's update listener from the scene
    this.scene.events.off("update", this.update, this);

    // Call this object's parent class destroy method
    super.destroy();
  }
}
