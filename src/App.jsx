import React from "react";
// Change BrowserRouter to HashRouter
import { HashRouter } from "react-router-dom"; 
import { GameProvider } from "./context/GameContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    // Wrap with HashRouter instead
    <HashRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </HashRouter>
  );
}