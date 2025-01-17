document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.querySelector('.login-button');
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
        loginButton.textContent = currentUser;
        loginButton.href = '#';
        loginButton.classList.add('username-display');
        
        loginButton.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    }
});
