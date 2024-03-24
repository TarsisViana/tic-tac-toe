function gameBoard(){

  const rows = 3;
  const columns = 3;
  const board = [];

  //make the board with obj
  for(let i = 0; i < rows; i++){
    board[i] = [];

    for(let j = 0; j < columns; j++){
      board[i].push(cell());
    }
  }
  
  //for the console version
  function print(){
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  }

  const getBoard = () => board;

  const makePlay = (playerToken,row,collumn) => {
    //check if its marked
    if(board[row][collumn].getValue()) return;

    //if not update the cell value;
    board[row][collumn].getPlay(playerToken);
  }



  const checkForWinner = () => {
    //short for currentBoard
    const cBoard = board.map((row) => row.map((cell) => cell.getValue()))
    let winner = false;

    for(let i = 0; i < 3; i++){
      //check rows
      let row = cBoard[i];
      if(row[0] === row[1] && row[0] === row[2] && row[0] !== undefined){
        winner = true;
        break;
      }
      //check columns
      if(
        cBoard[0][i] === cBoard[1][i] && 
        cBoard[0][i] === cBoard[2][i] &&
        cBoard[0][i] !== undefined
        )
        {
          winner = true;
          break;
      }
    }
    return winner;
  }

  return {print, getBoard, makePlay, checkForWinner}

};


//the cell has a private variable "value" and the functions to change or get the value.
function cell(){
  let value = undefined;

  function getPlay (playerToken) { 
    value = playerToken;
  }
  const getValue = () => value;
  return {getPlay, getValue}
}


function gameController(playerOne = 'Player One',playerTwo = 'Player Two'){

  //inicialize gameBoard
  const board = gameBoard();

  const players = [
    {name: playerOne, token: 'x'},
    {name: playerTwo, token: 'o'}
  ];

  let activePlayer = players[0];

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  const printNewround = () => {
    console.log(board.print());
    console.log(`${activePlayer.name}'s turn...` );
  }

  const playRound = (row,column) => {
    board.makePlay(activePlayer.token, row, column)
    let winner;
    //check for a winner after every play
    winner = board.checkForWinner(activePlayer);
    if(!winner){
      switchPlayer();
      printNewround();
      return;
    }
    printNewround();
    console.log(`${activePlayer.name} is the winner!`)
  }


  printNewround();

  return {playRound};
}

const game = gameController()