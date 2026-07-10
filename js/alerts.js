/*
=========================================================
LIMS Lite
Alerts Module
=========================================================
*/

const Alerts = {

    chartInstance: null,

    render() {

        const data = STATE.inventory || [];

        this.renderChart(data);

        const container = document.getElementById("alertsContent");

        if (!container) return;

        const expired = [];

        const warning = [];

        const lowStock = [];

        data.forEach(item => {

            const status = Utils.expiryStatus(item["Exp. Date"]);

            if (status === "expired") expired.push(item);

            if (status === "warning") warning.push(item);

            const stock = Number(item["Sisa Stok"] || 0);

            const min = Number(item["Stok Min"] || 0);

            if (stock <= min) lowStock.push(item);

        });

        let html = "";

        html += this.renderGroup(
            "🔴 Expired",
            expired,
            "Tidak ada reagen expired."
        );

        html += this.renderGroup(
            "🟡 Near Expired (≤ 30 hari)",
            warning,
            "Tidak ada reagen mendekati expired."
        );

        html += this.renderGroup(
            "📉 Stok Rendah",
            lowStock,
            "Tidak ada reagen dengan stok rendah.",
            true
        );

        container.innerHTML = html;

    },

    renderChart(data) {

        const canvas = document.getElementById("alertsChart");

        if (!canvas || typeof Chart === "undefined") return;

        const grouped = {};

        data.forEach(item => {

            const inst = item["Instalasi"] || "Lainnya";

            if (!grouped[inst]) {

                grouped[inst] = { expired: 0, warning: 0, lowStock: 0 };

            }

            const status = Utils.expiryStatus(item["Exp. Date"]);

            if (status === "expired") grouped[inst].expired++;

            if (status === "warning") grouped[inst].warning++;

            const stock = Number(item["Sisa Stok"] || 0);

            const min = Number(item["Stok Min"] || 0);

            if (stock <= min) grouped[inst].lowStock++;

        });

        const labels = Object.keys(grouped).sort();

        const expiredData = labels.map(l => grouped[l].expired);

        const warningData = labels.map(l => grouped[l].warning);

        const lowStockData = labels.map(l => grouped[l].lowStock);

        if (this.chartInstance) {

            this.chartInstance.destroy();

        }

        this.chartInstance = new Chart(canvas, {

            type: "bar",

            data: {

                labels: labels,

                datasets: [
                    {
                        label: "Expired",
                        data: expiredData,
                        backgroundColor: "#e08a8a"
                    },
                    {
                        label: "Near Expired",
                        data: warningData,
                        backgroundColor: "#f0c674"
                    },
                    {
                        label: "Stok Rendah",
                        data: lowStockData,
                        backgroundColor: "#b8698c"
                    }
                ]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {
                    legend: { position: "bottom" }
                },

                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }

            }

        });

    },

    renderGroup(title, items, emptyText, isStock = false) {

        let html = `<h3>${title} (${items.length})</h3>`;

        if (items.length === 0) {

            html += `<p>${emptyText}</p>`;

            return html;

        }

        html += `
<table>
<thead>
<tr>
<th>Nama Reagen</th>
<th>Kode/Lot</th>
<th>Instalasi</th>
${isStock
    ? "<th>Sisa Stok</th><th>Stok Min</th>"
    : "<th>Exp. Date</th>"}
</tr>
</thead>
<tbody>
`;

        items.forEach(item => {

            html += `
<tr>
<td>${Utils.escape(item["Nama Reagen"])}</td>
<td>${Utils.escape(item["Kode/Lot"])}</td>
<td>${Utils.escape(item["Instalasi"])}</td>
${isStock
    ? `<td>${Utils.number(item["Sisa Stok"])}</td><td>${Utils.number(item["Stok Min"])}</td>`
    : `<td>${Utils.formatDate(item["Exp. Date"])}</td>`}
</tr>
`;

        });

        html += `
</tbody>
</table>
`;

        return html;

    }

};
