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
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Game
              </Button>
            </Link>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">Custom Word List</h1>
          <p className="text-lg text-muted-foreground">
            Add up to 100 custom words that will be used first in the game, before the default word list.
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-muted/50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-3">Instructions:</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Enter one word per line</li>
            <li>• Words must be 3-9 letters long</li>
            <li>• Maximum 100 words allowed</li>
            <li>• Words will be converted to uppercase automatically</li>
            <li>• Custom words will be used first in random order</li>
            <li>• After all custom words are used, the game will use the default word list</li>
          </ul>
        </div>

        {/* Word Counter */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            Words: {wordCount}/100
          </span>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All
            </Button>
            <Button 
              onClick={handleSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Words
            </Button>
          </div>
        </div>

        {/* Text Area */}
        <div className="mb-6">
          <textarea
            value={customWords}
            onChange={handleTextChange}
            placeholder="Enter your custom words here, one per line...&#10;&#10;Example:&#10;CAT&#10;DOG&#10;HOUSE&#10;COMPUTER"
            className="w-full h-96 p-4 border border-input rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            maxLength={1000} // Reasonable limit for text area
          />
        </div>

        {/* Preview */}
        {customWords.trim() && (
          <div className="bg-muted/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Preview ({wordCount} words):</h3>
            <div className="flex flex-wrap gap-2">
              {customWords.split('\n')
                .map(word => word.trim().toUpperCase())
                .filter(word => word.length > 0)
                .slice(0, 20) // Show first 20 words
                .map((word, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                  >
                    {word}
                  </span>
                ))}
              {wordCount > 20 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                  +{wordCount - 20} more...
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            size="lg" 
            onClick={handleSave}
            className="flex items-center gap-2"
          >
            <Save className="h-5 w-5" />
            Save Custom Words
          </Button>
          <Link href="/">
            <Button 
              size="lg" 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Game
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
