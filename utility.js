function SetTile(cell, tile)
{ let td = document.getElementById("cell"+ cell);
td.style.backgroundPosition =
  ( -(tile%TILESET_WIDTH * TILE_WIDTH) + 1
  + "px"
  + " "
  + -(Math.floor(tile/TILESET_HEIGHT) * TILE_HEIGHT)
  + "px"
  );
}

function DrawBoard()
{ document.getElementById('displayLevelNumber').innerHTML =
    window.currentLevelNumber;
  
  window.currentLevel[TILE_BLANK] = []; // erase empty tile stack, will recalculate here.
  
  for(let cell=0; cell<GAME_BOARD_AREA; cell++)
  { let tile = 0; // assume blank until proven otherwise
    let tileType=TOTAL_TILES;
    while(tileType --> 1)
    { if(window.currentLevel[tileType].includes(cell))
      { // For now, only the last found tile (lowest id) wins.
        // later, I might do something to composite tiles on top of one another?
        tile = tileType;
      }
    }
    if(tile==0)
    { window.currentLevel[TILE_BLANK].push(cell); // rebuilding "empty" stack
    }
    SetTile(cell, tile);
  }
  calculateRules();
}

function calculateRules()
{
  window.rules =
  { isYou : []
  , isWin : []
  , isStop : [16] // Hardcode Brick is stop
  , isPush :
    [ 8, 9, 10, 11, 12, 13, 14, 15 // All text pt 1
    , 17, 18, 19, 20, 21, 22, 23 // All text pt 2
    , 24, 25, 26, 27, 28, 29 // All text pt 3
    ]
  };

  
  for(let i in window.currentLevel[TILE_TEXT_IS])
  { let isCell = window.currentLevel[TILE_TEXT_IS][i];
    PerformIsA(isCell-1, isCell+1);
    PerformIsA(isCell-GAME_BOARD_WIDTH, isCell+GAME_BOARD_WIDTH);
  }

  //setTimeout as a cheap way to try to get at least an animation frame in
  // before alert dialog freeze screen pre-win state :P
  setTimeout
  ( () =>
    { if(CheckWin())
      { alert("Uwin :D");
        StartLevel( (window.currentLevelNumber + 1) % window.levels.length );
      }
    }
  , 0
  );
}

function CheckWin()
{ let you = new Set();
  for(let i in window.rules.isYou)
  { let tileType = window.rules.isYou[i];
    window.currentLevel[tileType].forEach(youCell => { you.add(youCell);});
  }
  for(let i in window.rules.isWin)
  { let tileType = window.rules.isWin[i];
    for(let j in window.currentLevel[tileType])
    { let cell = window.currentLevel[tileType][j]
      if(you.has(cell))
      { return true;
      }
    }
  }
  return false;
}

function CellPeek(cell)
{ let ret = [];
  for(let tileType in window.currentLevel)
  { if(window.currentLevel[tileType].includes(cell))
    { ret.push(tileType);
    }
  }
  return ret;
}

function PerformIsA(nounTextCell, adjectiveCell)
{ let nounTexts = CellPeek(nounTextCell);
  let adjectives = CellPeek(adjectiveCell);
  for(let nounTextIndex in nounTexts)
  { for(let adjectiveIndex in adjectives)
    { let nounText = nounTexts[nounTextIndex];
      let nouns = window.textToNoun[nounText];
      if(nouns!=null && nouns.length>0)
      { PerformIsB(nouns, adjectives[adjectiveIndex]);
      }
    }
  }
}

function PerformIsB(nouns, adjective)
{ if(adjective == TILE_TEXT_YOU)
  { window.rules.isYou =
      window.rules.isYou.concat(nouns);
    return;
  }
  if(adjective == TILE_TEXT_STOP)
  { window.rules.isStop =
      window.rules.isStop.concat(nouns);
    return;
  }
  if(adjective == TILE_TEXT_PUSH)
  { window.rules.isPush =
      window.rules.isPush.concat(nouns);
    return;
  }  
  if(adjective == TILE_TEXT_WIN)
  { window.rules.isWin =
      window.rules.isWin.concat(nouns);
    return;
  }  
}

function HandleKeypress(event)
{ // assume we're not handling the keypress until it's proven that we are.
  window.allowKeypress = true;

  let offset = window.keyToOffset[event.key];
  if(event.key.toLowerCase() == 'a' && window.gameHistory.length>1)
  { // Undo
    window.gameHistory.pop(); // discard previous "currentLevel" on end of stack
    window.currentLevel = window.gameHistory[window.gameHistory.length-1];
    window.allowKeypress = false; // we did handle the keypress
  }
  else if(offset != null)
  { 
// console.log(offset);
    if(offset==null)
    { return;
    }
    window.frameBufferChanged = false;
    window.frameBuffer = [...window.currentLevel];
    window.gameHistory.push(window.frameBuffer);
    for(let i in window.rules.isYou)
    { let tileType = window.rules.isYou[i];
// console.log(`${tileType} : ${window.currentLevel[tileType]}`)
      window.frameBuffer[tileType] =
        window.currentLevel[tileType].map(MoveYouCell(offset))
    }
    if(window.frameBufferChanged)
    { window.currentLevel = window.frameBuffer;
    }
    else
    { window.frameBuffer = window.currentLevel;
      window.gameHistory.pop();
    }
      window.allowKeypress = false; // we did handle the keypress

  }
  DrawBoard();
  return window.allowKeypress; // return whether or not we handled the keypress
}

// partially apply "offset" as first argument to MoveCell.
// "null" is skipping a .bind() argument that's useless OOP bullshit.
function MoveYouCell(offset)
{ return MoveCell.bind(null, offset);
}

function MoveCell(offset, cell)
{ let newCell;
  if( offset % GAME_BOARD_WIDTH == 0)
  { newCell = (cell + offset + GAME_BOARD_AREA) % GAME_BOARD_AREA;
  }
  else
  { newCell =
      ( Math.floor(cell/GAME_BOARD_WIDTH)
      * GAME_BOARD_WIDTH
      + ( (cell + offset + GAME_BOARD_WIDTH)
        % GAME_BOARD_WIDTH
        )
      );
  }
// console.log(`Pre-stop-check, cell==${cell} + offset=${offset} ≅ newCell==${newCell}`);
  for(let i in window.rules.isStop)
  { let tileType = window.rules.isStop[i];
    if(window.currentLevel[tileType].includes(newCell))
    { 
// console.log(`isStop blocks ${cell} from going to ${newCell}`);
      return(cell);
    }
  }
  for(let i in window.rules.isPush)
  { let tileType = window.rules.isPush[i];
    // if(window.rules.isYou.includes(tileType))
    // { continue; // skip checking isPush on things that are already "you".
    // }
    if(window.currentLevel[tileType].includes(newCell))
    { let newNewCell = MoveCell(offset, newCell);
      if(newNewCell != newCell)
      { window.frameBuffer[tileType] =
          window.frameBuffer[tileType].filter( cellPushable => { return cellPushable != newCell; } );
        window.frameBuffer[tileType].push(newNewCell);
        window.frameBufferChanged = true;
      }
      else
      { 
// console.log(`isStop cascade blocks ${cell} from going to ${newCell}`);
        return(cell);
      }
    }
  }
// console.log(`Post-stop-check, cell=${cell} + offset=${offset} ≅ newCell=${newCell}`);

// console.log(`${cell} goes to ${newCell}!`);
  if(newCell != cell)
  { window.frameBufferChanged = true;
  }
  return( newCell );
}

function StartLevel(level)
{ window.currentLevelNumber = level;
  window.gameHistory = [[]];
  window.currentLevel = window.gameHistory[0];
  for(let i = 0; i<TOTAL_TILES; i++)
  { window.currentLevel[i] = [];
  }

  for(let cell=0; cell<GAME_BOARD_AREA; cell++)
  { let tile = window.symbolToData[window.levels[level].substr(cell,1)];
    if(tile<1)
    { continue; // don't need to record empties. DrawBoard will calculate those for us.
    }
    window.currentLevel[tile].push(cell);
  }
  DrawBoard();
}