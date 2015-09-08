angular.module('Game', [])
    .service('GameManager', function(GridService, $cookieStore) {

        this.getHighScore = function() {
            return parseInt($cookieStore.get('highScore')) || 0;
        };

        // Create a new game
        this.newGame = function() {
            GridService.buildEmptyGameBoard();
            GridService.buildStartingPosition();
            this.reinit();
        };

        // Reset game state
        this.reinit = function() {
            this.gameOver = false;
            this.win = false;
            this.currentScore = 0;
            this.highScore = 0; // we'll come back to this
        };

        // Handle the move action
        this.move = function(key) {
            // Update Grid
            GridService.prepareTiles();
            var hasWon = false;
            var self = this;
            // define move here
            if (self.win) {
                return false;
            }

            var positions = GridService.traversalDirections(key);

            positions.x.forEach(function(x) {
                positions.y.forEach(function(y) {
                    var originalPosition = {
                        x: x,
                        y: y
                    };
                    var tile = GridService.getCellAt(originalPosition);

                    if (tile) {
                        var cell = GridService.calculateNextPosition(tile, key),
                            next = cell.next;

                        if (next &&
                            next.value === tile.value &&
                            !next.merged) {

                            // MERGE
                            var newValue = tile.value * 2;

                            var merged = GridService.newTile(tile, newValue);
                            merged.merged = [tile, cell.next];

                            GridService.insertTile(merged);
                            GridService.removeTile(tile);

                            GridService.moveTile(merged, next);

                            self.updateScore(self.currentScore + cell.next.value);

                            if (merged.value >= self.winningValue) {
                                hasWon = true;
                            }
                            hasMoved = true; // we moved with a merge
                        } else {
                            GridService.moveTile(tile, cell.newPosition);
                        }

                        if (!GridService.samePositions(originalPosition, cell.newPosition)) {
                            hasMoved = true;
                        }
                    }
                });
            });

            if (hasMoved) {
                GridService.randomlyInsertNewTile();

                if (self.win || !self.movesAvailable()) {
                    self.gameOver = true;
                }
            }

        };

        // Update the score
        this.updateScore = function(newScore) {
            this.currentScore = newScore;
            if (this.currentScore > this.getHighScore()) {
                this.highScore = newScore;
                // Set on the cookie
                $cookieStore.put('highScore', newScopre);
            }
        };

        // Are there moves left?
        this.movesAvailable = function() {
            return GridService.anyCellsAvailable() || GridService.tileMatchesAvailable();
        };

    });