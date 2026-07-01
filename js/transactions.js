/*
=========================================================
LIMS Lite
Transactions Module
(Penerimaan, Distribusi, Pemusnahan)
=========================================================
*/

const Transactions = {

    renderPenerimaan() {

        this.renderGeneric(
            "penerimaanContent",
            STATE.receiving
        );

    },

    renderDistribusi() {

        this.renderGeneric(
            "distribusiContent",
            STATE.distribution
        );

    },

    renderPemusnahan() {

        this.renderGeneric(
            "pemusnahanContent",
            STATE.disposal
        );

    },

    // ===========================
    // Renderer generik
    // Kolom dibaca otomatis dari
    // header data sheet, jadi
    // tidak perlu hardcode nama
    // kolom per sheet.
    // ===========================
    renderGeneric(containerId, data) {

        const container = document.getElementById(containerId);

        if (!container) return;

        data = data || [];

        if (data.length === 0) {

            container.innerHTML =
                "<p>Belum ada data.</p>";

            return;

        }

        const columns = Object.keys(data[0]);

        let html = "<table><thead><tr>";

        columns.forEach(col => {

            html += `<th>${Utils.escape(Utils.displayColumn(col))}</th>`;

        });

        html += "</tr></thead><tbody>";

        data.forEach(row => {

            html += "<tr>";

            columns.forEach(col => {

                html += `<td>${Utils.renderCell(col, row[col])}</td>`;

            });

            html += "</tr>";

        });

        html += "</tbody></table>";

        container.innerHTML = html;

    }

};
