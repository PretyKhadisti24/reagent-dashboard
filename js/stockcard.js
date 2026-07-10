/*
=========================================================
LIMS Lite
Stock Card Module (Read-only + Export PDF)
Filter: Reagen, Kategori, Instalasi, Supplier berupa
KOTAK SEARCH (substring, case-insensitive), independen,
tidak wajib diisi semua. Export PDF hanya berdasarkan
kotak search "Nama Reagen", mengabaikan filter lainnya.
=========================================================
*/

const StockCard = {

    initialized: false,

    render() {

        this.bindEvents();

        this.applyFilters();

    },

    bindEvents() {

        if (this.initialized) return;

        this.initialized = true;

        [
            "scReagenFilter",
            "scKategoriFilter",
            "scInstalasiFilter",
            "scSupplierFilter"
        ].forEach(id => {

            document.getElementById(id)?.addEventListener(
                "input",
                () => this.applyFilters()
            );

        });

        document.getElementById("scExportPdfBtn")?.addEventListener(
            "click",
            () => this.exportPdf()
        );

    },

    sortByDate(data) {

        return [...data].sort((a, b) => {

            const da = Utils.parseDate(a["Tanggal"]);

            const db = Utils.parseDate(b["Tanggal"]);

            if (!da || !db) return 0;

            return da - db;

        });

    },

    matchText(fieldValue, searchText) {

        if (!searchText) return true;

        return String(fieldValue || "")
            .toLowerCase()
            .includes(searchText.toLowerCase().trim());

    },

    getFilteredData() {

        const namaReagen =
            document.getElementById("scReagenFilter")?.value || "";

        const kategori =
            document.getElementById("scKategoriFilter")?.value || "";

        const instalasi =
            document.getElementById("scInstalasiFilter")?.value || "";

        const supplier =
            document.getElementById("scSupplierFilter")?.value || "";

        let data = STATE.stockCard || [];

        data = data.filter(r =>

            this.matchText(r["Nama Reagen"], namaReagen) &&
            this.matchText(r["Kategori"], kategori) &&
            this.matchText(r["Instalasi"], instalasi) &&
            this.matchText(r["Supplier"], supplier)

        );

        return this.sortByDate(data);

    },

    applyFilters() {

        const data = this.getFilteredData();

        this.renderTable(data);

    },

    renderTable(data) {

        const container =
            document.getElementById("kartuStokContent");

        if (!container) return;

        if (data.length === 0) {

            container.innerHTML =
                "<p>Tidak ada data yang cocok dengan filter.</p>";

            return;

        }

        let html = `
<table>
<thead>
<tr>
<th>Tanggal</th>
<th>Instalasi</th>
<th>Nama Reagen</th>
<th>Kode/Lot</th>
<th>Expired</th>
<th>Merk</th>
<th>Kategori</th>
<th>Supplier</th>
<th>In</th>
<th>Out</th>
<th>Balance</th>
<th>Keterangan</th>
<th>PIC</th>
</tr>
</thead>
<tbody>
`;

        data.forEach(row => {

            html += `
<tr>
<td>${Utils.formatDate(row["Tanggal"])}</td>
<td>${Utils.escape(row["Instalasi"])}</td>
<td>${Utils.escape(row["Nama Reagen"])}</td>
<td>${Utils.escape(row["Kode/Lot"])}</td>
<td>${Utils.formatDate(row["Expired"])}</td>
<td>${Utils.escape(row["Merk"])}</td>
<td>${Utils.escape(row["Kategori"])}</td>
<td>${Utils.escape(row["Supplier"])}</td>
<td>${Utils.escape(row["In"])}</td>
<td>${Utils.escape(row["Out"])}</td>
<td>${Utils.number(row["Balance"])}</td>
<td>${Utils.escape(row["Keterangan"])}</td>
<td>${Utils.escape(row["PIC"])}</td>
</tr>
`;

        });

        html += `
</tbody>
</table>
`;

        container.innerHTML = html;

    },

    // ===========================
    // Export PDF - HANYA berdasarkan
    // kotak search "Nama Reagen",
    // 3 filter lain diabaikan di sini.
    // Kalau teks yang diketik cocok
    // ke lebih dari 1 nama reagen
    // berbeda, semuanya ikut tercetak
    // dalam 1 kartu (karena pakai
    // substring, bukan exact match).
    // ===========================
    exportPdf() {

        const namaReagenSearch =
            (document.getElementById("scReagenFilter")?.value || "").trim();

        if (!namaReagenSearch) {

            alert(
                "Ketik Nama Reagen di kotak pencarian pertama sebelum export PDF.\n\nExport hanya berdasarkan Nama Reagen — filter Kategori/Instalasi/Supplier diabaikan."
            );

            return;

        }

        const data = this.sortByDate(

            (STATE.stockCard || []).filter(r =>
                this.matchText(r["Nama Reagen"], namaReagenSearch)
            )

        );

        const printArea =
            document.getElementById("kartuStokPrintArea");

        if (!printArea) return;

        const today = new Date().toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        let html = `
<h2>KARTU STOK REAGEN</h2>
<p><strong>Nama Reagen:</strong> ${Utils.escape(namaReagenSearch)}</p>
<p><strong>Dicetak:</strong> ${today}</p>
<table>
<thead>
<tr>
<th>Tanggal</th>
<th>Nama Reagen</th>
<th>No. LOT</th>
<th>Kategori</th>
<th>In</th>
<th>Out</th>
<th>Balance</th>
<th>Keterangan</th>
</tr>
</thead>
<tbody>
`;

        if (data.length === 0) {

            html += `
<tr><td colspan="8">Belum ada riwayat transaksi untuk reagen ini.</td></tr>
`;

        }

        else {

            data.forEach(row => {

                html += `
<tr>
<td>${Utils.formatDate(row["Tanggal"])}</td>
<td>${Utils.escape(row["Nama Reagen"])}</td>
<td>${Utils.escape(row["Kode/Lot"])}</td>
<td>${Utils.escape(row["Kategori"])}</td>
<td>${Utils.escape(row["In"])}</td>
<td>${Utils.escape(row["Out"])}</td>
<td>${Utils.number(row["Balance"])}</td>
<td>${Utils.escape(row["Keterangan"])}</td>
</tr>
`;

            });

        }

        html += `
</tbody>
</table>
`;

        printArea.innerHTML = html;

        window.print();

    }

};
