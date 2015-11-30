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
				.then(replacementText => {
					return {
						selection,
						replacementText: replacementText.substr(0, replacementText.length - 1)
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
			const replacementText = jade.compile(text, { pretty: true })();
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
	});
	context.subscriptions.push(html2JadeDisposable);

}
