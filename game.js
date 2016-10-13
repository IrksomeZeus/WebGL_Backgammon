function WhitePiece() {
  this.radius = 1.625/2;
}

function BlackPiece() {
  this.radius = 1.625/2;
}

function Board() {
  var white = WhitePiece();
  var black = BlackPiece();

  this.gameState =
  [
    [white, white],
    [],
    [],
    [],
    [],
    [black, black, black, black, black],
    [],
    [black, black, black],
    [],
    [],
    [],
    [white, white, white, white, white],
    [black, black, black, black, black],
    [],
    [],
    [],
    [white, white, white],
    [],
    [white, white, white, white, white],
    [],
    [],
    [],
    [],
    [black, black]
  ];

  this.playerOnePoints = 0;
  this.playerTwoPoints = 0;
  this.jailed = [];
  this.playerOneTurn = true;
}
