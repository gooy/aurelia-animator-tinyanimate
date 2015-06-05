System.register(['aurelia-templating', './animator'], function (_export) {
  'use strict';

  var Animator, TinyAnimator;

  _export('configure', configure);

  function configure(aurelia, cb) {
    var animator = aurelia.container.get(TinyAnimator);
    Animator.configureDefault(aurelia.container, animator);
    if (cb !== undefined && typeof cb === 'function') cb(animator);
  }

  return {
    setters: [function (_aureliaTemplating) {
      Animator = _aureliaTemplating.Animator;
    }, function (_animator) {
      TinyAnimator = _animator.TinyAnimator;

      _export('TinyAnimator', _animator.TinyAnimator);
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=index.js.map