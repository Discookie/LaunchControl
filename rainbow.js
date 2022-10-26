var mstates = {
    "-1": 0,
    0: 1,
    1: 1,
    2: 2,
    3: 2,
    4: 3,
    5: 3,
    6: 19,
    7: 19,
    8: 35,
    9: 35,
    10: 51,
    11: 51,
    12: 50,
    13: 50,
    14: 49,
    15: 49,
    16: 48,
    17: 48,
    18: 32,
    19: 32,
    20: 16,
    21: 16,
    22: 0,
    23: 0
}
var states = {};
var ml = 24;
var ix = 2;
var int = function () {
    ix = 3;
    states = {};
    for (var i = 0; i < 8; i++) {
        var stateInner = {};
        for (var j = 0; j < 8; j++) {
            stateInner[j] = (i + j) % ml - 16;
        }
        states[i] = stateInner;
    }
}
var restartable = true;
var running = false;
var intId = 0;
var vars = require("./vars.js");
module.exports = {
    timeout: 50,
    ready: function () {
        restartable = false;
        running = true;
        int();
        vars.timeout = 50;
        return false;
    },
    update: function () {
        if (!restartable) {
            for (var i = 0; i < 8; i++) {
                var lm = "";
                var col = (i * 3 + ix) % 5;
                for (var j = 0; j < col; j++) lm += ".";
                lm += "O";
                var butt1 = launchpad.getButton(7 - i, col);

                states[i][col] = states[i][col] + 1;

                if (running || (states[7][7] < ml - 2))
                    states[i][col] %= ml;
                else
                    states[i][col] = Math.min(states[i][col], ml - 2);

                butt1.light(mstates[Math.max(states[i][col], -1)]);

                //sleep.msleep(1);

                if (col < 3) {

                    var prCol = col;
                    col += 5;
                    for (var j = prCol + 1; j < col; j++) lm += ".";
                    lm += "O";
                    var butt2 = launchpad.getButton(7 - i, col);

                    states[i][col] = states[i][col] + 1;

                    if (running || (states[7][7] < ml - 2))
                        states[i][col] %= ml;
                    else
                        states[i][col] = Math.min(states[i][col], ml - 2);

                    butt2.light(mstates[Math.max(states[i][col], -1)]);

                    //sleep.msleep(1);
                }

                for (j = col + 1; j < 8; j++) lm += ".";
                //console.log(lm);
            }
            if (!running) {
                var rme = 64;

                for (var i = 0; i < 8; i++) {
                    for (var j = 0; j < 8; j++) {
                        if (states[i][j] >= ml - 2 || states[i][j] < 0) {
                            --rme;
                        }
                    }
                }
                //console.log(rme);
                if (rme <= 0) {
                    restartable = true;
                    clearInterval(intId);
                    return true;
                }

            }
            ix += 1;
            return false;
        }
    },
    press: function (btn) {
        //console.log("running:" + (running==true?"true":"false") + ", intId = " + intId);
        if (running) {
            restartable = false;
            running = false;
            //console.log(running==true?"true":"false");

        }
    },
    exit: function () {
        restartable = false;
        running = false;
        return false;
    }
};
