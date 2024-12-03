class SudokuSolver {
  constructor(){
    this.rows = [];
    this.cols = [];
    this.regions = [];
  }
  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return { error: "Expected puzzle to be 81 characters long" };
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      return { error: "Invalid characters in puzzle" };
    }
    const puzzleSolvable = (puzzleString)=>{
      const rows = Array(9).fill(null).map(()=> []);
      const cols = Array(9).fill(null).map(()=> []);
      const regions = Array(9).fill(null).map(()=> []);
      for(let i = 0;i < puzzleString.length;i++){
        const row = Math.floor(i / 9);
        const col = i % 9;
        const region = Math.floor(row / 3) * 3 + Math.floor(col / 3);
        if(puzzleString[i] === ".") continue;
        regions[region].push(puzzleString[i]);
        rows[row].push(puzzleString[i]);
        cols[col].push(puzzleString[i]);
      }
      const hasDuplicates = (array)=>{
        return new Set(array).size !== array.length;
      }
      for(let i = 0;i < 9;i++){
        if(hasDuplicates(rows[i]) || hasDuplicates(cols[i]) || hasDuplicates(regions[i])){
          return false;
        }
      }
      return true;
    }
    if(!puzzleSolvable(puzzleString)){
      return {error: "Puzzle cannot be solved"};
    }
    return true;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const start = row * 9;
    const rowValues = puzzleString.slice(start, start + 9);
    return !rowValues.includes(value);
  }

  checkColPlacement(puzzleString, row, column, value) {
    for (let i = 0; i < 9; i++) {
      if (puzzleString[column + i * 9] === value.toString()) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionRowStart = Math.floor(row / 3) * 3;
    const regionColStart = Math.floor(column / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const currentIndex = (regionRowStart + i) * 9 + (regionColStart + j);
        if (puzzleString[currentIndex] === value.toString()) {
          return false;
        }
      }
    }
    return true;
  }

  solve(puzzleString) {
    const findEmptyCell = (puzzle) => {
      for (let i = 0; i < puzzle.length; i++) {
        if (puzzle[i] === ".") return i;
      }
      return null;
    };

    const solveRecursively = (puzzle) => {
      const emptyIndex = findEmptyCell(puzzle);
      if (emptyIndex === null) return puzzle;

      const row = Math.floor(emptyIndex / 9);
      const column = emptyIndex % 9;

      for (let num = 1; num <= 9; num++) {
        const value = num.toString();
        const checkRow = this.checkRowPlacement(puzzle, row, column, value);
        const checkCol = this.checkColPlacement(puzzle, row, column, value);
        const checkRegion = this.checkRegionPlacement(puzzle, row, column, value);
        if (checkRow && checkCol && checkRegion) {
          const puzzleStart = puzzle.slice(0, emptyIndex);
          const puzzleEnd = puzzle.slice(emptyIndex + 1);
          const newPuzzle = puzzleStart + value + puzzleEnd;
          const solvedPuzzle = solveRecursively(newPuzzle);
          if (solvedPuzzle) return solvedPuzzle;
        }
      }
      return null; // Trigger backtracking
    };

    return solveRecursively(puzzleString);
  }
}


module.exports = SudokuSolver;
