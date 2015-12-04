# Html to Jade, Jade to HTML

## Install

In the command palette (`F1`) select Install Extension and search for **html2jade**

## Usage

This command works with the currently selected text, not the entire contents of a file. Multi-select is also supported. If you want to convert an entire fall, then select all text `Ctrl+a`, and then run one of the available commands.

In the command palette (`F1`) type **jade**. You should see the following two commands:
* Convert HTML to Jade
* Convert Jade to HTML

### Convert HTML to Jade

This command uses the [html2jade](https://github.com/donpark/html2jade) library.

### Convert Jade to HTML

After running the 'Convert Jade to HTML' command, the extension will execute the 'Format Code' command, as the result of calling the [Jade library](https://github.com/jadejs/jade) returns HTML which is not formatted according to VS Code's rules. This will only work however, if the 'Language Mode' (bottom-right in the status bar) is set to HTML (usually the case if you're eding a HTML file). You can do this manually by selecting the HTML Language mode, then pressing `Shift+Alt+f`.

## Known Issues

* Due to the fact the the text length changes, the selection may not be correctly maintained. *Fix planned for next release*

## Support

[Create an issue](https://github.com/wmaurer/vscode-html2jade/issues), or ping [@waynemaurer](https://twitter.com/waynemaurer) on Twitter.
