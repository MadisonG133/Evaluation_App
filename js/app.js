document.querySelector("#btnLogin").addEventListener("click", async (e) => {
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

    let strEmailLogin = document.querySelector('#txtEmailLogin').value
    let strPasswordLogin = document.querySelector('#txtPasswordLogin').value
    strEmailLogin = strEmailLogin.toLowerCase()
    let blnError = false
    let strMessage = ""

    if(!regEmail.test(strEmailLogin)){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Please Enter a Valid Email Address</p>'
    }

    if(strPasswordLogin.length < 1){ //Keeping password check as just needs to be entered.
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Password Cannot Be Blank</p>'
    }

    if(blnError){
        Swal.fire({
        title: "Oh no, you have an error!",
        html: strMessage,
        icon: "error"
        });
        return
    }
    try{
        const userData = await loadData() //We load to check if the data is valid.
        let userFound = false
        userData.users.forEach(user => { //Iterate and see if the login info is that of a valid user.
            if (user.email === strEmailLogin && user.password === strPasswordLogin) { //No hashing yet, plan to add in backend.
                userFound = true

                sessionStorage.setItem('userId', user.id); //No JSON stringify, that will mess with the code later.
                Swal.fire({
                    title: "Successful Login",
                    icon: "success"
                });
                //The below code will tell it not to save login information.
                document.querySelector('#txtEmailLogin').value = '';
                document.querySelector('#txtPasswordLogin').value = '';
                loadStudentPage() //If successful login, begin the transition to studentView
            }
        });
    if(!userFound){ //If not a valid username.
        Swal.fire({
            title: "Login Failed",
            text: "Invalid email or password.",
            icon: "error"
        });
    }
} catch (err){
    console.error('Error loading user data:', err);
        Swal.fire({
            title: "Error",
            text: "There was an error loading user data. Please try again later.",
            icon: "error"
        });
}
})


//Below is input validation for registration
document.querySelector("#btnRegistration").addEventListener("click",(e) => {
    //Validation for Personal Information
    let strFirstName = document.querySelector("#txtFirstName").value
    let strLastName = document.querySelector("#txtLastName").value
    let strRole = document.querySelector("#txtRole").value
    //Validation for Account Information
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    let strEmail = document.querySelector("#txtEmail").value
    let strPassword = document.querySelector("#txtPassword").value
    let strConfirmPassword = document.querySelector("#txtConfirmPassword").value

    strEmail = strEmail.toLowerCase()
    let blnError = false
    let strMessage = ""

    if(strRole == "Select Role"){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Please Select a Role</p>'
    }

    if(strFirstName.length < 1){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">First name can not be blank.</p>'
    }
    if(strLastName.length < 1){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Last name can not be blank.</p>'
    }

    //Below is checking using regular expression.
    if(!regEmail.test(strEmail)){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Please Enter a Valid Email Address</p>'
    }

    if(strPassword.length < 1){ //Keeping password check as just needs to be entered.
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Password Cannot Be Blank</p>'
    }
    if(strPassword != strConfirmPassword){
        blnError = true
        strMessage += '<p class="mb-0 mt-0">Passwords Must be the Same</p>'
    }
    if (!blnError) {
        const roleFile = strRole.toLowerCase(); // "student" or "instructor"
        fetch(`components/${roleFile}Index.html`)
            .then(response => response.text())
            .then(html => {
                // Load and inject the appropriate JS
                const objScript = document.createElement('script');
                objScript.src = `js/${roleFile}.js`; // e.g., js/student.js
                objScript.type = 'text/javascript';
                document.head.appendChild(objScript);

                // Wait for the script to finish loading
                objScript.onload = () => {
                    console.log(`${roleFile}.js loaded.`);
                    
                };

                // Inject HTML content into a container
                document.querySelector('#frmRegister').innerHTML = html;
                document.querySelector('#frmRegister').style.display = 'block';
            })
            .catch(error => {
                console.error(`Error loading ${roleFile} view:`, error);
                Swal.fire("Error", `Could not load ${roleFile} view.`, "error");
            });
    } else {
        Swal.fire({
            title: "Oh no, you have an error!",
            html: strMessage,
            icon: "error"
        });
    }

    
})

// This allows for the Password toggle view functionality
document.getElementById('togglePasswordLogin').addEventListener('click', function() {
    togglePasswordVisibility('txtPasswordLogin', this);
});

document.getElementById('togglePassword').addEventListener('click', function() {
    togglePasswordVisibility('txtPassword', this);
});

document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
    togglePasswordVisibility('txtConfirmPassword', this);
});

function togglePasswordVisibility(inputId, button) {
    const passwordInput = document.getElementById(inputId);
    const icon = button.querySelector('i');
    
    //If the eye icon is clicked on, show the password in text and change the icon to an eye with a slash
    //indicating the option to hide it again.
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    //Vice Versa
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
}


//This allows for the swap between the Login and Registration form
$('#btnSwapRegistration').on('click', function(){
    $('#frmLogin').slideUp(function(){
        $('#frmRegister').slideDown()
    })
})

$('#btnSwapLogin').on('click', function(){
    $('#frmRegister').slideUp(function(){
        $('#frmLogin').slideDown()
    })
})

let data = [] //Defined outside of loadData, so we don't try to recreate the same variable.
let placeholderUserID = "" //Same thing.

        async function loadData() {
            try{
                const response = await fetch('data.json');
                data = await response.json();
                console.log(data)
                return data
            } catch (err){
                console.log("Failed to load in data.")
            }
        } 

function loadStudentPage() {
    // Fetch the studentIndex.html and insert its content into the studentContainer
    fetch('components/studentIndex.html')
        .then(response => response.text()) // Convert response to text (HTML content)
        .then(html => {
            
            document.getElementById('studentContainer').innerHTML = html;

            //Only load all of the student.js script when a student is logged in.
            loadStudentJS();
        })
        .catch(error => {
            console.error('Error loading student page:', error);
        });
}


function loadStudentJS() {
    // Dynamically load student.js script
    const script = document.createElement('script');
    script.src = 'js/student.js';  // Path to the script
    script.type = 'text/javascript';
    script.id = "studentScript"
    script.onload = () => {
        console.log('Student JS script loaded.');
        //Below functions will be a combination of the old on DOM functions and loadData functions.
        loadAccountInfo()
        loadReviews()
        changeCards('cardAccount')
    };
    script.onerror = () => {
        console.error('Error loading student JS script.');
    };
    document.body.appendChild(script); // Add the script tag to the body
}

function logOut() {
    document.querySelector('#studentContainer').innerHTML = ''; // Clear the student view
    const studentScript = document.getElementById('studentScript')
    if (studentScript){
        studentScript.remove() //Remove the dynamically added js code.
        console.log("Removed student script.")
    }
    document.getElementById('loginContainer').style.display = 'block'; // Show the login page
    //The below should "reset" the login page to when it is first loaded.
    const loginForm = document.getElementById('frmLogin');
    const registerForm = document.getElementById('frmRegister');
    loginForm.style.display = 'block'; 
    registerForm.style.display = 'none'; 

    sessionStorage.removeItem("userId"); // Remove the userId
