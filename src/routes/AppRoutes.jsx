import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Home } from "../pages/Home";
import { CreateGame } from "../pages/CreateGame";
import { GameBoard } from "../pages/GameBoard";
import { Results } from "../pages/Results";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateGame />} />
      <Route path="/game" element={<GameBoard />} />
      <Route path="/results" element={<Results />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};