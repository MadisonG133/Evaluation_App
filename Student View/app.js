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
                loadReviews()
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

        function loadReviews(){
            const user = data.users.find(u => u.id === placeholderUserID) //Same code to validate if the account is real.
            if(!user) return  //Once backend is added, might not even be used here.

            const completedReviews = [] //Array for completed reviews.
            const pendingReviews = [] //Array for pending reviews.

            data.reviews.forEach(review => {
                if(review.is_public === false){ //Check if it is public.
                    return
                }
                //Below code will make it so user don't see reviews for courses they are not enrolled in.
                const userEnrolled = data.enrolled.some(e => e.course_id === review.course_id && e.student_id === user.id) 
                if(!userEnrolled){ 
                    return
                }
                //If there is a matching entry in completed_review
                const statusComplete = data.completed_review.find(c => c.review_id === review.id)
                if(statusComplete){ //Add to completedReviews array if found.
                    completedReviews.push(review)
                }else { //If not, add to pending.
                    pendingReviews.push(review)
                }
            })

            displayReviewsStatus(completedReviews, 'completedReviewList', true); 
            displayReviewsStatus(pendingReviews, 'pendingReviewList', false);
        }

        function displayReviewsStatus(reviews, listId, completed){ //Function to load data into the correct list.
            const reviewList = document.getElementById(listId) //Should get the correct card.
            reviewList.innerHTML = ''

            if (reviews.length === 0){ //Create this element if blank.
                const list = document.createElement("li");
                list.classList.add("list-group-item");
                list.textContent = "No reviews available.";
                reviewList.appendChild(list);
            } else {
                reviews.forEach(review =>{
                    const list = document.createElement("li");
                    list.classList.add("list-group-item");
                    if(completed){ //Don't need to display due date if completed.
                        list.textContent = `${review.title}`;
                    } else{
                        list.textContent = `${review.title} (Due: ${review.due_at})`;
                    }
                    reviewList.appendChild(list);
                })
            }
        }

        //Displays pending regardless of account.