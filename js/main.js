// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDZQa4Ij3V160oyslzAZjgNJ2SSCAu3IOU",
    authDomain: "pikadu-c5721.firebaseapp.com",
    projectId: "pikadu-c5721",
    storageBucket: "pikadu-c5721.appspot.com",
    messagingSenderId: "459766299431",
    appId: "1:459766299431:web:d4f670131361b75c144702"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let menuToggle = document.querySelector('#menu-toggle');
let menu = document.querySelector('.sidebar');

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;
const loginElement = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const loginForget = document.querySelector('.login-forget');

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
const addPostButton = document.querySelector('.button-new_post');
const addPostForm = document.querySelector('.add-post');

const defaultPhoto = userAvatarElem.src;

const setUsers = {
    user: null,
    initUser(handler) {
        firebase.auth().onAuthStateChanged(user => {
            if (user){
               this.user = user;
            } else {
               this.user = null;
            }
            if(handler) handler();
        })
    },
    // Функция входа учётной записи
    logIn(email, password, handler){
    if(!regExpValidEmail.test(email)) {
        alert("Email не валиден");
        return;
    }
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            
        }) 
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
			if(errorCode === 'auth/wrong-password'){
				alert('Неверный пароль');
			} else if(errorCode === 'auth/user-not-found'){
				alert('Пользователь с таким email не найден');
			} else{
			   alert(errorMessage);
			}
        });
    //    const user = this.getUser(email);
    //    if(user && user.password === password){
    //        this.authorizedUser(user);
    //         if (handler){
    //         handler();
    //     }
    //    } else {
    //        alert('Пользователь с такими данными не найден!')
    //    }
    },
    // Функция выхода учётной записи
    logOut(){
        firebase.auth().signOut();
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
      firebase.auth().createUserWithEmailAndPassword(email, password)
         .then((user) => {
            this.editUser(email.split('@')[0], null, handler);
         })
         .catch((error) => {
               const errorCode = error.code;
               const errorMessage = error.message;
               if(errorCode === 'auth/weak-password'){
                  alert('Слабый пароль');
               } else if(errorCode === 'auth/email-already-in-use'){
                  alert('Пользователь с таким email уже зарегистрирован');
               } else{
                  alert(errorMessage);
               }
         });
        // if(!this.getUser(email)){
        //     const user = {email, password, displayName: email.split('@')[0]};
        //     listUsers.push(user);
        //     this.authorizedUser(user);
        //      if (handler){
        //     handler();
        // }
        // } else {
        //     alert('Пользователь с таким email уже зарегистрирован!')
        // }
    }, 
   //  // Функция получения эл. почты учётной записи
   //  getUser(email){
   //    return listUsers.find((item) => item.email === email)
   //  },
   //  // Функция авторизации учётной записи
   //  authorizedUser(user){
   //    this.user = user; 
   //  },
    // Функция редактирования учётной записи
    editUser(displayName, photoURL, handler){
      const user = firebase.auth().currentUser;
      if (displayName){
         if (photoURL){
            user.updateProfile({
               displayName,
               photoURL
            }).then(handler);
         } else{
            user.updateProfile({
               displayName
            }).then(handler);
         }
      }
    },
    sendForget(email){
        firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert('Письмо для сброса пароля отправлено!');
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            if(errorCode === 'auth/weak-password'){
                alert('Слабый пароль');
            } else if(errorCode === 'auth/email-already-in-use'){
                alert('Пользователь с таким email уже зарегистрирован');
            } else{
                alert(errorMessage);
            }
        });
    }
}; 


const setPosts = {
    allPosts: [],
    addPost(title, text, tags, handler){
        const user = firebase.auth().currentUser;
        this.allPosts.unshift({
            id: `postID${(+new Date()).toString(16)}-${user.uid}`,
            title,
            text, 
            tags: tags.split(',').map(item => item.trim()),
            author: {
                displayName: setUsers.user.displayName,
                photo: setUsers.user.photoURL
            },
            date: new Date().toLocaleString(),
            likes: 0,
            comments: 0
        });
        firebase.database().ref('post').set(this.allPosts)
            .then(() => this.getPosts(handler))
            .then()
            .catch();
    },
    getPosts(handler){
        firebase.database().ref('post').on('value', snapshot => {
            this.allPosts = snapshot.val() || [];
            handler();
        })
    }
}

// Функция-обработчик
const toggleAuthDOM = () => {
    const user = setUsers.user;
    if(user){
        loginElement.style.display = 'none';
        userElement.style.display = '';
        userNameElement.textContent = user.displayName;
        userAvatarElem.src = user.photoURL || defaultPhoto;
        addPostButton.classList.add('visible');   
    } else {
        loginElement.style.display = '';
        userElement.style.display = 'none';
        addPostButton.classList.remove('visible');
        addPostForm.classList.remove('visible');
        postsWrapper.classList.add('visible');
    }
};

const showAllPosts = () => {
    let postsHTML = '';
    setPosts.allPosts.forEach(({title, text, date, likes, comments, tags, author}) => {
        postsHTML += `
            <section class="post">
                <div class="post-body">
                    <h2 class="post-title">${title}</h2>
                    <p class="post-text">${text}</p>
                    <div class="tags">
                        ${tags.map(tag => `<a href="#${tag}" class="tag">#${tag}</a>`)}
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
                            <a href="#" class="author-username">${author.displayName}</a>
                            <span class="post-time">${date}</span>
                        </div>
                        <a href="" class="author-link"><img src=${author.photo || "images/avatar-2.jpg"} alt="avatar"
                                class="author-avatar"></a>
                    </div>
                    <!-- /.post-author -->
                </div>
                <!-- /.post-footer -->
            </section>
        `
    });
    postsWrapper.innerHTML = postsHTML;
    postsWrapper.classList.add('visible');
    addPostForm.classList.remove('visible');
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
        setUsers.logOut();
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

    menuToggle.addEventListener('click', function(event) {
        event.preventDefault();
        menu.classList.toggle('visible');
    });

    addPostButton.addEventListener('click', event =>{
        event.preventDefault();
        postsWrapper.classList.remove('visible');
        addPostForm.classList.add('visible');
        addPostButton.classList.remove('visible');
    });

    addPostForm.addEventListener('submit', event => {
        event.preventDefault();
        const {title, text, tags} = addPostForm.elements;
        if (title.value.length < 4) {
            alert('Длина заголовка должна быть от 4 символов!');
            return;
        }
        if (text.value.length < 30) {
            alert('Длина содержания должна быть от 30 символов!');
            return;
        }

        setPosts.addPost(title.value, text.value, tags.value, showAllPosts);
        addPostForm.classList.remove('visible');
        addPostForm.reset();
        addPostButton.classList.add('visible');
    });

    loginForget.addEventListener('click', event => {
        event.preventDefault();
        setUsers.sendForget(emailInput.value);
        emailInput.value = '';
    });

    setUsers.initUser(toggleAuthDOM);
    setPosts.getPosts(showAllPosts);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});