import SettingsTab from './Settings/SettingsTab';
import {Editor, Plugin} from 'obsidian';
import PasteFormatter from './Formatter/PasteFormatter';
import Settings from './Settings/Settings';

export default class Main extends Plugin {
  public settings!: Settings;

  async onload() {
    this.settings = Settings.fromData(this, await this.loadData());

    // await this.settings.flush();
    //
    // await this.settings.addPattern({
    //   name: 'GitHub issue link to issue number',
    //   searchPattern:
    //     'https://github.com/.+?/.+?/issues/([0-9]+)(#issuecomment-[0-9]+)?',
    //   replaceFormat: '[#{$1}]({$0})',
    //   testText: 'https://github.com/sjorso/obsidian-paste-formatter/issues/195',
    //   mode: MatchMode.exact,
    // });
    //
    // await this.settings.addPattern({
    //   name: 'The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog The quick brown fox jumps over the lazy dog',
    //   searchPattern:
    //     'https://github.com/.+?/.+?/issues/([0-9]+)https://github.com/.+?/.+?/issues/([0-9]+)https://github.com/.+?/.+?/issues/([0-9]+)https://github.com/.+?/.+?/issues/([0-9]+)https://github.com/.+?/.+?/issues/([0-9]+)',
    //   replaceFormat:
    //     '[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})[#{$1}]({$0})',
    //   testText: '',
    //   mode: MatchMode.all,
    // });
    //
    // await this.settings.save();

    this.addSettingTab(new SettingsTab(this.app, this));

    this.registerEvent(
      this.app.workspace.on('editor-paste', this.onPaste.bind(this))
    );
  }

  private onPaste(clipboardEvent: ClipboardEvent, editor: Editor) {
    // Because the docs say so
    if (clipboardEvent.defaultPrevented) {
      return;
    }

    const pastedText = clipboardEvent.clipboardData?.getData('text');

    if (!pastedText) {
      return;
    }

    const patterns = this.settings.getPatterns();

    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];

      if (!pattern.enabled) {
        continue;
      }

      const formatter = new PasteFormatter(
        pastedText,
        pattern.searchPattern,
        pattern.replaceFormat,
        pattern.mode
      );

      if (!formatter.hasMatched()) {
        continue;
      }

      editor.transaction({
        replaceSelection: formatter.getFormattedText(),
      });

      clipboardEvent.preventDefault();

      break;
    }
  }
}
