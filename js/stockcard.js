/*
=========================================================
LIMS Lite
Stock Card Module (Read-only + Export PDF)
Filter: Reagen, Kategori, Instalasi, Supplier (independen,
tidak wajib diisi semua). Export PDF hanya berdasarkan
Nama Reagen, mengabaikan filter lainnya.
=========================================================
*/

const StockCard = {

    initialized: false,

    render() {

        this.populateFilterOptions();

        this.bindEvents();

        this.applyFilters();

    },

    populateFilterOptions() {

        const data = STATE.stockCard || [];

        this.populateSelect("scReagenFilter", data, "Nama Reagen");

        this.populateSelect("scKategoriFilter", data, "Kategori");

        this.populateSelect("scInstalasiFilter", data, "Instalasi");

        this.populateSelect("scSupplierFilter", data, "Supplier");

    },

    populateSelect(id, data, field) {

        const select = document.getElementById(id);

        if (!select) return;

        if (select.dataset.populated === "true") return;

        const values = [...new Set(

            data.map(item => item[field]).filter(Boolean)

        )].sort();

        values.forEach(val => {

            const opt = document.createElement("option");

            opt.value = val;

            opt.textContent = val;

            select.appendChild(opt);

        });

        select.dataset.populated = "true";

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
                "change",
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

        if (namaReagen) {
            data = data.filter(r => r["Nama Reagen"] === namaReagen);
        }

        if (kategori) {
            data = data.filter(r => r["Kategori"] === kategori);
        }

        if (instalasi) {
            data = data.filter(r => r["Instalasi"] === instalasi);
        }

        if (supplier) {
            data = data.filter(r => r["Supplier"] === supplier);
        }

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
    // Nama Reagen, filter lain
    // (Kategori/Instalasi/Supplier)
    // sengaja diabaikan di sini.
    // ===========================
    exportPdf() {

        const namaReagen =
            document.getElementById("scReagenFilter")?.value || "";

        if (!namaReagen) {

            alert(
                "Pilih Nama Reagen terlebih dahulu.\n\nExport PDF hanya berdasarkan Nama Reagen — filter Kategori/Instalasi/Supplier tidak berlaku untuk export."
            );

            return;

        }

        const data = this.sortByDate(

            (STATE.stockCard || []).filter(
                r => r["Nama Reagen"] === namaReagen
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
<p><strong>Nama Reagen:</strong> ${Utils.escape(namaReagen)}</p>
<p><strong>Dicetak:</strong> ${today}</p>
<table>
<thead>
<tr>
<th>Tanggal</th>
<th>Instalasi</th>
<th>Kode/Lot</th>
<th>Expired</th>
<th>In</th>
<th>Out</th>
<th>Balance</th>
<th>Keterangan</th>
<th>PIC</th>
</tr>
</thead>
<tbody>
`;

        if (data.length === 0) {

            html += `
<tr><td colspan="9">Belum ada riwayat transaksi untuk reagen ini.</td></tr>
`;

        }

        else {

            data.forEach(row => {

                html += `
<tr>
<td>${Utils.formatDate(row["Tanggal"])}</td>
<td>${Utils.escape(row["Instalasi"])}</td>
<td>${Utils.escape(row["Kode/Lot"])}</td>
<td>${Utils.formatDate(row["Expired"])}</td>
<td>${Utils.escape(row["In"])}</td>
<td>${Utils.escape(row["Out"])}</td>
<td>${Utils.number(row["Balance"])}</td>
<td>${Utils.escape(row["Keterangan"])}</td>
<td>${Utils.escape(row["PIC"])}</td>
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
