var rb = require("./rainbow.js");
var mods = {
    0: null,
    1: rb,
    2: require("./amoba.js")
}

var vars = require("./vars.js");

var midiConnector = require('midi-launchpad').connect(0, 1, false);
var correct = false;

var update = function () {
    if (vars.current != 0) {
        correct = false;
        if (mods[vars.current].update) {
            if (mods[vars.current].update()) {
                vars.timeout = 100;
                vars.current = 0;
            } else {}
        }
    } else if (!correct) {
        var button;
        for (var i = 0; i < mods.length - 1; i++) {
            button = launchpad.getButton(i / 9, i % 9);
            button.light(51);
        }
    }
    setTimeout(update, vars.timeout);
}

var press = function (button) {
    console.log(vars.current);
    if (vars.current != 0) {
        if (button.x == 7 && button.y == 8) {
            if (mods[vars.current].exit || !(mods[vars.current].update)) {
                if (mods[vars.current].exit()) {
                    vars.timeout = 100;
                    vars.current = 0;
                }
            }
        } else if (mods[vars.current].press)
            if (mods[vars.current].press(button)) {
                vars.timeout = 100;
                vars.current = 0;
            }
    }
    if (!vars.current) {
        if (button.x == 7 && button.y == 8) {
            launchpad.renderBytes([
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "00000000"
            ], true);
            process.exit();
        }
        if (mods[button.y * 9 + button.x]) {
            launchpad.renderBytes([
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "000000000",
                "00000000"
            ], true);
            vars.current = button.y * 9 + button.x;
            vars.timeout = mods[vars.current].timeout;
            if (button.x == 7 && button.y == 8) {
                if (mods[vars.current].exit || !(mods[vars.current].update)) {
                    if (mods[vars.current].exit()) {
                        vars.timeout = 100;
                        vars.current = 0;
                    }
                }
            } else if (mods[vars.current].press)
                if (mods[vars.current].press(button)) {
                    vars.timeout = 100;
                    vars.current = 0;
                }
        }
    }
};

var release = function (button) {
    if (vars.current != 0) {
        if (mods[vars.current].release)
            if (mods[vars.current].release(button)) {
                vars.timeout = 100;
                vars.current = 0;
            }
    } else {
        if (mods[button.x * 8 + button.y]) {
            vars.current = button.x * 8 + button.y;
            if (mods[vars.current].ready) {
                mods[vars.current].ready();
            }
        }
    }
};

midiConnector.on("ready",
    function (lp) {
        global.launchpad = lp;
        vars.timeout = 200;
        setTimeout(update, vars.timeout);
        launchpad.on("press", press);
        launchpad.on("release", release);
        setTimeout(update, 200);
    }
);
