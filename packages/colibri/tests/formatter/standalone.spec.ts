// Copyright 2023
// Carlos Alberto Ruiz Naranjo [carlosruiznaranjo@gmail.com]
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

import * as path_lib from 'path';
import { Standalone_vhdl } from '../../src/formatter/standalone_vhdl';
import { KeyWords, TypeNames } from '../../src/formatter/bin/standalone_vhdl/VHDLFormatter';
import * as cfg from "../../src/config/config_declaration";
import { normalize_breakline_windows } from "../../src/utils/common_utils";
import { read_file_sync, save_file_sync,create_directory, remove_directory } from '../../src/utils/file_utils';

const C_OUTPUT_BASE_PATH = path_lib.join(__dirname, "out/standalone_vhdl");
const C_EXPECTED_BASE_PATH = path_lib.join(__dirname, "helpers/expected");

const global_config: cfg.e_formatter_standalone = {
  keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
  name_case: cfg.e_formatter_standalone_name_case.lowercase,
  indentation: "  ",
  align_port_generic: true,
  align_comment: false,
  remove_comments: true,
  remove_reports: false,
  check_alias: true,
  new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
  new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
  new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
  new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
  new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.no_new_line
};

function create_output() {
    remove_directory(C_OUTPUT_BASE_PATH);
    create_directory(C_OUTPUT_BASE_PATH, true);
    return C_OUTPUT_BASE_PATH;
}

describe('keyword_case is lowercase', () => {
  jest.setTimeout(100000);

  it('lowercase to lowercase', async () => {
    const unit_config = {...global_config, ["keyword_case"]: cfg.e_formatter_standalone_keyword_case.lowercase};
    const formatter = new Standalone_vhdl();

    for (const element of KeyWords) {
      const result = await formatter.format_from_code(element.toLowerCase(), unit_config);
      expect(result.code_formatted).toBe(element.toLowerCase());
    }    
  });
  it('uppercase to lowercase', async () => {
    const unit_config = {...global_config, ["keyword_case"]: cfg.e_formatter_standalone_keyword_case.lowercase};
    const formatter = new Standalone_vhdl();

    for (const element of KeyWords) {
      const result = await formatter.format_from_code(element.toUpperCase(), unit_config);
      expect(result.code_formatted).toBe(element.toLowerCase());
    }
  });
});

describe('keyword_case is uppercase', () => {
  jest.setTimeout(100000);

  it('lowercase to uppercase', async () => {
    const unit_config = {...global_config, ["keyword_case"]: cfg.e_formatter_standalone_keyword_case.uppercase};
    const formatter = new Standalone_vhdl();

    for (const element of KeyWords) {
      const result = await formatter.format_from_code(element.toLowerCase(), unit_config);
      expect(result.code_formatted).toBe(element.toUpperCase());
    }    
  });
  it('uppercase to uppercase', async () => {
    const unit_config = {...global_config, ["keyword_case"]: cfg.e_formatter_standalone_keyword_case.uppercase};
    const formatter = new Standalone_vhdl();

    for (const element of KeyWords) {
      const result = await formatter.format_from_code(element.toUpperCase(), unit_config);
      expect(result.code_formatted).toBe(element.toUpperCase());
    }
  });
});

describe('name_case is lowercase', () => {
  jest.setTimeout(100000);

  it('lowercase to lowercase', async () => {
    const unit_config = {...global_config, ["name_case"]: cfg.e_formatter_standalone_name_case.lowercase};
    const formatter = new Standalone_vhdl();

    for (const element of TypeNames) {
      const result = await formatter.format_from_code(element.toLowerCase(), unit_config);
      expect(result.code_formatted).toBe(element.toLowerCase());
    }
  });
  it('uppercase to lowercase', async () => {
    const unit_config = {...global_config, ["name_case"]: cfg.e_formatter_standalone_name_case.lowercase};
    const formatter = new Standalone_vhdl();

    for (const element of TypeNames) {
      const result = await formatter.format_from_code(element.toUpperCase(), unit_config);
      expect(result.code_formatted).toBe(element.toLowerCase());
    }
  });
});

describe('name_case is uppercase', () => {
  jest.setTimeout(100000);

  it('lowercase to uppercase', async () => {
    const unit_config = {...global_config, ["name_case"]: cfg.e_formatter_standalone_name_case.uppercase};
    const formatter = new Standalone_vhdl();

    for (const element of TypeNames) {
      const result = await formatter.format_from_code(element.toLowerCase(), unit_config);
      expect(result.code_formatted).toBe(element.toUpperCase());
    }
  });
  it('uppercase to uppercase', async () => {
    const unit_config = {...global_config, ["name_case"]: cfg.e_formatter_standalone_name_case.uppercase};
    const formatter = new Standalone_vhdl();

    for (const element of TypeNames) {
      const result = await formatter.format_from_code(element.toUpperCase(), unit_config);
      expect(result.code_formatted).toBe(element.toUpperCase());
    }
  });
});

describe('Indentation', () => {
  jest.setTimeout(100000);

  it('indentation is 2', async () => {
    const unit_config = {...global_config, 
      ["indentation"]: "  ",
      ["new_line_after_generic"]: cfg.e_formatter_standalone_new_line_after_generic.no_new_line,
      ["new_line_after_port"]: cfg.e_formatter_standalone_new_line_after_port.no_new_line
    };
    const formatter = new Standalone_vhdl();
    const code_input = 
      "entity dummy is\n" +
      "generic (\n" +
      "DATA_BYTES : integer := 8);\n" + 
      "port (\n" +
      "clk     : in std_ulogic;\n" +
      "reset_n : in std_ulogic;\n" +
      ");\n" +
      "end;\n" +
      "architecture rtl of dummy is\n" +
      "signal my_signal : std_logic;\n" +
      "begin;\n" +
      "inst : dummy2\n" +
      "generic map (\n" +
      "DATA_BYTES => DATA_BYTES\n" +
      ") port map (\n" +
      "clk     => clk,\n" +
      "reset_n => reset_n\n" +
      ");\n" +
      "inst : dummy3\n" +
      "generic map (\n" +
      "DATA_BYTES => DATA_BYTES )\n" +
      "port map (\n" +
      "clk     => clk,\n" +
      "reset_n => reset_n\n" +
      ");\n" +
      "s4 <= s1 or s2 or s3;\n" +
      "end architecture;\n";

    const code_expected = 
      "entity dummy is\n" +
      "  generic (\n" +
      "    DATA_BYTES : integer := 8);\n" +
      "  port (\n" +
      "    clk     : in std_ulogic;\n" +
      "    reset_n : in std_ulogic;\n" +
      "  );\n" +
      "end;\n" +
      "architecture rtl of dummy is\n" +
      "  signal my_signal : std_logic;\n" +
      "begin;\n" +
      "  inst : dummy2\n" +
      "  generic map (\n" +
      "    DATA_BYTES => DATA_BYTES\n" +
      "  ) port map (\n" +
      "    clk     => clk,\n" +
      "    reset_n => reset_n\n" +
      "  );\n" +
      "  inst : dummy3\n" +
      "  generic map (\n" +
      "    DATA_BYTES => DATA_BYTES)\n" +
      "  port map (\n" +
      "    clk     => clk,\n" +
      "    reset_n => reset_n\n" +
      "  );\n" +
      "  s4 <= s1 or s2 or s3;\n" +
      "end architecture;\n";

    const result = await formatter.format_from_code(code_input, unit_config);
    expect(result.code_formatted).toBe(code_expected);
  });
  it('indentation is 4', async () => {
    const unit_config = {...global_config, 
      ["indentation"]: "    ",
      ["new_line_after_generic"]: cfg.e_formatter_standalone_new_line_after_generic.no_new_line,
      ["new_line_after_port"]: cfg.e_formatter_standalone_new_line_after_port.no_new_line
    };
    const formatter = new Standalone_vhdl();
    const code_input = 
      "entity dummy is\n" +
      "generic (\n" +
      "DATA_BYTES : integer := 8);\n" + 
      "port (\n" +
      "clk     : in std_ulogic;\n" +
      "reset_n : in std_ulogic;\n" +
      ");\n" +
      "end;\n" +
      "architecture rtl of dummy is\n" +
      "signal my_signal : std_logic;\n" +
      "begin;\n" +
      "inst : dummy2\n" +
      "generic map (\n" +
      "DATA_BYTES => DATA_BYTES\n" +
      ") port map (\n" +
      "clk     => clk,\n" +
      "reset_n => reset_n\n" +
      ");\n" +
      "s4 <= s1 or s2 or s3;\n" +
      "end architecture;\n";

    const code_expected = 
      "entity dummy is\n" +
      "    generic (\n" +
      "        DATA_BYTES : integer := 8);\n" +
      "    port (\n" +
      "        clk     : in std_ulogic;\n" +
      "        reset_n : in std_ulogic;\n" +
      "    );\n" +
      "end;\n" +
      "architecture rtl of dummy is\n" +
      "    signal my_signal : std_logic;\n" +
      "begin;\n" +
      "    inst : dummy2\n" +
      "    generic map (\n" +
      "        DATA_BYTES => DATA_BYTES\n" +
      "    ) port map (\n" +
      "        clk     => clk,\n" +
      "        reset_n => reset_n\n" +
      "    );\n" +
      "    s4 <= s1 or s2 or s3;\n" +
      "end architecture;\n";
    const result = await formatter.format_from_code(code_input, unit_config);
    expect(result.code_formatted).toBe(code_expected);
  });
});

describe('file tests', () => {
    jest.setTimeout(1000000);

    beforeAll(() => {
        create_output();
    });
    it('vhdl_case_0', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_0.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: true,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config);

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_0.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_0.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_0b', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_0b.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.uppercase,
            name_case: cfg.e_formatter_standalone_name_case.uppercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: true,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config);

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_0b.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_0b.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_0c', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_0c.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.uppercase,
            name_case: cfg.e_formatter_standalone_name_case.uppercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: true,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.no_new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config);

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_0c.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_0c.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_1', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_1.vhd');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: true,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config);

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_1.vhd');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_1.vhd'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_2', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_2.vhdl');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "    ",
            align_port_generic: true,
            align_comment: true,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.no_new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config);

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_2.vhdl');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_2.vhdl'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_3', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_3.vhdl');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.uppercase,
            name_case: cfg.e_formatter_standalone_name_case.uppercase,
            indentation: "      ",
            align_port_generic: true,
            align_comment: false,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.no_new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.no_new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config);

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_3.vhdl');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_3.vhdl'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it('vhdl_case_4', async () => {
        const code_to_format = path_lib.join(__dirname, 'helpers', 'case_4.vhdl');
        const code = read_file_sync(code_to_format);

        const config: cfg.e_formatter_standalone = {
            keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
            name_case: cfg.e_formatter_standalone_name_case.lowercase,
            indentation: "  ",
            align_port_generic: true,
            align_comment: true,
            remove_comments: false,
            remove_reports: false,
            check_alias: true,
            new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
            new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
            new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
            new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
            new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
        };

        const formatter = new Standalone_vhdl();
        const result = await formatter.format_from_code(code, config);

        const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'case_4.vhdl');
        save_file_sync(output_path, result.code_formatted);

        expect(result.successful).toBe(true);
        const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'case_4.vhdl'));
        const expected_result_fix = normalize_breakline_windows(expected_result);
        expect(result.code_formatted).toBe(expected_result_fix);
    });
    it.skip('instantiation example', async () => {
      const code_to_format = path_lib.join(__dirname, 'helpers', 'instantiation_example.vhdl');
      const code = read_file_sync(code_to_format);

      const config: cfg.e_formatter_standalone = {
          keyword_case: cfg.e_formatter_standalone_keyword_case.lowercase,
          name_case: cfg.e_formatter_standalone_name_case.lowercase,
          indentation: "  ",
          align_port_generic: true,
          align_comment: true,
          remove_comments: false,
          remove_reports: false,
          check_alias: true,
          new_line_after_then: cfg.e_formatter_standalone_new_line_after_then.new_line,
          new_line_after_semicolon: cfg.e_formatter_standalone_new_line_after_semicolon.new_line,
          new_line_after_else: cfg.e_formatter_standalone_new_line_after_else.new_line,
          new_line_after_port: cfg.e_formatter_standalone_new_line_after_port.new_line,
          new_line_after_generic: cfg.e_formatter_standalone_new_line_after_generic.new_line
      };

      const formatter = new Standalone_vhdl();
      const result = await formatter.format_from_code(code, config);

      const output_path = path_lib.join(C_OUTPUT_BASE_PATH, 'instantiation_example.vhdl');
      save_file_sync(output_path, result.code_formatted);

      expect(result.successful).toBe(true);
      const expected_result = read_file_sync(path_lib.join(C_EXPECTED_BASE_PATH, 'instantiation_example.vhdl'));
      const expected_result_fix = normalize_breakline_windows(expected_result);
      expect(result.code_formatted).toBe(expected_result_fix);
    });
});
