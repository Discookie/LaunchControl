module.exports = {
    press: onClick,
    ready: ready,
    timeout: 200,
    exit: function () {
        return true;
    }
};

var field = {}; //0 or undefined: nobody; 1-4 red green yellow orage
var steps = [];

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
        if (turn != 0) return;
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
    if (getPixel(lx + ox, ly + oy) == 0) {
        setPixel(lx + ox, ly + oy, getCurrent());
        turn++;
        reDraw();
    }
}

function undo() {
    if (steps.length == 0) return;
    setPixel(steps[steps.length - 1][0], steps[steps.length - 1][1], 0);
    steps.pop();
    turn--;
}

function setPixel(gx, gy, state) {
    if (field[gx] == undefined) {
        field[gx] = {};
    }
    field[gx][gy] = state;
    if (state) steps[steps.length] = [gx, gy];
    corners.minx = Math.min(corners.minx, gy);
    corners.maxx = Math.max(corners.maxx, gy);
    corners.miny = Math.min(corners.miny, gx);
    corners.maxy = Math.max(corners.maxy, gx);
    reDraw();
}

function getPixel(gx, gy) {
    if (field[gx] == undefined) {
        return 0;
    } else {
        if (field[gx][gy] == undefined) {
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
            temp[j] = getColor(getPixel(ox + j, oy + i));
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
    if (turn == 0) tempu[6] = getColor(players);
    else tempu[6] = 0;
    arr[8] = tempu;
    launchpad.renderBytes(arr);
    return false;
}

function getColor(state) {
    switch (state) {
        case 0:
            return 0;
            break;
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

function getCurrent() {
    return turn % players + 1;
}
