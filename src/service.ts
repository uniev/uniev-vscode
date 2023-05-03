import { Server } from "jayson";
import * as vscode from "vscode";
import * as fs from "fs";

export interface FileSpec {
    path: string;
    line?: number;
    column?: number;
}

export const server = new Server({
    "openFile": (fileSpec: FileSpec, callback: any) => {
        const path = fileSpec.path;
        if (!fs.existsSync(path)) { callback(new Error(`file ${path} doesn't exist`), false); };
        const setting: vscode.Uri = vscode.Uri.file(path);

        vscode.workspace.openTextDocument(setting).then((doc: any) => {
            vscode.window.showTextDocument(doc).then(editor => {
                const { line = 1, column = 1 } = fileSpec;
                const position = new vscode.Position(line - 1, column - 1);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position));
            });
        });

        callback(null, { path });
    }
});