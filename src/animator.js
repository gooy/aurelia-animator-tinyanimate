import TinyAnimate from 'tinyanimate';
import JSOL from 'jsol';

/**
 * Aurelia animator implementation using TinyAnimate
 */
export class TinyAnimator{

  effects = {};
  timelines = {};

  /**
   * Default options for the animation
   * @type {Object}
   */
  options = {
    duration: 500
  };

  easings = [];

  /**
   * Default enter animation
   * @type {Object}
   */
  enterAnimation = {properties:"fadeIn",options:{duration:200}};
  /**
   * Default leave animation
   * @type {Object}
   */
  leaveAnimation = {properties:"fadeOut",options:{duration:200}};

  isAnimating = false;

  constructor(){
    this.easings = Object.keys(TinyAnimate.easings).sort();

    this.registerEffect("fadeIn",{opacity:1});
    this.registerEffect("fadeOut",{opacity:0});
  }

  /**
   * Run a animation by name or by manually specifying properties and options for it
   *
   * @param element {HTMLElement}   Element to animate
   * @param effectName {Object}     Element properties to animate
   * @param options {Object}        Animation options
   *
   * @returns {Promise} resolved when animation is complete
   */
  animate(element,effectName,options){

    this.isAnimating = true;

    return new Promise((resolve, reject) => {

      var defaults = {
        onComplete:elements=>{
          this.isAnimating = false;
          resolve(true);
        }
      };
      options = Object.assign({},this.options,defaults,options);

      var properties = this.effects[effectName];
      options = Object.assign(options, properties);

      var duration = parseInt(options.duration);
      delete options.duration;

      var easing = options.easing;
      delete options.easing;

      if(effectName==="fadeIn"){
        element.style.opacity = 0;
      }

      // TinyAnimate.animate(from, to, duration, update, easing, done)
      // TinyAnimate.animateCSS(element, property, unit, from, to, duration, easing, done)

      var cb = function() {resolve(true);};
      var property,_from,to,unit=null;
      for(property in properties){
        to = properties[property];
        _from = parseInt(element.style[property])||0;
        console.log('property', property,unit,_from,to,duration,easing);
        TinyAnimate.animateCSS(element, property, unit, _from, to, duration, easing, cb);
        cb = null;
      };

    });

  }

  /**
   * Run the enter animation on an element
   *
   * @param element {HTMLElement}   Element to animate
   * @returns {Promise} resolved when animation is complete
   */
  enter(element) {
    return this._runElementAnimation(element,"enter");
  }

  /**
   * Run the leave animation on an element
   *
   * @param element {HTMLElement}   Element to animate
   * @returns {Promise} resolved when animation is complete
   */
  leave(element) {
    return this._runElementAnimation(element,"leave");
  }

  /**
   * Run a seqeunce of animations, one after the other
   *
   * @param sequence {Array}  array of animations
   */
  runSequence(sequence){
    return Promise.resolve(false);
  }

  /**
   * Register a new effect by name
   *
   * @param effectName {String}   name of the effect
   * @param properties {Object}   properties for the effect
   */
  registerEffect(effectName,properties){
    this.effects[effectName] = properties;
  }

  /**
   * Unregister a new effect by name
   *
   * @param effectName {String}   name of the effect
   */
  unregisterEffect(effectName,properties){
    delete this.effects[effectName];
  }

  //--------------------------------- Private methods

  /**
   * Run animation by type name
   *
   * @param element {HTMLElement}   Element to animate
   * @param name {String}           Name of the animation to run
   *
   * @returns {Promise} resolved when animation is complete
   */
  _runElementAnimation(element,name){
    var properties = {};
    var options = {};

    //parse animation properties for this element if none were found
    if(!element.animations) this._parseAnimations(element);

    if(element.animations[name]) {
      properties = element.animations[name].properties;
      options = element.animations[name].options;
    }

    //skip if no enter animation was specified
    if(!properties) return Promise.resolve(false);

    return this.animate(element,properties,options);
  }

  /**
   * Parse animations specified in the elements attributes
   *
   * @param element {HTMLElement}   Element to parse animations from
   */
  _parseAnimations(element){
    element.animations = {};
    element.animations.enter = this.parseAttributeValue(element.getAttribute("animation-enter"))||this.enterAnimation;
    element.animations.leave = this.parseAttributeValue(element.getAttribute("animation-leave"))||this.leaveAnimation;
  }

  /**
   * Parse an attribute value as an animation definition
   *
   * syntax with effectname:     effectName:{prop1:value,prop2:value}
   * syntax with properties:     {prop1:value,prop2:value}:{prop1:value,prop2:value}
   *
   * @param value           Attribute value
   * @returns {Object}      Object with the effectName/properties and options that have been extracted
   */
  parseAttributeValue(value){
    if(!value) return value;
    var p = value.split(";");
    var properties = p[0];
    var options = {};
    if(properties[0]=="{" && properties[properties.length-1] == "}") properties = JSOL.parse(properties);

    if(p.length>1) {
      options = p[1];
      options = JSOL.parse(options);
    }
    return {properties,options};
  }

}
