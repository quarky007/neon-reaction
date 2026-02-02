"use client";
import { useState } from "react";
import { useGameLogic, PlayerColor } from "../hooks/useGameLogic";
import { Settings, X, RefreshCw } from "lucide-react";

const COLORS: Record<string, string> = {
  RED: "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] border-red-400",
  GREEN:
    "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] border-emerald-400",
  BLUE: "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)] border-blue-400",
  YELLOW:
    "bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)] border-yellow-300",
  PURPLE:
    "bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.6)] border-purple-400",
  CYAN: "bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)] border-cyan-300",
};

export default function ChainReaction() {
  const {
    board,
    turn,
    handleCellClick,
    winner,
    rows,
    cols,
    playerCount,
    initGame,
  } = useGameLogic();
  const [showSettings, setShowSettings] = useState(false);

  const [tempRows, setTempRows] = useState(9);
  const [tempCols, setTempCols] = useState(6);
  const [tempPlayers, setTempPlayers] = useState(2);

  const applySettings = () => {
    initGame(tempRows, tempCols, tempPlayers);
    setShowSettings(false);
  };

  return (
    <div className="h-screen w-screen bg-[#050505] text-white flex overflow-hidden relative font-sans selection:bg-cyan-500 selection:text-black">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-[350px] flex-shrink-0 flex flex-col justify-center p-8 border-r border-white/10 relative z-10 bg-[#050505]/95 backdrop-blur-xl">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-5xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-600 drop-shadow-2xl">
              NEON
              <br />
              REACTION
            </h1>
            <p className="text-gray-400 mt-4 text-sm leading-relaxed border-l-2 border-purple-500 pl-4">
              A strategic game of explosive expansion. Place atoms to reach
              critical mass. When a cell overloads, it explodes into neighbors,
              capturing them. Eliminate all opponent atoms to win.
            </p>
          </div>

          {/* Turn Indicator */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-gray-500 tracking-widest uppercase">
              Current Status
            </div>
            <div
              className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${winner ? "border-yellow-400 bg-yellow-400/10" : COLORS[turn as string]}`}
            >
              <span className="font-black text-xl tracking-wider">
                {winner ? "WINNER!" : `${turn} TURN`}
              </span>
              {winner && <span className="text-2xl">🏆</span>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="flex-1 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 font-bold transition flex items-center justify-center gap-2"
            >
              <span>⚙️ Settings</span>
            </button>
            <button
              onClick={() => initGame(rows, cols, playerCount)}
              className="px-4 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 transition"
            >
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL*/}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-[#050505]">
        {/* The Grid Container - FORCES ASPECT RATIO TO FIT */}
        <div
          className="relative transition-all duration-500 ease-in-out"
          style={{
            aspectRatio: `${cols} / ${rows}`,
            height: "100%",
            maxHeight: "90vh",
            maxWidth: "100%",
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
            gap: "4px",
          }}
        >
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                onClick={() => handleCellClick(rIdx, cIdx)}
                className="relative bg-white/5 rounded-md lg:rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />

                {/* Atoms */}
                {cell.count > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full p-[15%]">
                      {" "}
                      {[...Array(cell.count)].map((_, i) => (
                        <div
                          key={i}
                          className={`absolute w-[60%] h-[60%] rounded-full mix-blend-screen animate-pulse
                             ${COLORS[cell.owner as string]}
                             ${i === 0 ? "top-[20%] left-[20%]" : ""}
                             ${i === 1 ? "top-[20%] left-[20%] translate-x-[20%]" : ""}
                             ${i === 2 ? "top-[20%] left-[20%] -translate-y-[20%]" : ""}
                             ${i === 3 ? "top-[20%] left-[20%] translate-y-[20%]" : ""}
                           `}
                          style={{ animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )),
          )}
        </div>
      </div>

      {/* SETTINGS MODAL */}
      {showSettings && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111] border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Game Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Players */}
            <div className="mb-6">
              <label className="block text-gray-400 text-sm font-bold mb-2">
                PLAYERS
              </label>
              <div className="flex gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTempPlayers(num)}
                    className={`flex-1 py-2 rounded border font-bold ${tempPlayers === num ? "bg-white text-black border-white" : "bg-transparent border-gray-700 text-gray-500"}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid Size */}
            <div className="mb-8">
              <label className="block text-gray-400 text-sm font-bold mb-2">
                GRID SIZE
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setTempRows(6);
                    setTempCols(5);
                  }}
                  className={`py-3 rounded border ${tempRows === 6 ? "border-cyan-500 text-cyan-500 bg-cyan-500/10" : "border-gray-700"}`}
                >
                  Small
                  <br />
                  <span className="text-xs opacity-50">6x5</span>
                </button>
                <button
                  onClick={() => {
                    setTempRows(9);
                    setTempCols(6);
                  }}
                  className={`py-3 rounded border ${tempRows === 9 ? "border-cyan-500 text-cyan-500 bg-cyan-500/10" : "border-gray-700"}`}
                >
                  Standard
                  <br />
                  <span className="text-xs opacity-50">9x6</span>
                </button>
                <button
                  onClick={() => {
                    setTempRows(12);
                    setTempCols(8);
                  }}
                  className={`py-3 rounded border ${tempRows === 12 ? "border-cyan-500 text-cyan-500 bg-cyan-500/10" : "border-gray-700"}`}
                >
                  Large
                  <br />
                  <span className="text-xs opacity-50">12x8</span>
                </button>
              </div>
            </div>

            <button
              onClick={applySettings}
              className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl font-black text-white tracking-widest hover:opacity-90 transition"
            >
              START NEW GAME
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
