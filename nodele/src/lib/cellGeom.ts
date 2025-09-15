// Single source of truth so CellButton and Board previews match perfectly.
export function cellGeom(cell: number) {
  // Tweak ratios if you want thicker ring / bigger dot; both places will stay in sync.
  const RING_DIAM = Math.round(cell * 0.80); // outline ring diameter (~80% of cell)
  const FILL_DIAM = Math.round(cell * 0.56); // filled dot diameter (~56% of cell)
  return { RING_DIAM, FILL_DIAM };
}

// Absolute-centered square box
export function centerBox(size: number): React.CSSProperties {
  return {
    position: "absolute",
    width: size,
    height: size,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "9999px",
  };
}
