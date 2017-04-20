var $auth = (function ($, ractive) {
  var me = {};
  var _server = 'https://api.srp.digital';
  var _loginCallbacks = $.Callbacks();

  function _getServer() {
    return _server;
  }

  function _hideLogin() {
    $('#loginSect').slideUp();
  }

  function _login() {
    console.info('login');
    if (!document.forms['loginForm'].checkValidity()) {
      ractive.showMessage('Please provide both username and password');
      return false;
    }
    $('#username').val($('#username').val().toLowerCase());
    //localStorage['username'] = $('#username').val();
    //localStorage['password'] = $('#password').val();
    //document.forms['loginForm'].submit();
    $.ajax({
      url: document.forms['loginForm'].action,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ username: $('#username').val(), password: $('#password').val() }),
      success: function(data) {
        localStorage['token'] = data.token;
        localStorage['refreshToken'] = data.refreshToken;
        _loginCallbacks.fire();
        _hideLogin();
      }
    });
  }

  function _logout() {
    delete localStorage['username'];
    delete localStorage['password'];
    document.cookie = this.CSRF_COOKIE+'=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    // IE returns collection; Chrome and others the first
    if (document.forms['logoutForm']==undefined) document.location.href == _getServer()+'/login';
    else if (document.forms['logoutForm'].length>1) document.forms['logoutForm'][0].submit();
    else document.forms['logoutForm'].submit();
  }

  function _refreshToken(settings) {
    console.info('refreshToken');
    localStorage.removeItem('token');
    $.ajax({
      dataType: "json",
      url: _getServer()+'/auth/token',
      crossDomain: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Authorization": "Bearer "+localStorage['refreshToken'],
        "Cache-Control": "no-cache"
      },
      success: function( data ) {
        ractive.set('saveObserver', false);
        localStorage['token'] = data.token;
        // update token and retry
        console.log('retrying: '+settings.url);
        if (settings['headers']!=undefined) {
          settings.headers['X-Authorization'] = 'Bearer '+data.token;
        } else {
          settings.headers = {'X-Authorization': 'Bearer '+data.token};
        }
        $.ajax(settings);
        _hideLogin();
        ractive.set('saveObserver', true);
      },
      error: function() {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        _showLogin();
      }
    });
  }

  function _showLogin() {
    console.info('showLogin');
    $('#loginSect').slideDown();
  }

  // add token headers to all requests
  $.ajaxSetup({
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      "X-Authorization": "Bearer "+localStorage['token'],
      "Cache-Control": "no-cache"
    }
  });

  // register authentication handling
  $( document ).ajaxError(function( event, request, settings ) {
    switch (request.status) {
    case 0:
      // server unavailable, retry
      if (settings['retryIn']==undefined) settings.retryIn = 4000;
      else settings.retryIn = settings.retryIn * 2;
      var msg = 'Unable to connect, retrying in '+(settings.retryIn/1000)+' secs ...';
      ractive.showDisconnected(msg);
      setTimeout(function() {
        $.ajax(settings);
      }, settings.retryIn);
      break;
    case 200:
      break;
    case 400:
      var msg = request.responseJSON == null ? textStatus+': '+errorThrown : errorThrown+': '+request.responseJSON.message;
      ractive.showError(msg);
      break;
    case 401:
    case 403:
    case 405: /* Could also be a bug but in production we'll assume a timeout */
      if (settings.url.indexOf('token')==-1 && localStorage['refreshToken']!=undefined) {
        _refreshToken(settings);
      } else {
        _showLogin();
      }
      break;
    case 404:
      var path ='';
      if (request.responseJSON != undefined) {
        path = " '"+request.responseJSON.path+"'";
      }
      var msg = "That's odd, we can't find the page"+path+". Please let us know about this message";
      console.error('msg:'+msg);
      ractive.showError(msg);
      break;
    default:
      var msg = "Bother! Something has gone wrong (code "+request.status+"): "+textStatus+':'+errorThrown;
      console.error('msg:'+msg);
      $( "#ajax-loader" ).hide();
      ractive.showError(msg);
    }

    // register login handler
    // TODO ensure just added once
    $('#login').off('click').click(_login);

  });

  me.addLoginCallback = function(callback) {
    console.info('addLoginCallback');

    _loginCallbacks.add(callback);
  }

  me.getClaim = function(claim) {
    if (localStorage['token']==undefined) return _showLogin();
    return JSON.parse(atob(localStorage['token'].split('.')[1]))[claim];
  }

  return me;
}($, ractive));
