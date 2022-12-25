import {CurrentPage} from '../SettingsTab';
import {Setting} from 'obsidian';
import SettingsPage from '../SettingsPage';
import PasteFormatter, {MatchMode} from '../../Formatter/PasteFormatter';

export default class CreateSettingsPage extends SettingsPage {
  testInputTextArea!: HTMLTextAreaElement;
  testOutputTextArea!: HTMLTextAreaElement;
  nameInput!: HTMLInputElement;
  patternInput!: HTMLInputElement;
  modeInput!: HTMLSelectElement;
  formatInput!: HTMLInputElement;

  render() {
    this.html.createEl('h2', {text: 'Add new paste pattern'});

    new Setting(this.html)
      .setName('Name')
      .setClass('opf-full-width-input')
      .setDesc('A short description of what this pattern is supposed to do.')
      .addText(text => {
        text.setPlaceholder('Name');
        this.nameInput = text.inputEl;
      });

    new Setting(this.html)
      .setName('Match pattern')
      .setDesc(
        'The regex pattern that finds matches in the pasted text. Capture groups can be used in the "format" field.'
      )
      .setClass('opf-full-width-input')
      .addText(text => {
        text.setPlaceholder('Match pattern');
        text.onChange(this.updateTest.bind(this));
        this.patternInput = text.inputEl;
      });

    const tutorialDiv = this.html.createDiv();
    tutorialDiv.classList.add('opf-full-width-input');
    tutorialDiv.classList.add('opf-mb-4');
    tutorialDiv.innerHTML = ` 
    <a style="font-size: 0.75rem" href="https://gist.github.com/SjorsO/c4e81367ddb59610a2252c754cd47b7d">Need help? Click here for a short tutorial</a>
    `;

    new Setting(this.html)
      .setName('Mode')
      .setClass('opf-full-width-input')
      .addDropdown(dropdown => {
        dropdown
          .addOption(
            MatchMode.exact,
            'Apply if the pasted text matches exactly'
          )
          .addOption(MatchMode.all, 'Apply to all matches in the pasted text')
          .addOption(
            MatchMode.first,
            'Only apply to the first match in the pasted text'
          );

        this.modeInput = dropdown.selectEl;
        dropdown.onChange(this.updateTest.bind(this));
      });

    new Setting(this.html)
      .setName('Format')
      .setDesc(
        'How to format matches. Use {$0} as a placeholder for the whole text that the pattern matched. Use {$1}, {$2}, ..., as placeholders for capture groups from the pattern regex.'
      )
      .setClass('opf-full-width-input')
      .addText(text => {
        text.setPlaceholder('Format');
        text.onChange(this.updateTest.bind(this));
        this.formatInput = text.inputEl;
      });

    new Setting(this.html)
      .setName('Test text')
      .setDesc('Type a text to test your pattern')
      .setClass('opf-full-width-input')
      .addTextArea(textArea => {
        this.testInputTextArea = textArea.inputEl;
        textArea.setPlaceholder('Type a text to test your pattern');
        textArea.inputEl.style.resize = 'none';
        textArea.inputEl.rows = 3;
        textArea.onChange(this.updateTest.bind(this));
      });

    const noticeDiv = this.html.createDiv();
    noticeDiv.classList.add('opf-mb-4');
    noticeDiv.classList.add('setting-item');
    noticeDiv.classList.add('opf-full-width-input');
    noticeDiv.style.borderTop = 'none';
    noticeDiv.style.paddingTop = '0';

    const pEl = noticeDiv.createEl('p');
    pEl.classList.add('setting-item-description');
    pEl.setText('This is how your pattern formatted the test text');
    pEl.style.marginTop = '0';

    const el = noticeDiv.createEl('div');
    el.addClass('setting-item-control');

    this.testOutputTextArea = el.createEl('textarea');
    this.testOutputTextArea.style.resize = 'none';
    this.testOutputTextArea.readOnly = true;
    this.testOutputTextArea.rows = 3;

    new Setting(this.html)
      .addButton(button =>
        button.setButtonText('Cancel').onClick(() => {
          this.tab.displaying = CurrentPage.index;

          this.tab.display();
        })
      )
      .addButton(button =>
        button.setButtonText('Save').onClick(async () => {
          if (this.tab.editingId) {
            await this.settings.updatePattern({
              key: this.tab.editingId,
              name: this.nameInput.value,
              mode: <MatchMode>this.modeInput.value,
              searchPattern: this.patternInput.value,
              replaceFormat: this.formatInput.value,
              testText: this.testInputTextArea.value,
            });
          } else {
            await this.settings.addPattern({
              enabled: true,
              name: this.nameInput.value,
              mode: <MatchMode>this.modeInput.value,
              searchPattern: this.patternInput.value,
              replaceFormat: this.formatInput.value,
              testText: this.testInputTextArea.value,
            });
          }

          this.tab.displaying = CurrentPage.index;

          this.tab.display();
        })
      );

    // Check if we're editing an existing pattern
    if (this.tab.editingId) {
      this.loadExistingPattern(this.tab.editingId);
    }
  }

  private loadExistingPattern(editingId: string) {
    const pattern = this.settings.findPattern(editingId);

    if (!pattern) {
      return;
    }

    this.nameInput.value = pattern.name;
    this.modeInput.value = pattern.mode;
    this.patternInput.value = pattern.searchPattern;
    this.formatInput.value = pattern.replaceFormat;
    this.testInputTextArea.value = pattern.testText;

    this.updateTest();
  }

  updateTest() {
    if (
      this.patternInput.value.length === 0 ||
      this.testInputTextArea.value.length === 0
    ) {
      this.testOutputTextArea.value = '';
      return;
    }

    const formatter = new PasteFormatter(
      this.testInputTextArea.value,
      this.patternInput.value,
      this.formatInput.value,
      <MatchMode>this.modeInput.value
    );

    if (formatter.hasFailed()) {
      this.testOutputTextArea.value = '(your pattern is invalid)';
    } else if (formatter.hasMatched()) {
      this.testOutputTextArea.value = formatter.getFormattedText();
    } else {
      this.testOutputTextArea.value =
        '(your pattern did not match the test text)';
    }
  }
}
