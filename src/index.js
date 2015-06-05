import {Animator} from 'aurelia-templating';
import {TinyAnimator} from './animator';
export {TinyAnimator} from './animator';

export function configure(aurelia, cb){
  var animator = aurelia.container.get(TinyAnimator);
  Animator.configureDefault(aurelia.container, animator);
  if(cb !== undefined && typeof(cb) === 'function') cb(animator);
}
