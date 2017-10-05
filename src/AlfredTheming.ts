import getMuiTheme from "material-ui/styles/getMuiTheme";

export const APIColorPalette = {
    monoChrome0: "#231F20",
    monoChrome1: "#58595B",
    monoChrome2: "#808285",
    monoChrome3: "#A7A9AC",
    color0: "#33A89F",
    color1: "#24B99D",
    color2: "#50BD90",
    color3: "#67C18C",
    color4: "#3EB549",
    color5: "#8FCA79",
    color6: "#C1DA63",
    color7: "#D7DF23",
};
export const FinderColorPalette = {
    monoChrome0: "#231F20",
    monoChrome1: "#58595B",
    monoChrome2: "#808285",
    monoChrome3: "#A7A9AC",
    color0: "#09A89E",
    color1: "#5BAAA2",
    color2: "#7CCCBF",
    color3: "#97D5C9",
};
export const FinderMuiTheme = getMuiTheme({
    appBar: {
        height: 30,
        color: FinderColorPalette.color0,
    },
    palette: {
        primary1Color: FinderColorPalette.color0,
        primary2Color: FinderColorPalette.color1,
        primary3Color: FinderColorPalette.color2,
        accent1Color: FinderColorPalette.color3,
        accent2Color: FinderColorPalette.color3,
        accent3Color: FinderColorPalette.color3,
    },
});
