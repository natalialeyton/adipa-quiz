"use client";

import { useState } from "react";
import LandingScreen from "./LandingScreen";
import OnboardingForm from "./OnboardingForm";
import QuizModule from "./QuizModule";
import ResultScreen from "./ResultScreen";

const STEPS = {
  LANDING: "landing",
  ONBOARDING: "onboarding",
  QUIZ: "quiz",
  RESULTS: "results",
};

// Configuración por defecto (equivale al Quiz original: 25 preguntas,
// objetivo "descubrir tu área"), por si algo llegara a saltarse Landing.
const DEFAULT_QUIZ_CONFIG = { goal: "DESCUBRIR", questionCount: 25 };

export default function AppFlow() {
  const [step, setStep] = useState(STEPS.LANDING);
  const [userData, setUserData] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  // Objetivo ("DESCUBRIR" o "VALIDAR") + cantidad de preguntas elegidos en
  // Landing (Paso 1 y Paso 2). Vive en el estado global de AppFlow porque
  // QuizModule lo necesita para armar la sesión y ResultScreen/ShareCard
  // lo necesitan después para adaptar el informe final y el Social Kit.
  const [quizConfig, setQuizConfig] = useState(DEFAULT_QUIZ_CONFIG);

  const handleStart = (config) => {
    if (config?.goal && config?.questionCount) {
      setQuizConfig(config);
    }
    setStep(STEPS.ONBOARDING);
  };

  const handleOnboardingComplete = (data) => {
    setUserData(data);
    setStep(STEPS.QUIZ);
  };

  const handleQuizComplete = (result) => {
    setQuizResult(result);
    setStep(STEPS.RESULTS);
  };

  const handleRestart = () => {
    setUserData(null);
    setQuizResult(null);
    setQuizConfig(DEFAULT_QUIZ_CONFIG);
    setStep(STEPS.LANDING);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {step === STEPS.LANDING && <LandingScreen onStart={handleStart} />}

      {step === STEPS.ONBOARDING && (
        <OnboardingForm onComplete={handleOnboardingComplete} />
      )}

      {step === STEPS.QUIZ && (
        <QuizModule
          userData={userData}
          questionCount={quizConfig.questionCount}
          onComplete={handleQuizComplete}
        />
      )}

      {step === STEPS.RESULTS && (
        <ResultScreen
          userData={userData}
          quizResult={quizResult}
          goal={quizConfig.goal}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
