// Master calculation engines for First Man Out and Last Man Win variants
export const processGameRound = (players, deadlineScore, gameMode, currentRoundNo) => {
  let updatedPlayers = players.map(p => ({ ...p }));
  let isGameOver = false;
  let detectedWinner = null;

  if (gameMode === "FIRST_MAN_OUT") {
    const crossed = updatedPlayers.filter(p => p.totalScore >= deadlineScore);
    if (crossed.length > 0) {
      isGameOver = true;
      // Loser has the highest overflow value
      const targetLoser = [...crossed].sort((a, b) => b.totalScore - a.totalScore)[0];
      
      updatedPlayers = updatedPlayers.map(p => {
        if (p.id === targetLoser.id) {
          return { ...p, eliminated: true, eliminatedRound: currentRoundNo, rank: updatedPlayers.length };
        }
        return p;
      });

      // Sort remaining by lowest score total
      const sortedWinners = updatedPlayers.filter(p => !p.eliminated).sort((a, b) => a.totalScore - b.totalScore);
      sortedWinners.forEach((p, idx) => {
        const matchingPlayer = updatedPlayers.find(up => up.id === p.id);
        if (matchingPlayer) matchingPlayer.rank = idx + 1;
      });
      
      detectedWinner = updatedPlayers.sort((a, b) => (a.rank || 99) - (b.rank || 99))[0];
    }
  } else if (gameMode === "LAST_MAN_WIN") {
    // Flag newly broken thresholds
    updatedPlayers = updatedPlayers.map(p => {
      if (!p.eliminated && p.totalScore >= deadlineScore) {
        return { ...p, eliminated: true, eliminatedRound: currentRoundNo };
      }
      return p;
    });

    const activeCount = updatedPlayers.filter(p => !p.eliminated).length;

    // Edge Case: Everyone crossed simultaneously in this round
    if (activeCount === 0) {
      isGameOver = true;
      // Winner is the one closest to the line (least overflow)
      const sortedByLeastOverflow = [...updatedPlayers].sort((a, b) => a.totalScore - b.totalScore);
      sortedByLeastOverflow.forEach((p, idx) => {
        const match = updatedPlayers.find(up => up.id === p.id);
        if (match) match.rank = idx + 1;
      });
      detectedWinner = updatedPlayers.sort((a, b) => (a.rank || 99) - (b.rank || 99))[0];
    } 
    // Normal Case: Only one survivor remains standing
    else if (activeCount === 1) {
      isGameOver = true;
      const survivor = updatedPlayers.find(p => !p.eliminated);
      if (survivor) survivor.rank = 1;

      // Rank eliminated players by how long they survived, then by lowest score total
      const eliminatedPool = updatedPlayers.filter(p => p.eliminated)
        .sort((a, b) => b.eliminatedRound - a.eliminatedRound || a.totalScore - b.totalScore);
      
      eliminatedPool.forEach((p, idx) => {
        const match = updatedPlayers.find(up => up.id === p.id);
        if (match) match.rank = idx + 2;
      });
      detectedWinner = survivor;
    }
  }

  // Fallback sorting for standard realtime dashboard ordering
  const computedRankings = [...updatedPlayers].sort((a, b) => {
    if (a.eliminated !== b.eliminated) return a.eliminated ? 1 : -1;
    return a.totalScore - b.totalScore;
  });

  return { updatedPlayers, isGameOver, detectedWinner, computedRankings };
};

export const generateWhatsAppText = (rankings, winner) => {
  let text = `🏆 *Least Count Match Results* 🏆\n\n`;
  text += `Winner: 🎉 *${winner?.name}*\n\n`;
  text += `*Final Standings:*\n`;
  rankings.forEach((p, idx) => {
    text += `${idx + 1}. ${p.name} — Total: ${p.totalScore} pts ${p.eliminated ? '❌' : '✅'}\n`;
  });
  text += `\nTracked flawlessly via Least Count Dashboard.`;
  return encodeURIComponent(text);
};