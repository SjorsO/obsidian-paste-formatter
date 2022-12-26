import {MatchMode} from '../Formatter/PasteFormatter';
import Main from '../Main';

export interface Pattern {
  key: string;
  order: number;
  enabled: boolean;
  name: string;
  searchPattern: string;
  replaceFormat: string;
  testText: string;
  mode: MatchMode;
}

interface PluginSettings {
  patterns: Pattern[];
}

export default class Settings {
  private patterns: Pattern[] = [];

  constructor(private plugin: Main) {
    //
  }

  async flush() {
    this.patterns = [];

    await this.plugin.saveData(<PluginSettings>{patterns: []});
  }

  async addPattern(values: {
    name: string;
    searchPattern: string;
    replaceFormat: string;
    mode: MatchMode;
    testText: string;
    order?: number;
    enabled?: boolean;
  }) {
    this.patterns.push({
      key:
        'opf-' +
        [...Array(12)].map(() => Math.random().toString(36)[2] || '0').join(''),
      order: values.order ?? 99999999,
      enabled: values.enabled ?? true,
      name: values.name,
      mode: values.mode,
      searchPattern: values.searchPattern,
      replaceFormat: values.replaceFormat,
      testText: values.testText,
    });

    this.sortPatterns();

    await this.save();
  }

  async updatePattern(values: {
    key: string;
    name: string;
    searchPattern: string;
    replaceFormat: string;
    mode: MatchMode;
    testText: string;
  }) {
    let pattern = this.findPattern(values.key);

    if (!pattern) {
      return;
    }

    await this.deletePattern(values.key);

    await this.addPattern({
      enabled: pattern.enabled,
      order: pattern.order,
      name: values.name,
      mode: values.mode,
      searchPattern: values.searchPattern,
      replaceFormat: values.replaceFormat,
      testText: values.testText,
    });
  }

  getPatterns(): Pattern[] {
    return this.patterns;
  }

  async save() {
    await this.plugin.saveData({
      patterns: this.patterns,
    });
  }

  async deletePattern(key: string) {
    this.patterns = this.patterns.filter(pattern => pattern.key !== key);

    await this.save();
  }

  findPattern(key: string): Pattern | null {
    return this.patterns.filter(pattern => pattern.key === key).first() || null;
  }

  async increasePriorityFor(key: string) {
    const pattern = this.findPattern(key);

    if (pattern) {
      pattern.order -= 11;

      this.sortPatterns();

      await this.save();
    }
  }

  async decreasePriorityFor(key: string) {
    const pattern = this.findPattern(key);

    if (pattern) {
      pattern.order += 11;

      this.sortPatterns();

      await this.save();
    }
  }

  private sortPatterns() {
    const patterns = this.patterns.sort((a, b) => a.order - b.order);

    let i = 10;

    patterns.forEach(pattern => {
      pattern.order = i;

      i += 10;
    });

    this.patterns = patterns;
  }

  static fromData(plugin: Main, data: PluginSettings): Settings {
    const settings = new Settings(plugin);

    data?.patterns.forEach(pattern => {
      settings.addPattern({
        name: pattern.name,
        searchPattern: pattern.searchPattern,
        replaceFormat: pattern.replaceFormat,
        testText: pattern.testText,
        mode: pattern.mode,
        order: pattern.order,
        enabled: pattern.enabled,
      });
    });

    return settings;
  }
}
