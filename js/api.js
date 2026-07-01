/*
=========================================================
LIMS Lite
API Service
=========================================================
*/

class ApiService {

    static async fetchSheet(sheetName) {

        const controller = new AbortController();

        const timeout = setTimeout(() => {

            controller.abort();

        }, CONFIG.API.TIMEOUT);

        try {

            const url =
                `${CONFIG.API.BASE_URL}?sheet=${encodeURIComponent(sheetName)}`;

            const response = await fetch(url, {

                method: "GET",

                signal: controller.signal,

                cache: "no-store"

            });

            clearTimeout(timeout);

            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }

            const data = await response.json();

            return data;

        }

        catch (error) {

            clearTimeout(timeout);

            throw error;

        }

    }

    static inventory() {

        return this.fetchSheet(
            CONFIG.SHEETS.INVENTORY
        );

    }

    static receiving() {

        return this.fetchSheet(
            CONFIG.SHEETS.RECEIVING
        );

    }

    static distribution() {

        return this.fetchSheet(
            CONFIG.SHEETS.DISTRIBUTION
        );

    }

    static disposal() {

        return this.fetchSheet(
            CONFIG.SHEETS.DISPOSAL
        );

    }

    static documents() {

        return this.fetchSheet(
            CONFIG.SHEETS.DOCUMENT
        );

    }

    static stockCard() {

        return this.fetchSheet(
            CONFIG.SHEETS.STOCK_CARD
        );

    }

}

/*
=========================================================
Post Data (Write-back ke Apps Script)
=========================================================
Catatan: Content-Type sengaja "text/plain" (bukan
application/json). Ini penting -- kalau pakai
application/json, browser akan kirim preflight request
(OPTIONS) dulu, dan Google Apps Script Web App TIDAK bisa
menjawab preflight itu, hasilnya request akan gagal kena
error CORS. Dengan text/plain, browser menganggapnya
"simple request" dan langsung kirim tanpa preflight.
=========================================================
*/

async function postToSheet(payload) {

    const response = await fetch(CONFIG.API.BASE_URL, {

        method: "POST",

        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify(payload)

    });

    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}`
        );

    }

    return response.json();

}

/*
=========================================================
Load All Data
=========================================================
*/

async function loadAllData() {

    try {

        const [

            inventory,

            receiving,

            distribution,

            disposal,

            documents,

            stockCard

        ] = await Promise.all([

            ApiService.inventory(),

            ApiService.receiving(),

            ApiService.distribution(),

            ApiService.disposal(),

            ApiService.documents(),

            ApiService.stockCard()

        ]);

        STATE.inventory = inventory;

        STATE.receiving = receiving;

        STATE.distribution = distribution;

        STATE.disposal = disposal;

        STATE.documents = documents;

        STATE.stockCard = stockCard;

        STATE.online = true;

        STATE.lastSync = new Date();

        return true;

    }

    catch (err) {

        console.error(err);

        STATE.online = false;

        throw err;

    }

}

/*
=========================================================
Connection Status
=========================================================
*/

function updateConnectionStatus() {

    const status =
        document.getElementById("connectionStatus");

    if (!status) return;

    if (STATE.online) {

        status.innerHTML =
            "🟢 Online";

    }

    else {

        status.innerHTML =
            "🔴 Offline";

    }

}
