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

export default function AppFlow() {
  const [step, setStep] = useState(STEPS.LANDING);
  const [userData, setUserData] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  const handleStart = () => {
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
    setStep(STEPS.LANDING);
  };

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      {step === STEPS.LANDING && <LandingScreen onStart={handleStart} />}

      {step === STEPS.ONBOARDING && (
        <OnboardingForm onComplete={handleOnboardingComplete} />
      )}

      {step === STEPS.QUIZ && (
        <QuizModule userData={userData} onComplete={handleQuizComplete} />
      )}

      {step === STEPS.RESULTS && (
        <ResultScreen
          userData={userData}
          quizResult={quizResult}
          onRestart={handleRestart}
        />
      )}
    </main>
  );
}
