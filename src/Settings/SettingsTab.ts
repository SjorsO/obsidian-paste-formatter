import {App, PluginSettingTab} from 'obsidian';
import IndexSettingsPage from './Pages/IndexSettingsPage';
import CreateSettingsPage from './Pages/CreateSettingsPage';
import SettingsPage from './SettingsPage';
import Main from '../Main';

export enum CurrentPage {
  index = 'index',
  createOrEdit = 'createOrEdit',
}

export default class SettingsTab extends PluginSettingTab {
  displaying: CurrentPage = CurrentPage.index;
  editingId: string = '';

  constructor(app: App, public plugin: Main) {
    super(app, plugin);
  }

  private currentPage(): SettingsPage {
    switch (this.displaying) {
      case CurrentPage.index:
        return new IndexSettingsPage(this, this.plugin.settings);
      case CurrentPage.createOrEdit:
        return new CreateSettingsPage(this, this.plugin.settings);
    }
  }

  display(): void {
    this.containerEl.empty();

    this.currentPage().render();
  }
}
