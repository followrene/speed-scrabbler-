// Curated list of English words 3-9 letters long for the Speed Scrabbler game
// Organized by length with preferred words that are used first

// Preferred words that should be used first in random order
export const PREFERRED_WORDS_BY_LENGTH = {
  3: ['VIEW', 'LOSE'],
  4: ['MOIST', 'LOYAL', 'AVOID', 'HAUNT', 'ROYAL'],
  5: ['OUNCE', 'SPRAWL', 'LAUNCH', 'SAUCER', 'POUNCE', 'POISON', 'AUGUST', 'COWARD', 'EMPLOY', 'FLUTE', 'CRUISE', 'AVENUE', 'CHOOSE', 'BRUISE'],
  6: ['DESTROY', 'AUCTION', 'AWKWARD', 'AWESOME', 'CARTOON', 'COMPUTER'],
  7: ['NAUGHTY', 'ENCOUNTER', 'AVOIDABLE', 'BARBEQUE', 'SOUVENIR'],
  8: ['AUTOGRAPH'],
  9: ['BASKETBALL']
};

// Regular word list (used after preferred words are exhausted)
export const WORD_LIST_BY_LENGTH = {
  3: [
    // Animals
    'CAT', 'DOG', 'BAT', 'RAT', 'PIG', 'COW', 'FOX', 'HEN', 'DUCK', 'OWL',
    // Food & Objects
    'BAG', 'HAT', 'CUP', 'BED', 'CAR', 'KEY', 'MAP', 'BOX', 'JAR', 'CAN',
    // Actions & Colors
    'RUN', 'SIT', 'EAT', 'DRY', 'WET', 'RED', 'BLUE', 'HOT', 'COLD', 'NEW',
    // Common words
    'THE', 'AND', 'FOR', 'BUT', 'NOT', 'ALL', 'ANY', 'ONE', 'TWO', 'SIX'
  ],
  4: [
    // Animals
    'BIRD', 'FISH', 'DEER', 'BEAR', 'WOLF', 'LION', 'TIGER', 'SHARK', 'WHALE', 'EAGLE',
    // Food & Objects
    'CAKE', 'MILK', 'BREAD', 'MEAT', 'BOOK', 'TREE', 'HOUSE', 'DOOR', 'WINDOW', 'CHAIR',
    // Actions & Colors
    'JUMP', 'PLAY', 'WORK', 'READ', 'WRITE', 'SING', 'DANCE', 'BLUE', 'GREEN', 'BLACK',
    // Common words
    'HOME', 'LIFE', 'WATER', 'FIRE', 'EARTH', 'WIND', 'SUN', 'MOON', 'STAR', 'GOLD'
  ],
  5: [
    // Animals
    'HORSE', 'SNAKE', 'MONKEY', 'TIGER', 'PANDA', 'KOALA', 'ZEBRA', 'LLAMA',
    // Food & Objects
    'APPLE', 'BREAD', 'PIZZA', 'BURGER', 'SALAD', 'SANDWICH', 'COFFEE', 'WATER',
    // Actions & Colors
    'DANCE', 'SING', 'PAINT', 'DRAW', 'STUDY', 'LEARN', 'TEACH', 'BUILD',
    // Common words
    'HOUSE', 'SCHOOL', 'WORLD', 'PEACE', 'HAPPY', 'BRAVE', 'SMART', 'QUICK'
  ],
  6: [
    // Animals
    'DOLPHIN', 'PENGUIN', 'OSTRICH', 'FLAMINGO', 'PEACOCK', 'EAGLE', 'FALCON', 'PARROT',
    // Food & Objects
    'BANANA', 'ORANGE', 'GRAPES', 'COCONUT', 'AVOCADO', 'PINEAPPLE', 'WATERMELON', 'STRAWBERRY',
    // Actions & Colors
    'DANCING', 'SINGING', 'PAINTING', 'DRAWING', 'STUDYING', 'LEARNING', 'TEACHING', 'BUILDING',
    // Common words
    'BEAUTIFUL', 'WONDERFUL', 'POWERFUL', 'HOPEFUL', 'THANKFUL', 'GRATEFUL', 'CAREFUL', 'PEACEFUL'
  ],
  7: [
    // Animals
    'ELEPHANT', 'GIRAFFE', 'KANGAROO', 'PENGUIN', 'OSTRICH', 'FLAMINGO', 'PEACOCK', 'EAGLE',
    // Food & Objects
    'COMPUTER', 'TELEPHONE', 'TELEVISION', 'RADIO', 'CAMERA', 'PRINTER', 'SCANNER', 'KEYBOARD',
    // Actions & Colors
    'MOUNTAIN', 'VOLCANO', 'WATERFALL', 'GLACIER', 'DESERT', 'JUNGLE', 'SAVANNA', 'TUNDRA',
    // Common words
    'UNIVERSITY', 'HOSPITAL', 'LIBRARY', 'MUSEUM', 'THEATER', 'RESTAURANT', 'AIRPORT', 'STATION'
  ],
  8: [
    // Animals
    'ELEPHANT', 'GIRAFFE', 'KANGAROO', 'PENGUIN', 'OSTRICH', 'FLAMINGO', 'PEACOCK', 'EAGLE',
    // Food & Objects
    'COMPUTER', 'TELEPHONE', 'TELEVISION', 'RADIO', 'CAMERA', 'PRINTER', 'SCANNER', 'KEYBOARD',
    // Actions & Colors
    'MOUNTAIN', 'VOLCANO', 'WATERFALL', 'GLACIER', 'DESERT', 'JUNGLE', 'SAVANNA', 'TUNDRA',
    // Common words
    'UNIVERSITY', 'HOSPITAL', 'LIBRARY', 'MUSEUM', 'THEATER', 'RESTAURANT', 'AIRPORT', 'STATION'
  ],
  9: [
    // Animals
    'ELEPHANT', 'GIRAFFE', 'KANGAROO', 'PENGUIN', 'OSTRICH', 'FLAMINGO', 'PEACOCK', 'EAGLE',
    // Food & Objects
    'COMPUTER', 'TELEPHONE', 'TELEVISION', 'RADIO', 'CAMERA', 'PRINTER', 'SCANNER', 'KEYBOARD',
    // Actions & Colors
    'MOUNTAIN', 'VOLCANO', 'WATERFALL', 'GLACIER', 'DESERT', 'JUNGLE', 'SAVANNA', 'TUNDRA',
    // Common words
    'UNIVERSITY', 'HOSPITAL', 'LIBRARY', 'MUSEUM', 'THEATER', 'RESTAURANT', 'AIRPORT', 'STATION'
  ]
};

// Track which words have been used
let usedCustomWords: Set<string> = new Set();
let usedPreferredWords: { [length: number]: Set<string> } = {};

// Fisher-Yates shuffle algorithm for better randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Generate a random seed based on current time to add more entropy (currently unused)
// function getRandomSeed(): number {
//   return Date.now() + Math.random() * 1000000;
// }

// Get custom words from localStorage
function getCustomWords(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const saved = localStorage.getItem('customWords');
    if (!saved) return [];
    
    return saved.split('\n')
      .map(word => word.trim().toUpperCase())
      .filter(word => word.length >= 3 && word.length <= 9);
  } catch (error) {
    console.error('Error loading custom words:', error);
    return [];
  }
}

// Get lengths that have preferred words
function getPreferredLengths(): number[] {
  return Object.keys(PREFERRED_WORDS_BY_LENGTH)
    .map(Number)
    .filter(length => PREFERRED_WORDS_BY_LENGTH[length as keyof typeof PREFERRED_WORDS_BY_LENGTH].length > 0);
}

// Check if all custom words have been used
function areAllCustomWordsUsed(): boolean {
  const customWords = getCustomWords();
  return customWords.length > 0 && customWords.every(word => usedCustomWords.has(word));
}

// Check if all preferred words for a length have been used
function areAllPreferredWordsUsed(length: number): boolean {
  if (!usedPreferredWords[length]) return false;
  const preferredWords = PREFERRED_WORDS_BY_LENGTH[length as keyof typeof PREFERRED_WORDS_BY_LENGTH] || [];
  return preferredWords.every(word => usedPreferredWords[length].has(word));
}

// Check if all preferred words across all lengths have been used
function areAllPreferredWordsExhausted(): boolean {
  const preferredLengths = getPreferredLengths();
  return preferredLengths.every(length => areAllPreferredWordsUsed(length));
}

// Function to get a random word of specific length, prioritizing custom and preferred words
export function getRandomWordByLength(length: number): string {
  // Initialize used words set for this length if it doesn't exist
  if (!usedPreferredWords[length]) {
    usedPreferredWords[length] = new Set();
  }
  
  const customWords = getCustomWords();
  const preferredWords = PREFERRED_WORDS_BY_LENGTH[length as keyof typeof PREFERRED_WORDS_BY_LENGTH] || [];
  const regularWords = WORD_LIST_BY_LENGTH[length as keyof typeof WORD_LIST_BY_LENGTH] || [];
  
  // First priority: Custom words of this length that haven't been used
  const unusedCustomWords = customWords.filter(word => 
    word.length === length && !usedCustomWords.has(word)
  );
  
  if (unusedCustomWords.length > 0) {
    // Shuffle the unused custom words for better randomization
    const shuffledCustom = shuffleArray(unusedCustomWords);
    const selectedWord = shuffledCustom[0];
    usedCustomWords.add(selectedWord);
    return selectedWord;
  }
  
  // Second priority: Preferred words that haven't been used yet
  if (preferredWords.length > 0) {
    const unusedPreferred = preferredWords.filter(word => !usedPreferredWords[length].has(word));
    
    if (unusedPreferred.length > 0) {
      // Shuffle the unused preferred words for better randomization
      const shuffledPreferred = shuffleArray(unusedPreferred);
      const selectedWord = shuffledPreferred[0];
      usedPreferredWords[length].add(selectedWord);
      return selectedWord;
    }
  }
  
  // Third priority: Regular words
  if (regularWords.length === 0) {
    return 'HELLO'; // Fallback
  }
  
  // Shuffle regular words for better randomization
  const shuffledRegular = shuffleArray(regularWords);
  return shuffledRegular[0];
}

// Function to get a random word, prioritizing custom words first
export function getRandomWord(): string {
  const customWords = getCustomWords();
  
  // If we have custom words that haven't been used yet
  if (customWords.length > 0 && !areAllCustomWordsUsed()) {
    const unusedCustom = customWords.filter(word => !usedCustomWords.has(word));
    if (unusedCustom.length > 0) {
      // Shuffle unused custom words for better randomization
      const shuffledCustom = shuffleArray(unusedCustom);
      const selectedWord = shuffledCustom[0];
      usedCustomWords.add(selectedWord);
      return selectedWord;
    }
  }
  
  // If all custom words are used, check preferred words
  const preferredLengths = getPreferredLengths();
  
  if (preferredLengths.length > 0 && !areAllPreferredWordsExhausted()) {
    const lengthsWithUnusedPreferred = preferredLengths.filter(length => !areAllPreferredWordsUsed(length));
    
    if (lengthsWithUnusedPreferred.length > 0) {
      // Shuffle available lengths for better randomization
      const shuffledLengths = shuffleArray(lengthsWithUnusedPreferred);
      return getRandomWordByLength(shuffledLengths[0]);
    }
  }
  
  // If all custom and preferred words are exhausted, select from any length
  const allLengths = Object.keys(WORD_LIST_BY_LENGTH).map(Number);
  const shuffledAllLengths = shuffleArray(allLengths);
  return getRandomWordByLength(shuffledAllLengths[0]);
}

// Function to reset the used words (useful for new games)
export function resetUsedPreferredWords(): void {
  usedCustomWords = new Set();
  usedPreferredWords = {};
}

// Improved function to scramble letters in a word
// Ensures the scrambled word is different from the original
export function scrambleWord(word: string): string {
  if (word.length <= 1) return word;
  
  let scrambled = word;
  let attempts = 0;
  const maxAttempts = 10;
  
  // Try to create a different scrambled version
  while (scrambled === word && attempts < maxAttempts) {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    scrambled = letters.join('');
    attempts++;
  }
  
  // If we couldn't get a different version, just return the original
  // This happens with words like "AAA" where scrambling doesn't change anything
  return scrambled;
}

// Function to check if a word length is valid (3-9 letters)
export function isValidWordLength(word: string): boolean {
  return word.length >= 3 && word.length <= 9;
}

// Function to get all available word lengths
export function getAvailableWordLengths(): number[] {
  return Object.keys(WORD_LIST_BY_LENGTH).map(Number).sort((a, b) => a - b);
}

// New function to get word count by length
export function getWordCountByLength(length: number): number {
  const customWords = getCustomWords();
  const customCount = customWords.filter(word => word.length === length).length;
  const preferredWords = PREFERRED_WORDS_BY_LENGTH[length as keyof typeof PREFERRED_WORDS_BY_LENGTH] || [];
  const regularWords = WORD_LIST_BY_LENGTH[length as keyof typeof WORD_LIST_BY_LENGTH] || [];
  return customCount + preferredWords.length + regularWords.length;
}

// New function to get total word count across all lengths
export function getTotalWordCount(): number {
  const customWords = getCustomWords();
  const preferredCount = Object.values(PREFERRED_WORDS_BY_LENGTH).reduce((total, words) => total + words.length, 0);
  const regularCount = Object.values(WORD_LIST_BY_LENGTH).reduce((total, words) => total + words.length, 0);
  return customWords.length + preferredCount + regularCount;
}

// New function to get words by category (for future use)
export function getWordsByCategory(category: string): string[] {
  // This could be expanded to categorize words by theme
  // For now, return all words
  const customWords = getCustomWords();
  const preferredWords = Object.values(PREFERRED_WORDS_BY_LENGTH).flat();
  const regularWords = Object.values(WORD_LIST_BY_LENGTH).flat();
  return [...customWords, ...preferredWords, ...regularWords];
}
