export enum MatchMode {
  exact = 'exact',
  all = 'all',
  first = 'first',
}

export default class PasteFormatter {
  private readonly formattedText: string = '';
  private readonly matchingFailed: boolean = false;
  private readonly matchesCount: number = 0;

  constructor(
    originalText: string,
    searchPattern: string,
    replaceFormat: string,
    mode: MatchMode
  ) {
    if (mode === MatchMode.exact) {
      searchPattern =
        (searchPattern.startsWith('^') ? '' : '^') +
        searchPattern +
        (searchPattern.endsWith('$') ? '' : '$');
    }

    let parts: [string, string[] | false][] = [];

    while (true) {
      let matches = null;

      try {
        matches = originalText.match(new RegExp(`(${searchPattern})`));
      } catch (e: unknown) {
        this.matchingFailed = true;

        return;
      }

      if (!matches || (mode === MatchMode.first && this.matchesCount > 0)) {
        parts.push([originalText, false]);

        break;
      }

      this.matchesCount++;

      let matchedText = matches[1];

      let endOfMatchPosition =
        originalText.indexOf(matchedText) + matchedText.length;

      parts.push([originalText.substring(0, endOfMatchPosition), matches]);

      originalText = originalText.substring(endOfMatchPosition);
    }

    this.formattedText = parts
      .map(value => {
        let [string, matches] = value;

        // This is the last part, that either doesn't contain a match, or isn't replaced because the
        // mode isn't "MatchMode.all".
        if (matches === false) {
          return string;
        }

        let matchedText = matches[1];

        matches = [matches[0], ...matches.slice(2)];

        let replacement = replaceFormat;

        for (let i = 0; i < matches.length; i++) {
          replacement = replacement.replace(`{$${i}}`, matches[i]);
        }

        return string.replace(matchedText, replacement);
      })
      .join('');
  }

  hasMatched(): boolean {
    return !this.matchingFailed && this.matchesCount > 0;
  }

  hasFailed(): boolean {
    return this.matchingFailed;
  }

  getFormattedText(): string {
    if (!this.hasMatched()) {
      throw new Error();
    }

    return this.formattedText;
  }
}
