var rb = require("./rainbow.js");
var mods = [
    null,
    rb,
    require("./amoba.js")
]

var vars = require("./vars.js");

var midiConnector;
var correct = false;
var connected = true;


var connect = function () {
    try {
        midiConnector = require('midi-launchpad').connect(0, 1, false);
        midiConnector.on("ready",
            function (lp) {
                connected = true;
                global.launchpad = lp;
                vars.timeout = 200;
                setTimeout(update, vars.timeout);
                launchpad.on("press", press);
                launchpad.on("release", release);
                setTimeout(update, 200);
            }
        );
    } catch (e) {
        setTimeout(connect, 1000);
        return;
    }
    if (!connected) {
        setTimeout(connect, 1000);
    }
}
process.on('uncaughtException', function (err) {
    console.log("HI! You should see me :3");
    connected = false;
    setTimeout(connect, 1000);
});

var update = function () {
    if (!connected) return;
    try {
        launchpad.getButton(7, 8).light(12);
        launchpad.getButton(7, 8).light(0);
    } catch (e) {
        connected = false;
        connect();
        return;
    }

    try {
        if (vars.current != 0) {
            correct = false;
            if (mods[vars.current].update) {
                if (mods[vars.current].update()) {
                    vars.timeout = 100;
                    vars.current = 0;
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
                    var button;
                    for (var i = 0; i < mods.length; i++) {
                        button = launchpad.getButton(i % 9, Math.floor(i / 9));
                        button.light(51);
                    }
                } else {}
            }
        } else if (!correct) {
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
            var button;
            for (var i = 0; i < mods.length; i++) {
                button = launchpad.getButton(i % 9, Math.floor(i / 9));
                button.light(51);
            }
            correct = true;
        }
        setTimeout(update, vars.timeout);
    } catch (e) {
        connected = false;
        connect();
        return;
    }
}

var press = function (button) {
    if (!connected) return;
    try {
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
                    var button;
                    for (var i = 0; i < mods.length; i++) {
                        button = launchpad.getButton(i % 9, Math.floor(i / 9));
                        button.light(51);
                    }
                }
        } else if (button.x == 7 && button.y == 8) {
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
        if (!vars.current) {
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
                            var button;
                            for (var i = 0; i < mods.length; i++) {
                                button = launchpad.getButton(i % 9, Math.floor(i / 9));
                                button.light(51);
                            }
                        }
                    }
                } else if (mods[vars.current].ready)
                    mods[vars.current].ready(button);
            }
        }
    } catch (e) {
        connected = false;
        connect();
        return;
    }
};

var release = function (button) {
    if (!connected) return;
    try {
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
    } catch (e) {
        connected = false;
        connect();
        return;
    }
};

connect();
