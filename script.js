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
    // check diagonals
    if(
      cBoard[0][0] === cBoard [1][1] &&
      cBoard[0][0] === cBoard [2][2] &&
      cBoard[0][0] !== undefined
    ) winner = true;

    else if(
      cBoard[0][2] === cBoard [1][1] &&
      cBoard[0][2] === cBoard [2][0] &&
      cBoard[0][2] !== undefined
    ) winner = true;
      

    // need to check for draws
    // if every buttons has been clicked and
    // winner = false than its a draw  


    return winner;
  }

  function resetBoard(){
    for(let i = 0; i < rows; i++){
      board[i] = [];
  
      for(let j = 0; j < columns; j++){
        board[i].push(cell());
      }
    }
  }

  return {print, getBoard, makePlay, checkForWinner, resetBoard}

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
  let winner = false;
  let counter = 0;

  const switchPlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  
  const playRound = (row,column) => {
    board.makePlay(activePlayer.token, row, column)
    
    //check for a winner after every play
    winner = board.checkForWinner(activePlayer);
    if(!winner){
      switchPlayer();
      board.print();
      counter++;
      return;
    }
    console.log(`${activePlayer.name} is the winner!`)
    
  }

  function resetGame(){
    board.resetBoard();
    activePlayer = players[0];
    winner = false;
  }
  
  function getWinner() { 
    return winner;
  }

 function getCounter(){
  return counter;
 }
  return {playRound, getActivePlayer, resetGame, getWinner, getCounter};
}


function displayController(){

  let game = {};

  //cache DOM-
  const gameWrapper = document.querySelector('.game-wrapper');
  const resetBtn = document.querySelector('.reset');
  const form = document.querySelector('form');
  const msg = document.querySelector('p.msg')

  //bind events
  form.addEventListener('submit', startGame);
  resetBtn.addEventListener('click', reset);


  
  
  function createBoard() {
    gameWrapper.textContent = '';

    for(let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        const button = document.createElement('button');

        button.setAttribute('pos', `${i}${j}`);
        gameWrapper.appendChild(button);

        //bind events to each cell
        button.addEventListener('click',fillCell);
      }
    } 
  }

  function fillCell(e){
    //fills the cell and plays round
    e.target.innerHTML = game.getActivePlayer().token;
    const pos = e.target.getAttribute('pos');
    game.playRound(pos[0], pos[1]);
    msg.textContent = `It's ${game.getActivePlayer().name}'s turn`;

    //disable the button after its clicked once
    e.target.setAttribute('disabled','');

    checkEnd();
    disableForm();
  }
  

  
  
  function reset(){
    game.resetGame();
    gameWrapper.textContent = '';
    createBoard();
    form.reset();
    form.elements[0].removeAttribute('disabled');
    form.elements[1].removeAttribute('disabled');
    form.elements[2].removeAttribute('disabled');
  }


  function startGame(){
    let player1 = form.elements[0].value;
    let player2 = form.elements[1].value;
    if(player1 !== '' && player2 !== '') game = gameController(player1, player2);  
    else game = gameController(); 
    createBoard();
    disableForm();

    msg.textContent = `It's ${game.getActivePlayer().name}'s turn`;
  }


  function checkEnd(){
    console.log(game.getWinner())
    if(game.getWinner()){
      msg.textContent = `${game.getActivePlayer().name} wins!`;
      disableBtns();
    }
    if(game.getCounter() == 9){
      msg.textContent = `It's a Draw`;
    }
  }

  function disableForm(){
    form.elements[0].setAttribute('disabled', '');
    form.elements[1].setAttribute('disabled', '');
    form.elements[2].setAttribute('disabled', '');
  }

  function disableBtns(){
    const btn = gameWrapper.querySelectorAll('button');
    btn.forEach((button)=>{
      button.setAttribute('disabled','');
    })
  }
}

displayController();
