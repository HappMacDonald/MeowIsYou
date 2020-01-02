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
{ window.currentLevel[0] = []; // erase empty tile stack, will recalculate here.
  
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
    { window.currentLevel[0].push(cell); // rebuilding "empty" stack
    }
    SetTile(cell, tile);
  }
  calculateRules();
}

function calculateRules()
{
  window.rules =
  { isYou : []
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
}

function cellPeek(cell)
{ let ret = [];
  for(let tileType in window.currentLevel)
  { if(window.currentLevel[tileType].includes(cell))
    { ret.push(tileType);
    }
  }
  return ret;
}

function PerformIsA(nounTextCell, adjectiveCell)
{ let nounTexts = cellPeek(nounTextCell);
  let adjectives = cellPeek(adjectiveCell);
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
console.log(`PerformIsB`);
console.log(nouns);
console.log(window.rules.isYou);
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
}

function HandleKeypress(event)
{ let offset = window.keyToOffset[event.key];
// console.log(offset);
  if(offset==null)
  { return;
  }
  window.frameBuffer = [...window.currentLevel];
  for(let i in window.rules.isYou)
  { let tileType = window.rules.isYou[i]
console.log(`${tileType} : ${window.currentLevel[tileType]}`)
    window.frameBuffer[tileType] =
    window.currentLevel[tileType].map(MoveYouCell(offset))
  }
  window.currentLevel = [...window.frameBuffer];
  DrawBoard();
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
// console.log(`Pre-stop-check, cell=${cell} + offset=${offset} ≅ newCell=${newCell}`);
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
          window.frameBuffer[tileType].filter( cell => { return cell != newCell; } );
        window.frameBuffer[tileType].push(newNewCell);
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
  return( newCell );
}

