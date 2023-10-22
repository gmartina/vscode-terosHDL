// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
// Ismael Perez Rojo [ismaelprojo@gmail.com]
//
// This file is part of TerosHDL
//
// Colibri is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Colibri is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with TerosHDL.  If not, see <https://www.gnu.org/licenses/>.

import * as path_lib from "path";
import {Process} from "../../src/process/process";
import { get_os } from '../../src/process/utils';
import { OS } from '../../src/process/common';
describe("Process", () => {

    ////////////////////////////////////////////////////////////////////////////
    // exec_wait
    ////////////////////////////////////////////////////////////////////////////
    it(`Local: exec_wait`, async () => {
        const cmd = "ls -l";

        const p = new Process();
        const result = await p.exec_wait(cmd, undefined);
        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toContain("total");
        expect(result.successful).toBeTruthy();
    });

    it(`Local: exec_wait error`, async () => {
        const cmd = "asdf";
        let stderror = "";
        if (get_os() === OS.WINDOWS) {
            stderror = "/usr/bin/bash: line 1: asdf: command not found";
        }else{
            stderror = "/bin/sh: 1: asdf: not found";
        }
        const p = new Process();
        const result = await p.exec_wait(cmd);
        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(-1);
        expect(result.stderr).toBe(stderror);
        expect(result.stdout).toBe("");
        expect(result.successful).not.toBeTruthy();
    });

    it(`Local: exec_wait with cwd`, async () => {
        const cmd = "ls -l";

        const p = new Process();
        const folder_test = path_lib.join(__dirname, "sample_folder");
        const result = await p.exec_wait(cmd, {cwd: folder_test});

        expect(result.command).toBe(cmd);
        expect(result.return_value).toBe(0);
        expect(result.stderr).toBe("");
        expect(result.stdout).toContain("hi");
        expect(result.successful).toBeTruthy();
    });

    ////////////////////////////////////////////////////////////////////////////
    // exec
    ////////////////////////////////////////////////////////////////////////////
    it(`Local: exec`, () => {
        const cmd = "ls -l";

        const p = new Process();
        p.exec(cmd, undefined, (result) => {
            expect(result.command).toBe(cmd);
            expect(result.return_value).toBe(0);
            expect(result.stderr).toBe("");
            expect(result.stdout).toContain("total");
            expect(result.successful).toBeTruthy();
        });
    });

    it(`Local: exec error`, () => {
        const cmd = "asdf";
        let stderror = "";
        if (get_os() === OS.WINDOWS) {
            stderror = "/usr/bin/bash: line 1: asdf: command not found";
        }else{
            stderror = "/bin/sh: 1: asdf: not found";
        }
        const p = new Process();
        p.exec(cmd, undefined, (result) => {
            expect(result.command).toBe(cmd);
            expect(result.return_value).toBe(-1);
            expect(result.stderr).toBe(stderror);
            expect(result.stdout).toBe("");
            expect(result.successful).not.toBeTruthy();
        });
    });

    it(`Local: exec with cmd`, () => {
        const cmd = "ls -l";
        const p = new Process();
        const folder_test = path_lib.join(__dirname, "sample_folder");
        p.exec(cmd, {cwd: folder_test}, (result) => {
            expect(result.command).toBe("ls -l");
            expect(result.return_value).toBe(0);
            expect(result.stderr).toBe("");
            expect(result.stdout).toContain("hi");
            expect(result.successful).toBeTruthy();
        });
    });
});
