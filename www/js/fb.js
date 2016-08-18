var login = false;

function facebookLogin ()
{
    if (!login)
        facebookConnectPlugin.getLoginStatus(
            function (response)
            {
                if      (response.status === 'connected')        onFacebookLoginSuccess (response)
                else if (response.status === 'not_authorized')   console.log('not_authorized');
                else
                {
                    // FB permissions: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                    facebookConnectPlugin.login(['email', 'public_profile'], onFacebookLoginSuccess, onFacebookLoginError);
                }
            }
        );
    else facebookLogout();
}

function onFacebookLoginSuccess (response)
{
    if (!response.authResponse)
        return fbLoginError("Cannot find the authResponse");
    login = true;

    getFacebookProfileInfo(response.authResponse);
}

function getFacebookProfileInfo (authResponse)
{
  facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (profileInfo)
      {
          $(".user-name")[0].innerHTML = profileInfo.name;
          $(".user-email")[0].innerHTML = profileInfo.email;
          $("#facebook-sign-in")[0].innerHTML = "Log out";
          console.log({
              authResponse: authResponse,
              userID: profileInfo.id,
              name: profileInfo.name,
              email: profileInfo.email,
              picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
          });
      },
      function (fail)
      {
          console.log('Failed to get Facebook profile info', fail);
      }
  );
};

function onFacebookLoginError(error)
{
    console.log('fbLoginError', error);
};

function facebookLogout ()
{
    facebookConnectPlugin.logout(
        function()
        {
            login = false;
            $("#facebook-sign-in")[0].innerHTML = "Log in with Facebook";
            $(".user-name")[0].innerHTML = "";
            $(".user-email")[0].innerHTML = "";
        },
        function(fail){}
    );
}
