module.exports = {
    press: onClick,
    ready: reDraw,
    timeout: 200,
    exit: function () {
        return true;
    }
};

var field = {}; //0 or undefined: nobody; 1-4 red green yellow orage

var turn = 0;
var players = 2;
var ox = 0;
var oy = 0;
var corners = {
    minx: 0,
    miny: 0,
    maxx: 0,
    maxy: 0
};

function onClick(button) {
    if (button.special) {
        special(button.x, button.y);
    } else {
        click(button.x, button.y);
    }
}

function special(lx, ly) {
    if (lx == 0) {
        oy--;
    }
    if (lx == 1) {
        oy++;
    }
    if (lx == 2) {
        ox--;
    }
    if (lx == 3) {
        ox++;
    }
    reDraw();
}

function click(lx, ly) {
    if (getPixel(lx + ox, ly + oy) == 0) {
        setPixel(lx, ly, getCurrent());
        turn++;
        reDraw();
    }
}

function setPixel(gx, gy, state) {
    if (field[gx] == undefined) {
        field[gx] = {};
    }
    field[gx][gy] = state;
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
    var arr = {};
    for (var i = 0; i < 8; i++) {
        var temp = {};
        for (var j = 0; j < 8; j++) {
            temp[j] = getColor(getPixel(ox + i, oy + j));
        }
        arr[i] = temp;
    }
    var tempu = {};
    tempu[0] = (corners.minx < ox) ? 3 : 0;
    tempu[1] = (corners.maxx > ox + 8) ? 3 : 0;
    tempu[2] = (corners.miny < oy) ? 3 : 0;
    tempu[3] = (corners.maxy > ox + 8) ? 3 : 0;
    tempu[4] = getColor(getCurrent());
    launchpad.renderBytes(arr);
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
            return 16 | 2;
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
