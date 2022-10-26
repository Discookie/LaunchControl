module.exports = {
    press: onClick,
    ready: reset,
    timeout: 100,
    exit: function () {
        gameLive = false;
        return true;
    }
};

var colors = [[0, 1, 3, 19], [0, 16, 48, 49], [0, 17, 34, 51]];

var field = [];
var fieldColors = [];
var totalCount = [];
var blown = [];
var blownCount = 0;
var turn = 0;
var players = 2;
var winCheck = true;
var winner = 0;
var gameLive = true;
var turnRunning = false;

function reset() {
    gameLive = true;
    field = [];
    fieldColors = [];
    blown = [];
    for (let i = 0; i < 8; i++) {
        let temp = [];
        let temp2 = [];
        let temp3 = [];
        for (let j = 0; j < 8; j++) {
            temp.push(0);
            temp2.push(0);
            temp3.push(false);
        }
        field.push(temp);
        fieldColors.push(temp2);
        blown.push(temp3);
    }
    blownCount = 0;
    totalCount = [0, 0, 0];
    turnRunning = false;
    turn = 0;
    winner = 0;
    reDraw();
}

function onClick(button) {
    if (!button.special) {
        click(button.x, button.y);
    }
}

function click(lx, ly) {
    if (turnRunning) {
        return;
    }
    if (fieldColors[lx][ly] == getCurrent() || field[lx][ly] === 0) {
        turnRunning = true;
        updateTurn(updatePixel(lx, ly, getCurrent()), getCurrent(), 1);
    }
}

function updateTurn(queue, color, count) {
    if (!gameLive) {
        return;
    }
    if (queue.length > 0) {
        if (blownCount > 62 && winner === 0) {
            if (totalCount[0] === 0) {
                winner = 2;
                console.log(turn + 1);
            } else if (totalCount[1] === 0) {
                winner = 1;
                console.log(turn + 1);
            }
        }
        reDraw();
        let newQueue = [];
        for (let i in queue) {
            launchpad.getButton(queue[i][0], queue[i][1]).light(51);
            let tmp = updatePixel(queue[i][0], queue[i][1], color);
            for (let j in tmp) {
                if (!blown[queue[i][0]][queue[i][1]]) {
                    blownCount++;
                    blown[queue[i][0]][queue[i][1]] = true;
                }
                newQueue[newQueue.length] = tmp[j];
            }
        }
        setTimeout(updateTurn, 100, newQueue, color, count + 1);
    } else {
        turn++;
        turnRunning = false;
        blown = [];
        blownCount = 0;
        for (let i = 0; i < 8; i++) {
            let temp = [];
            for (let j = 0; j < 8; j++) {
                temp.push(false);
            }
            blown.push(temp);
        }
        if (turn > 1 && winCheck) {
            if (totalCount[0] === 0) {
                winner = 2;
                gameLive = false;
            } else if (totalCount[1] === 0) {
                winner = 1;
                gameLive = false;
            }
        }
        reDraw();
    }
}

function updatePixel(gx, gy, color) {
    let state = field[gx][gy];
    let updateQueue = [];
    totalCount[fieldColors[gx][gy]] -= state;
    state = state + 1;
    let needed = 2;
    if (0 < gx && gx < 7) {
        needed += 1;
    }
    if (0 < gy && gy < 7) {
        needed += 1;
    }
    if (state >= needed) {
        if (0 < gx) {
            updateQueue.push([gx - 1, gy]);
        }
        if (0 < gy) {
            updateQueue.push([gx, gy - 1]);
        }
        if (gx < 7) {
            updateQueue.push([gx + 1, gy]);
        }
        if (gy < 7) {
            updateQueue.push([gx, gy + 1]);
        }
    }
    field[gx][gy] = state % needed;
    totalCount[color] += state % needed;
    fieldColors[gx][gy] = color;
    return updateQueue;
}

function getPixel(gx, gy) {
    return field[gx][gy];
}

function reDraw() {
    let arr = [];
    for (let i = 0; i < 8; i++) {
        let temp = [];
        for (let j = 0; j < 8; j++) {
            temp.push(colors[fieldColors[j][i]][field[j][i] % 4]);
        }
        temp[8] = colors[i >> 2][i % 4];
        arr.push(temp);
    }
    arr.push([
        (winner >> 1) * 48 + (winner % 2) * 3,
        (winner >> 1) * 48 + (winner % 2) * 3,
        (winner >> 1) * 48 + (winner % 2) * 3,
        (winner >> 1) * 48 + (winner % 2) * 3,
        (winner === 0) ? colors[getCurrent()][2] : (winner >> 1) * 48 + (winner % 2) * 3,
        (winner >> 1) * 48 + (winner % 2) * 3,
        (winner >> 1) * 48 + (winner % 2) * 3,
        0
    ]);
    //tempu[4] = getColor(getCurrent());
    launchpad.renderBytes(arr);
}

function getCurrent() {
    return turn % players;
}
