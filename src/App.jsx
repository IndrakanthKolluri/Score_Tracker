import React from "react";
import { BrowserRouter } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <AppRoutes />
      </GameProvider>
    </BrowserRouter>
  );
}