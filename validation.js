// Boton de Login
const loginBtn = document.querySelector(".login-btn")

// Boton de registro
const registerBtn = document.querySelector(".register-btn")

// Contenedor del form del login
const loginContainer = document.querySelector("#form-login")

// Contenedor del form del registro
const registerContainer = document.querySelector("#form-register")


// Si Login contiene la clase active, aplicar la clase hidden al contenedor de registro
// Ahora Si RegisterBtn tiene la clase active, remover la clase hidden del registro y aplicarsela a el contenedor de login

const toggleRegister = () => {
    registerBtn.classList.toggle("active-btn");
    if(loginBtn.classList.contains("active-btn")){
        loginBtn.classList.remove("active-btn");
        loginContainer.classList.add("hidden");
        registerContainer.classList.remove("hidden")
        return;
    }
}

const toggleLogin = () => {
    loginBtn.classList.toggle("active-btn");
    if(registerBtn.classList.contains("active-btn")){
        registerBtn.classList.remove("active-btn");
        registerContainer.classList.add("hidden");
        loginContainer.classList.remove("hidden")
        return;
    }
}

const init = () =>{
    registerBtn.addEventListener("click", toggleRegister);
    loginBtn.addEventListener("click", toggleLogin);
}

// Validacion de formularios

// form de registro
const form  = document.querySelector("#form-register")

//Input de username

const nameInput   = document.querySelector("#username")

// Input de email

const emailInput  = document.querySelector("#email-register")

// Input de password

const passInput  = document.querySelector("#password-register")

// Input de telefono 

const phoneInput  = document.querySelector("#phone")


//Check User
const checkUsername = () => {
	let valid = false;
	const min = 3;
	const max = 25;
	const username = nameInput.value.trim();
	if (isEmpty(username)) {
		showError(nameInput, "El nombre es obligatorio");
	} else if (!isBetween(username.length, min, max)) {
		showError(
			nameInput,
			`El nombre debe tener entre ${min} y ${max} caracteres`
		);
	} else {
		showSuccess(nameInput);
		valid = true;
	}
	return valid;
};

// Checkeamos el email
const checkMail = () => {
	let valid = false;
	const emailValue = emailInput.value.trim();
	if (isEmpty(emailInput)) {
		showError(emailInput, "El mail es obligatorio");
	} else if (!isEmailValid(emailValue)) {
		showError(emailInput, "El mail no es válido");
	} else {
		showSuccess(emailInput);
		valid = true;
	}
	return valid;
};

// Checkeamos la contraseña
const checkPassword = () => {
	let valid = false;
	const password = passInput.value.trim();
	if (isEmpty(password)) {
		showError(passInput, "La contraseña es obligatoria");
	} else if (!isPassSecure(password)) {
		showError(
			passInput,
			"La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula y un simbolo"
		);
	} else {
		showSuccess(passInput);
		valid = true;
	}
	return valid;
};

// Checkeamos el telefono
const checkPhone = () => {
	let valid = false;
	const phoneValue = phoneInput.value.trim();
	if (!isPhoneValid(phoneValue)) {
		showError(phoneInput, "El telefono no es válido");
	} else {
		showSuccess(phoneInput);
		valid = true;
	}
	return valid;
};

const isEmpty = (value) => value === "";

// Funcion para verificar  min y max
const isBetween = (length, min, max) => {
	return length < min || length > max ? false : true;
};



// Email valido
const isEmailValid = (email) => {
	const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
	return re.test(email);
};

// Checkeamos si las pass es segura
const isPassSecure = (pass) => {
	const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,}$/;
	return re.test(pass);
};

// Checkeamos si el telefono ingresado es valido 
const isPhoneValid = (phone) => {
	const re = /^[0-9]{10}$/;
	return re.test(phone);
};

// Funcion para mostrar error
const showError = (input, message) => {
	const formField = input.parentElement;
	formField.classList.remove("success");
	formField.classList.add("error");
	const error = formField.querySelector("small");
	error.textContent = message;
};

// Funcion para mostrar exito
const showSuccess = (input) => {
	const formField = input.parentElement;
	formField.classList.remove("error");
	formField.classList.add("success");
	const error = formField.querySelector("small");
	error.textContent = "";
};


const debounce = (fn, delay = 500) => {
	let timeoutId;

	return (...args) => {
		// Cancelamos el timer anterior
		if (timeoutId) clearTimeout(timeoutId);

		// Seteamos un nuevo timer
		timeoutId = setTimeout(() => {
			fn.apply(null, args);
		}, delay);
	};
};

// Event Listener para enviar y checkear que todo sea valido.
form.addEventListener("submit", (e) => {
	e.preventDefault();

	let isUsernameValid = checkUsername();
	let isEmailValid = checkMail();
	let isPasswordValid = checkPassword();
	let isPhoneValid = checkPhone();

	let isFormValid =
		isUsernameValid && isEmailValid && isPasswordValid && isPhoneValid;
	if (isFormValid) {
		console.log("Enviamos el formulario");
		form.submit();
	}
});


form.addEventListener(
	"input",
	debounce((e) => {
		switch (e.target.id) {
			case "username":
				checkUsername();
				break;
			case "email":
				checkMail();
				break;
			case "password":
				checkPassword();
				break;
			case "phone":
				checkPhone();
				break;
		}
	})
);