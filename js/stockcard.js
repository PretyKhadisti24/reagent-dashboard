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

        this.populateReagenOptions();

        this.bindEvents();

        const selected =
            document.getElementById("scReagenFilter")?.value || "";

        this.renderTable(selected);

    },

    populateReagenOptions() {

        const select = document.getElementById("scReagenFilter");

        if (!select) return;

        if (select.dataset.populated === "true") return;

        const data = STATE.stockCard || [];

        const seen = new Set();

        data.forEach(item => {

            const kodeLot = item["Kode/Lot"];

            if (!kodeLot || seen.has(kodeLot)) return;

            seen.add(kodeLot);

            const opt = document.createElement("option");

            opt.value = kodeLot;

            opt.textContent =
                `${item["Nama Reagen"]} — ${kodeLot}`;

            select.appendChild(opt);

        });

        select.dataset.populated = "true";

    },

    bindEvents() {

        if (this.initialized) return;

        this.initialized = true;

        const select = document.getElementById("scReagenFilter");

        select?.addEventListener("change", () => {

            this.renderTable(select.value);

        });

    },

    renderTable(kodeLotFilter) {

        const container =
            document.getElementById("kartuStokContent");

        if (!container) return;

        let data = STATE.stockCard || [];

        if (kodeLotFilter) {

            data = data.filter(
                row => row["Kode/Lot"] === kodeLotFilter
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
