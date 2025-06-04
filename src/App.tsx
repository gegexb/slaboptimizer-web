




import type { Slab, Piece, PlacedPiece, CutType } from './types';
import React, { useState } from 'react';


export const App: React.FC = () => {
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);

  const [slabLength, setSlabLength] = useState('');
  const [slabWidth, setSlabWidth] = useState('');
  const [slabPrice, setSlabPrice] = useState('');

  const [pieceLength, setPieceLength] = useState('');
  const [pieceWidth, setPieceWidth] = useState('');
  const [pieceQty, setPieceQty] = useState('');
  const [cutType, setCutType] = useState<CutType>('Freeform');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>🛠 Slab Optimizer</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Add Slab</h2>
        <input value={slabLength} onChange={(e) => setSlabLength(e.target.value)} placeholder="Length (cm)" />
        <input value={slabWidth} onChange={(e) => setSlabWidth(e.target.value)} placeholder="Width (cm)" />
        <input value={slabPrice} onChange={(e) => setSlabPrice(e.target.value)} placeholder="Price per m²" />
        <button
          onClick={() => {
            const newSlab: Slab = {
              id: crypto.randomUUID(),
              length: parseFloat(slabLength),
              width: parseFloat(slabWidth),
              pricePerM2: parseFloat(slabPrice),
            };
            setSlabs([...slabs, newSlab]);
            setSlabLength('');
            setSlabWidth('');
            setSlabPrice('');
          }}
        >
          ➕ Add Slab
        </button>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>Add Piece</h2>
        <input value={pieceLength} onChange={(e) => setPieceLength(e.target.value)} placeholder="Length (cm)" />
        <input value={pieceWidth} onChange={(e) => setPieceWidth(e.target.value)} placeholder="Width (cm)" />
        <input value={pieceQty} onChange={(e) => setPieceQty(e.target.value)} placeholder="Quantity" />
        <select value={cutType} onChange={(e) => setCutType(e.target.value as CutType)}>
          <option>Freeform</option>
          <option>Vertical Cut Only</option>
          <option>Horizontal Cut Only</option>
        </select>
        <button
          onClick={() => {
            const quantity = parseInt(pieceQty);
            if (isNaN(quantity) || quantity < 1) return;
            const basePiece: Piece = {
              id: crypto.randomUUID(),
              length: parseFloat(pieceLength),
              width: parseFloat(pieceWidth),
              quantity,
              cutType,
            };
            const newPieces = Array.from({ length: quantity }).map(() => ({
              ...basePiece,
              id: crypto.randomUUID(),
            }));
            setPieces([...pieces, ...newPieces]);
            setPieceLength('');
            setPieceWidth('');
            setPieceQty('');
          }}
        >
          ➕ Add Piece(s)
        </button>
      </section>


      <section style={{ marginTop: '2rem' }}>
        <h2>📋 Summary</h2>
        <p>Slabs: {slabs.length}</p>
        <p>Pieces: {pieces.reduce((sum, p) => sum + p.quantity, 0)}</p>
        <p>Placed: {placedPieces.length}</p>
        <button
          onClick={() => {
            const newPlaced: PlacedPiece[] = [];
            let offsetX = 0;
            let offsetY = 0;

            slabs.forEach((slab) => {
              pieces.forEach((piece) => {
                for (let i = 0; i < piece.quantity; i++) {
                  if (
                    offsetX + piece.width <= slab.width &&
                    offsetY + piece.length <= slab.length
                  ) {
                    newPlaced.push({
                      id: crypto.randomUUID(),
                      piece,
                      x: offsetX,
                      y: offsetY,
                      rotated: false,
                      slabID: slab.id,
                    });
                    offsetX += piece.width;
                  } else {
                    offsetX = 0;
                    offsetY += piece.length;
                  }
                }
              });
            });

            setPlacedPieces(newPlaced);
          }}
        >
          🧠 Optimize Layout
        </button>
      </section>

      {/* Entered Slabs Section */}
      <section style={{ marginTop: '2rem' }}>
        <h2>📦 Entered Slabs</h2>
        <ul>
          {slabs.map((slab) => (
            <li key={slab.id}>
              {slab.length} x {slab.width} cm - {slab.pricePerM2} AED/m²
            </li>
          ))}
        </ul>
      </section>

      {/* Entered Pieces Section */}
      <section style={{ marginTop: '2rem' }}>
        <h2>🧩 Entered Pieces</h2>
        <ul>
          {pieces.map((piece) => (
            <li key={piece.id}>
              {piece.quantity} x {piece.length} x {piece.width} cm ({piece.cutType})
            </li>
          ))}
        </ul>
      </section>
      {placedPieces.length > 0 && (
        <div style={{ marginTop: "2rem", padding: "1rem", border: "1px solid #ccc" }}>
          <h3>📐 Optimized Layout Preview</h3>
          <div style={{ position: "relative", width: "600px", height: "400px", border: "1px solid #000", background: "#f8f8f8" }}>
            {placedPieces.map((p) => (
              <div
                key={p.id}
                style={{
                  position: "absolute",
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.piece.width}px`,
                  height: `${p.piece.length}px`,
                  backgroundColor: "#6ba",
                  border: "1px solid #000",
                  fontSize: "10px",
                  textAlign: "center",
                  overflow: "hidden"
                }}
              >
                {p.piece.length}x{p.piece.width}
              </div>
            ))}
          </div>
        </div>
      )}
      <button onClick={() => alert('🚀 Optimization logic will go here')}>
        🚀 Optimize Layout
      </button>
    </div>
  );
}


