const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  app.route("/").get((req,res)=>{
    res.sendFile(process.cwd() + "/views/index.html");
  })
  const solver = new SudokuSolver();
  app.route('/api/check')
    .post((req, res)=>{
      const {puzzle, coordinate, value} = req.body;
      if(!puzzle || !coordinate || !value){
        res.json({error: "Required field(s) missing"});
        return;
      };
      const validation = solver.validate(puzzle);
      if(validation.error){
        res.json(validation);
        return;
      }
      let [left, right] = coordinate.split(/(?<=[A-Ia-i])(?=\d)/);
      const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
      const rowIndex0 = rows.indexOf(left.toUpperCase());
      const colIndex1 = Number.parseInt(right);
      const index = rowIndex0 * 9 + (colIndex1 - 1);
      if(value === puzzle[index]){
        res.json({valid:true})
        return;
      };
      if(rowIndex0 === -1 || colIndex1 < 1 || colIndex1 > 9 || isNaN(colIndex1) || !left || !right){
        res.json({error: "Invalid coordinate"});
        return;
      }
      
      const valueNum = Number.parseInt(value);
      if(valueNum < 1 || valueNum > 9 || isNaN(valueNum)){
        res.json({error: "Invalid value"})
        return;
      };
      const validRow = solver.checkRowPlacement(puzzle, rowIndex0, colIndex1 - 1, value);
      const validCol = solver.checkColPlacement(puzzle, rowIndex0, colIndex1 - 1, value);
      const validRegion = solver.checkRegionPlacement(puzzle, rowIndex0, colIndex1 - 1, value);
      const errorTypes = [];
      !validRow && errorTypes.push("row");
      !validCol && errorTypes.push("column");
      !validRegion && errorTypes.push("region");
      if(errorTypes.length){
        res.json({valid:false, conflict: errorTypes});
      }else{
        res.json({valid:true })
      }
    });
  app.route('/api/solve')
    .post((req, res) => {
      const {puzzle} = req.body;
      if(!puzzle){
        res.json({error: "Required field missing"})
        return;
      }
      const validation = solver.validate(puzzle);
      if(validation.error){
        res.json(validation);
        return;
      }
      res.json({
        solution:solver.solve(puzzle)
      })
    });

};

