export type Stroke = { color: string; points: string };
export type DrawingGesture = {
  originX: number;
  originY: number;
  stroke: Stroke;
};
export function beginStroke(
  x: number,
  y: number,
  color: string,
): DrawingGesture {
  return {
    originX: x,
    originY: y,
    stroke: { color, points: `M ${x} ${y} l 0.1 0.1` },
  };
}
export function moveStroke(
  gesture: DrawingGesture,
  dx: number,
  dy: number,
): DrawingGesture {
  const x = gesture.originX + dx,
    y = gesture.originY + dy;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return gesture;
  return {
    ...gesture,
    stroke: {
      ...gesture.stroke,
      points: gesture.stroke.points + ` L ${x} ${y}`,
    },
  };
}
