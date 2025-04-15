    function changeCards(cardId) { //Will hide all cards except the one selected.
        // Hide all cards
        const cards = document.querySelectorAll('.card')
        cards.forEach(card => card.style.display = 'none')
    
        // Show the selected card
        document.getElementById(cardId).style.display = 'block'
    }


        placeholderUserID = sessionStorage.getItem("userId")
        

        function loadAccountInfo(){
            const user = data.users.find(u => u.id === placeholderUserID) //Find out if the account is in the database.
            if(!user) return //Should not be triggered, but idea of not a registered account to translate to backend.

            document.getElementById("accountName").textContent = `${user.first_name} ${user.last_name}` 
            const contactList = document.getElementById("contactList")
            contactList.innerHTML = '' //Clear the list in case of any uncessary data, mostly preparing for later.

            const contacts = data.contact_info.filter(c => c.user_id === placeholderUserID)// Will search for contacts associated with the user.
            
            if (contacts.length === 0) { //Will display a message if the user has no contacts.
                const list = document.createElement("li")
                list.classList.add("list-group-item")
                list.textContent = "No contact information available."
                contactList.appendChild(list)
            } else {
                contacts.forEach(contact => {
                    const list = document.createElement("li")
                    list.classList.add("list-group-item")
                    list.textContent = `${contact.name}: ${contact.username}`
                    contactList.appendChild(list)
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

            displayReviewsStatus(completedReviews, 'completedReviewList', true)
            displayReviewsStatus(pendingReviews, 'pendingReviewList', false)
        }

        function displayReviewsStatus(reviews, listId, completed){ //Function to load data into the correct list.
            const reviewList = document.getElementById(listId) //Should get the correct card.
            reviewList.innerHTML = ''

            if (reviews.length === 0){ //Create this element if blank.
                const list = document.createElement("li")
                list.classList.add("list-group-item")
                list.textContent = "No reviews available."
                reviewList.appendChild(list)
            } else {
                reviews.forEach(review =>{
                    const list = document.createElement("li")
                    list.classList.add("list-group-item")
                    list.innerHTML = `<button class="btn btn-link p-0" onclick="showReviewDetails('${review.id}', ${completed})"> ${review.title}${completed ? '' : ` (Due: ${review.due_at})`} </button>`
                    //Above code will create a button that looks like a link for all of the reviews, and if they are pending, then it will have the due date, but will exclude it is already completed.
                    reviewList.appendChild(list)
                })
            }
        }

        function showReviewDetails(reviewId, completed){
            const review = data.reviews.find(r => r.id === reviewId) //Same validation as with most of these.
            if(!review){
                return
            }

            const detailCard = document.getElementById("cardReviewDetails")
            const titleDisplay = document.getElementById("reviewDetailTitle")
            const courseDisplay = document.getElementById("reviewDetailCourse")
            const gradeDisplay = document.getElementById("reviewDetailGrade")
            const listDisplay = document.getElementById("reviewDetailsList")

            titleDisplay.textContent = review.title
            const course = data.courses.find(c => c.id === review.course_id)
            if(!course || !course.name || course.name.trim() === ""){ 
                courseDisplay.textContent = "No Course Name Provided"
            } else{
                courseDisplay.textContent = course.name
            }
            gradeDisplay.textContent = ""
            listDisplay.innerHTML = ""

            if(completed){
                //Data validation, will need to be more complex for backend, but this is just a placeholder until backen actual checks the login system.
                const responses = data.review_responses.filter(r => r.review_id === review.id && r.student_id === placeholderUserID)
                const reviewGrade = data.grades.find(g => g.student_id === placeholderUserID && g.review_id === review.id)
                gradeDisplay.textContent = `Grade: ${reviewGrade.grade}`

                if(responses.length === 0){
                    const list = document.createElement("li")
                    list.classList.add("list-group-item")
                    list.textContent = "No responses available."
                    listDisplay.appendChild(list)
                } else{
                responses.forEach(response => {
                    //Below will match the specific review_response to the right question.
                    const question = data.review_questions.find(q => q.id === response.question_id)
                    const feedback = data.review_feedback.find(f => f.question_id === question.id)
                    const list = document.createElement("li")
                    list.classList.add("list-group-item")
                    //The below line of code greatly bothers me, but it is fine.
                    list.innerHTML = `<strong>${question.question}</strong><br> "You answered: "${response.response}<br>"Feedback: " ${feedback.feedback}`
                    listDisplay.appendChild(list)
                    })
                }
            } else { //If review is pending.
                const questions = data.review_questions.filter(q => q.review_id === reviewId)
                if(questions.length === 0){
                    const list = document.createElement("li")
                    list.classList.add("list-group-item")
                    list.textContent = "No questions available."
                    listDisplay.appendChild(list)
                } else{
                    questions.forEach(question => {
                    //Below will match the specific review_response to the right question.
                    const list = document.createElement("li")
                    list.classList.add("list-group-item")
                    list.innerHTML = question.question
                    const input = document.createElement("textarea")
                    input.classList.add("form-control", "mt-2")
                    input.placeholder = "Your response would go here, but this is just a mockup, so no user input or submissions are allowed."
                    input.disabled = true 
        
                    
                    list.appendChild(input)
                    listDisplay.appendChild(list)
                    })
                }
            }
            detailCard.style.display = 'block'
        }
        closeDetailsButton.addEventListener('click', () => {
            document.getElementById('cardReviewDetails').style.display = 'none';
        })