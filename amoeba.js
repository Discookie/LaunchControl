module.exports = {
    press: onClick,
    ready: ready,
    timeout: 800,
    exit: function () {
        return true;
    }
};

var field = {}; //0 or undefined: nobody; 1-4 red green yellow orage
var steps = [];

var tick = 0;

var turn = 0;
var players = 3;
var ox = 0;
var oy = 0;
var corners = {
    minx: 8,
    miny: 8,
    maxx: 0,
    maxy: 0
};
var winArrays = [];
var winners;

var over = false;

function winning(gx, gy) {
    if (winners !== undefined) {
        switch (winners.or) {
            case 0:
                if (gx == winners.x && gy >= 0 && gy < 5)
                    return 1;
                break;
            case 1:
                if (gy == winners.y && gx >= 0 && gx < 5)
                    return 1;
                break;
            case 2:
                if ((gx - winners.x >= 0 && gx - winners.x < 5) && (gx - winners.x == gy - winners.y))
                    return 1;
                break;
            case 3:
                if ((gx - winners.x >= 0 && gx - winners.x < 5) && (gx - winners.x == winners.y - gy))
                    return 1;
                break;
        }
    }
    for (var i = 0; i < winArrays.length; i++) {
        switch (winArrays[i].or) {
            case 0:
                if (gx == winArrays[i].x && gy > 0 && gy < 5)
                    return 1;
                break;
            case 1:
                if (gy == winArrays[i].y && gx > 0 && gx < 5)
                    return 1;
                break;
            case 2:
                if ((gx - winArrays[i].x > 0 && gx - winArrays[i].x < 5) && (gx - winArrays[i].x == gy - winArrays[i].y))
                    return 1;
                break;
            case 3:
                if ((gx - winArrays[i].x > 0 && gx - winArrays[i].x < 5) && (gx - winArrays[i].x == winArrays[i].y - gy))
                    return 1;
                break;
        }
    }
    return 0;
}

function checkWin(gx, gy, state) {
    for (var i = 0; i < winArrays.length; i++) {
        switch (winArrays[i].or) {
            case 0:
                if (gx == winArrays[i].x && (gy - winArrays[i].y === 0 || gy - winArrays[i].y == 5)) {
                    if (winArrays[i].pl != state) {
                        winArrays.splice(i--, 1);
                    } else {
                        over = true;
                        if (gx - winArrays[i].x === 0) {
                            winners = {
                                x: winArrays[i].x,
                                y: winArrays[i].y,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };
                        } else {
                            winners = {
                                x: winArrays[i].x,
                                y: winArrays[i].y + 1,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };
                        }
                    }
                }
                break;
            case 1:
                if (gy == winArrays[i].y && (gx - winArrays[i].x === 0 || gx - winArrays[i].x == 5)) {
                    if (winArrays[i].pl != state) {
                        winArrays.splice(i--, 1);
                    } else {
                        over = true;
                        if (gx - winArrays[i].x === 0) {
                            winners = {
                                x: winArrays[i].x,
                                y: winArrays[i].y,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };
                        } else {
                            winners = {
                                x: winArrays[i].x + 1,
                                y: winArrays[i].y,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };
                        }
                    }
                }
                break;
            case 2:
                if ((gx - winArrays[i].x === 0 || gx - winArrays[i].x == 5) && (gx - winArrays[i].x == gy - winArrays[i].y)) {
                    if (winArrays[i].pl != state) {
                        winArrays.splice(i--, 1);
                    } else {
                        over = true;
                        if (gx - winArrays[i].x === 0) {
                            winners = {
                                x: winArrays[i].x,
                                y: winArrays[i].y,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };
                        } else {
                            winners = {
                                x: winArrays[i].x + 1,
                                y: winArrays[i].y + 1,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };
                        }
                    }
                }
                break;
            case 3:
                if ((gx - winArrays[i].x === 0 || gx - winArrays[i].x == 5) && (gx - winArrays[i].x == winArrays[i].y - gy)) {
                    if (winArrays[i].pl != state) {
                        winArrays.splice(i--, 1);
                    } else {
                        over = true;
                        if (gx - winArrays[i].x === 0) {
                            winners = {
                                x: winArrays[i].x,
                                y: winArrays[i].y,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };
                        } else {
                            winners = {
                                x: winArrays[i].x + 1,
                                y: winArrays[i].y,
                                pl: winArrays[i].pl,
                                or: winArrays[i].or
                            };

                        }
                    }
                }
                break;
        }
    }
}

function ready() {
    corners = {
        minx: 8,
        miny: 8,
        maxx: 0,
        maxy: 0
    };
    field = [];
    steps = [];
    turn = 0;
    ox = 0;
    oy = 0;
    reDraw();
}

function onClick(button) {
    if (button.special) {
        special(button.x, button.y);
    } else {
        click(button.x, button.y);
    }
    return false;
}

function special(lx, ly) {
    if (lx === 0) {
        oy--;
    }
    if (lx === 1) {
        oy++;
    }
    if (lx == 2) {
        ox--;
    }
    if (lx == 3) {
        ox++;
    }
    if (lx == 4) {
        ox = 0;
        oy = 0;
    }
    if (lx == 5) {
        undo();
    }
    if (lx == 6) {
        if (turn !== 0)
            return;
        players = (players - 1) % 3 + 2;
        var bt = launchpad.getButton(8, 6);
        switch (players) {
            case 0:
                bt.light(0);
                break;
            case 1:
                bt.light(3);
                break;
            case 2:
                bt.light(48);
                break;
            case 3:
                bt.light(16 | 2);
                break;
            case 4:
                bt.light(32 | 1);
                break;
        }
    }
    reDraw();
}

function click(lx, ly) {
    if (over)
        return;
    if (getPixel(lx + ox, ly + oy) === 0) {
        setPixel(lx + ox, ly + oy, getCurrent());
        turn++;
        reDraw();
    }
}

function undo() {
    over = false;
    winners = undefined;
    if (steps.length === 0)
        return;
    setPixel(steps[steps.length - 1][0], steps[steps.length - 1][1], 0);
    steps.pop();
    turn--;
}

function setPixel(gx, gy, state) {
    if (field[gx] === undefined) {
        field[gx] = {};
    }
    checkWin(gx, gy, state);
    field[gx][gy] = state;
    if (state)
        steps[steps.length] = [gx, gy];
    corners.minx = Math.min(corners.minx, gy);
    corners.maxx = Math.max(corners.maxx, gy);
    corners.miny = Math.min(corners.miny, gx);
    corners.maxy = Math.max(corners.maxy, gx);
    reDraw();
}

function getPixel(gx, gy) {
    if (field[gx] === undefined) {
        return 0;
    } else {
        if (field[gx][gy] === undefined) {
            return 0;
        } else {
            return field[gx][gy];
        }
    }
}

function reDraw() {
    var arr = [];
    for (var i = 0; i < 8; i++) {
        var temp = [];
        for (var j = 0; j < 8; j++) {
            temp[j] = getColor(getPixel(ox + j, oy + i), winning(ox + j, oy + i));
        }
        arr[i] = temp;
    }
    var tempu = [];
    tempu[0] = (corners.minx < oy) ? 3 : 0;
    tempu[1] = (corners.maxx > oy + 7) ? 3 : 0;
    tempu[2] = (corners.miny < ox) ? 3 : 0;
    tempu[3] = (corners.maxy > ox + 7) ? 3 : 0;
    tempu[4] = getColor(getCurrent());
    tempu[5] = 0;
    if (turn === 0)
        tempu[6] = getColor(players);
    else
        tempu[6] = 0;
    arr[8] = tempu;
    launchpad.renderBytes(arr);
    tick++;
    return false;
}

function getColor(state, blk) {
    if (blk == 1 && tick % 4 === 0) {
        switch (state) {
            case 0:
                return 0;
            case 1:
                return 2;
            case 2:
                return 32;
            case 3:
                return (players == 3 ? 17 : (16 | 3));
            case 4:
                return 48 | 1;
            default:
                console.log("Unknown state " + state);
                return 0;
        }
    } else if (blk == 2 && tick % 2 === 0) {
        return 0;
    } else {
        switch (state) {
            case 0:
                return 0;
            case 1:
                return 3;
            case 2:
                return 48;
            case 3:
                return (players == 3 ? 34 : (16 | 2));
            case 4:
                return 32 | 1;
            default:
                console.log("Unknown state " + state);
                return 0;
        }
    }
}

function getCurrent() {
    return turn % players + 1;
}
