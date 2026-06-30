/*
=========================================================
LIMS Lite
Application Controller
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

async function initializeApp() {

    showLoading();

    try {

        await loadAllData();

        updateConnectionStatus();

        updateLastSync();

        hideLoading();

        showDashboard();

        console.log("LIMS Lite Connected");

    }

    catch (err) {

        console.error(err);

        showError(err.message);

    }

}

function showLoading() {

    document.getElementById("loadingScreen").hidden = false;

    document.getElementById("errorScreen").hidden = true;

}

function hideLoading() {

    document.getElementById("loadingScreen").hidden = true;

}

function showDashboard() {

    document.getElementById("dashboardPage").hidden = false;

}

function showError(message) {

    document.getElementById("loadingScreen").hidden = true;

    document.getElementById("errorScreen").hidden = false;

    document.getElementById("errorMessage").textContent = message;

}

function updateLastSync() {

    if (!STATE.lastSync) return;

    const el = document.getElementById("lastSync");

    if (!el) return;

    el.textContent =
        "Last Sync : " +
        STATE.lastSync.toLocaleString("id-ID");

}

document.addEventListener("click", (e) => {

    if (e.target.id === "refreshBtn") {

        initializeApp();

    }

    if (e.target.id === "retryBtn") {

        initializeApp();

    }

});
