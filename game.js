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

  function getPieces() {

    var pieces = [[],[],[],[]];
    var indexPointer = 0;

    for (var col = 0; col < 24; col ++) {
      var amount = this.gameState[col].length
      if (amount > 0) {
        for (var piece = 0; piece < amount; piece++) {
          if (this.gameState[col][piece] instanceof WhitePiece) {
            // figure points and add them to array for white pieces
            if (col < 12) {
              var centerX = 28 - col*2;

              var newPoint1 = vec4(centerX - 1, 0.011, 1 + piece*1.5);
              var newPoint2 = vec4(centerX - 1, 0.011, 1 + (piece + 1) * 1.5);
              var newPoint3 = vec4(centerX + 1, 0.011, 1 + piece*1.5);
              var newPoint4 = vec4(centerX + 1, 0.011, 1 + (piece + 1) * 1.5);

              pieces[0].push(newPoint1);
              pieces[0].push(newPoint2);
              pieces[0].push(newPoint3);
              pieces[0].push(newPoint4);
              pieces[3].push(flatten([indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3]));
              indexPointer = indexPointer+4;

            }
          } else {
            // figure points and add them to array for white pieces

          }
        }
      }
    }
  }
};
