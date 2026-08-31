const HEADER = /^(?:\p{Extended_Pictographic}️?\s+)?(\w+)(?:\(([^)]+)\))?!?: (.+)$/u;

export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: HEADER,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  prompt: {
    alias: { f: 'docs: fix typos' },
    useEmoji: true,
    emojiAlign: 'left',
    scopes: ['mobile', 'server', 'schemas', 'game-core', 'platform', 'ci', 'docs', 'deps'],
    allowCustomScopes: false,
    allowEmptyScopes: true,
    upperCaseSubject: false,
    markBreakingChangeMode: true,
    skipQuestions: ['footerPrefix', 'footer']
  },
  rules: {
    'scope-enum': [
      2,
      'always',
      ['mobile', 'server', 'schemas', 'game-core', 'platform', 'ci', 'docs', 'deps']
    ]
  }
};
