import React, { createContext, useContext, useState, useEffect } from "react";

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameMode, setGameMode] = useState(() => JSON.parse(localStorage.getItem("lc_gameMode")) || "");
  const [deadlineScore, setDeadlineScore] = useState(() => JSON.parse(localStorage.getItem("lc_deadlineScore")) || 100);
  const [players, setPlayers] = useState(() => JSON.parse(localStorage.getItem("lc_players")) || []);
  const [rounds, setRounds] = useState(() => JSON.parse(localStorage.getItem("lc_rounds")) || []);
  const [winner, setWinner] = useState(() => JSON.parse(localStorage.getItem("lc_winner")) || null);
  const [rankings, setRankings] = useState(() => JSON.parse(localStorage.getItem("lc_rankings")) || []);
  const [theme, setTheme] = useState(() => localStorage.getItem("lc_theme") || "party");

  useEffect(() => {
    localStorage.setItem("lc_gameMode", JSON.stringify(gameMode));
    localStorage.setItem("lc_deadlineScore", JSON.stringify(deadlineScore));
    localStorage.setItem("lc_players", JSON.stringify(players));
    localStorage.setItem("lc_rounds", JSON.stringify(rounds));
    localStorage.setItem("lc_winner", JSON.stringify(winner));
    localStorage.setItem("lc_rankings", JSON.stringify(rankings));
    localStorage.setItem("lc_theme", theme);
  }, [gameMode, deadlineScore, players, rounds, winner, rankings, theme]);

  const resetGame = () => {
    setGameMode("");
    setDeadlineScore(100);
    setPlayers([]);
    setRounds([]);
    setWinner(null);
    setRankings([]);
    localStorage.removeItem("lc_gameMode");
    localStorage.removeItem("lc_deadlineScore");
    localStorage.removeItem("lc_players");
    localStorage.removeItem("lc_rounds");
    localStorage.removeItem("lc_winner");
    localStorage.removeItem("lc_rankings");
  };

  return (
    <GameContext.Provider value={{
      gameMode, setGameMode,
      deadlineScore, setDeadlineScore,
      players, setPlayers,
      rounds, setRounds,
      winner, setWinner,
      rankings, setRankings,
      theme, setTheme,
      resetGame
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);