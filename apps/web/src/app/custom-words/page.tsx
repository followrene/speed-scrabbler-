'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CustomWordsPage() {
  const [customWords, setCustomWords] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);

  // Load saved custom words on component mount
  useEffect(() => {
    const saved = localStorage.getItem('customWords');
    if (saved) {
      setCustomWords(saved);
      setWordCount(saved.split('\n').filter(word => word.trim().length > 0).length);
    }
  }, []);

  // Update word count when custom words change
  useEffect(() => {
    const words = customWords.split('\n').filter(word => word.trim().length > 0);
    setWordCount(words.length);
  }, [customWords]);

  const handleSave = () => {
    const words = customWords.split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length > 0 && word.length <= 9);
    
    if (words.length > 100) {
      alert('Please enter no more than 100 words.');
      return;
    }

    localStorage.setItem('customWords', words.join('\n'));
    alert(`Saved ${words.length} custom words! These will be used first in the game.`);
  };

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all custom words?')) {
      setCustomWords('');
      localStorage.removeItem('customWords');
      setWordCount(0);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');
    
    // Limit to 100 words
    if (lines.length > 100) {
      alert('Maximum 100 words allowed.');
      return;
    }
    
    setCustomWords(value);
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header - Apple Design */}
        <div className="mb-8 apple-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <button className="apple-button-secondary flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Game
              </button>
            </Link>
          </div>
          
          <h1 className="apple-text-large text-black mb-3">Custom Word List</h1>
          <p className="apple-text-body">
            Add up to 100 custom words that will be used first in the game, before the default word list.
          </p>
        </div>

        {/* Instructions - Apple Design */}
        <div className="apple-card p-6 mb-6">
          <h2 className="apple-text-medium text-black mb-3">Instructions</h2>
          <ul className="space-y-2">
            <li className="apple-text-body">• Enter one word per line</li>
            <li className="apple-text-body">• Words must be 3-9 letters long</li>
            <li className="apple-text-body">• Maximum 100 words allowed</li>
            <li className="apple-text-body">• Words will be converted to uppercase automatically</li>
            <li className="apple-text-body">• Custom words will be used first in random order</li>
            <li className="apple-text-body">• After all custom words are used, the game will use the default word list</li>
          </ul>
        </div>

        {/* Word Counter - Apple Design */}
        <div className="flex justify-between items-center mb-4">
          <span className="apple-text-small">
            Words: {wordCount}/100
          </span>
          <div className="flex gap-2">
            <button 
              onClick={handleClear}
              className="apple-button-secondary flex items-center gap-2 text-sm px-3 py-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </button>
            <button 
              onClick={handleSave}
              className="apple-button-primary flex items-center gap-2 text-sm px-3 py-2"
            >
              <Save className="h-4 w-4" />
              Save Words
            </button>
          </div>
        </div>

        {/* Text Area - Apple Design */}
        <div className="mb-6">
          <textarea
            value={customWords}
            onChange={handleTextChange}
            placeholder="Enter your custom words here, one per line...&#10;&#10;Example:&#10;CAT&#10;DOG&#10;HOUSE&#10;COMPUTER"
            className="apple-input w-full h-96 resize-none font-mono"
            maxLength={1000} // Reasonable limit for text area
          />
        </div>

        {/* Preview - Apple Design */}
        {customWords.trim() && (
          <div className="apple-card p-6 mb-6">
            <h3 className="apple-text-medium text-black mb-3">Preview ({wordCount} words)</h3>
            <div className="flex flex-wrap gap-2">
              {customWords.split('\n')
                .map(word => word.trim().toUpperCase())
                .filter(word => word.length > 0)
                .slice(0, 20) // Show first 20 words
                .map((word, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-black rounded-lg text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              {wordCount > 20 && (
                <span className="px-3 py-1 bg-gray-200 text-gray-600 rounded-lg text-sm">
                  +{wordCount - 20} more...
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons - Apple Design */}
        <div className="flex justify-center gap-3 mt-8">
          <button 
            onClick={handleSave}
            className="apple-button-primary flex items-center gap-2 min-w-[160px]"
          >
            <Save className="h-4 w-4" />
            Save Custom Words
          </button>
          <Link href="/">
            <button className="apple-button-secondary flex items-center gap-2 min-w-[160px]">
              <ArrowLeft className="h-4 w-4" />
              Back to Game
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
