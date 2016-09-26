"use strict";
function logOut(){
    if(glb.AB=='A'){
        window.location.href = '#/tab/user';
    }else{
        window.location.href = '#/tab/userB';
    }
    window.localStorage.setItem("userid",'N/A');
    window.localStorage.setItem("username",'N/A');
    window.localStorage.setItem("email",'N/A');
    window.localStorage.setItem("record",'N/A');
    window.localStorage.setItem("isLogIn", false);
}
