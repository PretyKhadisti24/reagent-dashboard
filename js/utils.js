/*
=========================================================
LIMS Lite v3.1
Utilities
=========================================================
*/

const Utils = {

    // ===========================
    // Parse Tanggal
    // Handle format dd/MM/yyyy yang
    // dikirim Apps Script (native
    // JS Date suka salah baca ini
    // sebagai MM/dd/yyyy)
    // ===========================
    parseDate(value) {

        if (!value) return null;

        if (value instanceof Date) return value;

        const str = String(value).trim();

        const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

        if (match) {

            const day = Number(match[1]);

            const month = Number(match[2]);

            const year = Number(match[3]);

            return new Date(year, month - 1, day);

        }

        const d = new Date(str);

        return isNaN(d) ? null : d;

    },

    // ===========================
    // Format Tanggal
    // ===========================
    formatDate(value) {

        const d = this.parseDate(value);

        if (!d) return value || "-";

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

        const exp = this.parseDate(value);

        if (!exp) return null;

        const today = new Date();

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
    // Cek apakah value berupa URL
    // (dipakai buat auto-detect
    // kolom Link COA / Link MSDS / dsb)
    // ===========================
    isLinkValue(value){

        return typeof value === "string" &&
            /^https?:\/\//i.test(value.trim());

    },

    // ===========================
    // Cek apakah nama kolom
    // mengandung indikasi tanggal
    // ===========================
    isDateColumn(col){

        return /tgl|tanggal|date|expired|exp\./i.test(col || "");

    },

    // ===========================
    // Nama kolom buat ditampilkan
    // (fallback kalau header kosong)
    // ===========================
    displayColumn(col){

        return (col && col.trim()) ? col : "Lainnya";

    },

    // ===========================
    // Render satu cell tabel secara
    // otomatis: URL jadi tombol
    // "Buka", kolom tanggal diformat,
    // sisanya di-escape biasa.
    // ===========================
    renderCell(col, value){

        if (this.isLinkValue(value)) {

            return `<a href="${this.escape(value)}" target="_blank" rel="noopener noreferrer">Buka</a>`;

        }

        if (this.isDateColumn(col) && value) {

            return this.escape(this.formatDate(value));

        }

        return this.escape(value);

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
