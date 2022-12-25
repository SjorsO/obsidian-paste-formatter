import SettingsTab from './SettingsTab';
import Settings from './Settings';

export default abstract class SettingsPage {
  html: HTMLElement;

  constructor(public tab: SettingsTab, public settings: Settings) {
    this.html = tab.containerEl;
  }

  abstract render(): void;
}
