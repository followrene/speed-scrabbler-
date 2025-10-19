'use client';

import { useState } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Zap, MessageCircle, Users, ArrowLeft } from "lucide-react";
import WordSpellingGame from "@/components/WordSpellingGame";
import SimpleIcon from "@/components/SimpleIcon";

type GameScreen = 'welcome' | 'game' | 'features';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('welcome');

  const renderWelcomeScreen = () => (
    <>
      {/* Hero Section - Apple Design */}
      <section className="relative py-6 lg:py-8 bg-white">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center apple-fade-in">
            {/* Game Logo */}
            <div className="flex justify-center mb-4">
              <SimpleIcon size={100} className="opacity-90" />
            </div>

            {/* Main Heading - Apple Typography */}
            <h1 className="apple-text-large text-black mb-3 max-w-2xl mx-auto">
              Welcome to Speed Scrabbler
            </h1>

            {/* Subtitle - Clean and minimal */}
            <p className="apple-text-body mb-6 max-w-lg mx-auto">
              Test your spelling skills with our word scramble game. Unscramble letters to form words while racing against a 45-second timer.
            </p>

            {/* CTA Buttons - Apple Style */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <button 
                className="apple-button-primary min-w-[140px]"
                onClick={() => setCurrentScreen('game')}
              >
                Start Playing
              </button>
              <button 
                className="apple-button-secondary min-w-[140px]"
                onClick={() => setCurrentScreen('features')}
              >
                Learn More
              </button>
              <Link href="/custom-words">
                <button className="apple-button-secondary min-w-[140px]">
                  Custom Words
                </button>
              </Link>
            </div>

            {/* Badge - Minimal Apple Style */}
            <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200">
              <MessageCircle className="h-4 w-4" />
              Built on Celo + Farcaster
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderGameScreen = () => (
    <section className="py-4 bg-gray-50 min-h-screen">
      <div className="container px-4 mx-auto max-w-4xl">
        {/* Game Component */}
        <div className="flex justify-center">
          <WordSpellingGame />
        </div>
        
        {/* Back Button - Apple Style */}
        <div className="mt-6 text-center">
          <button 
            onClick={() => setCurrentScreen('welcome')}
            className="apple-button-secondary flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Menu
          </button>
        </div>
      </div>
    </section>
  );

  const renderFeaturesScreen = () => (
    <>
      {/* Features Header - Apple Design */}
      <section className="relative py-8 lg:py-12 bg-white">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="text-center apple-fade-in">
            {/* Back Button */}
            <div className="mb-6 flex justify-center">
              <button 
                onClick={() => setCurrentScreen('welcome')}
                className="apple-button-secondary flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </button>
            </div>

            {/* Main Heading */}
            <h1 className="apple-text-large text-black mb-3">
              Game Features
            </h1>

            {/* Subtitle */}
            <p className="apple-text-body mb-8 max-w-lg mx-auto">
              Discover what makes Speed Scrabbler exciting and challenging.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid - Apple Design */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="apple-card text-center p-6 apple-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl mb-4">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="apple-text-medium text-black mb-2">Fast-Paced Action</h3>
              <p className="apple-text-small">
                45-second countdown timer per word keeps the excitement high and challenges your speed.
              </p>
            </div>

            <div className="apple-card text-center p-6 apple-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl mb-4">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="apple-text-medium text-black mb-2">Smart Hints</h3>
              <p className="apple-text-small">
                Auto-revealing letters every 20 seconds help you when stuck, but cost 10 points each.
              </p>
            </div>

            <div className="apple-card text-center p-6 apple-fade-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-xl mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="apple-text-medium text-black mb-2">Progressive Difficulty</h3>
              <p className="apple-text-small">
                Start with 3-letter words, then progress to 4, 5, 6, 7, 8, and 9-letter words.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features - Apple Design */}
      <section className="py-12 bg-white">
        <div className="container px-4 mx-auto max-w-3xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="apple-text-medium text-black mb-4">How Scoring Works</h2>
              <div className="apple-card p-6">
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 font-semibold text-lg">✓</span>
                    <span className="apple-text-body"><strong className="text-black">Correct word:</strong> +10 points + bonus for remaining time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-semibold text-lg">⚠</span>
                    <span className="apple-text-body"><strong className="text-black">Auto-revealed letter:</strong> -10 points (every 20 seconds)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 font-semibold text-lg">💀</span>
                    <span className="apple-text-body"><strong className="text-black">Game over:</strong> When time runs out or score goes below 0</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h2 className="apple-text-medium text-black mb-4">Game Rules</h2>
              <div className="apple-card p-6">
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-black font-semibold">1.</span>
                    <span className="apple-text-body">Type letters on your keyboard to spell the word</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-semibold">2.</span>
                    <span className="apple-text-body">Use Backspace or the Back button to correct mistakes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-semibold">3.</span>
                    <span className="apple-text-body">Letters auto-reveal every 20 seconds if you don't type</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-semibold">4.</span>
                    <span className="apple-text-body">Complete as many words as possible in 120 seconds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-black font-semibold">5.</span>
                    <span className="apple-text-body">Game ends if time runs out or score goes below 0</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section - Apple Design */}
      <section className="py-12 bg-gray-50">
        <div className="container px-4 mx-auto max-w-3xl text-center">
          <h2 className="apple-text-large text-black mb-3">
            Ready to Challenge Yourself?
          </h2>
          <p className="apple-text-body mb-8">
            Test your spelling skills and see how many words you can unscramble in 120 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              className="apple-button-primary min-w-[160px]"
              onClick={() => setCurrentScreen('game')}
            >
              Start Playing Now
            </button>
            <button 
              className="apple-button-secondary min-w-[160px]"
              onClick={() => setCurrentScreen('welcome')}
            >
              Back to Menu
            </button>
          </div>
        </div>
      </section>
    </>
  );

  return (
    <main className="flex-1">
      {currentScreen === 'welcome' && renderWelcomeScreen()}
      {currentScreen === 'game' && renderGameScreen()}
      {currentScreen === 'features' && renderFeaturesScreen()}
    </main>
  );
}
