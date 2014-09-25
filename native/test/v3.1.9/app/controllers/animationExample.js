steroids.view.navigationBar.show("Animation Example");

var animationsPerformed = {};

function performAnimation(transition, duration) {

  // Create the animation
  var anim = new steroids.Animation({
    transition: transition,
    duration: duration
  });

  // Perform it...
  anim.perform();

  // And immediately update the screen. If you want to update screen when the animation has finished, hook it to the onSuccess of the animation's perform() method.

  if ( animationsPerformed[transition] === undefined ) {
    animationsPerformed[transition] = 1;
  } else {
    animationsPerformed[transition]++;
  }

  var elem = document.querySelector("#"+transition+"Counter");
  elem.textContent = animationsPerformed[transition];

}
