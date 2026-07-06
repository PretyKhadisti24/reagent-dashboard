/*
=========================================================
LIMS Lite
Stock Card Module (Read-only)
Menampilkan data Kartu Stok dari Google Sheets,
dengan filter per reagen. Input data dilakukan
langsung di Google Sheets, bukan dari dashboard.
=========================================================
*/

const StockCard = {

    initialized: false,

    render() {

    this.populateFilterOptions("scReagenFilter", "Nama Reagen");
    this.populateFilterOptions("scKategoriFilter", "Kategori");
    this.populateFilterOptions("scInstalasiFilter", "Instalasi");
    this.populateFilterOptions("scSupplierFilter", "Supplier");

    this.bindEvents();

    this.applyFilters();

},


populateFilterOptions(id, field) {

    const select = document.getElementById(id);

    if (!select) return;

    if (select.dataset.populated === "true") return;

    const data = STATE.stockCard || [];

    const seen = new Set();

    data.forEach(item => {

        const value = item[field];

        if (!value || seen.has(value)) return;

        seen.add(value);

        const option = document.createElement("option");

        option.value = value;
        option.textContent = value;

        select.appendChild(option);

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

        document.getElementById(id)?.addEventListener("change", () => {

            this.applyFilters();

        });

    });

},

    applyFilters() {

    this.renderTable({

        reagen:
            document.getElementById("scReagenFilter")?.value || "",

        kategori:
            document.getElementById("scKategoriFilter")?.value || "",

        instalasi:
            document.getElementById("scInstalasiFilter")?.value || "",

        supplier:
            document.getElementById("scSupplierFilter")?.value || ""

    });

},

    renderTable(filters = {}) {

        const container =
            document.getElementById("kartuStokContent");

        if (!container) return;

        let data = STATE.stockCard || [];

         const {
    reagen = "",
    kategori = "",
    instalasi = "",
    supplier = ""
} = filters;

if (reagen) {

    data = data.filter(row =>
        row["Nama Reagen"] === reagen
    );

}

if (kategori) {

    data = data.filter(row =>
        row["Kategori"] === kategori
    );

}

if (instalasi) {

    data = data.filter(row =>
        row["Instalasi"] === instalasi
    );

}

if (supplier) {

    data = data.filter(row =>
        row["Supplier"] === supplier
    );

}

        data = [...data].sort((a, b) => {

            const da = Utils.parseDate(a["Tanggal"]);

            const db = Utils.parseDate(b["Tanggal"]);

            if (!da || !db) return 0;

            return da - db;

        });

        if (data.length === 0) {

            container.innerHTML =
                "<p>Belum ada data kartu stok.</p>";

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

    }

};
