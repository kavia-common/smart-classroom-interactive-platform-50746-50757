import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { TVNavProvider } from "./tvnav/TVNavProvider";
import { RoleGate } from "./components/RoleGate";

import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { TeacherDashboardScreen } from "./screens/TeacherDashboardScreen";
import { QuestionBankScreen } from "./screens/QuestionBankScreen";
import { QuizExamSetupScreen } from "./screens/QuizExamSetupScreen";
import { QuizExamPlayScreen } from "./screens/QuizExamPlayScreen";
import { MemoryGameScreen } from "./screens/MemoryGameScreen";
import { AccessibilitySettingsScreen } from "./screens/AccessibilitySettingsScreen";
import { StudentJoinPlayScreen } from "./screens/StudentJoinPlayScreen";

// PUBLIC_INTERFACE
function App() {
  /** App entry: routing + providers for auth, accessibility, and TV navigation. */
  return (
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <TVNavProvider>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/accessibility" element={<AccessibilitySettingsScreen />} />

              {/* Teacher routes */}
              <Route
                path="/teacher"
                element={
                  <RoleGate allow="teacher">
                    <TeacherDashboardScreen />
                  </RoleGate>
                }
              />
              <Route
                path="/teacher/questions"
                element={
                  <RoleGate allow="teacher">
                    <QuestionBankScreen />
                  </RoleGate>
                }
              />
              <Route
                path="/teacher/setup"
                element={
                  <RoleGate allow="teacher">
                    <QuizExamSetupScreen />
                  </RoleGate>
                }
              />

              {/* Student routes */}
              <Route
                path="/student/join"
                element={
                  <RoleGate allow="student">
                    <StudentJoinPlayScreen />
                  </RoleGate>
                }
              />

              {/* Play routes (can be used by both roles for now) */}
              <Route
                path="/play/quiz"
                element={
                  <RoleGate allow="any">
                    <QuizExamPlayScreen />
                  </RoleGate>
                }
              />
              <Route
                path="/play/memory"
                element={
                  <RoleGate allow="any">
                    <MemoryGameScreen />
                  </RoleGate>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </TVNavProvider>
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  );
}

export default App;
