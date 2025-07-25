# Paste Formatter
A plugin that formats and transforms text you paste into [Obsidian](https://obsidian.md/).

In a nutshell:
- Define one or more Regex patterns in the settings
- When you paste into Obsidian the patterns are checked
- If a pattern matches the pasted text is formatted

Most common use-case:
- Automatically formatting URLs you paste into a Markdown link with a label
- (your use case here?)

![A link being pasted into Obsidian and being formatted](/img/pasting-in-action.gif)

![Screenshot of the settings page](/img/settings-page.png)

## Development
During local development, symlink the plugin to your addons folder:
```
# cd into the repo

mkdir ../vault/.obsidian/plugins/obsidian-paste-formatter

ln -nf main.js ../vault/.obsidian/plugins/obsidian-paste-formatter/main.js

ln -nf styles.css ../vault/.obsidian/plugins/obsidian-paste-formatter/styles.css

ln -nf manifest.json ../vault/.obsidian/plugins/obsidian-paste-formatter/manifest.json
```
