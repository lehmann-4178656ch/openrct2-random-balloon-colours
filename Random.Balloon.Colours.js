const balloonStallType = 32;
const namespace = 'random_balloon_colours';
const changeStallBalloonColourKey = namespace + ".changeStallBalloonColour"
const changePeepBalloonColourKey = namespace + ".changePeepBalloonColour"

// Retrieve given key from sharedStorage, returns defaultValue if not found.
const getConfig = function(key, defaultValue) {
    return context.sharedStorage.get(key, defaultValue);
}

// Stores given value under given key in sharedStorage.
const setConfig = function(key, value) {
    return context.sharedStorage.set(key, value)
}

// Change the colour of each balloon stall to a random one.
// This can result in the same colour as before.
const changeStallBalloonColour = function() {
    for (var i = 0; i < map.rides.length; i++) {
        const item = map.rides[i];
        if (item.classification != 'stall') {
            continue;
        }
        if (item.type != balloonStallType) {
            continue;
        }
        item.colourSchemes = [{main: context.getRandom(0, 31)}];
    }
}

// Change the colour of each sold balloon to a random one.
// This can result in the same colour as before.
const changePeepBalloonColour = function() {
    for (var i = 0; i < map.numEntities; i++) {
        const item = map.getEntity(i);
        if (!item) {
            continue;
        }
        if (item.type != 'peep') {
            continue;
        }
        if (item.peepType != 'guest') {
            continue;
        }
        item.balloonColour = context.getRandom(0, 31);
    }
}

// Function run once a day.
const dayHook = function() {
    if (getConfig(changeStallBalloonColourKey, false)) {
        changeStallBalloonColour();
    }
    if (getConfig(changePeepBalloonColourKey, false)) {
        changePeepBalloonColour();
    }
}

// Configuration window
const showWindow = function() {
    const window = ui.getWindow(namespace);
    if (window) {
      window.bringToFront();
      return;
    }
  
    ui.openWindow({
        classification: namespace,
        width: 240,
        height: 102,
        title: 'Random Ballon Colours',
        widgets: [
            {
                type: 'checkbox',
                x: 5,
                y: 20,
                width: 210,
                height: 10,
                tooltip: "",
                text: "Change Stall Balloon Colour daily",
                isChecked: getConfig(changeStallBalloonColourKey, false),
                onChange: function (params) { setConfig(changeStallBalloonColourKey, params)}
            },
            {
                type: 'button',
                x: 5,
                y: 35,
                width: 230,
                height: 21,
                text: "Change Stall Balloon Colour once",
                tooltip: "",
                isPressed: false,
                onClick: changeStallBalloonColour,
            },
            {
                type: 'checkbox',
                x: 5,
                y: 61,
                width: 210,
                height: 10,
                tooltip: "",
                text: "Change Peep Balloon Colour daily",
                isChecked: getConfig(changePeepBalloonColourKey, false),
                onChange: function (params) { setConfig(changePeepBalloonColourKey, params)}
            },
            {
                type: 'button',
                x: 5,
                y: 76,
                width: 230,
                height: 21,
                text: "Change Peep Balloon Colour once",
                tooltip: "",
                isPressed: false,
                onClick: changePeepBalloonColour,
            }
        ],
    });
}

// Main function registering menu and hook.
function main() {
    ui.registerMenuItem('Random Balloon Colours', function() {
        showWindow();
    });
    context.subscribe("interval.day", dayHook);
}

// Register plugin
registerPlugin({
    name: 'Random Balloon Colours',
    version: '1.0',
    authors: ['lehmann-4178656ch'],
    type: 'remote',
    licence: "GPL-3.0",
    main: main
});
