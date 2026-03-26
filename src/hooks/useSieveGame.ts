import { useState, useCallback, useRef } from "react";
import { Difficulty } from "@/hooks/useShiftGame";

// Rule types for number theory challenge
type RuleType =
  | "multiples"
  | "divisors_count"
  | "digit_sum"
  | "prime"
  | "perfect_square"
  | "coprime"
  | "palindrome"
  | "fibonacci"
  | "triangular"
  | "digit_product"
  | "mod_condition"
  | "twin_prime_neighbor"
  | "abundant"
  | "deficient"
  | "harshad"
  | "compound_and"
  | "compound_or"
  | "compound_not";

interface Rule {
  type: RuleType;
  params: Record<string, number>;
  subRules?: Rule[];
  description: string;
}

export interface SieveState {
  limit: number;
  grid: number[];
  marked: boolean[];
  correct: boolean[]; // ground truth for current rule
  moves: number;
  won: boolean;
  lost: boolean;
  difficulty: string;
  hintCell: number | null;
  peeking: boolean;
  round: number;
  totalRounds: number;
  currentRule: Rule;
  mistakes: number;
  maxMistakes: number;
  roundComplete: boolean;
  score: number;
}

// Math helpers
function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function divisorCount(n: number): number {
  let count = 0;
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) { count++; if (i !== n / i) count++; }
  }
  return count;
}

function digitSum(n: number): number {
  return String(n).split("").reduce((s, d) => s + Number(d), 0);
}

function digitProduct(n: number): number {
  return String(n).split("").reduce((p, d) => p * Number(d), 1);
}

function isPerfectSquare(n: number): boolean {
  const s = Math.sqrt(n);
  return Math.floor(s) * Math.floor(s) === n;
}

function gcd(a: number, b: number): number {
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function isCoprime(a: number, b: number): boolean {
  return gcd(a, b) === 1;
}

function isPalindrome(n: number): boolean {
  const s = String(n);
  return s === s.split("").reverse().join("");
}

function isFibonacci(n: number): boolean {
  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
}

function isTriangular(n: number): boolean {
  const k = Math.floor((-1 + Math.sqrt(1 + 8 * n)) / 2);
  return k * (k + 1) / 2 === n;
}

function sumOfDivisors(n: number): number {
  let s = 0;
  for (let i = 1; i * i <= n; i++) {
    if (n % i === 0) { s += i; if (i !== n / i) s += n / i; }
  }
  return s;
}

function isAbundant(n: number): boolean { return sumOfDivisors(n) - n > n; }
function isDeficient(n: number): boolean { return sumOfDivisors(n) - n < n; }
function isHarshad(n: number): boolean { return n % digitSum(n) === 0; }

function isTwinPrimeNeighbor(n: number): boolean {
  return (isPrime(n) && (isPrime(n - 2) || isPrime(n + 2)));
}

function evaluateRule(n: number, rule: Rule): boolean {
  switch (rule.type) {
    case "multiples": return n % rule.params.of === 0;
    case "divisors_count": return divisorCount(n) === rule.params.count;
    case "digit_sum": return rule.params.prime ? isPrime(digitSum(n)) : digitSum(n) === rule.params.value;
    case "prime": return isPrime(n);
    case "perfect_square": return isPerfectSquare(n);
    case "coprime": return isCoprime(n, rule.params.to);
    case "palindrome": return isPalindrome(n);
    case "fibonacci": return isFibonacci(n);
    case "triangular": return isTriangular(n);
    case "digit_product": return rule.params.prime ? isPrime(digitProduct(n)) : digitProduct(n) === rule.params.value;
    case "mod_condition": return n % rule.params.mod === rule.params.remainder;
    case "twin_prime_neighbor": return isTwinPrimeNeighbor(n);
    case "abundant": return isAbundant(n);
    case "deficient": return isDeficient(n);
    case "harshad": return isHarshad(n);
    case "compound_and":
      return rule.subRules!.every(r => evaluateRule(n, r));
    case "compound_or":
      return rule.subRules!.some(r => evaluateRule(n, r));
    case "compound_not":
      return !evaluateRule(n, rule.subRules![0]);
    default: return false;
  }
}

// Seeded RNG
function seededRng(seed: number) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

// Generate rules by difficulty tier
function generateRules(difficulty: Difficulty, rand: () => number): Rule[] {
  const pick = <T>(arr: T[]): T => arr[Math.floor(rand() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

  const simpleRules: (() => Rule)[] = [
    () => { const m = pick([3, 4, 5, 6, 7, 8, 9, 11, 13]); return { type: "multiples", params: { of: m }, description: `Multiples of ${m}` }; },
    () => { const c = pick([2, 3, 4, 6, 8]); return { type: "divisors_count", params: { count: c }, description: `Numbers with exactly ${c} divisors` }; },
    () => ({ type: "prime", params: {}, description: "Prime numbers" }),
    () => ({ type: "perfect_square", params: {}, description: "Perfect squares" }),
    () => ({ type: "palindrome", params: {}, description: "Palindromic numbers" }),
    () => ({ type: "fibonacci", params: {}, description: "Fibonacci numbers" }),
    () => ({ type: "triangular", params: {}, description: "Triangular numbers" }),
    () => ({ type: "abundant", params: {}, description: "Abundant numbers (sum of proper divisors > number)" }),
    () => ({ type: "deficient", params: {}, description: "Deficient numbers (sum of proper divisors < number)" }),
    () => ({ type: "harshad", params: {}, description: "Harshad numbers (divisible by their digit sum)" }),
    () => ({ type: "twin_prime_neighbor", params: {}, description: "Twin prime numbers (differ by 2 from another prime)" }),
    () => ({ type: "digit_sum", params: { prime: 1 }, description: "Numbers whose digit sum is prime" }),
    () => ({ type: "digit_product", params: { prime: 1 }, description: "Numbers whose digit product is prime" }),
    () => { const m = randInt(3, 11); const r = randInt(0, m - 1); return { type: "mod_condition", params: { mod: m, remainder: r }, description: `Numbers where n mod ${m} = ${r}` }; },
    () => { const t = pick([6, 10, 14, 15, 21, 30, 35]); return { type: "coprime", params: { to: t }, description: `Numbers coprime to ${t}` }; },
  ];

  const makeCompound = (): Rule => {
    const r1 = pick(simpleRules)();
    const r2 = pick(simpleRules.filter(f => f !== undefined))();
    const op = pick(["and", "or"] as const);
    if (op === "and") {
      return { type: "compound_and", params: {}, subRules: [r1, r2], description: `${r1.description} AND ${r2.description}` };
    }
    return { type: "compound_or", params: {}, subRules: [r1, r2], description: `${r1.description} OR ${r2.description}` };
  };

  const makeCompoundNot = (): Rule => {
    const r1 = pick(simpleRules)();
    const r2 = pick(simpleRules)();
    return { type: "compound_and", params: {}, subRules: [r1, { type: "compound_not", params: {}, subRules: [r2], description: `NOT ${r2.description}` }], description: `${r1.description} BUT NOT ${r2.description}` };
  };

  const makeTriple = (): Rule => {
    const r1 = pick(simpleRules)();
    const r2 = pick(simpleRules)();
    const r3 = pick(simpleRules)();
    return { type: "compound_and", params: {}, subRules: [r1, r2, r3], description: `${r1.description} AND ${r2.description} AND ${r3.description}` };
  };

  const config = getConfig(difficulty);
  const rules: Rule[] = [];

  for (let i = 0; i < config.rounds; i++) {
    const roundDifficulty = i / config.rounds; // 0..1 progression
    
    switch (difficulty) {
      case "easy":
        rules.push(pick(simpleRules)());
        break;
      case "medium":
        rules.push(roundDifficulty < 0.5 ? pick(simpleRules)() : makeCompound());
        break;
      case "hard":
        rules.push(roundDifficulty < 0.3 ? pick(simpleRules)() : makeCompound());
        break;
      case "expert":
        rules.push(roundDifficulty < 0.2 ? makeCompound() : makeCompoundNot());
        break;
      case "master":
        rules.push(roundDifficulty < 0.3 ? makeCompoundNot() : makeTriple());
        break;
      case "grandmaster":
        rules.push(makeTriple());
        break;
      case "genius": {
        const r = makeTriple();
        const extra = pick(simpleRules)();
        rules.push({ type: "compound_and", params: {}, subRules: [...(r.subRules || []), { type: "compound_not", params: {}, subRules: [extra], description: `NOT ${extra.description}` }], description: `${r.description} BUT NOT ${extra.description}` });
        break;
      }
      case "legend": {
        // 4-5 compound conditions
        const subs = Array.from({ length: pick([4, 5]) }, () => {
          const base = pick(simpleRules)();
          return rand() > 0.4 ? base : { type: "compound_not" as RuleType, params: {}, subRules: [base], description: `NOT ${base.description}` };
        });
        rules.push({ type: "compound_and", params: {}, subRules: subs, description: subs.map(s => s.description).join(" AND ") });
        break;
      }
      default:
        rules.push(pick(simpleRules)());
    }
  }

  return rules;
}

interface Config {
  limit: number;
  rounds: number;
  maxMistakes: number;
}

function getConfig(difficulty: Difficulty): Config {
  switch (difficulty) {
    case "easy": return { limit: 30, rounds: 3, maxMistakes: 5 };
    case "medium": return { limit: 50, rounds: 4, maxMistakes: 4 };
    case "hard": return { limit: 75, rounds: 5, maxMistakes: 3 };
    case "expert": return { limit: 100, rounds: 6, maxMistakes: 3 };
    case "master": return { limit: 150, rounds: 7, maxMistakes: 2 };
    case "grandmaster": return { limit: 200, rounds: 8, maxMistakes: 2 };
    case "genius": return { limit: 300, rounds: 10, maxMistakes: 1 };
    case "legend": return { limit: 500, rounds: 12, maxMistakes: 1 };
    default: return { limit: 30, rounds: 3, maxMistakes: 5 };
  }
}

function buildRound(grid: number[], rule: Rule, round: number, totalRounds: number, maxMistakes: number, difficulty: string, score: number): SieveState {
  const correct = grid.map(n => evaluateRule(n, rule));
  return {
    limit: grid[grid.length - 1],
    grid,
    marked: new Array(grid.length).fill(false),
    correct,
    moves: 0,
    won: false,
    lost: false,
    difficulty,
    hintCell: null,
    peeking: false,
    round,
    totalRounds,
    currentRule: rule,
    mistakes: 0,
    maxMistakes,
    roundComplete: false,
    score,
  };
}

export function useSieveGame() {
  const [game, setGame] = useState<SieveState | null>(null);
  const [difficultyLabel, setDifficultyLabel] = useState("");
  const historyRef = useRef<boolean[][]>([]);
  const rulesRef = useRef<Rule[]>([]);
  const gridRef = useRef<number[]>([]);
  const configRef = useRef<Config>({ limit: 30, rounds: 3, maxMistakes: 5 });

  const startGame = useCallback((difficulty: Difficulty, _rand?: () => number) => {
    const config = getConfig(difficulty);
    configRef.current = config;
    const rand = _rand || seededRng(Date.now());
    const grid = Array.from({ length: config.limit - 1 }, (_, i) => i + 2);
    gridRef.current = grid;

    const rules = generateRules(difficulty, rand);
    rulesRef.current = rules;
    historyRef.current = [];

    setDifficultyLabel(difficulty.charAt(0).toUpperCase() + difficulty.slice(1));
    setGame(buildRound(grid, rules[0], 1, config.rounds, config.maxMistakes, difficulty, 0));
  }, []);

  const toggleMark = useCallback((index: number) => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || prev.roundComplete) return prev;
      historyRef.current.push([...prev.marked]);
      const newMarked = [...prev.marked];
      newMarked[index] = !newMarked[index];
      const moves = prev.moves + 1;

      // Check if toggling to wrong state counts as mistake
      let mistakes = prev.mistakes;
      const isCorrect = prev.correct[index];
      // Mistake: marking a number that shouldn't be marked, or unmarking one that should
      if (newMarked[index] !== isCorrect && newMarked[index]) {
        mistakes++;
      }

      const lost = mistakes >= prev.maxMistakes;

      return { ...prev, marked: newMarked, moves, mistakes, lost, hintCell: null };
    });
  }, []);

  const submitRound = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;

      // Check if all selections are correct
      let allCorrect = true;
      for (let i = 0; i < prev.grid.length; i++) {
        if (prev.marked[i] !== prev.correct[i]) { allCorrect = false; break; }
      }

      if (!allCorrect) {
        // Count wrong ones as mistakes
        let newMistakes = prev.mistakes;
        for (let i = 0; i < prev.grid.length; i++) {
          if (prev.marked[i] !== prev.correct[i]) newMistakes++;
        }
        if (newMistakes >= prev.maxMistakes) {
          return { ...prev, lost: true, mistakes: newMistakes };
        }
        return { ...prev, mistakes: newMistakes, hintCell: null };
      }

      const score = prev.score + Math.max(1, prev.grid.length - prev.moves);

      // Move to next round or win
      if (prev.round >= prev.totalRounds) {
        return { ...prev, won: true, roundComplete: true, score };
      }

      return { ...prev, roundComplete: true, score };
    });
  }, []);

  const nextRound = useCallback(() => {
    setGame(prev => {
      if (!prev || !prev.roundComplete || prev.won) return prev;
      const nextIdx = prev.round; // 0-indexed: round was 1-based
      const rule = rulesRef.current[nextIdx];
      if (!rule) return prev;
      historyRef.current = [];
      return buildRound(gridRef.current, rule, prev.round + 1, prev.totalRounds, prev.maxMistakes, prev.difficulty, prev.score);
    });
  }, []);

  const showHint = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      for (let i = 0; i < prev.grid.length; i++) {
        if (prev.marked[i] !== prev.correct[i]) {
          return { ...prev, hintCell: i };
        }
      }
      return prev;
    });
  }, []);

  const undo = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost || historyRef.current.length === 0) return prev;
      const prevMarked = historyRef.current.pop()!;
      return { ...prev, marked: prevMarked, hintCell: null };
    });
  }, []);

  const peek = useCallback(() => {
    setGame(prev => {
      if (!prev || prev.won || prev.lost) return prev;
      return { ...prev, peeking: true };
    });
    setTimeout(() => {
      setGame(prev => prev ? { ...prev, peeking: false } : prev);
    }, 2000);
  }, []);

  const restart = useCallback(() => {
    setGame(prev => {
      if (!prev) return prev;
      historyRef.current = [];
      const rule = rulesRef.current[0];
      return buildRound(gridRef.current, rule, 1, prev.totalRounds, prev.maxMistakes, prev.difficulty, 0);
    });
  }, []);

  const goToMenu = useCallback(() => setGame(null), []);

  return { game, difficultyLabel, startGame, toggleMark, submitRound, nextRound, showHint, undo, peek, restart, goToMenu };
}
