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

  if ( animationsPerformed[transition] === undefined ) {
    animationsPerformed[transition] = 1;
  } else {
    animationsPerformed[transition]++;
  }

  var elem = document.querySelector("#"+transition+"Counter");
  elem.textContent = animationsPerformed[transition];

}
