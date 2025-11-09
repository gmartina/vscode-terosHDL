/* ------------------------------------------------------------------------------------------
 * MIT License
 * Copyright (c) 2020 Henrik Bohlin
 * Full license text can be found in /LICENSE or at https://opensource.org/licenses/MIT.
 * ------------------------------------------------------------------------------------------ */
'use strict';
import * as fs from 'fs-extra';
import * as path from 'path';
import vscode = require('vscode');
import { ExtensionContext } from 'vscode';
import util = require('util');
import { Multi_project_manager } from 'colibri/project_manager/multi_project_manager';
import * as os from 'os';

const exec = util.promisify(require('child_process').exec);

import {
    LanguageClient,
    LanguageClientOptions,
    ServerOptions,
    RevealOutputChannelOn,
    State
} from 'vscode-languageclient/node';

const isWindows = process.platform === 'win32';
const languageServerBinaryName = 'verible-verilog-ls';
let languageServer: string;

export class Verilbe_lsp {
    private client: LanguageClient | undefined = undefined;
    private context: ExtensionContext;
    private languageServerDisposable;
    private serverCommandPath: string | undefined;
    private manager: Multi_project_manager;
    public stop_client: boolean = false;
    private errorCounter = 0;

    constructor(context: ExtensionContext, manager: Multi_project_manager, private fileListPath: string) {
        this.context = context;
        this.manager = manager;

        this.context.subscriptions.push(
            vscode.commands.registerCommand('teroshdl.verible.restart', async () => {
                // if (this.client != undefined && this.client.isRunning() && this.client.state === State.Running) {
                //     try {
                //         this.client.stop().finally(async () => {
                //             await this.run();
                //         });
                //     } catch (error) {
                //         this.errorCounter++;
                //         this.client.dispose();
                //         this.client = undefined;
                //         console.log(error);
                //         if (this.errorCounter < 5) {
                //             await this.run();
                //         }
                //     }
                // }
            })
        );

        // Ensure we attempt to kill any leftover servers when the extension host exits
        process.on('exit', async () => {
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
        });
        process.on('SIGINT', async () => {
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
            process.exit();
        });
        process.on('SIGHUP', async () => {
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
            process.exit();
        });
    }

    async run(): Promise<boolean> {
        const languageServerDir = this.context.asAbsolutePath(path.join('server', 'verible'));
        const current_language_server_version = this.embeddedVersion(languageServerDir);

        languageServer = path.join(
            'server',
            'verible',
            current_language_server_version,
            languageServerBinaryName + (isWindows ? '.exe' : '')
        );
        // Get language server configuration and command to start server
        let serverOptions: ServerOptions;
        serverOptions = this.getServerOptionsEmbedded(this.context);

        // Options to control the language client
        let clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'verilog' }, { scheme: 'file', language: 'systemverilog' }],
            revealOutputChannelOn: RevealOutputChannelOn.Never,
            // middleware: {
            //     provideDiagnostics: () => {
            //         return undefined;
            //     }
            // }
        };

        // Create the language client
        this.client = new LanguageClient('verible-verilog-ls', 'Verible', serverOptions, clientOptions);

        let server_path = this.context.asAbsolutePath(languageServer);
        let is_alive = await this.check_run(server_path);
        if (is_alive === false) {
            return false;
        }

        // Start the client. This will also launch the server
        this.languageServerDisposable = await this.client.start();
        this.context.subscriptions.push(this.languageServerDisposable);

        return true;
    }

    async check_run(binPath: string) {
        let command = binPath + ' --version';
        // eslint-disable-next-line no-console
        console.log(`[colibri][info] Linting with command: ${command}`);
        const exec = require('child_process').exec;
        return new Promise((resolve) => {
            exec(command, (err, stdout: string, stderr) => {
                if (stderr !== '') {
                    console.log(`[verible][error] ${stderr}`);
                }
                if (err !== null || !stdout.toLowerCase().includes('version')) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    async deactivate() {
        if (!this.client) {
            return undefined;
        }
        try {
            // Increase timeout to 5 seconds to ensure proper shutdown in SSH scenarios
            await this.client.stop(5000);
            // Explicitly dispose of the language server disposable
            if (this.languageServerDisposable) {
                this.languageServerDisposable.dispose();
            }
            console.log('[verible] Language server stopped successfully');
        } catch (error) {
            console.error('[verible] Error stopping language server:', error);
            // Force dispose even if stop fails
            if (this.languageServerDisposable) {
                this.languageServerDisposable.dispose();
            }
        } finally {
            this.client = undefined;
            this.languageServerDisposable = undefined;
            // Try to kill any lingering server processes that match our server binary
            try {
                await this.killServerProcesses();
            } catch (e) { /* ignore */ }
        }
    }

    private async killServerProcesses(): Promise<void> {
        if (!this.serverCommandPath) {
            return;
        }
        const serverPath = this.serverCommandPath;
        const exec = require('child_process').exec;

        return new Promise((resolve) => {
            exec(`pgrep -f "${serverPath}"`, (err, stdout) => {
                if (err || !stdout) {
                    return resolve();
                }
                const pids = stdout.split(/\s+/).map((s: string) => s.trim()).filter(Boolean);
                if (pids.length === 0) {
                    return resolve();
                }
                pids.forEach((pid: string) => {
                    try {
                        process.kill(parseInt(pid, 10), 'SIGTERM');
                    } catch (e) { /* ignore */ }
                });
                setTimeout(() => {
                    pids.forEach((pid: string) => {
                        try {
                            process.kill(parseInt(pid, 10), 'SIGKILL');
                        } catch (e) { /* ignore */ }
                    });
                    resolve();
                }, 500);
            });
        });
    }

    embeddedVersion(languageServerDir: string): string {
        try {
            const dirs = fs.readdirSync(languageServerDir);
            // Return the first directory found, or default to '0.0.0' if none
            return dirs.length > 0 ? dirs[0] : '0.0.0';
        } catch {
            return '0.0.0';
        }
    }

    getServerOptionsEmbedded(context: ExtensionContext) {
        const args = ["--file_list_path", this.fileListPath, '--ruleset=none'];

    let serverCommand = context.asAbsolutePath(languageServer);
    // remember server path for cleanup
    this.serverCommandPath = serverCommand;
        let serverOptions: ServerOptions = {
            run: {
                command: serverCommand,
                args: args,
                options: {
                    // Ensure process is killed when parent terminates (important for SSH scenarios)
                    detached: true,
                    shell: false
                }
            },
            debug: {
                command: serverCommand,
                args: args,
                options: {
                    // Ensure process is killed when parent terminates (important for SSH scenarios)
                    detached: true,
                    shell: false
                }
            }
        };
        
        // We rely on explicit cleanup (killServerProcesses) called on deactivate/exit

        return serverOptions;
    }
}
