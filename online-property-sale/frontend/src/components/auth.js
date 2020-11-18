export function isLoggedIn() {
    // get the login status
    return localStorage.getItem("success") === "signin successfully";
}

export function deleteTokens() {
    // delete the login status
    localStorage.removeItem("success");
    localStorage.removeItem("firstname");
    localStorage.removeItem("lastname");
    localStorage.removeItem("emailaddr");
    localStorage.removeItem('birthyear');
    localStorage.removeItem('birthmonth');
    localStorage.removeItem('birthday');
    localStorage.removeItem("phone");
    localStorage.removeItem('expdate');
    localStorage.removeItem('card');
    localStorage.removeItem('csv');
    localStorage.removeItem('endtime');
}
