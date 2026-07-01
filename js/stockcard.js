/*
=========================================================
LIMS Lite
Stock Card Module
Form input transaksi + riwayat per reagen
=========================================================
*/

const StockCard = {

    initialized: false,

    render() {

        this.populateReagenOptions();

        this.bindEvents();

        const selected =
            document.getElementById("scReagen")?.value;

        this.renderHistory(selected);

    },

    populateReagenOptions() {

        const select = document.getElementById("scReagen");

        if (!select) return;

        if (select.dataset.populated === "true") return;

        const data = STATE.inventory || [];

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

        const select = document.getElementById("scReagen");

        select?.addEventListener("change", () => {
            this.onReagenChange();
        });

        const form = document.getElementById("stockCardForm");

        form?.addEventListener("submit", (e) => {

            e.preventDefault();

            this.submitForm();

        });

    },

    onReagenChange() {

        const kodeLot =
            document.getElementById("scReagen").value;

        const data = STATE.inventory || [];

        const item =
            data.find(i => i["Kode/Lot"] === kodeLot);

        document.getElementById("scInstalasi").value =
            item ? (item["Instalasi"] || "") : "";

        document.getElementById("scMerk").value =
            item ? (item["Merk"] || "") : "";

        document.getElementById("scSupplier").value =
            item ? (item["Supplier"] || "") : "";

        document.getElementById("scExpired").value =
            item ? Utils.formatDate(item["Exp. Date"]) : "";

        this.renderHistory(kodeLot);

    },

    renderHistory(kodeLot) {

        const container =
            document.getElementById("kartuStokContent");

        if (!container) return;

        if (!kodeLot) {

            container.innerHTML =
                "<p>Pilih reagen di atas untuk melihat riwayat kartu stoknya.</p>";

            return;

        }

        const data = (STATE.stockCard || [])

            .filter(row => row["Kode/Lot"] === kodeLot)

            .sort((a, b) => {

                const da = Utils.parseDate(a["Tanggal"]);

                const db = Utils.parseDate(b["Tanggal"]);

                if (!da || !db) return 0;

                return da - db;

            });

        if (data.length === 0) {

            container.innerHTML =
                "<p>Belum ada riwayat transaksi untuk reagen ini.</p>";

            return;

        }

        let html = `
<table>
<thead>
<tr>
<th>Tanggal</th>
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

    async submitForm() {

        const kodeLot =
            document.getElementById("scReagen").value;

        const message =
            document.getElementById("scFormMessage");

        const submitBtn =
            document.getElementById("scSubmitBtn");

        if (!kodeLot) {

            if (message) {
                message.textContent = "Pilih reagen terlebih dahulu.";
            }

            return;

        }

        const inVal =
            Number(document.getElementById("scIn").value) || 0;

        const outVal =
            Number(document.getElementById("scOut").value) || 0;

        if (inVal === 0 && outVal === 0) {

            if (message) {
                message.textContent = "Isi jumlah In atau Out.";
            }

            return;

        }

        const item =
            (STATE.inventory || [])
                .find(i => i["Kode/Lot"] === kodeLot);

        const tanggalInput =
            document.getElementById("scTanggal").value;

        const tanggal = tanggalInput
            ? this.toIndoDate(tanggalInput)
            : null;

        const payload = {

            kodeLot: kodeLot,

            namaReagen: item ? item["Nama Reagen"] : "",

            instalasi: item ? item["Instalasi"] : "",

            expired: item ? item["Exp. Date"] : "",

            merk: item ? item["Merk"] : "",

            supplier: item ? item["Supplier"] : "",

            in: inVal,

            out: outVal,

            keterangan:
                document.getElementById("scKeterangan").value || "",

            pic:
                document.getElementById("scPic").value || "",

            tanggal: tanggal

        };

        if (submitBtn) submitBtn.disabled = true;

        if (message) message.textContent = "Menyimpan...";

        try {

            const result = await postToSheet(payload);

            if (result.success) {

                if (message) {
                    message.textContent =
                        "Tersimpan. Balance terbaru: " + result.balance;
                }

                document.getElementById("scIn").value = "";

                document.getElementById("scOut").value = "";

                document.getElementById("scKeterangan").value = "";

                const fresh = await ApiService.stockCard();

                STATE.stockCard = fresh;

                this.renderHistory(kodeLot);

            }

            else {

                if (message) {
                    message.textContent = "Gagal: " + result.error;
                }

            }

        }

        catch (err) {

            if (message) {
                message.textContent =
                    "Gagal terhubung ke server: " + err.message;
            }

        }

        finally {

            if (submitBtn) submitBtn.disabled = false;

        }

    },

    // Ubah input <input type="date"> (format yyyy-mm-dd)
    // jadi format dd/MM/yyyy sesuai standar sheet
    toIndoDate(isoDate) {

        const [year, month, day] = isoDate.split("-");

        return `${day}/${month}/${year}`;

    }

};
