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
      {/* Hero Section - Optimized for Farcaster */}
      <section className="relative py-4 lg:py-6">
        <div className="container px-3 mx-auto max-w-4xl">
          <div className="text-center">
            {/* Game Logo - Smaller */}
            <div className="flex justify-center mb-3">
              <SimpleIcon size={120} className="drop-shadow-xl" />
            </div>

            {/* Main Heading - Smaller fonts */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-2">
              Welcome to{" "}
              <span className="text-primary">Speed Scrabbler</span>
            </h1>

            {/* Subtitle - Smaller and more compact */}
            <p className="text-sm md:text-base text-muted-foreground mb-4 max-w-xl mx-auto leading-snug">
              Test your spelling skills with our word scramble game! Unscramble letters to form words while racing against a 45-second timer per word. 
            </p>

            {/* CTA Buttons - More compact */}
            <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-4">
              <Button 
                size="default" 
                className="px-6 py-2 text-sm font-medium"
                onClick={() => setCurrentScreen('game')}
              >
                Start Playing
              </Button>
              <Button 
                size="default" 
                variant="outline" 
                className="px-6 py-2 text-sm font-medium"
                onClick={() => setCurrentScreen('features')}
              >
                Learn More
              </Button>
              <Link href="/custom-words">
                <Button 
                  size="default" 
                  variant="outline" 
                  className="px-6 py-2 text-sm font-medium"
                >
                  Custom Word List
                </Button>
              </Link>
            </div>
            {/* Badge - Smaller */}
            <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
              <MessageCircle className="h-3 w-3" />
              Built on Celo + Farcaster
            </div>
          </div>
        </div>
      </section>
    </>
  );

  const renderGameScreen = () => (
    <section className="py-2">
      <div className="container px-2 mx-auto max-w-4xl">
        {/* Game Component */}
        <div className="flex justify-center">
          <WordSpellingGame />
        </div>
        
        {/* Back Button - More compact */}
        <div className="mt-4 text-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCurrentScreen('welcome')}
            className="flex items-center gap-1 mx-auto text-xs"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to Menu
          </Button>
        </div>
      </div>
    </section>
  );

  const renderFeaturesScreen = () => (
    <>
      {/* Features Header - More Compact */}
      <section className="relative py-12 lg:py-20">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            {/* Back Button */}
            <div className="mb-6 flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentScreen('welcome')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Menu
              </Button>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              Game Features
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto leading-relaxed">
              Discover what makes Speed Scrabbler exciting and challenging!
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid - More Compact */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast-Paced Action</h3>
              <p className="text-muted-foreground">
                45-second countdown timer per word keeps the excitement high and challenges your speed.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Hints with Penalty</h3>
              <p className="text-muted-foreground">
                Auto-revealing letters every 20 seconds help you when stuck, but cost 10 points each! Revealed letters are automatically filled in.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progressive Difficulty</h3>
              <p className="text-muted-foreground">
                Start with 3-letter words in Round 1, then progress to 4, 5, 6, 7, 8, and finally 9-letter words in later rounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Features - More Compact */}
      <section className="py-16">
        <div className="container px-4 mx-auto max-w-4xl">
          <div className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">How Scoring Works</h2>
              <div className="bg-muted/50 p-6 rounded-lg">
                <ul className="text-left space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-green-600 font-semibold">✓</span>
                    <span><strong>Correct word:</strong> +10 points + bonus points for remaining time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-semibold">⚠</span>
                    <span><strong>Auto-revealed letter:</strong> -10 points (happens every 20 seconds if you don&apos;t type)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-600 font-semibold">💀</span>
                    <span><strong>Game over:</strong> When time runs out OR when your score goes below 0</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Game Rules</h2>
              <div className="bg-muted/50 p-6 rounded-lg">
                <ul className="text-left space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-semibold">1.</span>
                    <span>Type letters on your keyboard to spell the word</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-semibold">2.</span>
                    <span>Use Backspace or the Back button to correct mistakes</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-semibold">3.</span>
                    <span>Letters auto-reveal every 20 seconds if you don&apos;t type (costs 10 points)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-semibold">4.</span>
                    <span>Complete as many words as possible in 120 seconds</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-600 font-semibold">5.</span>
                    <span>Game ends if time runs out OR score goes below 0</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started Section - More Compact */}
      <section className="py-16 bg-muted/50">
        <div className="container px-4 mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Challenge Yourself?
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Test your spelling skills and see how many words you can unscramble in 120 seconds!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="px-8 py-3"
              onClick={() => setCurrentScreen('game')}
            >
              Start Playing Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3"
              onClick={() => setCurrentScreen('welcome')}
            >
              Back to Menu
            </Button>
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
