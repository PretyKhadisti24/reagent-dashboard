/*
=========================================================
LIMS Lite
Lab Inventory Management System
Version : 2.0.0
=========================================================
*/

const CONFIG = {

    APP: {
        NAME: "LIMS Lite",
        FULLNAME: "Lab Inventory Management System",
        VERSION: "2.0.0",
        AUTHOR: "Gyra Project"
    },

    API: {
        BASE_URL: "https://script.google.com/macros/s/AKfycbyE6wqglEsHtkgsKyGYvcTHYLtNGmGsz7pfWbBCpWL5r5_gQiB440Ksi7QSRYD0E5yN/exec",
        TIMEOUT: 15000
    },

    SHEETS: {

        INVENTORY: "Stok",

        RECEIVING: "Penerimaan",

        DISTRIBUTION: "Distribusi",

        DISPOSAL: "Pemusnahan",

        DOCUMENT: "Document Index"

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

    dashboard: {},

    online: false,

    lastSync: null

};
