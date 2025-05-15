/**
 * Neon Chess - A fully-featured chess engine with neon styling
 * 
 * Features:
 * - Object-oriented architecture
 * - AI opponent with adjustable difficulty
 * - Neon-themed visual styling
 * - User management system
 * - Online multiplayer framework
 */

// Game Constants
const PIECE_TYPES = {
    PAWN: 'pawn',
    ROOK: 'rook',
    KNIGHT: 'knight',
    BISHOP: 'bishop',
    QUEEN: 'queen',
    KING: 'king'
};

const COLORS = {
    WHITE: 'white',
    BLACK: 'black'
};

const THEMES = {
    BLUE_PINK: 'blue-pink',
    GREEN_YELLOW: 'green-yellow',
    PURPLE_ORANGE: 'purple-orange',
    CUSTOM: 'custom'
};

const DIFFICULTY = {
    EASY: 1,
    MEDIUM: 2,
    HARD: 3,
    MASTER: 4
};

// ============= PIECE CLASSES =============

/**
 * Base Piece class that all chess pieces inherit from
 */
class Piece {
    constructor(color, position) {
        this.color = color;
        this.position = position;
        this.hasMoved = false;
        this.element = null;
    }

    /**
     * Get all possible moves for this piece
     * @param {Board} board - The current board state
     * @returns {Array} - Array of valid move positions
     */
    getPossibleMoves(board) {
        return [];
    }

    /**
     * Check if a move is valid
     * @param {Board} board - The current board state
     * @param {Object} targetPosition - The target position {x, y}
     * @returns {Boolean} - Whether the move is valid
     */
    isValidMove(board, targetPosition) {
        const possibleMoves = this.getPossibleMoves(board);
        return possibleMoves.some(move => 
            move.x === targetPosition.x && move.y === targetPosition.y
        );
    }

    /**
     * Create HTML element for this piece
     * @param {String} theme - Current visual theme
     * @returns {HTMLElement} - The piece element
     */
    createElement(theme) {
        const element = document.createElement('div');
        element.classList.add('piece', this.constructor.name.toLowerCase(), this.color);
        element.dataset.pieceType = this.constructor.name.toLowerCase();
        element.dataset.color = this.color;
        
        // Add theme-specific classes
        element.classList.add(`theme-${theme}`);
        
        this.element = element;
        return element;
    }

    /**
     * Move this piece to a new position
     * @param {Object} newPosition - The new position {x, y}
     */
    moveTo(newPosition) {
        this.position = newPosition;
        this.hasMoved = true;
    }
}

class Pawn extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = PIECE_TYPES.PAWN;
    }

    getPossibleMoves(board) {
        const moves = [];
        const direction = this.color === COLORS.WHITE ? -1 : 1;
        const x = this.position.x;
        const y = this.position.y;

        // Forward move
        if (board.isPositionEmpty({ x, y: y + direction })) {
            moves.push({ x, y: y + direction });

            // Double move from starting position
            if (!this.hasMoved && board.isPositionEmpty({ x, y: y + 2 * direction })) {
                moves.push({ x, y: y + 2 * direction });
            }
        }

        // Capture moves
        const capturePositions = [
            { x: x - 1, y: y + direction },
            { x: x + 1, y: y + direction }
        ];

        capturePositions.forEach(pos => {
            if (board.isValidPosition(pos)) {
                const pieceAtPosition = board.getPieceAt(pos);
                if (pieceAtPosition && pieceAtPosition.color !== this.color) {
                    moves.push(pos);
                }
            }
        });

        // En passant
        if (board.enPassantTarget) {
            const enPassantPos = board.enPassantTarget;
            if (Math.abs(enPassantPos.x - x) === 1 && enPassantPos.y === y) {
                moves.push({ x: enPassantPos.x, y: y + direction });
            }
        }

        return moves.filter(pos => board.isValidPosition(pos));
    }

    createElement(theme) {
        const element = super.createElement(theme);
        element.innerHTML = '<i class="fas fa-chess-pawn"></i>';
        return element;
    }
}

class Rook extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = PIECE_TYPES.ROOK;
    }

    getPossibleMoves(board) {
        const moves = [];
        const directions = [
            { x: 1, y: 0 },  // right
            { x: -1, y: 0 }, // left
            { x: 0, y: 1 },  // down
            { x: 0, y: -1 }  // up
        ];

        directions.forEach(dir => {
            let currentPos = { 
                x: this.position.x + dir.x, 
                y: this.position.y + dir.y 
            };

            while (board.isValidPosition(currentPos)) {
                const pieceAtPosition = board.getPieceAt(currentPos);
                
                if (!pieceAtPosition) {
                    moves.push({ ...currentPos });
                } else {
                    if (pieceAtPosition.color !== this.color) {
                        moves.push({ ...currentPos });
                    }
                    break;
                }
                
                currentPos.x += dir.x;
                currentPos.y += dir.y;
            }
        });

        return moves;
    }

    createElement(theme) {
        const element = super.createElement(theme);
        element.innerHTML = '<i class="fas fa-chess-rook"></i>';
        return element;
    }
}

class Knight extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = PIECE_TYPES.KNIGHT;
    }

    getPossibleMoves(board) {
        const moves = [];
        const knightMoves = [
            { x: 1, y: 2 },
            { x: 2, y: 1 },
            { x: 2, y: -1 },
            { x: 1, y: -2 },
            { x: -1, y: -2 },
            { x: -2, y: -1 },
            { x: -2, y: 1 },
            { x: -1, y: 2 }
        ];

        knightMoves.forEach(move => {
            const newPos = {
                x: this.position.x + move.x,
                y: this.position.y + move.y
            };

            if (board.isValidPosition(newPos)) {
                const pieceAtPosition = board.getPieceAt(newPos);
                if (!pieceAtPosition || pieceAtPosition.color !== this.color) {
                    moves.push(newPos);
                }
            }
        });

        return moves;
    }

    createElement(theme) {
        const element = super.createElement(theme);
        element.innerHTML = '<i class="fas fa-chess-knight"></i>';
        return element;
    }
}

class Bishop extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = PIECE_TYPES.BISHOP;
    }

    getPossibleMoves(board) {
        const moves = [];
        const directions = [
            { x: 1, y: 1 },   // down-right
            { x: 1, y: -1 },  // up-right
            { x: -1, y: 1 },  // down-left
            { x: -1, y: -1 }  // up-left
        ];

        directions.forEach(dir => {
            let currentPos = { 
                x: this.position.x + dir.x, 
                y: this.position.y + dir.y 
            };

            while (board.isValidPosition(currentPos)) {
                const pieceAtPosition = board.getPieceAt(currentPos);
                
                if (!pieceAtPosition) {
                    moves.push({ ...currentPos });
                } else {
                    if (pieceAtPosition.color !== this.color) {
                        moves.push({ ...currentPos });
                    }
                    break;
                }
                
                currentPos.x += dir.x;
                currentPos.y += dir.y;
            }
        });

        return moves;
    }

    createElement(theme) {
        const element = super.createElement(theme);
        element.innerHTML = '<i class="fas fa-chess-bishop"></i>';
        return element;
    }
}

class Queen extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = PIECE_TYPES.QUEEN;
    }

    getPossibleMoves(board) {
        const moves = [];
        // Queen moves like a rook and bishop combined
        const directions = [
            { x: 1, y: 0 },   // right
            { x: -1, y: 0 },  // left
            { x: 0, y: 1 },   // down
            { x: 0, y: -1 },  // up
            { x: 1, y: 1 },   // down-right
            { x: 1, y: -1 },  // up-right
            { x: -1, y: 1 },  // down-left
            { x: -1, y: -1 }  // up-left
        ];

        directions.forEach(dir => {
            let currentPos = { 
                x: this.position.x + dir.x, 
                y: this.position.y + dir.y 
            };

            while (board.isValidPosition(currentPos)) {
                const pieceAtPosition = board.getPieceAt(currentPos);
                
                if (!pieceAtPosition) {
                    moves.push({ ...currentPos });
                } else {
                    if (pieceAtPosition.color !== this.color) {
                        moves.push({ ...currentPos });
                    }
                    break;
                }
                
                currentPos.x += dir.x;
                currentPos.y += dir.y;
            }
        });

        return moves;
    }

    createElement(theme) {
        const element = super.createElement(theme);
        element.innerHTML = '<i class="fas fa-chess-queen"></i>';
        return element;
    }
}

class King extends Piece {
    constructor(color, position) {
        super(color, position);
        this.type = PIECE_TYPES.KING;
        this.inCheck = false;
    }

    getPossibleMoves(board) {
        const moves = [];
        const kingMoves = [
            { x: 1, y: 0 },
            { x: 1, y: 1 },
            { x: 0, y: 1 },
            { x: -1, y: 1 },
            { x: -1, y: 0 },
            { x: -1, y: -1 },
            { x: 0, y: -1 },
            { x: 1, y: -1 }
        ];

        // Regular king moves
        kingMoves.forEach(move => {
            const newPos = {
                x: this.position.x + move.x,
                y: this.position.y + move.y
            };

            if (board.isValidPosition(newPos)) {
                const pieceAtPosition = board.getPieceAt(newPos);
                if (!pieceAtPosition || pieceAtPosition.color !== this.color) {
                    // Check if this move would put the king in check
                    if (!board.wouldBeInCheck(this, newPos)) {
                        moves.push(newPos);
                    }
                }
            }
        });

        // Castling
        if (!this.hasMoved && !this.inCheck) {
            // Kingside castling
            const kingsideRook = board.getPieceAt({ x: 7, y: this.position.y });
            if (kingsideRook && 
                kingsideRook instanceof Rook && 
                kingsideRook.color === this.color && 
                !kingsideRook.hasMoved) {
                
                const pathClear = [5, 6].every(x => 
                    !board.getPieceAt({ x, y: this.position.y }) &&
                    !board.isPositionUnderAttack({ x, y: this.position.y }, this.color)
                );

                if (pathClear) {
                    moves.push({ x: 6, y: this.position.y, castling: 'kingside' });
                }
            }

            // Queenside castling
            const queensideRook = board.getPieceAt({ x: 0, y: this.position.y });
            if (queensideRook && 
                queensideRook instanceof Rook && 
                queensideRook.color === this.color && 
                !queensideRook.hasMoved) {
                
                const pathClear = [1, 2, 3].every(x => 
                    !board.getPieceAt({ x, y: this.position.y })
                ) && [2, 3].every(x =>
                    !board.isPositionUnderAttack({ x, y: this.position.y }, this.color)
                );

                if (pathClear) {
                    moves.push({ x: 2, y: this.position.y, castling: 'queenside' });
                }
            }
        }

        return moves;
    }

    createElement(theme) {
        const element = super.createElement(theme);
        element.innerHTML = '<i class="fas fa-chess-king"></i>';
        return element;
    }
}

// ============= BOARD CLASS =============

/**
 * Board class to handle the chess board representation
 */
class Board {
    constructor() {
        this.squares = new Array(8).fill(null).map(() => new Array(8).fill(null));
        this.capturedPieces = {
            [COLORS.WHITE]: [],
            [COLORS.BLACK]: []
        };
        this.enPassantTarget = null;
        this.boardElement = null;
        this.squareElements = [];
        this.theme = THEMES.BLUE_PINK;
    }

    /**
     * Initialize the chess board with pieces in starting positions
     */
    initialize() {
        // Create pawns
        for (let x = 0; x < 8; x++) {
            this.squares[x][1] = new Pawn(COLORS.BLACK, { x, y: 1 });
            this.squares[x][6] = new Pawn(COLORS.WHITE, { x, y: 6 });
        }

        // Create rooks
        this.squares[0][0] = new Rook(COLORS.BLACK, { x: 0, y: 0 });
        this.squares[7][0] = new Rook(COLORS.BLACK, { x: 7, y: 0 });
        this.squares[0][7] = new Rook(COLORS.WHITE, { x: 0, y: 7 });
        this.squares[7][7] = new Rook(COLORS.WHITE, { x: 7, y: 7 });

        // Create knights
        this.squares[1][0] = new Knight(COLORS.BLACK, { x: 1, y: 0 });
        this.squares[6][0] = new Knight(COLORS.BLACK, { x: 6, y: 0 });
        this.squares[1][7] = new Knight(COLORS.WHITE, { x: 1, y: 7 });
        this.squares[6][7] = new Knight(COLORS.WHITE, { x: 6, y: 7 });

        // Create bishops
        this.squares[2][0] = new Bishop(COLORS.BLACK, { x: 2, y: 0 });
        this.squares[5][0] = new Bishop(COLORS.BLACK, { x: 5, y: 0 });
        this.squares[2][7] = new Bishop(COLORS.WHITE, { x: 2, y: 7 });
        this.squares[5][7] = new Bishop(COLORS.WHITE, { x: 5, y: 7 });

        // Create queens
        this.squares[3][0] = new Queen(COLORS.BLACK, { x: 3, y: 0 });
        this.squares[3][7] = new Queen(COLORS.WHITE, { x: 3, y: 7 });

        // Create kings
        this.squares[4][0] = new King(COLORS.BLACK, { x: 4, y: 0 });
        this.squares[4][7] = new King(COLORS.WHITE, { x: 4, y: 7 });
    }

    /**
     * Create the HTML elements for the board
     * @param {String} theme - The visual theme to use
     * @returns {HTMLElement} - The board element
     */
    createBoardElement(theme) {
        this.theme = theme || this.theme;
        
        const boardElement = document.createElement('div');
        boardElement.classList.add('chess-board', `theme-${this.theme}`);
        
        // Create squares
        this.squareElements = [];
        
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const square = document.createElement('div');
                const isLight = (x + y) % 2 === 0;
                
                square.classList.add('square', isLight ? 'light' : 'dark');
                square.dataset.x = x;
                square.dataset.y = y;
                
                // Add the piece if there is one
                const piece = this.squares[x][y];
                if (piece) {
                    square.appendChild(piece.createElement(this.theme));
                }
                
                boardElement.appendChild(square);
                this.squareElements.push(square);
            }
        }
        
        this.boardElement = boardElement;
        return boardElement;
    }

    /**
     * Check if a position is valid (within the board)
     * @param {Object} position - The position to check {x, y}
     * @returns {Boolean} - Whether the position is valid
     */
    isValidPosition(position) {
        return position.x >= 0 && position.x < 8 && 
               position.y >= 0 && position.y < 8;
    }

    /**
     * Check if a position is empty
     * @param {Object} position - The position to check {x, y}
     * @returns {Boolean} - Whether the position is empty
     */
    isPositionEmpty(position) {
        if (!this.isValidPosition(position)) return false;
        return this.squares[position.x][position.y] === null;
    }

    /**
     * Get the piece at a position
     * @param {Object} position - The position to check {x, y}
     * @returns {Piece|null} - The piece at the position or null
     */
    getPieceAt(position) {
        if (!this.isValidPosition(position)) return null;
        return this.squares[position.x][position.y];
    }

    /**
     * Get all pieces of a specific color
     * @param {String} color - The color to filter by
     * @returns {Array} - Array of pieces
     */
    getPiecesByColor(color) {
        const pieces = [];
        
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const piece = this.squares[x][y];
                if (piece && piece.color === color) {
                    pieces.push(piece);
                }
            }
        }
        
        return pieces;
    }

    /**
     * Get the king of a specific color
     * @param {String} color - The color of the king to find
     * @returns {King|null} - The king piece or null
     */
    getKing(color) {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const piece = this.squares[x][y];
                if (piece && piece instanceof King && piece.color === color) {
                    return piece;
                }
            }
        }
        return null;
    }

    /**
     * Check if a position is under attack by a specific color
     * @param {Object} position - The position to check {x, y}
     * @param {String} byColor - The attacking color
     * @returns {Boolean} - Whether the position is under attack
     */
    isPositionUnderAttack(position, byColor) {
        const oppositeColor = byColor === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
        const attackingPieces = this.getPiecesByColor(oppositeColor);
        
        for (const piece of attackingPieces) {
            // For king checks we need to exclude its own attack range to avoid recursion
            if (piece instanceof King) {
                const kingMoves = [
                    { x: 1, y: 0 },
                    { x: 1, y: 1 },
                    { x: 0, y: 1 },
                    { x: -1, y: 1 },
                    { x: -1, y: 0 },
                    { x: -1, y: -1 },
                    { x: 0, y: -1 },
                    { x: 1, y: -1 }
                ];
                
                // Check if king directly threatens the position
                for (const move of kingMoves) {
                    const attackPos = {
                        x: piece.position.x + move.x,
                        y: piece.position.y + move.y
                    };
                    
                    if (attackPos.x === position.x && attackPos.y === position.y) {
                        return true;
                    }
                }
            } else {
                // For other pieces, check their possible moves
                const moves = piece.getPossibleMoves(this);
                
                if (moves.some(move => move.x === position.x && move.y === position.y)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * Check if moving a piece would put its king in check
     * @param {Piece} piece - The piece to move
     * @param {Object} targetPosition - The target position {x, y}
     * @returns {Boolean} - Whether the move would put the king in check
     */
    wouldBeInCheck(piece, targetPosition) {
        // Save the current state
        const originalPosition = { ...piece.position };
        const pieceAtTarget = this.squares[targetPosition.x][targetPosition.y];
        
        // Temporarily make the move
        this.squares[originalPosition.x][originalPosition.y] = null;
        this.squares[targetPosition.x][targetPosition.y] = piece;
        piece.position = targetPosition;
        
        // Check if the king is in check
        const king = piece instanceof King ? piece : this.getKing(piece.color);
        const inCheck = this.isPositionUnderAttack(king.position, king.color);
        
        // Restore the original state
        piece.position = originalPosition;
        this.squares[originalPosition.x][originalPosition.y] = piece;
        this.squares[targetPosition.x][targetPosition.y] = pieceAtTarget;
        
        return inCheck;
    }

    /**
     * Move a piece on the board
     * @param {Piece} piece - The piece to move
     * @param {Object} targetPosition - The target position {x, y}
     * @returns {Object} - Move result including captured piece if any
     */
    movePiece(piece, targetPosition) {
        const result = {
            piece,
            from: { ...piece.position },
            to: { ...targetPosition },
            capturedPiece: null,
            isPromotion: false,
            isCastling: false,
            isEnPassant: false
        };
        
        // Handle castling
        if (piece instanceof King && targetPosition.castling) {
            result.isCastling = true;
            
            // Move the king
            this.squares[piece.position.x][piece.position.y] = null;
            this.squares[targetPosition.x][targetPosition.y] = piece;
            piece.moveTo(targetPosition);
            
            // Move the rook
            let rookX, rookTargetX;
            if (targetPosition.castling === 'kingside') {
                rookX = 7;
                rookTargetX = 5;
            } else { // queenside
                rookX = 0;
                rookTargetX = 3;
            }
            
            const rook = this.squares[rookX][piece.position.y];
            this.squares[rookX][piece.position.y] = null;
            this.squares[rookTargetX][piece.position.y] = rook;
            rook.moveTo({ x: rookTargetX, y: piece.position.y });
            
            return result;
        }
        
        // Check for en passant capture
        if (piece instanceof Pawn && 
            targetPosition.x !== piece.position.x && 
            !this.getPieceAt(targetPosition)) {
            
            result.isEnPassant = true;
            const capturePosition = {
                x: targetPosition.x,
                y: piece.position.y
            };
            
            result.capturedPiece = this.squares[capturePosition.x][capturePosition.y];
            this.capturedPieces[result.capturedPiece.color].push(result.capturedPiece);
            this.squares[capturePosition.x][capturePosition.y] = null;
        }
        
        // Capture piece if present
        const capturedPiece = this.squares[targetPosition.x][targetPosition.y];
        if (capturedPiece) {
            result.capturedPiece = capturedPiece;
            this.capturedPieces[capturedPiece.color].push(capturedPiece);
        }
        
        // Set en passant target for next move
        this.enPassantTarget = null;
        if (piece instanceof Pawn && Math.abs(targetPosition.y - piece.position.y) === 2) {
            const direction = piece.color === COLORS.WHITE ? -1 : 1;
            this.enPassantTarget = {
                x: piece.position.x,
                y: piece.position.y + direction
            };
        }
        
        // Move the piece
        this.squares[piece.position.x][piece.position.y] = null;
        this.squares[targetPosition.x][targetPosition.y] = piece;
        piece.moveTo(targetPosition);
        
        // Check for pawn promotion
        if (piece instanceof Pawn && (targetPosition.y === 0 || targetPosition.y === 7)) {
            result.isPromotion = true;
        }
        
        return result;
    }

    /**
     * Promote a pawn to another piece type
     * @param {Pawn} pawn - The pawn to promote
     * @param {String} pieceType - The piece type to promote to
     * @returns {Piece} - The new piece
     */
    promotePawn(pawn, pieceType) {
        let newPiece;
        
        switch (pieceType) {
            case PIECE_TYPES.QUEEN:
                newPiece = new Queen(pawn.color, pawn.position);
                break;
            case PIECE_TYPES.ROOK:
                newPiece = new Rook(pawn.color, pawn.position);
                break;
            case PIECE_TYPES.BISHOP:
                newPiece = new Bishop(pawn.color, pawn.position);
                break;
            case PIECE_TYPES.KNIGHT:
                newPiece = new Knight(pawn.color, pawn.position);
                break;
            default:
                newPiece = new Queen(pawn.color, pawn.position);
        }
        
        this.squares[pawn.position.x][pawn.position.y] = newPiece;
        return newPiece;
    }

    /**
     * Update the visual representation of the board
     */
    updateBoardView() {
        if (!this.boardElement) return;
        
        // Update all squares
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                const squareElement = this.boardElement.querySelector(`[data-x="${x}"][data-y="${y}"]`);
                
                // Clear square
                while (squareElement.firstChild) {
                    squareElement.removeChild(squareElement.firstChild);
                }
                
                // Add piece if present
                const piece = this.squares[x][y];
                if (piece) {
                    squareElement.appendChild(piece.createElement(this.theme));
                }
            }
        }
    }

    /**
     * Set the visual theme of the board
     * @param {String} theme - The theme to set
     */
    setTheme(theme) {
        if (!THEMES[theme]) return;
        
        this.theme = theme;
        
        if (this.boardElement) {
            // Update board theme
            this.boardElement.className = this.boardElement.className.replace(/theme-\w+/, `theme-${theme}`);
            
            // Update pieces theme
            const pieceElements = this.boardElement.querySelectorAll('.piece');
            pieceElements.forEach(el => {
                el.className = el.className.replace(/theme-\w+/, `theme-${theme}`);
            });
        }
    }
}

// ============= GAME CLASS =============

/**
 * Game class to manage the overall game state
 */
class Game {
    constructor(options = {}) {
        this.board = new Board();
        this.ui = new UI(this);
        this.currentPlayer = COLORS.WHITE;
        this.selectedPiece = null;
        this.gameMode = options.gameMode || 'player-vs-ai';
        this.aiDifficulty = options.aiDifficulty || DIFFICULTY.MEDIUM;
        this.aiPlayer = options.aiPlayer || COLORS.BLACK;
        this.theme = options.theme || THEMES.BLUE_PINK;
        this.moveHistory = [];
        this.gameStatus = 'active'; // active, check, checkmate, stalemate, draw
        this.userManager = new UserManager();
        this.multiplayerManager = options.multiplayer ? new MultiplayerManager(this) : null;
    }

    /**
     * Initialize the game
     * @param {HTMLElement} container - The container element for the game
     */
    initialize(container) {
        this.board.initialize();
        this.ui.initialize(container, this.theme);
        
        // If playing against AI and AI goes first, make AI move
        if (this.gameMode === 'player-vs-ai' && this.aiPlayer === COLORS.WHITE) {
            this.makeAiMove();
        }
        
        // Setup multiplayer if enabled
        if (this.multiplayerManager) {
            this.multiplayerManager.initialize();
        }
    }

    /**
     * Handle a square click on the board
     * @param {Number} x - The x coordinate
     * @param {Number} y - The y coordinate
     */
    handleSquareClick(x, y) {
        // Ignore clicks if game is over or not player's turn in multiplayer
        if (this.gameStatus !== 'active' && this.gameStatus !== 'check') return;
        if (this.multiplayerManager && !this.multiplayerManager.isMyTurn()) return;
        
        const clickedPiece = this.board.getPieceAt({ x, y });
        
        // If a piece is already selected
        if (this.selectedPiece) {
            // If clicking the same piece, deselect it
            if (this.selectedPiece === clickedPiece) {
                this.ui.deselectPiece();
                this.selectedPiece = null;
                return;
            }
            
            // If clicking another piece of the same color, select that piece instead
            if (clickedPiece && clickedPiece.color === this.currentPlayer) {
                this.ui.deselectPiece();
                this.selectedPiece = clickedPiece;
                this.ui.selectPiece(clickedPiece);
                return;
            }
            
            // Try to move the selected piece
            const targetPosition = { x, y };
            if (this.selectedPiece.isValidMove(this.board, targetPosition) && 
                !this.board.wouldBeInCheck(this.selectedPiece, targetPosition)) {
                
                this.makeMove(this.selectedPiece, targetPosition);
            }
        } 
        // If no piece is selected, select a piece of the current player's color
        else if (clickedPiece && clickedPiece.color === this.currentPlayer) {
            this.selectedPiece = clickedPiece;
            this.ui.selectPiece(clickedPiece);
        }
    }

    /**
     * Make a move with a piece
     * @param {Piece} piece - The piece to move
     * @param {Object} targetPosition - The target position {x, y}
     */
    makeMove(piece, targetPosition) {
        // Make the move
        const moveResult = this.board.movePiece(piece, targetPosition);
        
        // Update move history
        this.moveHistory.push(moveResult);
        
        // Handle pawn promotion
        if (moveResult.isPromotion) {
            const promotionPiece = this.ui.showPromotionDialog(piece.color);
            this.board.promotePawn(piece, promotionPiece);
        }
        
        // Update the UI
        this.ui.deselectPiece();
        this.selectedPiece = null;
        this.board.updateBoardView();
        
        // Switch player
        this.currentPlayer = this.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
        this.ui.updateStatus();
        
        // Check game status
        this.updateGameStatus();
        
        // If playing against AI and it's AI's turn
        if (this.gameMode === 'player-vs-ai' && this.currentPlayer === this.aiPlayer && 
            this.gameStatus === 'active') {
            setTimeout(() => this.makeAiMove(), 500);
        }
        
        // If playing multiplayer, send the move
        if (this.multiplayerManager) {
            this.multiplayerManager.sendMove(moveResult);
        }
    }

    /**
     * Make an AI move
     */
    makeAiMove() {
        const ai = new ChessAI(this.aiDifficulty);
        const move = ai.calculateBestMove(this.board, this.aiPlayer);
        
        if (move) {
            this.makeMove(move.piece, move.to);
        }
    }

    /**
     * Check if the game is over and update the status
     */
    updateGameStatus() {
        const king = this.board.getKing(this.currentPlayer);
        
        // Check if king is in check
        const inCheck = this.board.isPositionUnderAttack(king.position, king.color);
        king.inCheck = inCheck;
        
        // Get all possible moves for the current player
        const pieces = this.board.getPiecesByColor(this.currentPlayer);
        let hasValidMoves = false;
        
        for (const piece of pieces) {
            const moves = piece.getPossibleMoves(this.board);
            
            for (const move of moves) {
                if (!this.board.wouldBeInCheck(piece, move)) {
                    hasValidMoves = true;
                    break;
                }
            }
            
            if (hasValidMoves) break;
        }
        
        // Update game status
        if (inCheck && !hasValidMoves) {
            this.gameStatus = 'checkmate';
            const winner = this.currentPlayer === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
            this.ui.showGameOver(`Checkmate! ${winner} wins!`);
        } else if (!inCheck && !hasValidMoves) {
            this.gameStatus = 'stalemate';
            this.ui.showGameOver('Stalemate! The game is a draw.');
        } else if (inCheck) {
            this.gameStatus = 'check';
            this.ui.showCheck();
        } else {
            this.gameStatus = 'active';
        }
    }

    /**
     * Reset the game to its initial state
     */
    resetGame() {
        this.board = new Board();
        this.board.initialize();
        this.currentPlayer = COLORS.WHITE;
        this.selectedPiece = null;
        this.moveHistory = [];
        this.gameStatus = 'active';
        
        this.ui.resetUI();
        this.board.updateBoardView();
        
        // If playing against AI and AI goes first, make AI move
        if (this.gameMode === 'player-vs-ai' && this.aiPlayer === COLORS.WHITE) {
            this.makeAiMove();
        }
    }

    /**
     * Change the game theme
     * @param {String} theme - The theme to set
     */
    setTheme(theme) {
        this.theme = theme;
        this.board.setTheme(theme);
        this.ui.setTheme(theme);
    }
}

// ============= UI CLASS =============

/**
 * UI class for user interface interactions
 */
class UI {
    constructor(game) {
        this.game = game;
        this.boardContainer = null;
        this.statusElement = null;
        this.controlsElement = null;
        this.capturedPiecesElement = null;
        this.theme = null;
    }

    /**
     * Initialize the UI
     * @param {HTMLElement} container - The container element
     * @param {String} theme - The theme to use
     */
    initialize(container, theme) {
        this.theme = theme;
        
        // Create main container
        const gameContainer = document.createElement('div');
        gameContainer.classList.add('chess-game-container', `theme-${theme}`);
        
        // Create status element
        this.statusElement = document.createElement('div');
        this.statusElement.classList.add('game-status');
        this.updateStatus();
        gameContainer.appendChild(this.statusElement);
        
        // Create captured pieces display
        this.capturedPiecesElement = document.createElement('div');
        this.capturedPiecesElement.classList.add('captured-pieces');
        
        const whiteCaptured = document.createElement('div');
        whiteCaptured.classList.add('white-captured');
        whiteCaptured.innerHTML = '<h3>White Captured:</h3><div class="pieces"></div>';
        
        const blackCaptured = document.createElement('div');
        blackCaptured.classList.add('black-captured');
        blackCaptured.innerHTML = '<h3>Black Captured:</h3><div class="pieces"></div>';
        
        this.capturedPiecesElement.appendChild(whiteCaptured);
        this.capturedPiecesElement.appendChild(blackCaptured);
        gameContainer.appendChild(this.capturedPiecesElement);
        
        // Create board container
        this.boardContainer = document.createElement('div');
        this.boardContainer.classList.add('board-container');
        
        // Create and add the board
        const boardElement = this.game.board.createBoardElement(theme);
        this.boardContainer.appendChild(boardElement);
        gameContainer.appendChild(this.boardContainer);
        
        // Create controls
        this.controlsElement = document.createElement('div');
        this.controlsElement.classList.add('game-controls');
        
        // Reset button
        const resetButton = document.createElement('button');
        resetButton.classList.add('reset-button');
        resetButton.textContent = 'Reset Game';
        resetButton.addEventListener('click', () => this.game.resetGame());
        
        // Theme selector
        const themeSelector = document.createElement('select');
        themeSelector.classList.add('theme-selector');
        
        Object.keys(THEMES).forEach(theme => {
            const option = document.createElement('option');
            option.value = THEMES[theme];
            option.textContent = theme.replace('_', ' ').toLowerCase()
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            themeSelector.appendChild(option);
        });
        
        themeSelector.value = theme;
        themeSelector.addEventListener('change', e => {
            this.game.setTheme(e.target.value);
        });
        
        // Difficulty selector (if playing against AI)
        if (this.game.gameMode === 'player-vs-ai') {
            const difficultySelector = document.createElement('select');
            difficultySelector.classList.add('difficulty-selector');
            
            Object.keys(DIFFICULTY).forEach(diff => {
                const option = document.createElement('option');
                option.value = DIFFICULTY[diff];
                option.textContent = diff.charAt(0) + diff.slice(1).toLowerCase();
                difficultySelector.appendChild(option);
            });
            
            difficultySelector.value = this.game.aiDifficulty;
            difficultySelector.addEventListener('change', e => {
                this.game.aiDifficulty = parseInt(e.target.value);
            });
            
            const difficultyLabel = document.createElement('label');
            difficultyLabel.textContent = 'AI Difficulty: ';
            difficultyLabel.appendChild(difficultySelector);
            
            this.controlsElement.appendChild(difficultyLabel);
        }
        
        // Add controls to container
        const themeLabel = document.createElement('label');
        themeLabel.textContent = 'Theme: ';
        themeLabel.appendChild(themeSelector);
        
        this.controlsElement.appendChild(themeLabel);
        this.controlsElement.appendChild(resetButton);
        gameContainer.appendChild(this.controlsElement);
        
        // Add event listeners to the board
        boardElement.addEventListener('click', e => {
            const square = e.target.closest('.square');
            if (square) {
                const x = parseInt(square.dataset.x);
                const y = parseInt(square.dataset.y);
                this.game.handleSquareClick(x, y);
            }
        });
        
        // Append the game container to the provided container
        container.appendChild(gameContainer);
    }

    /**
     * Update the game status display
     */
    updateStatus() {
        if (!this.statusElement) return;
        
        let statusText = `Current Player: ${this.game.currentPlayer}`;
        
        if (this.game.gameStatus === 'check') {
            statusText += ' (in check)';
        } else if (this.game.gameStatus === 'checkmate') {
            const winner = this.game.currentPlayer === COLORS.WHITE ? 'Black' : 'White';
            statusText = `Game Over: ${winner} wins by checkmate!`;
        } else if (this.game.gameStatus === 'stalemate') {
            statusText = 'Game Over: Draw by stalemate!';
        }
        
        this.statusElement.textContent = statusText;
        this.updateCapturedPieces();
    }

    /**
     * Update the captured pieces display
     */
    updateCapturedPieces() {
        if (!this.capturedPiecesElement) return;
        
        const whiteCapturedContainer = this.capturedPiecesElement.querySelector('.white-captured .pieces');
        const blackCapturedContainer = this.capturedPiecesElement.querySelector('.black-captured .pieces');
        
        // Clear existing pieces
        whiteCapturedContainer.innerHTML = '';
        blackCapturedContainer.innerHTML = '';
        
        // Add white captured pieces
        this.game.board.capturedPieces[COLORS.WHITE].forEach(piece => {
            const pieceElement = piece.createElement(this.theme);
            pieceElement.classList.add('captured');
            whiteCapturedContainer.appendChild(pieceElement);
        });
        
        // Add black captured pieces
        this.game.board.capturedPieces[COLORS.BLACK].forEach(piece => {
            const pieceElement = piece.createElement(this.theme);
            pieceElement.classList.add('captured');
            blackCapturedContainer.appendChild(pieceElement);
        });
    }

    /**
     * Select a piece in the UI
     * @param {Piece} piece - The piece to select
     */
    selectPiece(piece) {
        const square = this.boardContainer.querySelector(`[data-x="${piece.position.x}"][data-y="${piece.position.y}"]`);
        if (square) {
            square.classList.add('selected');
            
            // Highlight possible moves
            const possibleMoves = piece.getPossibleMoves(this.game.board);
            possibleMoves.forEach(move => {
                if (!this.game.board.wouldBeInCheck(piece, move)) {
                    const moveSquare = this.boardContainer.querySelector(`[data-x="${move.x}"][data-y="${move.y}"]`);
                    if (moveSquare) {
                        const hasPiece = this.game.board.getPieceAt(move);
                        moveSquare.classList.add(hasPiece ? 'possible-capture' : 'possible-move');
                    }
                }
            });
        }
    }

    /**
     * Deselect the currently selected piece
     */
    deselectPiece() {
        // Remove all selection highlights
        const selected = this.boardContainer.querySelector('.selected');
        if (selected) {
            selected.classList.remove('selected');
        }
        
        // Remove possible move highlights
        const possibleMoves = this.boardContainer.querySelectorAll('.possible-move, .possible-capture');
        possibleMoves.forEach(square => {
            square.classList.remove('possible-move', 'possible-capture');
        });
    }

    /**
     * Show the pawn promotion dialog
     * @param {String} color - The color of the pawn
     * @returns {String} - The selected piece type
     */
    showPromotionDialog(color) {
        // In a real implementation, this would show a dialog
        // For now, we'll just promote to a queen automatically
        return PIECE_TYPES.QUEEN;
    }

    /**
     * Show a check notification
     */
    showCheck() {
        // Flash the king
        const king = this.game.board.getKing(this.game.currentPlayer);
        const kingSquare = this.boardContainer.querySelector(`[data-x="${king.position.x}"][data-y="${king.position.y}"]`);
        
        if (kingSquare) {
            kingSquare.classList.add('check');
            setTimeout(() => {
                kingSquare.classList.remove('check');
            }, 1000);
        }
        
        this.updateStatus();
    }

    /**
     * Show game over message
     * @param {String} message - The game over message
     */
    showGameOver(message) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('game-over-overlay');
        
        const messageElement = document.createElement('div');
        messageElement.classList.add('game-over-message');
        messageElement.textContent = message;
        
        const newGameButton = document.createElement('button');
        newGameButton.textContent = 'New Game';
        newGameButton.addEventListener('click', () => {
            this.game.resetGame();
            this.boardContainer.removeChild(overlay);
        });
        
        messageElement.appendChild(newGameButton);
        overlay.appendChild(messageElement);
        this.boardContainer.appendChild(overlay);
        
        this.updateStatus();
    }

    /**
     * Reset the UI
     */
    resetUI() {
        this.deselectPiece();
        this.updateStatus();
        
        // Remove any game over overlay
        const overlay = this.boardContainer.querySelector('.game-over-overlay');
        if (overlay) {
            this.boardContainer.removeChild(overlay);
        }
    }

    /**
     * Set the UI theme
     * @param {String} theme - The theme to set
     */
    setTheme(theme) {
        this.theme = theme;
        
        // Update container theme
        const container = this.boardContainer.closest('.chess-game-container');
        container.className = container.className.replace(/theme-\w+/, `theme-${theme}`);
    }
}

// ============= AI CLASSES =============

/**
 * Chess AI class for computer opponent
 */
class ChessAI {
    constructor(difficulty) {
        this.difficulty = difficulty;
    }

    /**
     * Calculate the best move for the AI
     * @param {Board} board - The current board state
     * @param {String} color - The AI's color
     * @returns {Object} - The best move {piece, from, to}
     */
    calculateBestMove(board, color) {
        // Get all possible moves
        const pieces = board.getPiecesByColor(color);
        let allMoves = [];
        
        pieces.forEach(piece => {
            const moves = piece.getPossibleMoves(board);
            
            moves.forEach(move => {
                if (!board.wouldBeInCheck(piece, move)) {
                    allMoves.push({
                        piece,
                        from: { ...piece.position },
                        to: move
                    });
                }
            });
        });
        
        if (allMoves.length === 0) return null;
        
        // Easy difficulty: just pick a random move
        if (this.difficulty === DIFFICULTY.EASY) {
            return allMoves[Math.floor(Math.random() * allMoves.length)];
        }
        
        // Medium difficulty and above: evaluate moves
        allMoves.forEach(move => {
            move.score = this.evaluateMove(board, move, color);
        });
        
        // Sort moves by score (descending)
        allMoves.sort((a, b) => b.score - a.score);
        
        // For harder difficulties, look ahead more moves
        if (this.difficulty >= DIFFICULTY.HARD) {
            // We would implement minimax with alpha-beta pruning here
            // For simplicity, we'll just increase the randomness for now
            allMoves = allMoves.slice(0, Math.ceil(allMoves.length / 2));
        }
        
        // Master difficulty would include opening book, endgame strategies, etc.
        
        // Pick from the top moves with some randomness based on difficulty
        const topMovesCount = Math.max(1, Math.ceil(allMoves.length / this.difficulty));
        const topMoves = allMoves.slice(0, topMovesCount);
        
        return topMoves[Math.floor(Math.random() * topMoves.length)];
    }

    /**
     * Evaluate a move and assign a score
     * @param {Board} board - The current board state
     * @param {Object} move - The move to evaluate {piece, from, to}
     * @param {String} color - The AI's color
     * @returns {Number} - The move score
     */
    evaluateMove(board, move, color) {
        let score = 0;
        
        // Clone the board to simulate the move
        const tempBoard = new Board();
        
        // Copy the current board state
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                const piece = board.squares[x][y];
                if (piece) {
                    tempBoard.squares[x][y] = Object.assign(
                        Object.create(Object.getPrototypeOf(piece)),
                        JSON.parse(JSON.stringify(piece))
                    );
                }
            }
        }
        
        // Find the piece in the temp board
        const piece = tempBoard.getPieceAt(move.from);
        
        // Make the move
        const moveResult = tempBoard.movePiece(piece, move.to);
        
        // Basic piece value scoring
        const pieceValues = {
            [PIECE_TYPES.PAWN]: 1,
            [PIECE_TYPES.KNIGHT]: 3,
            [PIECE_TYPES.BISHOP]: 3,
            [PIECE_TYPES.ROOK]: 5,
            [PIECE_TYPES.QUEEN]: 9,
            [PIECE_TYPES.KING]: 100
        };
        
        // Score for captures
        if (moveResult.capturedPiece) {
            const capturedValue = pieceValues[moveResult.capturedPiece.type] || 1;
            score += capturedValue * 10;
        }
        
        // Score for check
        const oppositeColor = color === COLORS.WHITE ? COLORS.BLACK : COLORS.WHITE;
        const opponentKing = tempBoard.getKing(oppositeColor);
        
        if (tempBoard.isPositionUnderAttack(opponentKing.position, oppositeColor)) {
            score += 5;
            
            // Check for checkmate
            const opponentPieces = tempBoard.getPiecesByColor(oppositeColor);
            let opponentHasValidMoves = false;
            
            for (const oppPiece of opponentPieces) {
                const oppMoves = oppPiece.getPossibleMoves(tempBoard);
                
                for (const oppMove of oppMoves) {
                    if (!tempBoard.wouldBeInCheck(oppPiece, oppMove)) {
                        opponentHasValidMoves = true;
                        break;
                    }
                }
                
                if (opponentHasValidMoves) break;
            }
            
            if (!opponentHasValidMoves) {
                score += 1000; // Checkmate is the best move
            }
        }
        
        // Score for pawn promotion
        if (moveResult.isPromotion) {
            score += 8;
        }
        
        // Score for castling
        if (moveResult.isCastling) {
            score += 3;
        }
        
        // Position evaluation
        // Bonus for controlling center squares
        if (move.to.x >= 2 && move.to.x <= 5 && move.to.y >= 2 && move.to.y <= 5) {
            score += 0.5;
            // Extra bonus for the very center
            if (move.to.x >= 3 && move.to.x <= 4 && move.to.y >= 3 && move.to.y <= 4) {
                score += 0.5;
            }
        }
        
        // Add some random noise for less predictable play
        score += Math.random() * 0.2;
        
        return score;
    }
}

// ============= USER MANAGEMENT =============

/**
 * User Management class for handling user accounts
 */
class UserManager {
    constructor() {
        this.currentUser = null;
        this.users = this.loadUsers();
    }

    /**
     * Load users from local storage
     * @returns {Array} - Array of user objects
     */
    loadUsers() {
        const usersJson = localStorage.getItem('neonChessUsers');
        return usersJson ? JSON.parse(usersJson) : [];
    }

    /**
     * Save users to local storage
     */
    saveUsers() {
        localStorage.setItem('neonChessUsers', JSON.stringify(this.users));
    }

    /**
     * Register a new user
     * @param {String} username - The username
     * @param {String} password - The password
     * @returns {Boolean} - Whether registration was successful
     */
    registerUser(username, password) {
        // Check if username already exists
        if (this.users.some(user => user.username === username)) {
            return false;
        }
        
        // Create the new user
        const newUser = {
            username,
            passwordHash: this.hashPassword(password),
            stats: {
                gamesPlayed: 0,
                wins: 0,
                losses: 0,
                draws: 0
            },
            preferences: {
                theme: THEMES.BLUE_PINK,
                aiDifficulty: DIFFICULTY.MEDIUM
            }
        };
        
        this.users.push(newUser);
        this.saveUsers();
        
        // Log in the new user
        this.currentUser = newUser;
        
        return true;
    }

    /**
     * Log in a user
     * @param {String} username - The username
     * @param {String} password - The password
     * @returns {Boolean} - Whether login was successful
     */
    loginUser(username, password) {
        const user = this.users.find(user => user.username === username);
        
        if (user && user.passwordHash === this.hashPassword(password)) {
            this.currentUser = user;
            return true;
        }
        
        return false;
    }

    /**
     * Log out the current user
     */
    logoutUser() {
        this.currentUser = null;
    }

    /**
     * Update user stats after a game
     * @param {String} result - The game result (win, loss, draw)
     */
    updateStats(result) {
        if (!this.currentUser) return;
        
        this.currentUser.stats.gamesPlayed++;
        
        switch (result) {
            case 'win':
                this.currentUser.stats.wins++;
                break;
            case 'loss':
                this.currentUser.stats.losses++;
                break;
            case 'draw':
                this.currentUser.stats.draws++;
                break;
        }
        
        this.saveUsers();
    }

    /**
     * Update user preferences
     * @param {Object} preferences - The new preferences
     */
    updatePreferences(preferences) {
        if (!this.currentUser) return;
        
        this.currentUser.preferences = {
            ...this.currentUser.preferences,
            ...preferences
        };
        
        this.saveUsers();
    }

    /**
     * Get the current user's stats
     * @returns {Object|null} - The user stats or null if no user is logged in
     */
    getUserStats() {
        return this.currentUser ? this.currentUser.stats : null;
    }

    /**
     * Get the current user's preferences
     * @returns {Object|null} - The user preferences or null if no user is logged in
     */
    getUserPreferences() {
        return this.currentUser ? this.currentUser.preferences : null;
    }

    /**
     * Simple password hashing (for demo purposes only)
     * @param {String} password - The password to hash
     * @returns {String} - The hashed password
     */
    hashPassword(password) {
        // In a real application, use a proper hashing algorithm
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash.toString(16);
    }
}

// ============= MULTIPLAYER CLASSES =============

/**
 * Multiplayer Manager for online play
 */
class MultiplayerManager {
    constructor(game) {
        this.game = game;
        this.socket = null;
        this.roomId = null;
        this.playerId = null;
        this.playerColor = null;
    }

    /**
     * Initialize multiplayer connection
     */
    initialize() {
        // In a real implementation, this would connect to a WebSocket server
        // For this demo, we'll simulate the connection
        console.log('Multiplayer functionality would initialize here');
        
        // Simulate connection events
        this.simulateConnection();
    }

    /**
     * Simulate multiplayer connection for demo purposes
     */
    simulateConnection() {
        // Simulate successful connection
        setTimeout(() => {
            console.log('Connected to multiplayer server');
            
            // Simulate joining a room
            this.roomId = 'room-' + Math.floor(Math.random() * 1000);
            this.playerId = 'player-' + Math.floor(Math.random() * 1000);
            this.playerColor = COLORS.WHITE; // First player is white
            
            console.log(`Joined room ${this.roomId} as ${this.playerColor}`);
            
            // Show a notification
            this.showNotification(`Connected to multiplayer. You are playing as ${this.playerColor}.`);
        }, 1000);
    }

    /**
     * Check if it's the current player's turn
     * @returns {Boolean} - Whether it's the player's turn
     */
    isMyTurn() {
        return this.game.currentPlayer === this.playerColor;
    }

    /**
     * Send a move to the opponent
     * @param {Object} moveResult - The move result
     */
    sendMove(moveResult) {
        if (!this.roomId) return;
        
        // In a real implementation, this would send the move to the server
        console.log('Sending move to opponent', moveResult);
        
        // Simulate opponent's acknowledgement
        setTimeout(() => {
            console.log('Opponent received move');
        }, 500);
    }

    /**
     * Handle a move received from the opponent
     * @param {Object} moveData - The received move data
     */
    handleOpponentMove(moveData) {
        // Find the piece
        const piece = this.game.board.getPieceAt(moveData.from);
        
        if (piece) {
            // Make the move
            this.game.makeMove(piece, moveData.to);
        }
    }

    /**
     * Show a notification to the user
     * @param {String} message - The notification message
     */
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.classList.add('multiplayer-notification');
        notification.textContent = message;
        
        // Add to the game container
        const container = this.game.ui.boardContainer.closest('.chess-game-container');
        container.appendChild(notification);
        
        // Remove after a delay
        setTimeout(() => {
            container.removeChild(notification);
        }, 5000);
    }

    /**
     * Disconnect from the multiplayer session
     */
    disconnect() {
        if (!this.roomId) return;
        
        // In a real implementation, this would disconnect from the server
        console.log('Disconnecting from multiplayer');
        
        this.roomId = null;
        this.playerId = null;
        this.playerColor = null;
        
        // Show a notification
        this.showNotification('Disconnected from multiplayer.');
    }
}

// ============= INITIALIZATION =============

/**
 * Initialize the chess game when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
    // Create the game
    const game = new Game({
        gameMode: 'player-vs-ai',
        aiDifficulty: DIFFICULTY.MEDIUM,
        theme: THEMES.BLUE_PINK
    });
    
    // Get the container element
    const container = document.getElementById('chess-container');
    
    // Initialize the game
    game.initialize(container);
});
