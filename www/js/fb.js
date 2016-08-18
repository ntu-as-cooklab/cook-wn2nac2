function facebookLogin ()
{
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
}

function onFacebookLoginSuccess (response)
{
    if (!response.authResponse)
        return fbLoginError("Cannot find the authResponse");

    getFacebookProfileInfo(response.authResponse);
}

function getFacebookProfileInfo (authResponse)
{
  facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (profileInfo)
      {
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
          console.log('profile info fail', fail);
      }
  );
};

function onFacebookLoginError(error)
{
    console.log('fbLoginError', error);
};

function facebookLogout ()
{
    facebookConnectPlugin.logout(function(){}, function(fail){});
}
