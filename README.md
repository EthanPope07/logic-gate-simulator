# Logic Gate Simulator

An interactive web-based logic gate simulator developed for practicing digital logic concepts for my ECE306 final exam.

![Logic Gate Simulator](https://img.shields.io/badge/status-active-success.svg)
![Built with React](https://img.shields.io/badge/React-19.2.0-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)

## 🎯 Purpose

This simulator was created to help me study and practice logic gate circuits for my ECE306 (Introduction to Computing) final exam. It provides a hands-on, visual way to build and test digital logic circuits.

## ✨ Features

### Core Functionality
- **Drag-and-Drop Interface**: Easily place gates on the canvas
- **Logic Gates**: AND, OR, NOT, XOR, NAND, NOR, XNOR
- **Input/Output Nodes**: Interactive inputs and visual outputs
- **Wire Connections**: Connect gates with visual wiring
- **Real-time Simulation**: See logic propagate through your circuit instantly

### Advanced Features
- **Clock/Pulse Generator**: Build sequential circuits with adjustable clock speed (100-2000ms)
- **Custom ICs**: Create reusable components from circuit sections
- **Truth Table Generator**: Automatically generate truth tables for your circuits
- **Undo/Redo**: Full history support with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Save/Load**: Save circuits as JSON files and reload them later
- **Wire Styles**: Toggle between curved (Bezier) and angled (orthogonal) wires
- **Grid Snap**: Automatic 20px grid alignment for clean circuits
- **Multi-Selection**: Shift+Click to select multiple nodes

### UI Modes
- **Base 3 Mode**: Limit to fundamental gates (AND, OR, NOT) for exam practice
- **All Gates Mode**: Access all available logic gates
- **Pause Simulation**: Freeze circuit state for analysis

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/logic-gate-simulator.git
cd logic-gate-simulator

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 📖 How to Use

1. **Select a Mode**: Choose "Base 3" for exam practice or "All Gates" for full functionality
2. **Add Gates**: Drag gates from the sidebar onto the canvas
3. **Connect Wires**: Click an output pin, then click an input pin to create a wire
4. **Toggle Inputs**: Click INPUT nodes to toggle between 0 and 1
5. **Create ICs**: Shift+Click to select multiple nodes, then click "Create IC" to make reusable components
6. **Generate Truth Tables**: Click "Table" to see the truth table for your circuit
7. **Adjust Clock Speed**: Use the slider to control clock pulse frequency

### Keyboard Shortcuts
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Shift+Click**: Multi-select nodes
- **Delete/Backspace**: Delete selected node

## 🛠️ Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS Variables** - Theming and styling

## 🎓 Educational Value

This simulator helps with:
- Understanding Boolean logic and gate operations
- Visualizing circuit behavior and signal propagation
- Building complex circuits from simple gates
- Practicing for exams with truth table verification
- Experimenting with sequential logic using clock signals

## 🔮 Future Enhancements

Planned features for future development:
- **Multiplexers (MUX)** and Demultiplexers (DEMUX)
- **Encoders** and Decoders
- **Flip-Flops** (SR, D, JK, T)
- **Registers** and Counters
- **7-Segment Display** output
- **Timing Diagrams** for signal visualization
- **Circuit Templates** for common patterns
- **Export to Verilog/VHDL**
- **Zoom and Pan** for large circuits

## 📝 License

This project is open source and available for educational purposes.

## 🙏 Acknowledgments

Developed as a study tool for ECE306 - Introduction to Computing at UT Austin.

---

**Note**: This is an educational tool and may not reflect all real-world circuit behaviors. Always verify critical designs with professional tools.
