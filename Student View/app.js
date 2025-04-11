    function changeCards(cardId) { //Will hide all cards except the one selected.
        // Hide all cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.style.display = 'none');
    
        // Show the selected card
        document.getElementById(cardId).style.display = 'block';
    }

        document.addEventListener('DOMContentLoaded', () => { //Will automatically set it to the screen showing account details.
            changeCards('cardAccount');
        });