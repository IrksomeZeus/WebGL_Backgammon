class WhitePiece {
  constructor() {
    this.radius = 1.625/2;
  }
};

class BlackPiece {
  constructor() {
    this.radius = 1.625/2;
  }
};

class Board {
  constructor() {
    var white = new WhitePiece();
    var black = new BlackPiece();

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

  
};
