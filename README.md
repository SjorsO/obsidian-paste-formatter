# Paste Formatter
A plugin for [Obsidian](https://obsidian.md/) that formats and transforms pasted text using custom regex patterns.

In a nutshell:
- Define one or more patterns in the settings
- These patterns are checked when you paste text into Obsidian
- If a pattern matches, then the pasted text is formatted

A use-case for this plugin is automatically formatting pasted links.
For example: the GIF below shows a link to a GitHub issue being pasted into Obsidian.
The plugin applies a pattern to the pasted text and formats the link as a markdown link with the issue number as the label:

![A link being pasted into Obsidian and being formatted](/img/pasting-in-action.gif)

The screenshot below shows the pattern used in the GIF above:

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

## Releasing
Using [this guide](https://docs.obsidian.md/Plugins/Releasing/Release+your+plugin+with+GitHub+Actions):
```
# Don't forget to update the version number in the manifest.json
git tag -a 1.0.1 -m "1.0.1"
git push origin 1.0.1
# release is made automatically by GitHub Actions
```
