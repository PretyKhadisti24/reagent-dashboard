/*
=========================================================
LIMS Lite v3.1
Router Module
=========================================================
*/

const Router = {

    currentPage: "dashboard",

    pages: [
        "dashboard",
        "inventory",
        "alerts",
        "penerimaan",
        "distribusi",
        "pemusnahan",
        "documents"
    ],

    // Setiap tab dipetakan ke fungsi render
    // modul terkait. Dipanggil setelah tab
    // ditampilkan, supaya datanya selalu
    // fresh sesuai STATE terbaru.
    renderers: {

        dashboard: () => Dashboard.render(),

        inventory: () => Inventory.render(),

        alerts: () => Alerts.render(),

        penerimaan: () => Transactions.renderPenerimaan(),

        distribusi: () => Transactions.renderDistribusi(),

        pemusnahan: () => Transactions.renderPemusnahan(),

        documents: () => Documents.render()

    },

    show(page) {

        if (!this.pages.includes(page)) {
            console.warn("Page tidak ditemukan:", page);
            return;
        }

        // Sembunyikan semua halaman
        this.pages.forEach(name => {

            const section =
                document.getElementById(name + "Page");

            if (section) {
                section.hidden = true;
            }

        });

        // Tampilkan halaman dipilih
        const active =
            document.getElementById(page + "Page");

        if (active) {
            active.hidden = false;
        }

        // Ubah menu aktif
        document
            .querySelectorAll(".nav-btn")
            .forEach(btn => {

                btn.classList.remove("active");

                if (btn.dataset.page === page) {
                    btn.classList.add("active");
                }

            });

        // Judul halaman
        const title =
            document.getElementById("pageTitle");

        if (title) {

            const names = {
                dashboard: "Dashboard",
                inventory: "Inventory",
                alerts: "Alerts",
                penerimaan: "Penerimaan",
                distribusi: "Distribusi",
                pemusnahan: "Pemusnahan",
                documents: "COA & MSDS"
            };

            title.textContent =
                names[page] || page;

        }

        this.currentPage = page;

        // Render data modul terkait
        const renderFn = this.renderers[page];

        if (typeof renderFn === "function") {

            try {

                renderFn();

            }

            catch (err) {

                console.error(
                    "Gagal render halaman " + page,
                    err
                );

            }

        }

    },

    init() {

        document
            .querySelectorAll(".nav-btn")
            .forEach(btn => {

                btn.addEventListener("click", () => {

                    Router.show(
                        btn.dataset.page
                    );

                });

            });

    }

};

document.addEventListener(
    "DOMContentLoaded",
    () => Router.init()
);
