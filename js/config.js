/*
=========================================================
LIMS Lite
Lab Inventory Management System
Version : 2.3.0
=========================================================
*/

const CONFIG = {

    APP: {
        NAME: "LIMS Lite",
        FULLNAME: "Lab Inventory Management System",
        VERSION: "2.3.0",
        AUTHOR: "Gyra Project"
    },

    API: {
        BASE_URL: "https://script.google.com/macros/s/AKfycbwoq-rzZcdjwumnaSi0SCcXwMnytmdwKqWZYi_txiOPXwoZ5EVt0LuYXTUqTMWssBG7iw/exec",
        TIMEOUT: 15000
    },

    SHEETS: {

        INVENTORY: "Master Stok",

        RECEIVING: "Penerimaan",

        DISTRIBUTION: "Distribusi",

        DISPOSAL: "Pemusnahan",

        DOCUMENT: "Document Index",

        STOCK_CARD: "Kartu Stok"

    },

    STATUS: {

        ACTIVE: "AKTIF",

        INACTIVE: "TIDAK AKTIF"

    },

    STORAGE: {

        LOCAL_KEY: "lims-lite-cache",

        LAST_SYNC: "lims-lite-last-sync"

    }

};


/*
=========================================================
Global State
=========================================================
*/

const STATE = {

    inventory: [],

    receiving: [],

    distribution: [],

    disposal: [],

    documents: [],

    stockCard: [],

    dashboard: {},

    online: false,

    lastSync: null

};
