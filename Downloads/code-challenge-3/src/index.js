document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
    const filmsApiUrl = "http://localhost:3000/films";
    const buyTicketBtn = document.getElementById("buy-ticket");

    fetchFilms();

    async function fetchFilms() {
        try {
            const response = await fetch(filmsApiUrl);
            if (!response.ok) throw new Error("Failed to fetch films");
            const films = await response.json();
            renderFilmList(films);
            if (films.length) loadFilmDetails(films[0].id);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    function renderFilmList(films) {
        const filmsContainer = document.getElementById("films");
        filmsContainer.innerHTML = "";

        films.forEach(film => {
            const filmItem = createFilmItem(film);
            filmsContainer.appendChild(filmItem);
        });
    }

    function createFilmItem(film) {
        const li = document.createElement("li");
        li.className = "filmItem";
        li.textContent = film.title;
        li.dataset.id = film.id;

        const selectShowBtn = createSelectShowButton(film.id);
        li.appendChild(selectShowBtn);

        return li;
    }

    function createSelectShowButton(id) {
        const button = document.createElement("button");
        button.textContent = "Select Show";
        button.className = "ui blue button";

        button.addEventListener("click", (event) => {
            event.stopPropagation();
            loadFilmDetails(id);
        });

        return button;
    }

    async function loadFilmDetails(id) {
        try {
            const response = await fetch(`${filmsApiUrl}/${id}`);
            if (!response.ok) throw new Error("Failed to fetch film details");
            const filmData = await response.json();
            updateFilmDetails(filmData);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    function updateFilmDetails(data) {
        document.getElementById("poster").src = data.poster;
        document.getElementById("poster").alt = data.title;
        document.getElementById("title").textContent = data.title;
        document.getElementById("runtime").textContent = `${data.runtime} minutes`;
        document.getElementById("film-info").textContent = data.description;
        document.getElementById("showtime").textContent = data.showtime;

        const remainingTickets = data.capacity - data.tickets_sold;
        const ticketNum = document.getElementById("ticket-num");
        ticketNum.textContent = `${remainingTickets} `;

        updateBuyTicketButton(remainingTickets);
        setupBuyTicketHandler(data);
    }

    function updateBuyTicketButton(remainingTickets) {
        buyTicketBtn.disabled = remainingTickets <= 0;
    }

    function setupBuyTicketHandler(data) {
        buyTicketBtn.onclick = (event) => {
            event.preventDefault();
            if (data.tickets_sold < data.capacity) {
                data.tickets_sold++;
                updateFilmTickets(data.id, { tickets_sold: data.tickets_sold });
            } else {
                alert("Tickets sold out");
            }
        };
    }

    async function updateFilmTickets(id, updatedData) {
        try {
            const response = await fetch(`${filmsApiUrl}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            });
            if (!response.ok) throw new Error("Failed to update tickets");
            const updatedFilm = await response.json();
            loadFilmDetails(updatedFilm.id);
        } catch (error) {
            console.error("Update error:", error);
        }
    }
}
