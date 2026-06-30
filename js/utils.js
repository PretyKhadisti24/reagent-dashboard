/*
=========================================================
LIMS Lite v3.0
Utilities
=========================================================
*/

const Utils = {

    // ===========================
    // Format Tanggal
    // ===========================
    formatDate(value) {

        if (!value) return "-";

        const d = new Date(value);

        if (isNaN(d)) return value;

        return d.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });

    },

    // ===========================
    // Hitung Selisih Hari
    // ===========================
    daysToExpire(value) {

        if (!value) return null;

        const today = new Date();

        const exp = new Date(value);

        today.setHours(0,0,0,0);
        exp.setHours(0,0,0,0);

        return Math.floor(
            (exp - today) / 86400000
        );

    },

    // ===========================
    // Status Expired
    // ===========================
    expiryStatus(value){

        const days = this.daysToExpire(value);

        if(days === null) return "unknown";

        if(days < 0) return "expired";

        if(days <= 30) return "warning";

        return "normal";

    },

    // ===========================
    // Badge Expired
    // ===========================
    expiryBadge(value){

        const status=this.expiryStatus(value);

        switch(status){

            case "expired":
                return `<span class="badge badge-danger">Expired</span>`;

            case "warning":
                return `<span class="badge badge-warning">Near Expired</span>`;

            default:
                return `<span class="badge badge-success">Normal</span>`;

        }

    },

    // ===========================
    // Badge Status
    // ===========================
    statusBadge(status){

        status=(status||"").toUpperCase();

        if(status==="AKTIF"){

            return `<span class="badge badge-success">Aktif</span>`;

        }

        if(status==="TIDAK AKTIF"){

            return `<span class="badge badge-danger">Tidak Aktif</span>`;

        }

        return `<span class="badge badge-secondary">${status}</span>`;

    },

    // ===========================
    // Format Angka
    // ===========================
    number(value){

        return Number(value||0)
            .toLocaleString("id-ID");

    },

    // ===========================
    // Escape HTML
    // ===========================
    escape(text){

        return String(text ?? "")
            .replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;")
            .replace(/'/g,"&#039;");

    },

    // ===========================
    // Open Link
    // ===========================
    open(url){

        if(!url) return;

        window.open(url,"_blank");

    },

    // ===========================
    // Toast
    // ===========================
    toast(message,type="info"){

        console.log(`[${type}] ${message}`);

        // Nanti kita upgrade menjadi popup cantik

    },

    // ===========================
    // Loading
    // ===========================
    showLoading(){

        document
            .getElementById("loadingScreen")
            ?.removeAttribute("hidden");

    },

    hideLoading(){

        document
            .getElementById("loadingScreen")
            ?.setAttribute("hidden",true);

    }

};
