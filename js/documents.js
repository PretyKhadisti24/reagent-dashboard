/*
=========================================================
LIMS Lite
Documents Module
(COA & MSDS)
=========================================================
*/

const Documents = {

    render() {

        const data = STATE.documents || [];

        const container = document.getElementById("documentsContent");

        if (!container) return;

        if (data.length === 0) {

            container.innerHTML =
                "<p>Belum ada dokumen.</p>";

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
