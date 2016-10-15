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
    this.whiteNum = 15;
    this.blackNum = 15;
    this.number = 2;
  }

  getPieces() {

    var pieces = [[],[],[],[]];
    var indexPointer = 79;
    var f = 2;

    for (var col = 0; col < 24; col ++) {
      var amount = this.gameState[col].length
      if (amount > 0) {
        for (var piece = 0; piece < amount; piece++) {
          if (this.gameState[col][piece] instanceof WhitePiece) {
            // figure points and add them to array for white pieces
            if (col < 12) {
              if (col < 6) {
                var centerX = 28 - col*2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(1 + piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(1 + (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(1 + piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(1 + (piece + 0.9) * f));

                pieces[0].push(newPoint1);
                pieces[0].push(newPoint2);
                pieces[0].push(newPoint3);
                pieces[0].push(newPoint4);
                pieces[2].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              } else {
                var centerX = 26 - col*2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(1 + piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(1 + (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(1 + piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(1 + (piece + 0.9) * f));

                pieces[0].push(newPoint1);
                pieces[0].push(newPoint2);
                pieces[0].push(newPoint3);
                pieces[0].push(newPoint4);
                pieces[2].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              }
            } else {
              if (col < 18) {
                var centerX = 4 + (col - 12) * 2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(25 - piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(25 - (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(25 - piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(25 - (piece + 0.9) * f));

                pieces[0].push(newPoint1);
                pieces[0].push(newPoint2);
                pieces[0].push(newPoint3);
                pieces[0].push(newPoint4);
                pieces[2].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              } else {
                var centerX = 6 + (col - 12) * 2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(25 - piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(25 - (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(25 - piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(25 - (piece + 0.9) * f));

                pieces[0].push(newPoint1);
                pieces[0].push(newPoint2);
                pieces[0].push(newPoint3);
                pieces[0].push(newPoint4);
                pieces[2].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              }
            }
          }
        }
      }
    }
    for (var col = 0; col < 24; col ++) {
      var amount = this.gameState[col].length
      if (amount > 0) {
        for (var piece = 0; piece < amount; piece++) {
          if (this.gameState[col][piece] instanceof BlackPiece) {
            // figure points and add them to array for white pieces
            if (col < 12) {
              if (col < 6) {
                var centerX = 28 - col*2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(1 + piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(1 + (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(1 + piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(1 + (piece + 0.9) * f));

                pieces[1].push(newPoint1);
                pieces[1].push(newPoint2);
                pieces[1].push(newPoint3);
                pieces[1].push(newPoint4);
                pieces[3].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              } else {
                var centerX = 26 - col*2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(1 + piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(1 + (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(1 + piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(1 + (piece + 0.9) * f));

                pieces[1].push(newPoint1);
                pieces[1].push(newPoint2);
                pieces[1].push(newPoint3);
                pieces[1].push(newPoint4);
                pieces[3].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              }
            } else {
              if (col < 18) {
                var centerX = 4 + (col - 12) * 2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(25 - piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(25 - (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(25 - piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(25 - (piece + 0.9) * f));

                pieces[1].push(newPoint1);
                pieces[1].push(newPoint2);
                pieces[1].push(newPoint3);
                pieces[1].push(newPoint4);
                pieces[3].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              } else {
                var centerX = 6 + (col - 12) * 2;

                var newPoint1 = vec4(centerX - 1, 0.011, -(25 - piece*f));
                var newPoint2 = vec4(centerX - 1, 0.011, -(25 - (piece + 0.9) * f));
                var newPoint3 = vec4(centerX + 1, 0.011, -(25 - piece*f));
                var newPoint4 = vec4(centerX + 1, 0.011, -(25 - (piece + 0.9) * f));

                pieces[1].push(newPoint1);
                pieces[1].push(newPoint2);
                pieces[1].push(newPoint3);
                pieces[1].push(newPoint4);
                pieces[3].push(indexPointer, indexPointer+1, indexPointer+2, indexPointer+2, indexPointer+1, indexPointer+3);
                indexPointer = indexPointer+4;
              }
            }
          }
        }
      }
    }
    return pieces;
  }
};
