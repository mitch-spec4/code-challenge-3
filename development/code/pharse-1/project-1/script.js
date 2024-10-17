
document.getElementById("searchButton").onclick = function() {
    const searchInput = document.getElementById("searchInput");

    //for removing the display of the search bar
    if (searchInput.style.display === "none" || searchInput.style.display === "") {
        searchInput.style.display = "inline"; // forshowing the search bar
        searchInput.focus(); 
    } else {
        searchInput.style.display = "none"; 
    }
};


document.getElementById("aboutButton").onclick = function() {
    const aboutText = document.getElementById("aboutText");

  
    if (aboutText.style.display === "none" || aboutText.style.display === "") {
        aboutText.style.display = "inline"; // for showing the about text
    } else {
        aboutText.style.display = "none"; //to  hide the about text
    }
};
document.getElementById("locationButton").onclick = function (){
    const locationSearch= document.getElementById("locationSearch");
    if (locationSearch.style.display === "none" || locationSearch.style.display === "") {
        locationSearch.style.display = "inline"; // for showing the about text
        locationSearch.focus();
    } else {
        locationSearch.style.display = "none"; //to  hide the about text
    }
};

    let ticketsRemaining = 10;

    document.getElementById('buy ticket').addEventListener('click', function() {
        if (ticketsRemaining > 0) {
            ticketsRemaining--;
            document.getElementById('ticketcount').innerText = 'Tickets remaining: ' + ticketsRemaining;
            alert('To confirm ticket purchase press ok');
            alert(`Ticket purchased succesfully`)
        } else {
            alert('Sorry, tickets are depleted.');
        }
    });
    let tokens = 0;

    document.getElementById('buy-tokens').addEventListener('click', function() {
        const menu = document.getElementById('token-menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });

    document.getElementById('confirm-buy').addEventListener('click', function() {
        tokens += 10; 
        document.getElementById('tokencount').innerText = 'Tokens: ' + tokens;
        alert('You have purchased 10 tokens!');
        document.getElementById('token-menu').style.display = 'none'; 
    });

    document.getElementById('close-menu').addEventListener('click', function() {
        document.getElementById('token-menu').style.display = 'none'; 
    });

    document.getElementById('toggle-mode').addEventListener('click', function() {
        const body = document.body;
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');

        const icon = body.classList.contains('dark-mode') ? 'fa-sun' : 'fa-moon';
        document.getElementById('toggle-mode').innerHTML = `<i class="fa ${icon}"></i>`;
    });

    

