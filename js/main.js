let menuToggle = document.querySelector('#menu-toggle');
let menu = document.querySelector('.sidebar');

menuToggle.addEventListener('click', function(event) {
    event.preventDefault();
    menu.classList.toggle('visible');
});

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;
const loginElement = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');

const userElement = document.querySelector('.user');
const userNameElement = document.querySelector('.user-name');

const editContainer = document.querySelector('.edit-container');
const editElem = document.querySelector('.edit');
const editBtnElem = document.querySelector('.edit-btn');
const exitElem = document.querySelector('.exit');

const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');

const postsWrapper = document.querySelector('.posts');

// БД пользователей
 const listUsers = [
    {   
        id: '01',
        email: 'vitalton@gmail.com',
        password: '111',
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
    // Функция входа учётной записи
    logIn(email, password, handler){
    if(!regExpValidEmail.test(email)) {
        alert("Email не валиден");
        return;
    }
       const user = this.getUser(email);
       if(user && user.password === password){
           this.authorizedUser(user);
           handler();
       } else {
           alert('Пользователь с такими данными не найден!')
       }
    },
    // Функция выхода учётной записи
    logOut(handler){
        this.user = null; 
        handler();
    },
    // Функция регистрации учётной записи
    signUp(email, password, handler){
         if(!regExpValidEmail.test(email)) {
        alert("Email не валиден");
        return;
        }
        if(!email.trim() || !password.trim()){
            return alert('Введите данные!');
        }
        if(!this.getUser(email)){
            const user = {email, password, displayName: email.split('@')[0]};
            listUsers.push(user);
            this.authorizedUser(user);
            handler();
        } else {
            alert('Пользователь с таким email уже зарегистрирован!')
        }
    }, 
    // Функция получения эл. почты учётной записи
    getUser(email){
        return listUsers.find((item) => item.email === email)
    },
    // Функция авторизации учётной записи
    authorizedUser(user){
        this.user = user; 
    },
    // Функция редактирования учётной записи
    editUser(userName, userPhoto, handler){
        if (userName){
            this.user.displayName = userName;
        }
        if (userPhoto){
            this.user.photo = userPhoto;
        }
        handler();
    },
}; 


const setPosts = {
    allPosts: [
        {
            title: 'Релакс',
            text: 'Блогеры, которые не стесняются показать хотя бы кусочек своей яркой жизни, дают аудитории шикарный контент. Не каждый решается на такое, ведь многие волнуются о том, что подумают окружающие. Но если у вас есть читатели (даже если пока это только друзья и родственники), им будет интересно узнать о вас больше. Поделитесь своим личным опытом, переживаниями и умозаключениями. Покажите, как вы живете – возможно, кому-то уже хочется подражать вам! Зачем все это аудитории? Закономерный вопрос! Давайте подумаем вместе. Все, что вы делаете, вы делаете для своих читателей. Они — не просто ваши поклонники. Это потенциальные покупатели, которых вы УЖЕ чем-то зацепили. Теперь важно заручиться их доверием, чтобы «рыбке» было сложнее «сорваться с крючка». Чем больше читатели знают о вас, тем более близким другом вы для них становитесь. Поэтому когда вы сделаете им предложение купить, вероятнее всего, его примут без долгих раздумий. Многие увлекательные истории из своей жизни Олесь публикует в личном блоге. Они всегда яркие, неординарные и обязательно с полезностью.',
            tags: [ 'познавательно', 'новое', 'в тренде' ],
            author: 'vitalton@gmail.com',
            date: '11.11.2020, 11:45:12',
            likes: 26,
            comments: 57,
        },
        {
            title: '«Мотивашка»',
            text: 'Это очень эффективный вид контента. В нем минимум полезной информации и развлекательных приемов. Это чистой воды вдохновение. Если ваши посты дарят ощущение, что за спиной «расправляются крылья», просыпается неуемная энергия, чтобы творить и делать мир прекраснее, поздравляю – вы шикарный мотиватор! Аудитория высоко это ценит. Лучше всего такие посты подавать в форме историй, описаний жизни известных людей или просто цитатников. В такой статье не нужно обсуждать глобальные проблемы или говорить о чем-то сложном и непонятном. Умные мысли и философские размышления пока отложите в сторону. Напишите о простых вещах, которые волнуют многих, но о которых мало кто задумывается по-настоящему. Вот как статьи-мотивашки выглядят у нас.',
            tags: [ 'горячее', 'новое', 'в тренде' ],
            author: 'lelahorn@gmail.com',
            date: '10.11.2020, 10:44:02',
            likes: 100,
            comments: 85,
        }
    ]
}

// Функция-обработчик
const toggleAuthDOM = () => {
    const user = setUsers.user;
    if(user){
        loginElement.style.display = 'none';
        userElement.style.display = '';
        userNameElement.textContent = user.displayName;
        userAvatarElem.src = user.photo || userAvatarElem.src;
    } else {
        loginElement.style.display = '';
        userElement.style.display = 'none';
    }
};

const showAllPosts = () => {

    let postsHTML = '';
    setPosts.allPosts.forEach(({title, text, date, likes, comments, tags}) => {
        postsHTML += `
            <section class="post">
                <div class="post-body">
                    <h2 class="post-title">${title}</h2>
                    <p class="post-text">${text}</p>
                    <div class="tags">
                        <a href="#" class="tag">#познавательно</a>
                        <a href="#" class="tag">#новое</a>
                        <a href="#" class="tag">#в тренде</a>
                    </div>
                    <!-- /.tags -->
                </div>
                <!-- /.post-body -->
                <div class="post-footer">
                    <div class="post-buttons">
                        <button class="post-button likes">
                            <svg width="19" height="20" class="icon icon-likes">
                                <use xlink:href="images/icons.svg#likes"></use>
                            </svg>
                            <span class="likes-counter">${likes}</span>
                        </button>
                        <button class="post-button comments">
                            <svg width="21" height="21" class="icon icon-comments">
                                <use xlink:href="images/icons.svg#comments"></use>
                            </svg>
                            <span class="comments-counter">${comments}</span>
                        </button>
                        <button class="post-button save">
                            <svg width="20" height="20" class="icon icon-save">
                                <use xlink:href="images/icons.svg#save"></use>
                            </svg>
                        </button>
                        <button class="post-button share">
                            <svg width="18" height="20" class="icon icon-share">
                                <use xlink:href="images/icons.svg#share"></use>
                            </svg>
                        </button>
                    </div>
                    <!-- /.post-buttons -->
                    <div class="post-author">
                        <div class="author-about">
                            <a href="#" class="author-username">vitalton</a>
                            <span class="post-time">${date}</span>
                        </div>
                        <a href="" class="author-link"><img src="images/avatar-2.jpg" alt="avatar"
                                class="author-avatar"></a>
                    </div>
                    <!-- /.post-author -->
                </div>
                <!-- /.post-footer -->
            </section>
        `
    });
    postsWrapper.innerHTML = postsHTML;
}
 
const init = () => {
    // Вход в учётную запись
loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDOM);
    loginForm.reset();
});


// Регистрация учётной записи
loginSignup.addEventListener('click', (event) => {   
    event.preventDefault();
    setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDOM);
    loginForm.reset();
});


// Выход из учётной записи
exitElem.addEventListener('click', event => {   
    event.preventDefault();
    setUsers.logOut(toggleAuthDOM);
});


// Кнопка редактирования учётной записи
editElem.addEventListener('click', event => {   
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
});


// Редактирование учётной записи
editContainer.addEventListener('submit', event => {
    event.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDOM);
    editContainer.classList.remove('visible');
});
    showAllPosts();
    toggleAuthDOM();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});