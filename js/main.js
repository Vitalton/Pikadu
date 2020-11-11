let menuToggle = document.querySelector('#menu-toggle');
let menu = document.querySelector('.sidebar');

menuToggle.addEventListener('click', function(event) {
    event.preventDefault();
    menu.classList.toggle('visible');
});

const loginElement = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const userElement = document.querySelector('.user');
const userNameElement = document.querySelector('.user-name');

const listUsers = [
    {   
        id: '01',
        email: 'vitalton@gmail.com',
        password: 'qwerty123',
        displayName: 'vitalton'
    },
    {
        id: '02',
        email: 'lelahorn@gmail.com',
        password: 'qwerty123',
        displayName: 'lelahorn'
    }
];

const setUsers = {
    user: null,
    logIn(email, password, handler){
       const user = this.getUser(email);
       if(user && user.password === password){
           this.authorizedUser(user);
           handler();
       } else {
           alert('Пользователь с такими данными не найден!')
       }
    },
    logOut(){
        console.log('ВЫХОД')
    },
    signUp(email, password, handler){
        const user = {email, password, displayName: email.split('@')[0]};
        if(!this.getUser(email)){
            listUsers.push(user);
            this.authorizedUser(user);
            handler();
        } else {
            alert('Пользователь с таким email уже зарегистрирован!')
        }
    }, 
    getUser(email){
        return listUsers.find((item) => item.email === email)
    },
    authorizedUser(user){
        this.user = user; 
    }
}; 

const toggleAuthDOM = () => {
    const user = setUsers.user;
    if(user){
        loginElement.style.display = 'none';
        userElement.style.display = '';
        userNameElement.textContent = user.displayName;
    } else {
        loginElement.style.display = '';
        userElement.style.display = 'none';
    }
};

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDOM);
});

loginSignup.addEventListener('click', (event) => {
    event.preventDefault();
    setUsers.signUp(emailInput.value, passwordInput.value,toggleAuthDOM);
});

toggleAuthDOM();