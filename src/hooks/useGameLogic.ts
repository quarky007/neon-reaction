import { useState, useCallback, useEffect } from "react";

export type PlayerColor =
  | "RED"
  | "GREEN"
  | "BLUE"
  | "YELLOW"
  | "PURPLE"
  | "CYAN";
const PLAYER_COLORS: PlayerColor[] = [
  "RED",
  "GREEN",
  "BLUE",
  "YELLOW",
  "PURPLE",
  "CYAN",
];

export interface Cell {
  count: number;
  owner: PlayerColor | null;
}

export const useGameLogic = () => {
  // Default Settings
  const [playerCount, setPlayerCount] = useState(2);
  const [rows, setRows] = useState(9);
  const [cols, setCols] = useState(6);

  const [board, setBoard] = useState<Cell[][]>([]);
  const [turnIdx, setTurnIdx] = useState(0);
  const [winner, setWinner] = useState<PlayerColor | null>(null);

  // Initialize or Reset Game
  const initGame = useCallback((r: number, c: number, p: number) => {
    setRows(r);
    setCols(c);
    setPlayerCount(p);
    setBoard(
      Array(r)
        .fill(null)
        .map(() =>
          Array(c)
            .fill(null)
            .map(() => ({ count: 0, owner: null })),
        ),
    );
    setTurnIdx(0);
    setWinner(null);
  }, []);

  // Run init on first load
  useEffect(() => {
    if (board.length === 0) initGame(9, 6, 2);
  }, [initGame, board.length]);

  const activePlayers = PLAYER_COLORS.slice(0, playerCount);
  const turn = activePlayers[turnIdx];

  const getLimit = (r: number, c: number) => {
    let limit = 4;
    if ((r === 0 || r === rows - 1) && (c === 0 || c === cols - 1)) limit = 2;
    else if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) limit = 3;
    return limit;
  };

  const explode = useCallback(
    (grid: Cell[][], r: number, c: number, color: PlayerColor) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols) return;
      const cell = grid[r][c];
      cell.count++;
      cell.owner = color;

      if (cell.count >= getLimit(r, c)) {
        cell.count = 0;
        cell.owner = null;
        explode(grid, r - 1, c, color);
        explode(grid, r + 1, c, color);
        explode(grid, r, c - 1, color);
        explode(grid, r, c + 1, color);
      }
    },
    [rows, cols],
  );

  const handleCellClick = (r: number, c: number) => {
    if (winner || (board[r][c].owner && board[r][c].owner !== turn)) return;

    const newBoard = JSON.parse(JSON.stringify(board));
    explode(newBoard, r, c, turn);

    // Check Win Condition (Simple version: if enemy wiped out)
    // Note: Real game usually waits until players have made at least 1 move
    const remainingPlayers = activePlayers.filter((p) =>
      newBoard.some((row: Cell[]) => row.some((cell) => cell.owner === p)),
    );

    // Simple win check: if only 1 player remains and total atoms > 1
    const totalAtoms = newBoard
      .flat()
      .reduce((acc: number, cell: Cell) => acc + cell.count, 0);
    if (totalAtoms > playerCount && remainingPlayers.length === 1) {
      setWinner(remainingPlayers[0]);
    }

    setBoard(newBoard);
    setTurnIdx((turnIdx + 1) % playerCount);
  };

  return {
    board,
    turn,
    handleCellClick,
    winner,
    rows,
    cols,
    playerCount,
    initGame,
  };
};
