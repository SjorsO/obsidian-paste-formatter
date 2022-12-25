import {CurrentPage} from '../SettingsTab';
import {Setting} from 'obsidian';
import SettingsPage from '../SettingsPage';

export default class CreateSettingsPage extends SettingsPage {
  render() {
    this.html.createEl('h2', {text: 'Paste Formatter'});

    this.html.createEl('p', {
      text: "This plugin formats and transforms text you paste into Obsidian based on the patterns you've defined below.",
    });

    if (this.settings.getPatterns().length > 0) {
      this.html.createEl('h2', {text: 'Patterns'});

      this.settings.getPatterns().forEach((pattern, index) => {
        const div = this.html.createEl('div');
        div.classList.add('opf-setting-pattern-list-item');

        div.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: start">
            <div>${pattern.name}</div>
            
            <div style="flex-shrink: 0; padding-left: 1rem">
              <button class="order-down-btn ${
                index === this.settings.getPatterns().length - 1
                  ? 'opf-btn-disabled'
                  : ''
              }" data-id="${
          pattern.key
        }" title="Move down to decrease priority">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1rem; height: 1rem;">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                </svg>
              </button>

<button class="order-up-btn ${
          index === 0 ? 'opf-btn-disabled' : ''
        }" data-id="${pattern.key}" title="Move up to increase priority">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1rem; height: 1rem;">
                  <path fill-rule="evenodd" d="M14.77 12.79a.75.75 0 01-1.06-.02L10 8.832 6.29 12.77a.75.75 0 11-1.08-1.04l4.25-4.5a.75.75 0 011.08 0l4.25 4.5a.75.75 0 01-.02 1.06z" clip-rule="evenodd" />
                </svg>
              </button>

              <button class="delete-btn" data-id="${
                pattern.key
              }" title="Delete this pattern">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1rem; height: 1rem; color: indianred">
                  <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <button class="edit-btn" data-id="${
                pattern.key
              }" title="Edit this pattern">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" style="width: 1rem; height: 1rem">
                  <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                </svg>
              </button>
            </div>
          </div>
          
          <table>
            <tr>
              <td style="color: var(--color-base-60); text-align: right; padding-right: 0.25rem;">Pattern:</td>
              <td>${pattern.searchPattern}</td>
            </tr>
            <tr>
              <td style="color: var(--color-base-60); text-align: right; padding-right: 0.25rem;">Format:</td>
              <td>${pattern.replaceFormat}</td>
            </tr>           
          </table>
        `;

        div.querySelectorAll('.edit-btn').forEach(editBtn => {
          editBtn.addEventListener('click', () => {
            this.tab.editingId = <string>(
              (editBtn as HTMLButtonElement).dataset.id
            );
            this.tab.displaying = CurrentPage.createOrEdit;
            this.tab.display();
          });
        });

        div.querySelectorAll('.order-down-btn').forEach(editBtn => {
          editBtn.addEventListener('click', async () => {
            const key = <string>(editBtn as HTMLButtonElement).dataset.id;

            await this.settings.decreasePriorityFor(key);

            this.tab.display();
          });
        });

        div.querySelectorAll('.order-up-btn').forEach(editBtn => {
          editBtn.addEventListener('click', async () => {
            const key = <string>(editBtn as HTMLButtonElement).dataset.id;

            await this.settings.increasePriorityFor(key);

            this.tab.display();
          });
        });

        div.querySelectorAll('.delete-btn').forEach(deleteBtn => {
          deleteBtn.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this pattern?')) {
              return;
            }

            const key = <string>(deleteBtn as HTMLButtonElement).dataset.id;

            await this.settings.deletePattern(key);

            this.tab.display();
          });
        });
      });
    }

    new Setting(this.html).addButton(button =>
      button.setButtonText('Add pattern').onClick(() => {
        this.tab.editingId = '';
        this.tab.displaying = CurrentPage.createOrEdit;

        this.tab.display();
      })
    );
  }
}
