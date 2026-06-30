/*
=========================================================
LIMS Lite
Dashboard Module
Version 2.1.0
=========================================================
*/

const Dashboard = {

    render() {

        const data = STATE.inventory || [];

        this.renderStats(data);

        this.renderInstallationSummary(data);

    },

    renderStats(data) {

        const today = new Date();

        let total = data.length;

        let active = 0;

        let expired = 0;

        let warning = 0;

        let lowStock = 0;

        data.forEach(item => {

            // Status
            if ((item["Status"] || "").toUpperCase() === "AKTIF") {
                active++;
            }

            // Stok Minimum
            const stock =
                Number(item["Sisa Stok"] || 0);

            const min =
                Number(item["Stok Min"] || 0);

            if (stock <= min) {
                lowStock++;
            }

            // Expired
            if (item["Exp. Date"]) {

                const exp =
                    new Date(item["Exp. Date"]);

                const diff =
                    Math.ceil(
                        (exp - today) /
                        (1000 * 60 * 60 * 24)
                    );

                if (diff < 0) {

                    expired++;

                }

                else if (diff <= 30) {

                    warning++;

                }

            }

        });

        document.getElementById("totalItems").textContent = total;

        document.getElementById("activeItems").textContent = active;

        document.getElementById("expiredItems").textContent = expired;

        document.getElementById("warningItems").textContent = warning;

        document.getElementById("lowStockItems").textContent = lowStock;

    },

    renderInstallationSummary(data) {

        const container =
            document.getElementById(
                "installationSummary"
            );

        if (!container) return;

        const groups = {};

        data.forEach(item => {

            const inst =
                item["Instalasi"] || "Lainnya";

            if (!groups[inst]) {

                groups[inst] = 0;

            }

            groups[inst]++;

        });

        let html = `
<table>

<thead>

<tr>

<th>Instalasi</th>

<th>Total Reagen</th>

</tr>

</thead>

<tbody>
`;

        Object.keys(groups)

            .sort()

            .forEach(inst => {

                html += `

<tr>

<td>${inst}</td>

<td>${groups[inst]}</td>

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
