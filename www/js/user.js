"use strict";

function resetSignUp(){
    window.location.href = '#/signUp';
}

function logOut(){
    if(glb.AB=='A'){
        window.location.href = '#/tab/user';
    }else{
        window.location.href = '#/tab/userB';
    }
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("password");
    window.localStorage.setItem("isLogIn", false);
}
