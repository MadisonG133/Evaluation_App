    function changeCards(cardId) { //Will hide all cards except the one selected.
        // Hide all cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => card.style.display = 'none');
    
        // Show the selected card
        document.getElementById(cardId).style.display = 'block';
    }

        document.addEventListener('DOMContentLoaded', () => { //Will automatically set it to the screen showing account details.
            loadData();
            changeCards('cardAccount');
        });

        let data = []

        async function loadData() {
            try{
                const response = await fetch('data.json');
                data = await response.json();

                loadAccountInfo()
                // loadPendingReviews()
                // loadCompletedReviews()
            } catch (err){
                console.log("Failed to load in data.")
            }
        } 

        placeholderUserID = "u1"

        function loadAccountInfo(){
            const user = data.users.find(u => u.id === placeholderUserID) //Find out if the account is in the database.
            if(!user) return //Should not be triggered, but idea of not a registered account to translate to backend.

            const card = document.getElementById("cardAccount")// Will add the name of the user at the top of the page.
            document.getElementById("accountName").textContent = `${user.first_name} ${user.last_name}` 

            const contactList = document.getElementById("contactList")
            contactList.innerHTML = '' //Clear the list in case of any uncessary data, mostly preparing for later.

            const contacts = data.contact_info.filter(c => c.user_id === placeholderUserID)// Will search for contacts associated with the user.
            
            if (contacts.length === 0) { //Will display a message if the user has no contacts.
                const li = document.createElement("li");
                li.classList.add("list-group-item");
                li.textContent = "No contact information available.";
                contactList.appendChild(li);
            } else {
                contacts.forEach(contact => {
                    const li = document.createElement("li");
                    li.classList.add("list-group-item");
                    li.textContent = `${contact.name}: ${contact.username}`;
                    contactList.appendChild(li);
                })
        }
        }

