const GAME_BOARD_WIDTH = 24;
const GAME_BOARD_HEIGHT = 24;
const GAME_BOARD_AREA = GAME_BOARD_WIDTH * GAME_BOARD_HEIGHT;
const TILESET_WIDTH = 8;
const TILESET_HEIGHT = 8;
const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

const TILE_BLANK = 0;
const TILE_MEOW = 1;
const TILE_WOOF = 2;
const TILE_TARGET = 3;
const TILE_WALL = 4;
const TILE_STONE = 5;
const TILE_WATER = 6;
const TILE_HEART = 7;

const TILE_TEXT_BLANK = 8;
const TILE_TEXT_MEOW = 9;
const TILE_TEXT_WOOF = 10;
const TILE_TEXT_TARGET = 11;
const TILE_TEXT_WALL = 12;
const TILE_TEXT_STONE = 13;
const TILE_TEXT_WATER = 14;
const TILE_TEXT_HEART = 15;

const TILE_BRICK = 16;
const TILE_TEXT_IS = 17;
const TILE_TEXT_YOU = 18;
const TILE_TEXT_WIN = 19;
const TILE_TEXT_PUSH = 20;
const TILE_TEXT_STOP = 21;
const TILE_TEXT_MOVE = 22;
const TILE_TEXT_SINK = 23;

const TILE_TEXT_BRICK = 24;
const TILE_TEXT_PULL = 25;
const TILE_TEXT_HOT = 26;
const TILE_TEXT_MELT = 27;
const TILE_TEXT_OPEN = 28;
const TILE_TEXT_SHUT = 29;


window.dataToSymbol =
[ ' ' // TILE_BLANK = 0;
, 'M' // TILE_MEOW = 1;
, 'D' // TILE_WOOF = 2;
, 'T' // TILE_TARGET = 3;
, 'W' // TILE_WALL = 4;
, 'S' // TILE_STONE = 5;
, '~' // TILE_WATER = 6;
, '3' // TILE_HEART = 7;

, '_' // TILE_TEXT_BLANK = 8;
, 'm' // TILE_TEXT_MEOW = 9;
, 'd' // TILE_TEXT_WOOF = 10;
, 't' // TILE_TEXT_TARGET = 11;
, 'w' // TILE_TEXT_WALL = 12;
, 's' // TILE_TEXT_STONE = 13;
, '`' // TILE_TEXT_WATER = 14;
, '2' // TILE_TEXT_HEART = 15;

, 'B' // TILE_BRICK = 16;
, 'i' // TILE_TEXT_IS = 17;
, 'y' // TILE_TEXT_YOU = 18;
, '!' // TILE_TEXT_WIN = 19;
, 'p' // TILE_TEXT_PUSH = 20;
, '$' // TILE_TEXT_STOP = 21;
, '>' // TILE_TEXT_MOVE = 22;
, 'v' // TILE_TEXT_SINK = 23;

, 'b' // TILE_TEXT_BRICK = 24;
, 'q' // TILE_TEXT_PULL = 25;
, 'h' // TILE_TEXT_HOT = 26;
, 'e' // TILE_TEXT_MELT = 27;
, 'o' // TILE_TEXT_OPEN = 28;
, 'x' // TILE_TEXT_SHUT = 29;
];

const TOTAL_TILES = window.dataToSymbol.length;

window.symbolToData = [];
for(let data=0; data<TOTAL_TILES; data++)
{ window.symbolToData[window.dataToSymbol[data]] = data;
}

window.textToNoun =
{  [TILE_TEXT_BLANK] : [TILE_BLANK]
,  [TILE_TEXT_MEOW] : [TILE_MEOW]
,  [TILE_TEXT_WOOF] : [TILE_WOOF]
,  [TILE_TEXT_TARGET] : [TILE_TARGET]
,  [TILE_TEXT_WALL] : [TILE_WALL]
,  [TILE_TEXT_STONE] : [TILE_STONE]
,  [TILE_TEXT_WATER] : [TILE_WATER]
,  [TILE_TEXT_HEART] : [TILE_HEART]

,  [TILE_TEXT_BRICK] : [TILE_BRICK]
};

window.nounToText = [];
for(let noun=0; noun<TOTAL_TILES; noun++)
{ window.nounToText[noun] = [];
}

for(let text=0; text<TOTAL_TILES; text++)
{ for(let i in window.textToNoun[text])
  { let noun = window.textToNoun[text][i]
    window.nounToText[noun].push(text);
  }
}

window.keyToOffset =
{ 'ArrowUp' : -GAME_BOARD_WIDTH
, 'ArrowLeft' : -1
, 'ArrowRight' : 1
, 'ArrowDown' : GAME_BOARD_WIDTH
, ' ' : 0
};

window.levels =
[ ( "BBBBBBBBBBBBBBBBBBBBBBBB"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B     miy     sip      B"
  + "B                      B"
  + "B    WWWWWWWWWWWWW     B"
  + "B          S           B"
  + "B      M   S   T       B"
  + "B          S           B"
  + "B    WWWWWWWWWWWWW     B"
  + "B                      B"
  + "B     wi$     ti!      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "BBBBBBBBBBBBBBBBBBBBBBBB"
  )
, ( "BBBBBBBBBBBBBBBBBBBBBBBB"
  + "B                      B"
  + "B                      B"
  + "B m           t        B"
  + "B i                    B"
  + "B y        w           B"
  + "B                      B"
  + "B                 i    B"
  + "B                      B"
  + "B          T           B"
  + "B                      B"
  + "B   WWWWWWWWW          B"
  + "B   W       W          B"
  + "B   W M     W          B"
  + "B   W   wi$ W          B"
  + "B   W       W          B"
  + "B   WWWWWWWWW          B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "B                      B"
  + "BBBBBBBBBBBBBBBBBBBBBBBB"
  )
];