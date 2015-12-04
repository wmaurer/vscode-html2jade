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
		const selectionsTransformed = textEditor.selections.map(selection => {
			const text = textEditor.document.getText(selection);
			const replacementText = jade.compile(text, { pretty: true })() as string;
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

		vscode.commands.executeCommand('editor.action.format');
	});
	context.subscriptions.push(jade2HtmlDisposable);
}
