import { useState, useCallback, useRef } from "react";

export type Difficulty = "easy" | "medium" | "hard" | "expert" | "master" | "grandmaster" | "genius";

// Word lists by length
const WORDS_4 = [
  "BARK","BEAM","BELL","BOLT","BORN","BULK","BURN","CALL","CALM","CAMP",
  "CARD","CARE","CART","CAVE","CHIN","CHIP","CLAN","CLAY","CLIP","CLUE",
  "COAL","COAT","CODE","COIN","COLD","COMB","CONE","COOL","CORD","CORE",
  "CORN","COST","COZY","CRAM","CROP","CROW","CURL","DAMP","DARE","DARK",
  "DART","DASH","DAWN","DEAD","DEAF","DEAL","DEAR","DECK","DEEP","DENY",
  "DESK","DILL","DIRT","DISK","DIVE","DOCK","DOME","DOOR","DORE","DOWN",
  "DRAG","DRAW","DRIP","DRUM","DUCK","DULL","DUNE","DUSK","DUST","EDGE",
  "ELSE","EVEN","FACE","FACT","FAIL","FAIR","FALL","FAME","FARM","FAST",
  "FATE","FAWN","FEAR","FEAT","FEED","FEEL","FELT","FILE","FILL","FILM",
  "FIND","FIRE","FISH","FIST","FIVE","FIZZ","FLAG","FLAW","FLEW","FLIP",
  "FLOW","FOAM","FOLD","FOND","FONT","FOOD","FOOL","FORD","FORK","FORM",
  "FORT","FOUR","FROG","FROM","FUEL","FULL","FUND","FUSE","GAIN","GALE",
  "GAME","GANG","GAVE","GAZE","GEAR","GIFT","GIRL","GIST","GIVE","GLAD",
  "GLOW","GLUE","GOAL","GOLD","GOLF","GOOD","GOWN","GRAB","GRAM","GRAY",
  "GRIP","GRIT","GROW","GULF","GUST","HACK","HAIL","HAIR","HALF","HALL",
  "HALT","HAND","HANG","HARD","HARM","HARP","HASH","HATE","HAVE","HAWK",
  "HAZE","HEAD","HEAL","HEAP","HEAT","HEEL","HELM","HELP","HERB","HERE",
  "HIGH","HILL","HINT","HIRE","HOLD","HOLE","HOME","HOOK","HOPE","HORN",
  "HOST","HOUR","HULK","HUMP","HUNT","HURT","HYMN","IDEA","IDLE","ITCH",
  "JADE","JAIL","JEST","JOBS","JOIN","JUMP","JUST","KEEN","KEEP","KICK",
];
const WORDS_5 = [
  "ABOUT","ABOVE","ABUSE","ACTOR","ACUTE","ADMIN","ADMIT","ADULT","AFTER","AGAIN",
  "AGILE","ALARM","ALBUM","ALERT","ALGAE","ALIBI","ALIEN","ALIGN","ALIKE","ALONE",
  "ALONG","ALTER","ANGEL","ANGLE","ANIME","ANKLE","ANNEX","APPLE","APPLY","ARENA",
  "ARGUE","ARISE","ARMOR","ARROW","ATLAS","ATTIC","AUDIO","AUDIT","AVOID","AWARD",
  "AWARE","AWFUL","BAKER","BASIC","BASIN","BASIS","BATCH","BEACH","BEGIN","BEING",
  "BELOW","BENCH","BIBLE","BIRTH","BLACK","BLADE","BLAME","BLANK","BLAST","BLAZE",
  "BLEED","BLEND","BLIND","BLOCK","BLOOD","BLOOM","BLOWN","BLUES","BLUNT","BLURT",
  "BOARD","BONUS","BOOST","BOUND","BRAIN","BRAND","BRAVE","BREAD","BREAK","BRICK",
  "BRIDE","BRIEF","BRING","BROOK","BROWN","BRUSH","BUILD","BUNCH","BURST","BUYER",
  "CABIN","CABLE","CAMEL","CANDY","CARRY","CATCH","CAUSE","CHAIN","CHAIR","CHALK",
  "CHAOS","CHARM","CHASE","CHECK","CHEEK","CHESS","CHEST","CHIEF","CHILD","CHINA",
  "CHOIR","CHUNK","CLAIM","CLASH","CLASS","CLEAN","CLEAR","CLERK","CLICK","CLIFF",
  "CLIMB","CLING","CLOCK","CLOSE","CLOUD","COAST","COMET","COMIC","CORAL","COULD",
  "COUNT","COURT","COVER","CRACK","CRAFT","CRANE","CRASH","CRAZY","CREAM","CRIME",
  "CROSS","CROWD","CRUSH","CRUST","CURVE","CYCLE","DAILY","DANCE","DEATH","DEBUT",
  "DELAY","DELVE","DENSE","DEPOT","DEPTH","DERBY","DEVIL","DIGIT","DIRTY","DISCO",
  "DONUT","DRAFT","DRAIN","DRAMA","DRANK","DRAWL","DREAM","DRINK","DRIVE","DRONE",
  "DROVE","DROWN","DRUGS","DRUMS","DRUNK","DRYER","DWARF","EAGLE","EARLY","EARTH",
  "EIGHT","ELITE","EMOTE","EMPTY","ENEMY","ENJOY","ENTER","ENTRY","EQUAL","EQUIP",
  "EVADE","EVENT","EXACT","EXILE","EXTRA","FABLE","FACET","FAINT","FAITH","FALSE",
];
const WORDS_6 = [
  "ABROAD","ABSORB","ACCENT","ACCEPT","ACCESS","ACCORD","ACCRUE","ACCUSE","ACROSS","ACTING",
  "ACTION","ACTIVE","ACTUAL","ADVENT","ADVICE","ADVISE","AFFECT","AFFORD","AFRAID","AGENDA",
  "ALMOST","ALWAYS","ANIMAL","ANNUAL","ANSWER","ANYONE","ANYWAY","APPEAL","APPEAR","AROUND",
  "ARTIST","ASSERT","ASSESS","ASSIGN","ASSIST","ASSURE","ATTACK","ATTEND","BATTLE","BEAUTY",
  "BEFORE","BELONG","BETTER","BEWARE","BISHOP","BITTER","BORDER","BOTTLE","BOTTOM","BOUNCE",
  "BRANCH","BRIDGE","BRIGHT","BROKEN","BUBBLE","BUDGET","BUNDLE","BURDEN","BUTLER","BUTTON",
  "CAMERA","CANDLE","CANNON","CASTLE","CASUAL","CATTLE","CAUGHT","CHANCE","CHANGE","CHARGE",
  "CHOOSE","CHROME","CIRCLE","CLIENT","CLOSED","CLOSER","COMBAT","COMING","COMMIT","COMMON",
  "CORNER","COTTON","COURSE","CREATE","CREDIT","CRISIS","CROSS","CRUTCH","CUSTOM","DAMAGE",
  "DANGER","DAYDREAM","DEBATE","DEFINE","DEGREE","DELETE","DEMAND","DEPEND","DEPLOY","DESERT",
];
const WORDS_7 = [
  "ACCOUNT","ACHIEVE","ACQUIRE","ADDRESS","ANCIENT","ANOTHER","ANXIETY","ARRANGE","ARTICLE","ASSAULT",
  "ATTEMPT","ATTRACT","BALANCE","BANQUET","BATTERY","BIZARRE","BLOSSOM","CABINET","CAPTAIN","CASCADE",
  "CHAPTER","CHARITY","COMMAND","COMMENT","COMPILE","CONCERN","CONDUCT","CONFIRM","CONNECT","CONTENT",
  "CONTROL","CONVERT","COUNCIL","COURAGE","CURRENT","CURTAIN","CUSHION","DECEIVE","DELIVER","DEVOTED",
  "DIGITAL","DILEMMA","DISCORD","DISCUSS","DISMISS","DISPUTE","DISTANT","EXCLUDE","EXPLORE","FASCINATE",
];
const WORDS_8 = [
  "ABSOLUTE","ACCEPTED","ACCIDENT","ACCURATE","ACHIEVED","ACQUIRED","ACTIVELY","ADEQUATE","ADJACENT","ADVANCED",
  "ALPHABET","AMBITION","ANNOUNCE","ARGUMENT","ASSEMBLY","BACKBONE","BALANCED","CALENDAR","CAMPAIGN","CATEGORY",
  "CHAMPION","CHEMICAL","CIVILIAN","COINCIDE","COMMENCE","COMPLETE","COMPOUND","CONTRAST","CONVINCE","CORRIDOR",
  "DEADLINE","DECISION","DECREASE","DEFEATED","DESCRIBE","DIALOGUE","DIRECTLY","DISCOVER","DISPROVE","DISTINCT",
];

const WORD_LISTS: Record<number, string[]> = {
  4: WORDS_4,
  5: WORDS_5,
  6: WORDS_6,
  7: WORDS_7,
  8: WORDS_8,
};

interface Config { wordLength: number; maxAttempts: number }
const CONFIGS: Record<Difficulty, Config> = {
  easy:        { wordLength: 4, maxAttempts: 8 },
  medium:      { wordLength: 5, maxAttempts: 6 },
  hard:        { wordLength: 5, maxAttempts: 5 },
  expert:      { wordLength: 6, maxAttempts: 6 },
  master:      { wordLength: 7, maxAttempts: 6 },
  grandmaster: { wordLength: 7, maxAttempts: 5 },
  genius:      { wordLength: 8, maxAttempts: 5 },
};

export type LetterState = "correct" | "present" | "absent" | "empty" | "tbd";

export interface GuessRow {
  letters: string[];
  states: LetterState[];
  submitted: boolean;
}

export interface WordGuessState {
  target: string;
  wordLength: number;
  maxAttempts: number;
  rows: GuessRow[];
  currentRow: number;
  currentCol: number;
  won: boolean;
  lost: boolean;
  difficulty: Difficulty;
  usedLetters: Record<string, LetterState>;
  revealed: boolean; // peek
}

function pickWord(wordLength: number, rand: () => number): string {
  const list = WORD_LISTS[wordLength] || WORDS_5;
  return list[Math.floor(rand() * list.length)];
}

function makeState(difficulty: Difficulty, rand: () => number): WordGuessState {
  const { wordLength, maxAttempts } = CONFIGS[difficulty];
  const target = pickWord(wordLength, rand);
  const rows: GuessRow[] = Array.from({ length: maxAttempts }, () => ({
    letters: Array(wordLength).fill(""),
    states: Array(wordLength).fill("empty" as LetterState),
    submitted: false,
  }));
  return {
    target,
    wordLength,
    maxAttempts,
    rows,
    currentRow: 0,
    currentCol: 0,
    won: false,
    lost: false,
    difficulty,
    usedLetters: {},
    revealed: false,
  };
}

function evaluateGuess(guess: string[], target: string): LetterState[] {
  const states: LetterState[] = Array(target.length).fill("absent");
  const targetChars = target.split("");
  const usedTarget = Array(target.length).fill(false);

  // First pass: correct positions
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === targetChars[i]) {
      states[i] = "correct";
      usedTarget[i] = true;
    }
  }
  // Second pass: present but wrong position
  for (let i = 0; i < guess.length; i++) {
    if (states[i] === "correct") continue;
    for (let j = 0; j < targetChars.length; j++) {
      if (!usedTarget[j] && guess[i] === targetChars[j]) {
        states[i] = "present";
        usedTarget[j] = true;
        break;
      }
    }
  }
  return states;
}

export function useWordGuessGame() {
  const [game, setGame] = useState<WordGuessState | null>(null);
  const randRef = useRef<(() => number) | null>(null);
  const diffRef = useRef<Difficulty>("easy");

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    randRef.current = rand;
    diffRef.current = difficulty;
    setGame(makeState(difficulty, rand));
  }, []);

  const typeLetter = useCallback((letter: string) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.currentCol >= prev.wordLength) return prev;
      if (prev.rows[prev.currentRow].submitted) return prev;
      const rows = prev.rows.map((r, i) => {
        if (i !== prev.currentRow) return r;
        const letters = [...r.letters];
        letters[prev.currentCol] = letter.toUpperCase();
        return { ...r, letters, states: r.states.map((s, j) => j === prev.currentCol ? "tbd" as LetterState : s) };
      });
      return { ...prev, rows, currentCol: prev.currentCol + 1 };
    });
  }, []);

  const deleteLetter = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.currentCol <= 0) return prev;
      const col = prev.currentCol - 1;
      const rows = prev.rows.map((r, i) => {
        if (i !== prev.currentRow) return r;
        const letters = [...r.letters];
        letters[col] = "";
        const states = [...r.states];
        states[col] = "empty";
        return { ...r, letters, states };
      });
      return { ...prev, rows, currentCol: col };
    });
  }, []);

  const submitGuess = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      if (prev.currentCol < prev.wordLength) return prev; // not enough letters
      const row = prev.rows[prev.currentRow];
      const guess = row.letters;
      const states = evaluateGuess(guess, prev.target);
      const newUsedLetters = { ...prev.usedLetters };
      guess.forEach((letter, i) => {
        const cur = newUsedLetters[letter];
        if (states[i] === "correct") newUsedLetters[letter] = "correct";
        else if (states[i] === "present" && cur !== "correct") newUsedLetters[letter] = "present";
        else if (!cur || cur === "empty") newUsedLetters[letter] = "absent";
      });
      const won = states.every(s => s === "correct");
      const newRow = prev.currentRow + 1;
      const lost = !won && newRow >= prev.maxAttempts;
      const rows = prev.rows.map((r, i) => i === prev.currentRow ? { ...r, states, submitted: true } : r);
      return { ...prev, rows, currentRow: newRow, currentCol: 0, won, lost, usedLetters: newUsedLetters };
    });
  }, []);

  const restart = useCallback(() => {
    if (randRef.current) setGame(makeState(diffRef.current, randRef.current));
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      // Fill in the first unknown letter in current row
      const row = prev.rows[prev.currentRow];
      const firstEmpty = row.letters.findIndex((l, i) => l === "" || !prev.usedLetters[prev.target[i]]);
      if (firstEmpty === -1) return prev;
      const correctLetter = prev.target[firstEmpty];
      const rows = prev.rows.map((r, i) => {
        if (i !== prev.currentRow) return r;
        const letters = [...r.letters];
        letters[firstEmpty] = correctLetter;
        const states = [...r.states];
        states[firstEmpty] = "tbd";
        return { ...r, letters, states };
      });
      const newCol = Math.max(prev.currentCol, firstEmpty + 1);
      return { ...prev, rows, currentCol: Math.min(newCol, prev.wordLength) };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => prev ? { ...prev, revealed: !prev.revealed } : prev);
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, startGame, typeLetter, deleteLetter, submitGuess, restart, hint, peek, goToMenu };
}
