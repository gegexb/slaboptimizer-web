// Types of cut directions allowed
export type CutType = "Vertical Cut Only" | "Horizontal Cut Only" | "Freeform";

// A marble slab with dimensions and price info
export type Slab = {
  id: string;
  length: number; // in cm
  width: number;  // in cm
  pricePerM2: number; // in AED
};

// A piece to be cut from a slab
export type Piece = {
  id: string;
  length: number; // in cm
  width: number;  // in cm
  quantity: number;
  cutType: CutType;
};

// A placed piece on a specific slab with its position and rotation
export type PlacedPiece = {
  id: string;
  piece: Piece;
  x: number; // x position on slab
  y: number; // y position on slab
  rotated: boolean;
  slabID: string;
};