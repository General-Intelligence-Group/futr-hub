const Config = {
    alerting: {
        fetchBroadcastUrl: "./broadcastedPortalAlerts.json"
    },
    wfsImgPath: "./resources/img/",
    cswId: "004",
    namedProjections: [
        ["EPSG:25833", "+title=ETRS89/UTM 33N +proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"],
        ["EPSG:4326", "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs"]
    ],
    footer: {
        urls: [
        {
            "url": "https://www.tegelprojekt.de/impressum.html",
            "alias": "Bereitgestellt von Tegel Projekt GmbH",
            "alias_mobil": "TP"
        }, 
        {
            "url": "mailto:kontakt@futr-hub.de",
            "alias": "Fehler melden"
        },
        {
            "url": "https://gitlab.com/berlintxl/futr-hub/platform/masterportal_customizing",
            "alias": "Quellcode"
        },
    ],
        showVersion: true
    },
    ignoredKeys: ["BOUNDEDBY", "SHAPE", "SHAPE_LENGTH", "SHAPE_AREA", "OBJECTID", "GLOBALID", "GEOMETRY", "SHP", "SHP_AREA", "SHP_LENGTH","GEOM", "Fid", "Id", "Id_0", "X", "Y", "Extent"],
    quickHelp: {
        imgPath: "./resources/img/"
    },
    layerConf: "./resources/services-internet.json",
    restConf: "./resources/rest-services-internet.json",
    styleConf: "./resources/style_v3.json",
    scaleLine: true,
    mouseHover: {
        numFeaturesToShow: 2,
        infoText: "(weitere Objekte. Bitte zoomen.)"
    },
    useVectorStyleBeta: true, 
    portalLanguage: {
        enabled: true,
        debug: false,
        languages: {
            de: "Deutsch",
            en: "English",
            es: "Español",
            it: "Italiano",
            pt: "Português"
        },
        fallbackLanguage: "de",
        changeLanguageOnStartWhen: ["querystring", "localStorage", "htmlTag"]
    }
};

// conditional export to make config readable by e2e tests
if (typeof module !== "undefined") {
    module.exports = Config;
}
