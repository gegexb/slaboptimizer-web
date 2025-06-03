
import React, { useState } from 'react';
import type { Slab, Piece, PlacedPiece, CutType } from './types';


export const App: React.FC = () => {
  const [slabs, setSlabs] = useState<Slab[]>([]);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [placedPieces, setPlacedPieces] = useState<PlacedPiece[]>([]);

  // Slab form state
  const [slabLength, setSlabLength] = useState('');
  const [slabWidth, setSlabWidth] = useState('');
  const [slabPrice, setSlabPrice] = useState('');

  // Piece form state
  const [pieceLength, setPieceLength] = useState('');
  const [pieceWidth, setPieceWidth] = useState('');
  const [pieceQty, setPieceQty] = useState('');
  const [cutType, setCutType] = useState<CutType>('Freeform');

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
      <h1>🛠 Slab Optimizer Pro (Web)</h1>

      <section>
        <h2>🪨 Add Slab</h2>
        <input
          placeholder="Length (cm)"
          value={slabLength}
          onChange={(e) => setSlabLength(e.target.value)}
        />
        <input
          placeholder="Width (cm)"
          value={slabWidth}
          onChange={(e) => setSlabWidth(e.target.value)}
        />
        <input
          placeholder="Price per m² (AED)"
          value={slabPrice}
          onChange={(e) => setSlabPrice(e.target.value)}
        />
        <button
          onClick={() => {
            const length = parseFloat(slabLength);
            const width = parseFloat(slabWidth);
            const price = parseFloat(slabPrice);
            if (!isNaN(length) && !isNaN(width) && !isNaN(price)) {
              const newSlab: Slab = {
                id: crypto.randomUUID(),
                length,
                width,
                pricePerM2: price,
              };
              setSlabs([...slabs, newSlab]);
              console.log("Slabs:", [...slabs, newSlab]);
              setSlabLength('');
              setSlabWidth('');
              setSlabPrice('');
            }
          }}
        >
          ➕ Add Slab
        </button>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h2>🧩 Add Piece</h2>
        <input
          placeholder="Length (cm)"
          value={pieceLength}
          onChange={(e) => setPieceLength(e.target.value)}
        />
        <input
          placeholder="Width (cm)"
          value={pieceWidth}
          onChange={(e) => setPieceWidth(e.target.value)}
        />
        <input
          placeholder="Quantity"
          value={pieceQty}
          onChange={(e) => setPieceQty(e.target.value)}
        />
        <select value={cutType} onChange={(e) => setCutType(e.target.value as CutType)}>
          <option value="Vertical Cut Only">Vertical</option>
          <option value="Horizontal Cut Only">Horizontal</option>
          <option value="Freeform">Freeform</option>
        </select>
        <button
          onClick={() => {
            const length = parseFloat(pieceLength);
            const width = parseFloat(pieceWidth);
            const qty = parseInt(pieceQty);
            if (!isNaN(length) && !isNaN(width) && !isNaN(qty)) {
              const newPiece: Piece = {
                id: crypto.randomUUID(),
                length,
                width,
                quantity: qty,
                cutType,
              };
              setPieces([...pieces, newPiece]);
              console.log("Pieces:", [...pieces, newPiece]);
              setPieceLength('');
              setPieceWidth('');
              setPieceQty('');
              setCutType('Freeform');
            }
          }}
        >
          ➕ Add Piece
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
    </div>
  );
}


