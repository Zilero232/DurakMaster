import type { PlainCard } from '@durak-master/schemas';

import {
  ArrowDownToLine,
  ArrowLeftRight,
  Crown,
  Equal,
  Eye,
  Flag,
  Hand,
  Layers,
  Plus,
  Shield,
  Sparkles,
  VenetianMask
} from 'lucide-react-native';

import type { RuleFact, RuleMode, RuleStepConfig } from './RulesPanel.types';

const card = (rank: PlainCard['rank'], suit: PlainCard['suit']): PlainCard => ({
  kind: 'plain',
  rank,
  suit
});

export const RULE_FACTS: readonly RuleFact[] = [
  { icon: Layers, valueKey: 'rules.facts.deckValue', labelKey: 'rules.facts.deck' },
  { icon: Hand, valueKey: 'rules.facts.handValue', labelKey: 'rules.facts.hand' },
  { icon: Crown, valueKey: 'rules.facts.trumpValue', labelKey: 'rules.facts.trump' }
];

export const RULE_STEPS: readonly RuleStepConfig[] = [
  { id: 'deal', icon: Layers },
  { id: 'firstMove', icon: Crown },
  {
    id: 'defend',
    icon: Shield,
    examples: [
      {
        cards: [card('seven', 'hearts'), card('ten', 'hearts')],
        captionKey: 'rules.examples.higher'
      },
      { cards: [card('ace', 'hearts'), card('six', 'spades')], captionKey: 'rules.examples.trump' }
    ]
  },
  {
    id: 'throwIn',
    icon: Plus,
    examples: [
      {
        cards: [card('eight', 'clubs'), card('eight', 'diamonds')],
        captionKey: 'rules.examples.sameRank'
      }
    ]
  },
  { id: 'endBout', icon: Hand },
  { id: 'draw', icon: ArrowDownToLine },
  { id: 'end', icon: Flag }
];

export const RULE_MODES: readonly RuleMode[] = [
  { id: 'throwIn', icon: Plus },
  { id: 'transfer', icon: ArrowLeftRight },
  { id: 'showTrump', icon: Eye },
  { id: 'jokers', icon: Sparkles },
  { id: 'cheaters', icon: VenetianMask },
  { id: 'draw', icon: Equal }
];

export const EXAMPLE_CARD_WIDTH = 40;

export const EXAMPLE_ANSWER_ROTATION = 8;
