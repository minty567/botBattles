/**
 * @author       Kris Gano <kris@pyxld.com>
 * @copyright    2019 Dev Launchers
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import Phaser from "phaser";
//import Color from "phaser/display/color";
import FloatingMessage from "./FloatingMessage.js";
import PositionDisplay from "./PositionDisplay.js";

var Color = Phaser.Display.Color;
var EventEmitter = Phaser.Events.EventEmitter;

export default class BattleSquare extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, config) {
    super(scene, x, y, scene.generateSquareSprite(100), 0);
    this.scene = scene;

    this.name = "Default";

    this.initialX = x;
    this.initialY = y;
    this._energy = 99;
    this._score = 0;
    this._updateCounter = 0;

    this.events = new EventEmitter();

    this.positionDisplay = new PositionDisplay(scene, this);

    this._energyText = scene.add
      .text(x, y, this._energy, {
        fontSize: "32px",
        fontFamily: '"Press Start 2P"',
        align: "center",
        padding: { x: 1, y: 1 },
        backgroundColor: "transparent",
        fill: "#000000",
        stroke: "#ffffff",
        strokeThickness: 12
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setResolution(3) // Makes text more crisp
      .setScale(0.5) // Makes text more crisp
      .setDepth(100);

    scene.add.existing(this);
    scene.physics.add
      .existing(this)
      .setDrag(150, 100)
      .setMaxVelocity(600, 600)
      .setCollideWorldBounds(true)
      //.setInteractive()
      .setOrigin(0.5, 0.5); // fixes interactive offset issue
    scene.physics.add.collider(this, scene.ground);

    this._particleTrail = scene.add
      .particles(scene.generateSquareSprite(100))
      .createEmitter({
        alpha: { end: 0, start: 0.1 },
        angle: 0,
        //blendMode: 'MULTIPLY',
        emitZone: {
          source: new Phaser.Geom.Rectangle(0, 0, 1, 1)
        },
        frequency: 5,
        lifespan: 200,
        quantity: 1,
        scale: 1,
        tint: 0xffffff,
        gravityX: 0,
        gravityY: 0
      });

    this._scoreText = scene.add
      .text(x, y, this._score, {
        fontSize: "64px",
        fontFamily: '"Press Start 2P"',
        align: "center",
        padding: { x: 1, y: 1 },
        backgroundColor: "transparent",
        fill: "#ffffff",
        stroke: "#000000",
        strokeThickness: 16
      })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setResolution(3) // Makes text more crisp
      .setScale(0.5) // Makes text more crisp
      .setDepth(100);

    // Make sure the scene calls this object's update function every frame
    this.updateListener = scene.events.on("update", (time, delta) => {
      this.update(time, delta);
    });
  }

  /*
   *
   * <Getters> */

  /**
   * Gets the x component of this BattleSquare's position attribute
   *
   * @method BattleSquare#getX
   * @since 0.0.1
   *
   * @return {float} The x component of this BattleSquare's position attribute
   */
  getX() {
    return this.x;
  }

  /**
   * Gets the x component of this BattleSquare's position attribute
   *
   * @method BattleSquare#getX
   * @since 0.0.1
   *
   * @return {float} The x component of this BattleSquare's position attribute
   */
  getY() {
    return this.y;
  }

  /**
   * Returns the position of this BattleSquare with format {x:xPos, y:yPos}
   *
   * @method BattleSquare#getPosition
   * @since 0.0.1
   *
   * @return {Object} The position of this BattleSquare with format {x:xPos, y:yPos}
   */
  getPosition() {
    return {
      x: this.x,
      y: this.y
    };
  }

  /**
   * Gets the x component of this BattleSquare's velocity attribute
   *
   * @method BattleSquare#getVelocityX
   * @since 0.0.1
   *
   * @return {float} The x component of this BattleSquare's velocity attribute
   */
  getVelocityX() {
    return this.body.velocity.x;
  }

  /**
   * Gets the y component of this BattleSquare's velocity attribute
   *
   * @method BattleSquare#getVelocityY
   * @since 0.0.1
   *
   * @return {float} The y component of this BattleSquare's velocity attribute
   */
  getVelocityY() {
    return this.body.velocity.y;
  }

  /**
   * Returns the position of this BattleSquare with format {x:xVel, y:yVel}
   *
   * @method BattleSquare#getVelocity
   * @since 0.0.1
   *
   * @return {Object} The velocity of this BattleSquare with format {x:xVel, y:yVel}
   */
  getVelocity() {
    return {
      x: this.body.velocity.x,
      y: this.body.velocity.y
    };
  }

  /**
   * Returns a boolean value representing whether or not this BattleSquare is currently active
   *
   * @method BattleSquare#isActive
   * @since 0.0.1
   *
   * @return {boolean} A boolean value representing whether or not this BattleSquare is currently active
   */
  isActive() {
    return this.active;
  }

  /**
   * Returns a boolean value representing whether or not this BattleSquare is currently alive
   *
   * @method BattleSquare#isAlive
   * @since 0.0.1
   *
   * @return {boolean} A boolean value representing whether or not this BattleSquare is currently alive
   */
  isAlive() {
    return this.active;
  }

  /**
   * Returns the score (number of points) of this BattleSquare for this round
   *
   * @method BattleSquare#getScore
   * @since 0.0.1
   *
   * @return {integer} A positive integer denoting how many times this BattleSquare has scored during this round
   */
  getScore() {
    return this._score;
  }

  /**
   * Returns the x distance between this BattleSquare and otherBattleSquare
   *
   * @method BattleSquare#xDistanceFrom
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {float} The x distance between this BattleSquare and otherBattleSquare
   */
  xDistanceFrom(otherBattleSquare) {
    return Math.abs(this.x - otherBattleSquare.x);
  }

  /**
   * Returns the y distance between this BattleSquare and otherBattleSquare
   *
   * @method BattleSquare#yDistanceFrom
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {float} The y distance between this BattleSquare and otherBattleSquare
   */
  yDistanceFrom(otherBattleSquare) {
    return Math.abs(this.y - otherBattleSquare.y);
  }

  /**
   * Returns the distance between this BattleSquare and otherBattleSquare
   *
   * @method BattleSquare#distanceFrom
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {float} The distance between this BattleSquare and otherBattleSquare
   */
  distanceFrom(otherBattleSquare) {
    return Math.hypot(
      this.x - otherBattleSquare.x,
      this.y - otherBattleSquare.y
    );
  }

  /**
   * Returns a boolean denoting whether or not otherBattleSquare is positioned to the left of this BattleSquare
   *
   * @method BattleSquare#isLeftOf
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {boolean} A boolean denoting whether or not otherBattleSquare is positioned to the left of this BattleSquare
   */
  isLeftOf(otherBattleSquare) {
    return parseInt(this.x) < parseInt(otherBattleSquare.x);
  }

  /**
   * Returns a boolean denoting whether or not otherBattleSquare is positioned to the right of this BattleSquare
   *
   * @method BattleSquare#isRightOf
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {boolean} A boolean denoting whether or not otherBattleSquare is positioned to the right of this BattleSquare
   */
  isRightOf(otherBattleSquare) {
    return parseInt(this.x) > parseInt(otherBattleSquare.x);
  }

  /**
   * Returns a boolean denoting whether or not otherBattleSquare is positioned above this BattleSquare
   *
   * @method BattleSquare#isRightOf
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {boolean} A boolean denoting whether or not otherBattleSquare is positioned above this BattleSquare
   */
  isAbove(otherBattleSquare) {
    return parseInt(this.y) < parseInt(otherBattleSquare.y);
  }

  /**
   * Returns a boolean denoting whether or not otherBattleSquare is positioned below this BattleSquare
   *
   * @method BattleSquare#isRightOf
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {boolean} A boolean denoting whether or not otherBattleSquare is positioned below this BattleSquare
   */
  isBelow(otherBattleSquare) {
    return parseInt(this.y) > parseInt(otherBattleSquare.y);
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is moving toward otherBattleSquare
   *
   * @method BattleSquare#isMovingToward
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is moving toward otherBattleSquare
   */
  isMovingToward(otherBattleSquare) {
    if (
      (this.x < otherBattleSquare.x && this.isMovingRight()) ||
      (this.x > otherBattleSquare.x && this.isMovingLeft())
    )
      return true;
    return false;
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is moving away from otherBattleSquare
   *
   * @method BattleSquare#isMovingAwayFrom
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is moving away from otherBattleSquare
   */
  isMovingAwayFrom(otherBattleSquare) {
    if (
      (this.x < otherBattleSquare.x && this.isMovingLeft()) ||
      (this.x > otherBattleSquare.x && this.isMovingRight())
    )
      return true;
    return false;
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is moving away from otherBattleSquare
   *
   * @method BattleSquare#isMovingAway
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - Another BattleSquare object
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is moving away from otherBattleSquare
   */
  isMovingAway(otherBattleSquare) {
    return this.isMovingAwayFrom(otherBattleSquare);
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is moving left
   *
   * @method BattleSquare#isMovingLeft
   * @since 0.0.1
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is moving left
   */
  isMovingLeft() {
    return this.body.velocity.x < 0 ? true : false;
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is moving right
   *
   * @method BattleSquare#isMovingRight
   * @since 0.0.1
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is moving right
   */
  isMovingRight() {
    return this.body.velocity.x > 0 ? true : false;
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is moving up
   *
   * @method BattleSquare#isMovingUp
   * @since 0.0.1
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is moving up
   */
  isMovingUp() {
    return this.body.velocity.y < 0 ? true : false;
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is moving down
   *
   * @method BattleSquare#isMovingDown
   * @since 0.0.1
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is moving down
   */
  isMovingDown() {
    return this.body.velocity.y > 0 ? true : false;
  }

  /**
   * Returns a boolean denoting whether or not this BattleSquare is stationary (not moving at all)
   *
   * @method BattleSquare#isStationary
   * @since 0.0.1
   *
   * @return {boolean} A boolean denoting whether or not this BattleSquare is stationary (not moving at all)
   */
  isStationary() {
    if (this.body.velocity.x == 0 && this.body.velocity.y == 0) {
      return true;
    }
    return false;
  }

  /* </Getters>
   *
   */
  /*
   *
   * <Utility Functions> */

  /* NOTE: this function is a default, but is intended to be overwritten */
  makeMove() {
    let energyToUse = 3 + parseInt(Math.random() * 5);
    let rand = Math.random();
    if (rand < 0.33) this.jumpRight(energyToUse);
    else if (rand < 0.66) this.jumpLeft(energyToUse);
    else this.jump(energyToUse);

    return this;
  }

  /**
   * Sets this BattleSquare's opponent BattleSquare to the supplied BattleSquare instance
   *
   * @method BattleSquare#setOpponent
   * @since 0.0.1
   *
   * @param {BattleSquare} opponent - The battle square to set this battle square's opponent to
   *
   * @return {BattleSquare} This BattleSquare object
   */
  setOpponent(opponent) {
    this.opponent = opponent;
    this.enemy = opponent;

    this.scene.physics.add.collider(this, this.opponent, () => {
      let opponent = this.opponent;
      if (!this.active || !opponent.active) return;
      if (
        opponent.y <= this.y - this.height / 2 - 1 &&
        Math.abs(opponent.x - this.x) < this.width / 1.1
      ) {
        //this.destroy();
        this.die();
      } else if (
        this.y <= opponent.y - opponent.height / 2 - 1 &&
        Math.abs(this.x - opponent.x) < opponent.width / 1.1
      ) {
        //opponent.destroy();
        opponent.die();
      }
    });

    return this;
  }

  /**
   * Sets this BattleSquare's name, which is displayed during gameplay
   *
   * @method BattleSquare#setName
   * @since 0.0.1
   *
   * @param {string} name - The name to set for this battle square
   *
   * @return {BattleSquare} This BattleSquare object
   */
  setName(name) {
    this.name = name;
    this.events.emit("datachange");
  }

  update(time, delta) {
    this._updateCounter++;

    if (this._updateCounter % 30 === 0) {
      //if (this.body.onFloor()) {
      if (this.body.onFloor() || this.body.touching.down) {
        this.makeMove();

        this._energyText.setText(this._energy);

        if (this._energy <= 0) this.die();
      }
    }

    this._energyText.x = this.x;
    this._energyText.y = this.y;
    this._particleTrail.setPosition(this.x, this.y);

    return this;
  }

  _removeEnergy(amount) {
    this._setEnergy(this._energy - amount);

    return this;
  }
  _setEnergy(energy) {
    this._energy = energy;
    this._energyText.setText(this._energy);

    return this;
  }

  /**
   * Causes this BattleSquare to jump straight upwards
   *
   * @method BattleSquare#jump
   * @since 0.0.1
   *
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  jump(energyToUse) {
    if (!energyToUse) energyToUse = 1;
    if (energyToUse > 10) energyToUse = 10;
    this.setVelocity(0, -1 * (25 + 25 * energyToUse) * 2);
    this._removeEnergy(energyToUse);
    this.floatMessage("jump(" + energyToUse + ");");

    return this;
  }

  /**
   * Causes this BattleSquare to jump up and to the left
   *
   * @method BattleSquare#jumpLeft
   * @since 0.0.1
   *
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  jumpLeft(energyToUse) {
    if (!energyToUse) energyToUse = 1;
    if (energyToUse > 10) energyToUse = 10;
    this.setVelocity(
      -1 * (15 + 15 * energyToUse) * 2,
      -1 * (20 + 20 * energyToUse) * 2
    );
    this._removeEnergy(energyToUse);
    this.floatMessage("jumpLeft(" + energyToUse + ");");

    return this;
  }

  /**
   * Causes this BattleSquare to jump up and to the right
   *
   * @method BattleSquare#jumpRight
   * @since 0.0.1
   *
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  jumpRight(energyToUse) {
    if (!energyToUse) energyToUse = 1;
    if (energyToUse > 10) energyToUse = 10;
    this.setVelocity(
      15 + 15 * energyToUse * 2,
      -1 * (20 + 20 * energyToUse) * 2
    );
    this._removeEnergy(energyToUse);
    this.floatMessage("jumpRight(" + energyToUse + ");");

    return this;
  }

  /**
   * Causes this BattleSquare to jump toward otherBattleSquare
   *
   * @method BattleSquare#jumpRight
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - The BattleSquare to jump toward
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  jumpToward(otherBattleSquare, energyToUse) {
    if (this.isLeftOf(otherBattleSquare)) this.jumpRight(energyToUse);
    else if (this.isRightOf(otherBattleSquare)) this.jumpLeft(energyToUse);
    else this.jump(energyToUse);

    return this;
  }

  /**
   * Causes this BattleSquare to jump away from otherBattleSquare
   *
   * @method BattleSquare#jumpAwayFrom
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - The BattleSquare to jump away from
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  jumpAwayFrom(otherBattleSquare, energyToUse) {
    if (this.isLeftOf(otherBattleSquare)) this.jumpLeft(energyToUse);
    else if (this.isRightOf(otherBattleSquare)) this.jumpRight(energyToUse);
    else this.jump(energyToUse);

    return this;
  }

  /**
   * Causes this BattleSquare to jump away from otherBattleSquare
   *
   * @method BattleSquare#jumpAway
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - The BattleSquare to jump away from
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  jumpAway(otherBattleSquare, energyToUse) {
    this.jumpAwayFrom(otherBattleSquare, energyToUse);
  }

  /**
   * Causes this BattleSquare to dash to the left
   *
   * @method BattleSquare#dashLeft
   * @since 0.0.1
   *
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  dashLeft(energyToUse) {
    if (!energyToUse) energyToUse = 1;
    if (energyToUse > 10) energyToUse = 10;
    this.setVelocity(-1 * 25 - 25 * energyToUse * 2, 0);
    this._removeEnergy(energyToUse);
    this.floatMessage("dashLeft(" + energyToUse + ");");

    return this;
  }

  /**
   * Causes this BattleSquare to dash to the right
   *
   * @method BattleSquare#dashRight
   * @since 0.0.1
   *
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  dashRight(energyToUse) {
    if (!energyToUse) energyToUse = 1;
    if (energyToUse > 10) energyToUse = 10;
    this.setVelocity(25 + 25 * energyToUse * 2, 0);
    this._removeEnergy(energyToUse);
    this.floatMessage("dashRight(" + energyToUse + ");");

    return this;
  }

  /**
   * Causes this BattleSquare to dash toward otherBattleSquare
   *
   * @method BattleSquare#dashToward
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - The BattleSquare to jump toward
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  dashToward(otherBattleSquare, energyToUse) {
    if (this.isLeftOf(otherBattleSquare)) this.dashRight(energyToUse);
    else if (this.isRightOf(otherBattleSquare)) this.dashLeft(energyToUse);

    return this;
  }

  /**
   * Causes this BattleSquare to dash away from otherBattleSquare
   *
   * @method BattleSquare#dashAwayFrom
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - The BattleSquare to dash away from
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  dashAwayFrom(otherBattleSquare, energyToUse) {
    if (this.isLeftOf(otherBattleSquare)) this.dashLeft(energyToUse);
    else if (this.isRightOf(otherBattleSquare)) this.dashRight(energyToUse);

    return this;
  }

  /**
   * Causes this BattleSquare to dash away from otherBattleSquare
   *
   * @method BattleSquare#dashAway
   * @since 0.0.1
   *
   * @param {BattleSquare} otherBattleSquare - The BattleSquare to dash away from
   * @param {BattleSquare} energyToUse - The amount of energy to use during this movement. More energy used == greater propulsion
   *
   * @return {BattleSquare} This BattleSquare object
   */
  dashAway(otherBattleSquare, energyToUse) {
    this.dashAwayFrom(otherBattleSquare, energyToUse);

    return this;
  }

  floatMessage(text) {
    return new FloatingMessage(
      this.scene,
      this.x,
      this.y - this.width * 2,
      text,
      {
        fill: Color.IntegerToColor(this.color).rgba
      }
    );
  }

  /**
   * Sets the color of this BattleSquare to the specified value
   *
   * @method BattleSquare#setColor
   * @since 0.0.1
   *
   * @param {BattleSquare} color - The color to set this BattleSquare
   *
   * @return {BattleSquare} This BattleSquare object
   */
  setColor(color) {
    return this.setTint(color);
  }
  setTint(tint) {
    super.setTint(tint);
    this._particleTrail.tint.propertyValue = tint;
    this.color = tint;
    this.positionDisplay.setTint(tint);

    return this;
  }

  die() {
    this.respawn();
    this.opponent._addPointToScore();

    this.active = false;
    this.visible = false;
    this._particleTrail.visible = false;
    this._energyText.visible = false;
    this.body.allowGravity = false;
    setTimeout(() => {
      this.active = true;
      this.visible = true;
      this._particleTrail.visible = true;
      this._energyText.visible = true;
      this.body.allowGravity = true;
    }, 2000);

    return this;
  }

  respawn() {
    this._setEnergy(99);
    this.x = this.initialX;
    this.y = this.initialY;
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
  }

  resetScore() {
    this._score = 0;
    this._scoreText.setText(this._score);
  }

  fullReset() {
    this.respawn();
    this.resetScore();
  }

  _addPointToScore() {
    this._score++;
    this._scoreText.setText(this._score);

    this.events.emit("pointscored");

    return this;
  }

  destroy() {
    // Remove this object's update listener from the scene
    this.scene.events.removeListener("update", this.updateListener);

    this._energyText.destroy();

    // Call this object's parent class destroy method
    super.destroy();
  }
}
