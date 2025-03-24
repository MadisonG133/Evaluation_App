document.querySelector("#btnLogin").addEventListener("click",(e) => {
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
    }
    else{
        Swal.fire({
        title: "Successful Login",
        icon: "success"
        });
    }

})


//Below is input validation for registration
document.querySelector("#btnRegistration").addEventListener("click",(e) => {
    //Validation for Personal Information
    let strFirstName = document.querySelector("#txtFirstName").value
    let strLastName = document.querySelector("#txtLastName").value
    //Validation for Account Information
    const regEmail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    let strEmail = document.querySelector("#txtEmail").value
    let strPassword = document.querySelector("#txtPassword").value
    let strConfirmPassword = document.querySelector("#txtConfirmPassword").value

    strEmail = strEmail.toLowerCase()
    let blnError = false
    let strMessage = ""

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
    if(blnError){
        Swal.fire({
        title: "Oh no, you have an error!",
        html: strMessage,
        icon: "error"
        });
    }
    else{
        Swal.fire({
        title: "Successful Registration",
        icon: "success"
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
