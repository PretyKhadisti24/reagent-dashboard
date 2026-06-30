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
        BASE_URL: "https://script.google.com/macros/s/AKfycbzFKo3vajXoH7qs84mbQ85gGk1bFGBNkXXeedKyXl7NyRJh_Z_HQdzyfa3hIl0FUB0/exec",
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
