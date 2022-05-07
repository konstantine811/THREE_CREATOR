varying vec2 vUv;

void main() {
  // Pattern 1
  // float strength = vUv.x;
  // Pattern 2
  // float strength = vUv.y;
  // Pattern 3
  // float strength = 1.0 - vUv.x;
  // Pattern 4
  // float strength = vUv.y * 0.3;
  // Pattern 5
  //float strength = vUv.y * 10.0;
  // Pattern 6
  // float strength = floor(vUv.y * 3.0);
  // Pattern 7
  // float strength = mod(vUv.y * 10.0, 1.0);
  // Pattern 8
  // float strength = mod(vUv.y * 10.0, 1.0);
  // strength = strength < 0.5 ? 0.0 : 1.0;
  // same as Pattern 8
  // strength = step(0.5, strength);
  // Pattern 9
/*   float stepWidth = 0.9;
  float strength = step(stepWidth, mod(vUv.y * 10.0, 1.0));
  strength += step(stepWidth, mod(vUv.x * 10.0, 1.0)); */
  // Pattern 10
 /*  float stepWidth = 0.8;
  float strength = step(stepWidth, mod(vUv.y * 10.0, 1.0));
  strength *= step(stepWidth, mod(vUv.x * 10.0, 1.0)); */
  // Pattern 11
  /* float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  barX *= step(0.8, mod(vUv.y * 10.0, 1.0));

  float barY= step(0.8, mod(vUv.x * 10.0, 1.0));
  barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

  float strength = barX + barY; */
  // Pattern 12
  /* float barX = step(0.4, mod(vUv.x * 10.0, 1.0));
  barX *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0));

  float barY= step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0));
  barY *= step(0.4, mod(vUv.y * 10.0, 1.0));

  float strength = barX + barY; */
  // Pattern 13
  // float strength = abs(vUv.x - 0.5);
  // Pattern 14
  // float strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  // Pattern 15
  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
  // Pattern 16
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // Pattern 17
  // float strength = 1.0 - step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // Pattern 18
/*   float square1 = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  float square2 = 1.0 - step(0.3, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  float strength = square1 * square2; */
  // Pattern 19
  // float strength = floor(vUv.x * 10.0) / 10.0;
  // Pattern 20
  float strength = floor(vUv.x * 10.0) / 10.0;
  strength *= floor(vUv.y * 10.0) / 10.0;
  gl_FragColor = vec4(vec3(strength), 1.0);
}
