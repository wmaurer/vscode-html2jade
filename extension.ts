import * as vscode from 'vscode';
import * as html2jade from 'html2jade';
const jade = require('jade');

const promisify = require('es6-promisify');
const convertHtml: (text: string, options: Object) => Promise<string> = promisify(html2jade.convertHtml);

export function activate(context: vscode.ExtensionContext) {

	const html2JadeDisposable = vscode.commands.registerTextEditorCommand('extension.html2jade', (textEditor, edit) => {
		const convertHtmlOptions = {
			bodyless: true,
			nspaces: textEditor.options.insertSpaces ? textEditor.options.tabSize : undefined,
			tabs: !textEditor.options.insertSpaces
		};

		textEditor.options.insertSpaces;
		const promises = textEditor.selections.map(selection => {
			const text = textEditor.document.getText(selection);
			return convertHtml(text, convertHtmlOptions)
				.then(jadeText => {
					const replacementText = jadeText.substr(0, jadeText.length - 1).split('\n')
						.filter(line => !line.match(/\s*\|\s*/))
						.reduce((p, c) => p + '\n' + c, '');
					return {
						selection,
						replacementText
					};
				});
		});

		Promise.all(promises)
			.then(x => textEditor.edit(editBuilder => {
				x.forEach(y => {
					editBuilder.replace(y.selection, y.replacementText);
				});
			}));
	});
	context.subscriptions.push(html2JadeDisposable);

	const jade2HtmlDisposable = vscode.commands.registerTextEditorCommand('extension.jade2html', (textEditor, edit) => {
		const replaceFn = textEditor.options.insertSpaces
			? indents => Array(indents * textEditor.options.tabSize + 1).join(' ')
			: indents => Array(indents + 1).join('\t');

		const regex = /^(  )+/;
		const selectionsTransformed = textEditor.selections.map(selection => {
			const text = textEditor.document.getText(selection);
			const htmlText = jade.compile(text, { pretty: true })() as string;
			const replacementText = htmlText.split('\n')
				.map(line => {
					const matches = line.match(regex);
					return {
						line,
						indents: !matches ? 0 : matches[0].length / 2
					};
				})
				.map(x => x.line.replace(regex, replaceFn(x.indents)))
				// .map(x => x.line)
				.reduce((p, c) => p + '\n' + c, '');
			return {
				selection,
				replacementText
			};
		});

		textEditor.edit(editBuilder => {
			selectionsTransformed.forEach(x => {
				editBuilder.replace(x.selection, x.replacementText);
			});
		});

		// vscode.commands.executeCommand('editor.action.format');
	});
	context.subscriptions.push(jade2HtmlDisposable);

}
