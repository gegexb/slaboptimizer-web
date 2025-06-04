import type { Slab, Piece, PlacedPiece } from './types';

export function optimizeLayout(slabs: Slab[], pieces: Piece[]): PlacedPiece[] {
  const placedPieces: PlacedPiece[] = [];

  let slabIndex = 0;
  let currentX = 0;
  let currentY = 0;

  const pieceQueue = pieces.flatMap((piece) =>
    Array.from({ length: piece.quantity }, (_, i) => ({ ...piece, id: `${piece.id}-${i + 1}` }))
  );

  for (const piece of pieceQueue) {
    let placed = false;

    while (slabIndex < slabs.length && !placed) {
      const slab = slabs[slabIndex];

      // Try to place without rotation
      if (currentX + piece.length <= slab.length && currentY + piece.width <= slab.width) {
        placedPieces.push({
          id: piece.id,
          piece,
          x: currentX,
          y: currentY,
          rotated: false,
          slabID: slab.id,
        });

        currentY += piece.width;
        placed = true;
      }
      // Try to place with rotation
      else if (currentX + piece.width <= slab.length && currentY + piece.length <= slab.width) {
        placedPieces.push({
          id: piece.id,
          piece,
          x: currentX,
          y: currentY,
          rotated: true,
          slabID: slab.id,
        });

        currentY += piece.length;
        placed = true;
      } else {
        // Move to next slab
        slabIndex++;
        currentX = 0;
        currentY = 0;
      }
    }
  }

  return placedPieces;
}