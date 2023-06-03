"use strict";

const Player = (name, marker) => {
    this.name =name;
    this.marker = marker;
    const getPlayerMarker = () => marker;
    return { getPlayerMarker };
}

const GameBoard = (function() {
    let board = new Array(9);
    
    const getBoardCell = (idx) => {
        return board[idx];
    }

    const setCell = (index, marker) => {
        board[index] = marker;
    }

    const reset = () => {
        board.fill(null);
    };

    return{
        getBoardCell,
        setCell, 
        reset,
        board
    }
})();

const displayController = ( () => {
    const msg = document.getElementById('message')
    const resetBtn = document.getElementById('reset-button');
    const boardCells = document.querySelectorAll('.board-cell');
    const X_CLASS = 'x';
    const O_CLASS = 'o';

    const _init = ( () =>{ 
        boardCells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                if(gameController.getIsOver()) return;
                const cellIdx = parseInt(e.target.getAttribute('data-idx'));
                gameController.playRound(cellIdx);
            });
        });

        resetBtn.addEventListener('click', () => {
            GameBoard.reset();
            gameController.reset();
            clearCellClass();
            updateBoard();
            updateMessage("Player X's turn");
            toggleResetBtnVisibility();
        })

    })();

    const clearCellClass = () => {
        boardCells.forEach(cell => {
            cell.classList.remove(X_CLASS, O_CLASS);
        })
    }

    const updateMessage = (message) =>{
        msg.innerText = message;
    }

    const toggleResetBtnVisibility = () => {
        resetBtn.classList.toggle("show");
    }

    const updateBoard = () => {
        boardCells.forEach(cell => {
            const cellIdx = cell.getAttribute("data-idx");
            cell.classList.add(GameBoard.getBoardCell(cellIdx))
        });
    }

    return { 
        updateMessage,
        toggleResetBtnVisibility,
        updateBoard,
        X_CLASS,
        O_CLASS
    }

})()

const gameController = ( () => {
    const player1 = Player("Player 1", displayController.X_CLASS);
    const player2 = Player("Player 2", displayController.O_CLASS);    
    let round = 1;
    let gameOver = false;

    const playRound = (cellIndex) => {
        if (GameBoard.getBoardCell(cellIndex) != undefined) return;

        GameBoard.setCell(cellIndex, getCurrentPlayerMarker());
        displayController.updateBoard();
        // Check if there is a winner
        if(checkWinner(cellIndex) ){
            endGame(`Player ${getCurrentPlayerMarker().toUpperCase()} Wins!`)
            return
        }
        // Check if it's a draw, out of rounds
        if( round === 9 ) {
            endGame(`It's a Draw`)
            return
        }
        // Go to next round
        round++
        console.log("inside", round);
    }

    const getCurrentPlayerMarker = () => {
        return round % 2 === 1 ? player1.getPlayerMarker() : player2.getPlayerMarker();
    }

    const checkWinner = (cellIndex) => {

        const WINNING_COMBOS = [
            [0,1,2], // Horizontal
            [3,4,5],
            [6,7,8],
            [0,3,6], // Vertical
            [1,4,7],
            [2,5,8],
            [0,4,8], // Diagonal
            [2,4,6]
        ]

        const playerMarker = GameBoard.getBoardCell([cellIndex])

        for (let i = 0; i < WINNING_COMBOS.length; i++) {
            const [x,y,z] = WINNING_COMBOS[i];
            if (
                GameBoard.getBoardCell([x]) === playerMarker &&
                GameBoard.getBoardCell([y]) === playerMarker &&
                GameBoard.getBoardCell([z]) === playerMarker
            ) {
                return true;
            }
        }
        return false
    }

    const endGame = (message) => {
        // Display message
        displayController.updateMessage(message);
        // Show reset button
        displayController.toggleResetBtnVisibility();
        // Update gameOver var
        gameOver = true;
        console.log("I have run!", gameOver)
    }

    const reset = () => {
        gameOver = false;
        round = 1;
    }

    const getIsOver = () => {
        return gameOver;
    };

    return {
        playRound,
        reset,
        endGame,
        getIsOver
    }
})()
