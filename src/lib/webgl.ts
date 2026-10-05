/**
 * Whether this device should get the WebGL version of a 3D object. Client-only.
 * No for reduced motion, touch/no-hover devices (battery), or missing WebGL.
 */
export function canUse3D(): boolean {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(hover: none)").matches) return false;
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2") ?? c.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext(); // release the probe context
    return Boolean(gl);
  } catch {
    return false;
  }
}
