export function Arrow({
  direction = "right",
}: {
  direction?: "right" | "up" | "down" | "external";
}) {
  const rotation = { right: 0, down: 90, up: -90, external: -45 }[direction];
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <g transform={`rotate(${rotation} 12 12)`}>
        <path d="M4 12h15M13 6l6 6-6 6" />
      </g>
    </svg>
  );
}
