//This is what makes the Nav Bar Dynamic/Work
document.querySelectorAll('button[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');

      // Hide all dashboard sections
      document.querySelectorAll('.dashboard-section').forEach(section => {
        section.style.display = 'none';
      });

      // Show selected section
      const target = document.getElementById(targetId);
      if (target) target.style.display = 'block';
    });
  });





  //Create Review Section

  let questionCount = 0; //Want to make a counter for the number of questions created 
    
  //This function adds questions to the review form/questions list.
    function addQuestion() {
      questionCount++;
      const questionId = `question-${questionCount}`;
      const container = document.getElementById('questionContainer');
    
      const html = `
        <div class="card mb-3 p-3" id="${questionId}">
          <div class="mb-2">
            <label class="form-label">Question Text</label>
            <input type="text" class="form-control" name="questionText-${questionCount}" placeholder="Enter question text" aria-label="Enter Question Text">
          </div>
          <div class="mb-2">
            <label class="form-label">Question Type</label>
            <select class="form-select" name="questionType-${questionCount}" onchange="toggleOptions(this, '${questionId}') aria-label="Select a Question Type">
              <option value="likert" aria-label="Likert Scale">Likert Scale</option>
              <option value="multiple" aria-label="Multiple Choice">Multiple Choice</option>
              <option value="short" aria-label="Short Answer">Short Answer</option>
            </select>
          </div>
          <div class="mb-2 options-area" style="display:none;"></div>
          <button type="button" class="btn btn-sm btn-danger" onclick="removeQuestion('${questionId}')" aria-label="Remove Question">Remove Question</button>
        </div>
      `;
      container.insertAdjacentHTML('beforeend', html);
    }
    
    //This function removes questions from the review form/questions list.
    function removeQuestion(id) {
      document.getElementById(id)?.remove();
    }
    

    //This gives you the option to go from a multiple choice question to a likert scale/short answer question.
    function toggleOptions(select, id) {
      const optionsArea = document.querySelector(`#${id} .options-area`);
      const type = select.value;
    
      if (type === "multiple") {
        optionsArea.innerHTML = `
          <label class="form-label mt-2" aria-label="Create your answer choices" >Answer Choices (comma-separated)</label>
          <input type="text" class="form-control" name="options-${id}" placeholder="e.g. Option 1, Option 2, ...">
        `;
        optionsArea.style.display = "block";
      } else {
        optionsArea.innerHTML = "";
        optionsArea.style.display = "none";
      }
    }
  



document.getElementById('btnCreateReview').addEventListener('click', createReview);


//Creates a review and adds it to the Current Reviews list.
 
function createReview() {
    const selectedCourse = document.getElementById('selectedCourseCreate').value.trim();
    const selectedTeam = document.getElementById('selectedTeamCreate').value.trim();
    const reviewTitle = document.getElementById('reviewTitle').value.trim();

    // Ensures all fields are filled
    if (selectedCourse && selectedTeam && reviewTitle) {
        // Create the review if they are 
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `
            ${reviewTitle} (Course: ${selectedCourse}, Team: ${selectedTeam})
            <button class="btn btn-danger btn-sm" onclick="deleteCurrentReview(this)">Delete</button>
        `;

        // Append it to the Current Reviews list
        const currentReviewsList = document.getElementById('currentReviews');
        if (currentReviewsList) {
            currentReviewsList.appendChild(li);
        } else {
            console.error('Current Reviews list not found.');
        }

        // Clear the inputs and questions
        document.getElementById('selectedCourseCreate').value = '';
        document.getElementById('selectedTeamCreate').value = '';
        document.getElementById('reviewTitle').value = '';
        document.getElementById('questionContainer').innerHTML = '';
        questionCount = 0; // Reset question count
    } else {
        alert('Please select a course, a team, and enter a review title.');
    }
}

// Selects a course from the Current Courses list.
function selectCourseForReview(courseItem) {
  const selectedCourseInput = document.getElementById('selectedCourseCreate');
  selectedCourseInput.value = courseItem.textContent.trim();
}

// Selects a team from the Current Teams list.
function selectTeamForReview(teamItem) {
  const selectedTeamInput = document.getElementById('selectedTeamCreate');
  selectedTeamInput.value = teamItem.textContent.trim();
}

/** 
 * Deletes a review from the Current Reviews list.
 * @param {HTMLElement} button 
 */

// The delete button that was clicked.
function deleteCurrentReview(button) {
  const reviewItem = button.parentElement;
  reviewItem.remove();
}






//Create Schedule Section

/**
 * Selects a course from the Current Courses list.
 * @param {HTMLElement} courseItem
 */


function selectCourseForSchedule(courseItem) {
  const selectedCourseInput = document.getElementById('selectedCourse');
  selectedCourseInput.value = courseItem.textContent; // Set the course name in the input field
}


 //Adds a review to the Scheduled Reviews list.
function addScheduledReview() {
  const selectedCourse = document.getElementById('selectedCourse').value.trim(); // Gets the selected course
  const reviewDate = document.getElementById('reviewDate').value; // Gets the review date
  const reviewTime = document.getElementById('reviewTime').value; // Gets the review time

  //We have to have all three of these to create a review
  if (selectedCourse && reviewDate && reviewTime) {
      // Creates the scheduled review
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
          ${selectedCourse} - ${reviewDate} @ ${reviewTime}
          <button class="btn btn-danger btn-sm" onclick="deleteScheduledReview(this)">Delete</button>
      `;

      // Appends the list item to the Scheduled Reviews list
      document.getElementById('scheduledReviewList').appendChild(li);

      // Clear the inputs
      document.getElementById('selectedCourse').value = '';
      document.getElementById('reviewDate').value = '';
      document.getElementById('reviewTime').value = '';
  } else {
      alert('Please select a course, enter a review date, and enter a review time.');
  }
}

/**
* Deletes a review from the Scheduled Reviews list.
* @param {HTMLElement} button 
*/
function deleteScheduledReview(button) {
  // Find the parent list item and remove it
  const reviewItem = button.parentElement;
  reviewItem.remove();
}





//Create Report Section

// Made up data for courses, teams, and students to test average calculations
const reportData = {
  "CSC3100": {
    "TheBestTeam": [
      { name: "Alice", score: 92 },
      { name: "Bob", score: 85 }
    ]
  },
  "CSC4320": {
    "TheBetterTeam": [
      { name: "Madison", score: 100 },
      { name: "Diana", score: 91 }
    ]
  }
};

let selectedCourse = "";
let selectedTeam = "";

// When you click on a course, this function will display the course average and the list of teams.
function selectReportCourse(courseItem) {
  selectedCourse = courseItem.textContent.trim();
  document.getElementById("courseAverageSection").style.display = "block";

  // This is what calculates and displays the course average
  const allScores = [];
  const teams = reportData[selectedCourse];
  for (const team in teams) {
    teams[team].forEach(student => allScores.push(student.score));
  }

  const courseAvg = (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1);
  document.getElementById("courseAvgScore").textContent = courseAvg;

  //This is what populates the team list
  const teamList = document.getElementById("reportTeamsList");
  teamList.innerHTML = "";
  for (const team in teams) {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = team;
    li.onclick = () => selectReportTeam(li);
    teamList.appendChild(li);
  }

  //This shows the team list and hides the student list and individual average
  document.getElementById("teamListSection").style.display = "block";
  document.getElementById("teamAverageSection").style.display = "none";
  document.getElementById("studentListSection").style.display = "none";
  document.getElementById("individualAverageSection").style.display = "none";
}

// When you click on a team, this function will display the team average and the list of students.
function selectReportTeam(teamItem) {
  selectedTeam = teamItem.textContent.trim();
  const students = reportData[selectedCourse][selectedTeam];

  //This calculates and displays the team average
  const scores = students.map(s => s.score);
  const teamAvg = (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  document.getElementById("teamAvgScore").textContent = teamAvg;
  document.getElementById("teamAverageSection").style.display = "block";

  //This is what populates the student list
  const studentList = document.getElementById("reportStudentsList");
  studentList.innerHTML = "";
  students.forEach(student => {
    const li = document.createElement("li");
    li.className = "list-group-item";
    li.textContent = student.name;
    li.onclick = () => selectReportStudent(student);
    studentList.appendChild(li);
  });

  document.getElementById("studentListSection").style.display = "block";
  document.getElementById("individualAverageSection").style.display = "none";
}

//When you click on a student, this function will display their score.
function selectReportStudent(student) {
  document.getElementById("individualAvgScore").textContent = student.score;
  document.getElementById("individualAverageSection").style.display = "block";
}








 //Logs out the user and returns to the login page.
 
function logOut() {
    // Hides the instructor dashboard
    document.getElementById('instructorDash').style.display = 'none';

    // Shows the login form
    const loginForm = document.getElementById('frmLogin');
    const registerForm = document.getElementById('frmRegister');
    loginForm.style.display = 'block'; 
    registerForm.style.display = 'none'; 

    // Clears session data
    sessionStorage.removeItem('userId'); // Remove the userId from sessionStorage

    // Resets the login form
    document.getElementById('txtEmailLogin').value = '';
    document.getElementById('txtPasswordLogin').value = '';

    console.log('User logged out successfully.');
}
