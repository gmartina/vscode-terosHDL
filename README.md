# TerosHDL - HDL Language Support[![Current Version](https://img.shields.io/visual-studio-marketplace/v/teros-technology.teroshdl.png)](https://marketplace.visualstudio.com/items?itemName=teros-technology.teroshdl)

[![Install Count](https://img.shields.io/visual-studio-marketplace/i/teros-technology.teroshdl.png)](https://marketplace.visualstudio.com/items?itemName=teros-technology.teroshdl)

A lightweight VS Code extension providing HDL (Hardware Description Language) support for VHDL, Verilog, and SystemVerilog.[![Download Count](https://img.shields.io/visual-studio-marketplace/d/teros-technology.teroshdl.png)](https://marketplace.visualstudio.com/items?itemName=teros-technology.teroshdl)

[![vscode-TerosHDL documentation](https://img.shields.io/website.svg?label=vscode-TerosHDL%20Documentation&longCache=true&style=flat-square&url=http%3A%2F%2FTerosTechnology.github.io%2FterosHDLdoc%2Findex.html)](https://TerosTechnology.github.io/terosHDLdoc)

## Features



- **Syntax Highlighting** for:![TerosHDL](https://github.com/TerosTechnology/vscode-terosHDL/blob/dev//resources/images/low_res_banner.png?raw=true)

  - VHDL

  - Verilog  **Check the full documentation:** [https://terostechnology.github.io](https://terostechnology.github.io/)

  - SystemVerilog

  - TCL

  - XDC/SDC/LDC/PDC constraintsThe goal of TerosHDL is to provide an open source toolbox for HDL devlopers with functionalities commonly used by software developers. The toolbox consist in a bunch of tools and on top of them is the VSCode plugin. Some tools are developed by Teros Technology organization and others come from open source proyects. All the tools are organized in different backends and exposed to the GUI with the plugin.

  - UCF constraints

  - TL-VerilogThe toolbox tries to be as much self-contained as possible and simplify the installation process. Features:



- **Code Snippets** for all supported languages- Simulators and tools support: [Raptor](https://rapidsilicon.com/raptor/), Vivado, ModelSim, GHDL, Verilator, Icarus, VCS, Yosys, VUnit, cocotb, Diamond, Icestorm, ISE, Quartus, Radiant, Spyglass, Symbiflow, Trellis, Xcelium... and more!

- Go to definition.

- **File Icons** for HDL files (VHDL, Verilog, SystemVerilog, TCL, XDC, UCF)- Hover.

- Hiterachy viewer.

- **Language Configurations** with proper bracket matching, comments, etc.- Dependencies viewer.

- Syntax highlighting.

## Supported File Extensions- Template generator.

- Automatic documentation.

| Language | Extensions |- Verilog/SV schematic viewer.

|----------|------------|- Errors linter.

| VHDL | `.vhd`, `.vho`, `.vhdl` |- Style linter: Verible.

| Verilog | `.v`, `.vh`, `.vl` |- Code formatting.

| SystemVerilog | `.sv`, `.svh` |- State machine viewer.

| TCL | `.tcl`, `.pro` |- State machine designer.

| XDC | `.xdc`, `.sdc` |- Code snippets and grammar.

| LDC | `.ldc`, `.pdc` |

| UCF | `.ucf` |![TerosHDL](https://github.com/TerosTechnology/vscode-terosHDL/blob/dev//resources/images/gui.gif?raw=true)

| TL-Verilog | `.tlv` |

## Development

## File Icons

if you want to contribute with a bug fix or new feature implementation you can use the following steps:

To enable TerosHDL file icons:

1. Open Command Palette (`Ctrl+Shift+P`)  1. make fork

2. Type "File Icon Theme"  2. `git clone [FORK URL]`

3. Select "TerosHDL File Icons"  3. `cd vscode-terosHDL`

  4. `git checkout dev` this should put you on *dev* branch where we do development

## License  5. `npm install`



See [LICENSE](LICENSE)now you can start coding. Tests can be run using `npm run test` once you are done you can open a pull request!



## Links



- [Repository](https://github.com/TerosTechnology/vscode-terosHDL)## Managed by

- [Issues](https://github.com/TerosTechnology/vscode-terosHDL/issues)

- [Carlos Alberto Ruiz](https://www.linkedin.com/in/carlos-alberto-ruiz-fpga/): carlosruiznaranjo@gmail.com
- [Ismael Pérez](https://www.linkedin.com/in/ispero/): ismaelprojo@gmail.com

## Sponsor

This project was funded through the NGI Assure Fund, a fund established by NLnet with financial support from
the European Commission's Next Generation Internet programme, under the aegis of DG Communications Networks,
Content and Technology under grant agreement No 957073.


<img border=0 src="https://github.com/TerosTechnology/vscode-terosHDL/blob/dev/resources/images/nlnet-fundation-150x150.png?raw=true" width="150" height="150"><img border=0 src="https://github.com/TerosTechnology/vscode-terosHDL/blob/dev/resources/images/logo.png?raw=true" width="400" height="120">
