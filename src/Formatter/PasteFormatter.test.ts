import PasteFormatter, {MatchMode} from './PasteFormatter';

const cases: Array<{
  description: string;
  originalText: string;
  searchPattern: string;
  replaceFormat: string;
  expectedOutput: string | false;
  mode: MatchMode[];
}> = [
  {
    description: 'it handles empty pastes',
    originalText: '',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput: false,
    mode: [MatchMode.exact, MatchMode.first, MatchMode.all],
  },
  {
    description: 'It exactly matches a GitHub issue url',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195)',
    mode: [MatchMode.exact, MatchMode.first, MatchMode.all],
  },
  {
    description:
      'It exactly matches if the pattern already has the start/end regex',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195',
    searchPattern: '^https://github.com/.+?/.+?/issues/([0-9]+)$',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195)',
    mode: [MatchMode.exact],
  },
  {
    description:
      'It exactly matches if the pattern already has the start regex',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195',
    searchPattern: '^https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195)',
    mode: [MatchMode.exact],
  },
  {
    description: 'It exactly matches if the pattern already has the end regex',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)$',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195)',
    mode: [MatchMode.exact],
  },
  {
    description: 'Exact mode needs to be exact #1',
    originalText:
      'hallo https://github.com/sjorso/obsidian-paste-formatter/issues/195',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput: false,
    mode: [MatchMode.exact],
  },
  {
    description: 'Exact mode needs to be exact #2',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195 hallo',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput: false,
    mode: [MatchMode.exact],
  },
  {
    description: 'Exact mode needs to be exact #3',
    originalText:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195)',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput: false,
    mode: [MatchMode.exact],
  },
  {
    description: 'It can replace the first match',
    originalText:
      'hallo https://github.com/sjorso/obsidian-paste-formatter/issues/195 hey',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: 'wow [#{$1}]({$0}) cool',
    expectedOutput:
      'hallo wow [#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195) cool hey',
    mode: [MatchMode.first, MatchMode.all],
  },
  {
    description: 'It can fail to match',
    originalText: 'some text',
    searchPattern: '/some pattern/',
    replaceFormat: 'some {$1} format',
    expectedOutput: false,
    mode: [MatchMode.exact, MatchMode.first, MatchMode.all],
  },
  {
    description: 'It can replaces only the first match',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195 bla bla https://github.com/sjorso/obsidian-paste-formatter/issues/300 bla',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195) bla bla https://github.com/sjorso/obsidian-paste-formatter/issues/300 bla',
    mode: [MatchMode.first],
  },
  {
    description: 'It ignores missing groups',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195 bla',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0}{$2})',
    expectedOutput:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195{$2}) bla',
    mode: [MatchMode.first],
  },
  {
    description: 'It replaces all matches',
    originalText:
      'https://github.com/sjorso/obsidian-paste-formatter/issues/195 bla bla https://github.com/sjorso/obsidian-paste-formatter/issues/300 bla',
    searchPattern: 'https://github.com/.+?/.+?/issues/([0-9]+)',
    replaceFormat: '[#{$1}]({$0})',
    expectedOutput:
      '[#195](https://github.com/sjorso/obsidian-paste-formatter/issues/195) bla bla [#300](https://github.com/sjorso/obsidian-paste-formatter/issues/300) bla',
    mode: [MatchMode.all],
  },
  {
    description: 'Fox cat',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: 'fox',
    replaceFormat: 'cat',
    expectedOutput: 'The quick brown cat jumps over the lazy dog',
    mode: [MatchMode.all, MatchMode.first],
  },
  {
    description: 'Fox cat #2',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: 'fox',
    replaceFormat: 'cat',
    expectedOutput: false,
    mode: [MatchMode.exact],
  },
  {
    description: 'Fox cat #3 -- shorter than before',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: '(quick|brown)',
    replaceFormat: 'fast',
    expectedOutput: 'The fast fast fox jumps over the lazy dog',
    mode: [MatchMode.all],
  },
  {
    description: 'Fox cat #4 -- shorter than before',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: '(quick|brown)',
    replaceFormat: 'fast',
    expectedOutput: 'The fast brown fox jumps over the lazy dog',
    mode: [MatchMode.first],
  },
  {
    description: 'Fox cat #4 -- many matches',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: '(.)(.)(.) (.)(.)(.)(.)(.) (.)(.)(.)(.)(.) (.)(.)(.)',
    replaceFormat:
      '{$0} {$1} {$2} {$3} {$4} {$5} {$6} {$7} {$8} {$9} {$10} {$11} {$12} {$13} {$14} {$15} {$16} {$17}',
    expectedOutput:
      'The quick brown fox T h e q u i c k b r o w n f o x {$17} jumps over the lazy dog',
    mode: [MatchMode.all],
  },
  {
    description: 'It replaces all matches #2',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: '(fox|dog)',
    replaceFormat: 'cat',
    expectedOutput: 'The quick brown cat jumps over the lazy cat',
    mode: [MatchMode.all],
  },
  {
    description: 'It replaces all matches #2',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: '(fox|dog)',
    replaceFormat: 'cat',
    expectedOutput: 'The quick brown cat jumps over the lazy dog',
    mode: [MatchMode.first],
  },
  {
    description: 'Case sensitive',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: 'the',
    replaceFormat: '(~~THE~~) the',
    expectedOutput: 'The quick brown fox jumps over (~~THE~~) the lazy dog',
    mode: [MatchMode.first, MatchMode.all],
  },
  {
    description: 'Same input as output',
    originalText: 'The quick brown fox jumps over the lazy dog',
    searchPattern: '(lazy)',
    replaceFormat: '{$1}',
    expectedOutput: 'The quick brown fox jumps over the lazy dog',
    mode: [MatchMode.first, MatchMode.all],
  },
];

cases.forEach(data => {
  data.mode.forEach(mode => {
    it(`${data.description}
  
  Original text: ${data.originalText}
 Search pattern: ${data.searchPattern}
 Replace format: ${data.replaceFormat}
Expected output: ${data.expectedOutput}
           Mode: ${mode}`, () => {
      const formatter = new PasteFormatter(
        data.originalText,
        data.searchPattern,
        data.replaceFormat,
        mode
      );

      if (data.expectedOutput === false) {
        if (!formatter.hasMatched()) {
          expect(formatter.hasMatched()).toBe(false);
          return;
        }

        throw new Error(
          'Unexpected match. Result: ' + formatter.getFormattedText()
        );
      } else {
        expect(formatter.hasMatched()).toBe(true);
        expect(formatter.getFormattedText()).toBe(data.expectedOutput);
      }
    });
  });
});
