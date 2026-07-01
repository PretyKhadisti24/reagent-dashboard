/*
=========================================================
LIMS Lite
Inventory Module
=========================================================
*/

const Inventory = {

    bound: false,

    render() {

        const data = STATE.inventory || [];

        this.populateFilterOptions(data);

        this.bindEvents();

        this.applyFilters();

    },

    populateFilterOptions(data) {

        const select = document.getElementById("filterInstalasi");

        if (!select) return;

        if (select.dataset.populated === "true") return;

        const installations = [...new Set(

            data.map(item => item["Instalasi"]).filter(Boolean)

        )].sort();

        installations.forEach(inst => {

            const opt = document.createElement("option");

            opt.value = inst;

            opt.textContent = inst;

            select.appendChild(opt);

        });

        select.dataset.populated = "true";

    },

    bindEvents() {

        if (this.bound) return;

        this.bound = true;

        const search = document.getElementById("inventorySearch");

        const filterInstalasi = document.getElementById("filterInstalasi");

        const filterStatus = document.getElementById("filterStatus");

        [search, filterInstalasi, filterStatus].forEach(el => {

            if (!el) return;

            el.addEventListener("input", () => this.applyFilters());

            el.addEventListener("change", () => this.applyFilters());

        });

    },

    applyFilters() {

        const data = STATE.inventory || [];

        const searchText =
            (document.getElementById("inventorySearch")?.value || "")
                .toLowerCase()
                .trim();

        const instFilter =
            document.getElementById("filterInstalasi")?.value || "";

        const statusFilter =
            document.getElementById("filterStatus")?.value || "";

        const filtered = data.filter(item => {

            if (instFilter && item["Instalasi"] !== instFilter) {
                return false;
            }

            if (statusFilter &&
                (item["Status"] || "").toUpperCase() !== statusFilter) {
                return false;
            }

            if (searchText) {

                const haystack = [
                    item["Nama Reagen"],
                    item["Kode/Lot"],
                    item["Supplier"]
                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();

                if (!haystack.includes(searchText)) {
                    return false;
                }

            }

            return true;

        });

        this.renderStats(filtered);

        this.renderTable(filtered);

    },

    renderStats(data) {

        let lowStock = 0;

        let expired = 0;

        let warning = 0;

        data.forEach(item => {

            const stock = Number(item["Sisa Stok"] || 0);

            const min = Number(item["Stok Min"] || 0);

            if (stock <= min) lowStock++;

            const status = Utils.expiryStatus(item["Exp. Date"]);

            if (status === "expired") expired++;

            if (status === "warning") warning++;

        });

        document.getElementById("inventoryTotal").textContent = data.length;

        document.getElementById("inventoryLowStock").textContent = lowStock;

        document.getElementById("inventoryExpired").textContent = expired;

        document.getElementById("inventoryWarning").textContent = warning;

    },

    renderTable(data) {

        const container = document.getElementById("inventoryContent");

        if (!container) return;

        if (data.length === 0) {

            container.innerHTML =
                "<p>Tidak ada data yang cocok.</p>";

            return;

        }

        let html = `
<table>
<thead>
<tr>
<th>Nama Reagen</th>
<th>Kode/Lot</th>
<th>Instalasi</th>
<th>Sisa Stok</th>
<th>Exp. Date</th>
<th>Status</th>
</tr>
</thead>
<tbody>
`;

        data.forEach(item => {

            html += `
<tr>
<td>${Utils.escape(item["Nama Reagen"])}</td>
<td>${Utils.escape(item["Kode/Lot"])}</td>
<td>${Utils.escape(item["Instalasi"])}</td>
<td>${Utils.number(item["Sisa Stok"])}</td>
<td>${Utils.formatDate(item["Exp. Date"])} ${Utils.expiryBadge(item["Exp. Date"])}</td>
<td>${Utils.statusBadge(item["Status"])}</td>
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
