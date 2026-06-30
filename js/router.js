/*
=========================================================
LIMS Lite v3.0
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
