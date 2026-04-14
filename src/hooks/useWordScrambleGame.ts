import { useState, useCallback, useRef } from "react";

export type Difficulty =
  | "easy" | "medium" | "hard" | "expert" | "master"
  | "grandmaster" | "genius" | "legend" | "mythic" | "immortal" | "divine";

// ── Word banks by length category ──────────────────────────────────────────
const WORDS_3_4 = ["cat","dog","sun","map","cup","hot","red","box","pen","fan","hat","bus","log","run","tip","bay","oak","gem","fin","sky","ice","owl","dew","fog","joy","net","rug","wax","zip","bee","cob","dim","elk","fry","gum","hen","ink","jam","keg","lex","mop","nap","orb","pod","raw","sap","tar","urn","van","web","yak","zoo","arch","bark","bean","bolt","cave","dash","echo","fade","gale","herb","iris","jade","knot","lace","maze","node","oval","pace","quiz","ramp","sage","tide","unit","vale","wand","xray","yawn","zero","atom","base","coil","dusk","earl","fork","gust","haze","isle","jest","keep","loft","moat","nova","oath","pave","quip","reef","silk","toil","urge","vase","weld","apex","buff","clue","dawn","emit","flux","grip","hull","jolt","kern","limb","mast","nest","oath","pike","rune","stem","tuft","vane","writ"];

const WORDS_5_6 = ["apple","brave","crane","delta","eagle","flame","grace","heart","ivory","jewel","knave","lemon","maple","noble","ocean","pearl","queen","raven","storm","tiger","ultra","vivid","whale","xenon","yacht","zebra","amber","blend","chaos","depot","elite","frost","globe","honey","index","joint","karma","latch","magic","north","olive","pixel","quark","rover","sharp","toxic","umbra","viola","witch","xerox","young","zonal","bridge","castle","dollar","enigma","forest","goblin","hunter","island","jungle","knight","legacy","mirror","napkin","orange","puzzle","quarry","rocket","saddle","throne","unique","valley","walnut","yonder","zephyr","arctic","blouse","chrome","dagger","effect","factor","geyser","harbor","insect","jaguar","kettle","lizard","method","nickel","object","planet","quartz","riddle","silver","turban","useful","vector","window","xyster","yeoman","zipper","allure","bronze","cipher","debate","errand","fabled","garnet","hollow","immune","jingle","knuckle","luster","mosaic","nymph","osmium","plover","quench","rhinos","scorch","timber","upbeat","vermil","wooden"];

const WORDS_7_8 = ["balance","captain","diamond","element","fantasy","garland","harmony","illicit","journal","kingdom","lantern","monarch","network","obscure","pathway","quantum","rainbow","sapphire","thunder","uniform","venture","warrior","xylenet","yearling","zeppelin","absolute","blankets","combines","delivers","enormous","festival","gradient","hologram","industry","journals","keyboard","landmark","measures","northern","operates","powerful","quantity","resource","segments","textbook","ultimate","vehicles","windmill","youngest","abstract","birthday","conquest","division","enormous","fragment","graceful","handbook","imperial","junction","labyrinth","movement","nobility","offshore","platform","question","regiment","separate","thousand","universe","variable","wildfire","yourself","abundant","boundary","cascaded","discover","eternity","function","generate","highland","implicit","judgment","kilogram","latitude","momentum","northern","overcome","paradise","quantity","released","strength","tropical","underway","vibrance","windward","examined","boundary","chemical","creative","dramatic","euphoria","flooring","globules","hypnotic","inactive","jigsawed","kaleidoscope"];

const WORDS_9_10 = ["adventure","beautiful","challenge","discovery","emergency","formation","greatness","honeymoon","icebreaker","labyrinth","masterwork","nightmare","obsidian","patchwork","questions","resonance","sanctuary","telephone","undermine","vigilance","waterfall","xylophone","yesterday","zoologist","algorithm","birthplace","clockwork","driftwood","evolution","fortunate","greatness","handcraft","isometric","jailbreak","kilobytes","limestone","magnified","nocturnal","overwrite","patchwork","quillwork","rhythmics","snowflake","transpose","universal","vanishing","wellbeing","xenophile","zymologia","blacksmith","cornerstone","dynamically","earthworks","frostbite","greyounds","handshake","induction","jellyfish","knowledge","longitude","mindscape","northward","olympians","panoramic","quicksand","renewable","shipwreck","tapestry","underline","vineyards","watershed","existence","yardstick","zealously","alabaster","brilliant","coastline","downwards","eventfully","fireplace","gratitude","hardscape","irradiate","journaled","kilowatts","landscape","moonlight","normalize","obscurity","plaintiff","quickstep","reflected","starlight","trademark","unbridled","viewpoint","whitewash","xenolith","yieldings"];

const WORDS_11_PLUS = ["constellation","distinguished","encyclopedia","extraordinary","fluorescence","gravitational","hallucination","incomprehensible","jubilantly","kaleidoscope","laryngoscope","metamorphosis","nomenclature","opportunities","perpendicular","quintessential","radioactivity","sophisticated","transcendence","unforgettable","visualization","wholeheartedly","xylographical","yesteryear","zooplanktonic","bibliography","circumstances","decentralized","electroplated","fundamentals","grandiloquent","heterogeneous","interconnected","journeywoman","knowledgeable","liberalization","multifaceted","notifications","orchestration","phenomenology","quintuplicate","revolutionary","subterranean","transformation","understandable","vaccination","waterproofing","xerographics","yellowhammer","zoomorphical"];

const WORD_BANKS: Record<Difficulty, string[]> = {
  easy:        WORDS_3_4,
  medium:      WORDS_5_6,
  hard:        WORDS_7_8,
  expert:      [...WORDS_7_8, ...WORDS_9_10].slice(0, 80),
  master:      WORDS_9_10,
  grandmaster: [...WORDS_9_10, ...WORDS_11_PLUS].slice(0, 60),
  genius:      WORDS_11_PLUS,
  legend:      WORDS_11_PLUS,
  mythic:      WORDS_11_PLUS,
  immortal:    WORDS_11_PLUS,
  divine:      WORDS_11_PLUS,
};

// Per-difficulty: how many words to solve + optional time limit (seconds)
const DIFF_CONFIG: Record<Difficulty, { count: number; timeLimit: number | null }> = {
  easy:        { count: 3,  timeLimit: null },
  medium:      { count: 4,  timeLimit: null },
  hard:        { count: 5,  timeLimit: 120  },
  expert:      { count: 6,  timeLimit: 90   },
  master:      { count: 7,  timeLimit: 75   },
  grandmaster: { count: 8,  timeLimit: 60   },
  genius:      { count: 10, timeLimit: 45   },
  legend:      { count: 12, timeLimit: 40   },
  mythic:      { count: 14, timeLimit: 35   },
  immortal:    { count: 16, timeLimit: 30   },
  divine:      { count: 20, timeLimit: 25   },
};

function seededRandom(seed: number) {
  let s = seed;
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 4294967296; };
}

function scramble(word: string, rand: () => number): string[] {
  const letters = word.toUpperCase().split("");
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  // Ensure it's actually scrambled
  if (letters.join("") === word.toUpperCase()) {
    if (letters.length >= 2) [letters[0], letters[1]] = [letters[1], letters[0]];
  }
  return letters;
}

function pickWords(difficulty: Difficulty, count: number, rand: () => number): string[] {
  const bank = WORD_BANKS[difficulty];
  const pool = [...bank];
  // shuffle pool
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export interface WordScrambleRound {
  target: string;          // lowercase target word
  scrambled: string[];     // uppercase letter tiles (initial scramble)
  placed: string[];        // letters placed by player so far
  remaining: string[];     // unplaced letters (from scrambled pool)
  solved: boolean;
  failed: boolean;
}

export interface WordScrambleState {
  difficulty: Difficulty;
  rounds: WordScrambleRound[];
  currentRound: number;
  moves: number;           // total letter placements
  won: boolean;
  lost: boolean;
  timeLimit: number | null;
  hintActive: boolean;
  peeking: boolean;
}

export function useWordScrambleGame() {
  const [game, setGame] = useState<WordScrambleState | null>(null);
  const historyRef = useRef<WordScrambleState[]>([]);
  const peekTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback((difficulty: Difficulty, rand: () => number = Math.random) => {
    historyRef.current = [];
    const { count, timeLimit } = DIFF_CONFIG[difficulty];
    const words = pickWords(difficulty, count, rand);
    const seedRand = rand;
    const rounds: WordScrambleRound[] = words.map(word => {
      const sc = scramble(word, seedRand);
      return {
        target: word.toLowerCase(),
        scrambled: sc,
        placed: [],
        remaining: [...sc],
        solved: false,
        failed: false,
      };
    });
    setGame({ difficulty, rounds, currentRound: 0, moves: 0, won: false, lost: false, timeLimit, hintActive: false, peeking: false });
  }, []);

  /** Place a letter from remaining into placed */
  const placeLetter = useCallback((letterIndex: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const round = prev.rounds[prev.currentRound];
      if (!round || round.solved || round.failed) return prev;

      historyRef.current.push(deepClone(prev));

      const newRemaining = [...round.remaining];
      const letter = newRemaining.splice(letterIndex, 1)[0];
      const newPlaced = [...round.placed, letter];

      // Check if placed equals target length
      let solved = false;
      let failed = false;
      if (newPlaced.length === round.target.length) {
        solved = newPlaced.join("").toLowerCase() === round.target;
        failed = !solved;
      }

      const newRounds = prev.rounds.map((r, i) =>
        i === prev.currentRound
          ? { ...r, placed: newPlaced, remaining: newRemaining, solved, failed }
          : r
      );

      // Auto-advance on solve
      let nextRound = prev.currentRound;
      let won = prev.won;
      if (solved) {
        if (prev.currentRound + 1 >= prev.rounds.length) {
          won = true;
        } else {
          nextRound = prev.currentRound + 1;
        }
      }

      return {
        ...prev,
        rounds: newRounds,
        currentRound: nextRound,
        moves: prev.moves + 1,
        won,
        hintActive: false,
      };
    });
  }, []);

  /** Remove the last placed letter back to remaining */
  const removeLast = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const round = prev.rounds[prev.currentRound];
      if (!round || round.solved || !round.placed.length) return prev;

      historyRef.current.push(deepClone(prev));
      const newPlaced = round.placed.slice(0, -1);
      const removedLetter = round.placed[round.placed.length - 1];
      const newRemaining = [...round.remaining, removedLetter];

      const newRounds = prev.rounds.map((r, i) =>
        i === prev.currentRound
          ? { ...r, placed: newPlaced, remaining: newRemaining, failed: false }
          : r
      );
      return { ...prev, rounds: newRounds, hintActive: false };
    });
  }, []);

  /** Retry current round (clear placed, restore remaining) */
  const retryRound = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      const round = prev.rounds[prev.currentRound];
      if (!round) return prev;
      historyRef.current.push(deepClone(prev));
      const newRounds = prev.rounds.map((r, i) =>
        i === prev.currentRound
          ? { ...r, placed: [], remaining: [...r.scrambled], solved: false, failed: false }
          : r
      );
      return { ...prev, rounds: newRounds, lost: false, hintActive: false };
    });
  }, []);

  const undo = useCallback(() => {
    const prev = historyRef.current.pop();
    if (prev) setGame(prev);
  }, []);

  const hint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      const round = prev.rounds[prev.currentRound];
      if (!round || round.solved || round.failed) return prev;
      return { ...prev, hintActive: true };
    });
  }, []);

  const peek = useCallback(() => {
    if (peekTimeout.current) clearTimeout(peekTimeout.current);
    setGame(prev => prev ? { ...prev, peeking: true } : prev);
    peekTimeout.current = setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 3000);
  }, []);

  const restart = useCallback(() => {
    historyRef.current = [];
    setGame(prev => {
      if (!prev) return prev;
      const rand = Math.random;
      const { count, timeLimit } = DIFF_CONFIG[prev.difficulty];
      const words = pickWords(prev.difficulty, count, rand);
      const rounds: WordScrambleRound[] = words.map(word => {
        const sc = scramble(word, rand);
        return { target: word.toLowerCase(), scrambled: sc, placed: [], remaining: [...sc], solved: false, failed: false };
      });
      return { ...prev, rounds, currentRound: 0, moves: 0, won: false, lost: false, timeLimit, hintActive: false, peeking: false };
    });
  }, []);

  const goToMenu = useCallback(() => {
    historyRef.current = [];
    setGame(null);
  }, []);

  return { game, startGame, placeLetter, removeLast, retryRound, undo, hint, peek, restart, goToMenu };
}

function deepClone(state: WordScrambleState): WordScrambleState {
  return {
    ...state,
    rounds: state.rounds.map(r => ({
      ...r,
      scrambled: [...r.scrambled],
      placed: [...r.placed],
      remaining: [...r.remaining],
    })),
  };
}
