// Console-polyfill. MIT license.
// https://github.com/paulmillr/console-polyfill
// Make it safe to do console.log() always.
(function(con) {
  'use strict';
  var prop, method;
  var empty = {};
  var dummy = function() {};
  var properties = 'memory'.split(',');
  var methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
  'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
  'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(',');
  while (prop = properties.pop()) con[prop] = con[prop] || empty;
  while (method = methods.pop()) con[method] = con[method] || dummy;
})(this.console = this.console || {}); // Using `this` for web workers.

/*
 * Copyright 2013-17 Tim Stephenson. All rights reserved.
 */
var $p = (function (jQuery) {
  EASING_DURATION = 1000;
  TAB = 9;
  ENTER = 13;
  REQUIRED = '<span class="mandatory">*</span>';
  useReadyHandlers = true;
  fadeOutMessages = true;

  function validateRadio() {
    jQuery('[type="radio"]:invalid').parent().parent().find('.field-hint').removeClass('hidden').css('color','red');
  }

  this.enhanceForms=true;
  this.server = '';
  this.init = function() {
    $p.l10n = new I18nController();
    _initDomainModel();
  };
  this.deferredInit = function(func) {
    console.log('deferredInit adds '+func);
    $p.onInitCallbacks.add( func );
  };
  this.ensureInited = function(d) {
    if (d == undefined) d = {};
  };
  this.initObj = function(d,dataAttr) {
    //console.log('init '+d.id+' from '+dataAttr);
    // check any objects needed by binding are initialised
    var expr = d.data(dataAttr);
    //console.log('expr:'+expr);
    var parts = expr.split('.');
    var ref = '';
    for (idx in parts) {
      if (ref.length >0) ref+='.';
      ref+=(parts[idx]);
      //console.log('Needs initialising? '+ref);
      if (parseInt(idx)<(parts.length-1) && eval(ref) == undefined) {
        console.log('Initialising '+ref);
        eval(ref+' = new Object();');
      }
    }
  };
  function _initDomainModel() {
    console.log('initDomainModel...');
      var d = { action: 'p_domain' };
      return jQuery.ajax({
        type: 'GET',
        url: $p.proxyPath,
        data: d,
        dataType: 'json',
        timeout: 30000,
        success: function(data, textStatus, jqxhr) {
          console.log('loaded '+data.entities.length+' entities...');
          $p.model = data;
          $p.entityAttrs = [];
          jQuery(data.entities).each(function(i,d) {
            jQuery(d.fields).each(function(j,e) {
              $p.entityAttrs.push({value: d.name+'.'+e.name, label: d.name+' '+e.label});
            });
          });
          if ($p.entityAttrs.length > 0) {
            jQuery('#domainCtrl')
              .empty()
              .removeAttr('disabled','disabled');
            jQuery('#addDomainCtrl').removeAttr('disabled','disabled');
            jQuery.each($p.entityAttrs, function (i,d) {
              jQuery('#domainCtrl').append('<option value="'+d.value+'">'+d.label+'</option>');
            });
          }
        }
      });
  };
  this.addControl = function() {
    console.log('addControl');
    var options = '';
    var ctrlType = document.getElementById('ctrlType').value;
    if (ctrlType == 'checkbox' || ctrlType == 'radio' || ctrlType == 'select') {
      options = 'data-options="'+document.getEleemntById('ctrlOptions').value+'"';
    }
    _addControl(document.getElementById('ctrlId').value,
      ctrlType,
      document.getElementById('ctrlLabel').value,
      document.getElementById('ctrlPlaceholder').value,
      document.getElementById('ctrlRequired').checked,
      undefined,
      options);
  };
  function _addControl(ctrlId, ctrlType, ctrlLabel, ctrlPlaceholder, required, validation, options) {
    console.log('addControlInternal');

    var ctrl;
    switch (ctrlType) {
      case 'select':
        ctrl = '<select class="decorate" id="'
        +'" name="'+ctrlLabel
        +'" '+(required?'required ':'')+'>'
        +'\n  <option value=""></option>'
        +'\n</select>\n';
        break;
      case 'textarea':
        ctrl = '<textarea class="decorate" id="'+ctrlId
        +'" name="'+ctrlLabel
        +'" '+(required?'required ':'')+'rows="3" placeholder="'+ctrlPlaceholder+'"></textarea>\n';
        break;
      default:
        console.log('validation == undefined? '+(validation==undefined));
        ctrl = '<input class="decorate" '+options+' id="'+ctrlId
          +'" name="'+ctrlLabel+'" '+(required?'required ':'')
          +(validation == undefined ? '' : ' pattern="'+validation+'"')
          +' placeholder="'+ctrlPlaceholder+'" title="'
          +ctrlPlaceholder+'" type="'+ctrlType+'"/>\n';
          break;
      }

      if (document.querySelectorAll('.wp-editor-area')[0].style.display=='none') {
        document.querySelectorAll(".wp-editor")[0].value += ctrl;
      } else {
        insertAtCursor(document.querySelectorAll('.wp-editor-area')[0], ctrl);
      }
  };
  this.addControlOptions = function() {
    switch (document.getElementById('ctrlType').value) {
    case 'checkbox':
    case 'radio':
    case 'select':
      document.getElementById('ctrlOptionsPara').style.display='inline';
      break;
    default:
      document.getElementById('ctrlOptionsPara').style.display='inline';
      break;
    }
  };
  this.addDomainControl = function() {
      var domainCtrl = document.getElementById('domainCtrl').value;
      console.log('addDomainControl: '+domainCtrl);
      var entity = domainCtrl.substring(0,domainCtrl.indexOf('.'));
      var attr = domainCtrl.substring(domainCtrl.indexOf('.')+1);
      //console.log('entity: '+entity+', field:'+attr);
      jQuery.each($p.model.entities, function(i,d) {
        if (d.name == entity) {
          jQuery.each(d.fields, function(j,e) {
            if (e.name == attr) {
              console.log('found attr:'+JSON.stringify(e));
              _addControl(e.name, e.type, e.label, e.hint, e.required, e.validation);
              jQuery('#domainCtrl').val('');
            }
          });
        }
      });
  };
  this.getResource = function(resource, searchExpr, callback) {
    console.log('get resource "'+resource+'", filtered by: '+JSON.stringify(searchExpr));
    if ($p.isOffline()) {
      callback(JSON.parse(localStorage['GET_'+resource]));
    } else {
      return $.ajax({
        type: 'GET',
        url: (resource.indexOf('/admin-ajax.php')==-1 ? $p.server+resource : resource),
        contentType: 'application/json',
        data: searchExpr,
        dataType: 'text',
        username: $p.username,
        password: $p.password,
        xhrFields: { withCredentials: true },
        done: function() {
          console.info('Received reply');
        },
        success: function(response) {
          console.info('Received reply');
          localStorage['GET_'+resource]=response;
          callback(JSON.parse(response));
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('ERROR '+ jqXHR.statusCode());
          console.log('error:'+textStatus+':'+errorThrown);
        }
      });
    }
  };
  this.handleCallback = function(msg, wp_callback) {
    console.log('handleCallback: '+msg+', '+wp_callback);
    if (window['$params'] != undefined) jQuery.extend(msg, $params);
    if (wp_callback == undefined || wp_callback == '') {
      console.warn('No callback to execute');
    } else {
      var data = {
  	  	'action': wp_callback,
  		  'json': (msg!=undefined && typeof msg == 'object')
           ? encodeURIComponent(JSON.stringify(msg))
           : msg
  	  };
  	  $.post('/wp-admin/admin-ajax.php', data, function(response) {
  		  console.log('Got this from the server: ' + response);
  	  });
    }
  };
  this.isOffline = function() {
    return false;
  };
  this.nameToSlug = function(name, incHyphens) {
    console.log('nameToSlug: '+name+', '+incHyphens);
    if (incHyphens==undefined) incHyphens=true;
    if (name!=undefined && isNaN(name) && incHyphens) {
      return name.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
    } else if (name!=undefined && isNaN(name)) {
      return name.toLowerCase().replace(/ /g,'').replace(/[^\w-]+/g,'');
    } else {
      return name;
    }
  }

  /**
  * @param msg JSON or object repesentation of message to send
  */
  this.sendMessage = function(mep, msgName, msg, redirect, wp_callback, proxy, businessDescription) {
    console.log('sendMessage');
  	if (wp_callback != null && wp_callback.length > 0) $p.handleCallback(msg, wp_callback);

    if (mep=='none') {
      console.log('Server integration turned off');
      $p.handleCallback(msg, 'p_send_mail');
      if (undefined != redirect) window.location.href=redirect;
    } else {
      jQuery('html, body').css("cursor", "wait");
      console.log('Sending '+msgName+' as mep: '+mep);
      var type = ((mep == 'inOut' || mep == 'outOnly') ? 'GET' : 'POST');
      switch (type) {
      case 'GET':
        $p.showMessage('Loading...','bg-info text-info');
        break;
      default:
        $p.showMessage('Saving...','bg-info text-info');
      }
      msg.tenantId = $p.tenant;
      console.log('msg: '+ msg);
      if (msg!=undefined && typeof msg == 'string' && msg.indexOf('{')==0) msg = JSON.parse(msg);
      if (window['$params'] != undefined) jQuery.extend(msg, $params);
      $p.json = msg;
      var d = {};
      if (msg['firstName']!=undefined && msg['lastName']!=undefined) d.businessDescription = msg.firstName+' '+msg.lastName;
      if (msg['fullName']!=undefined) d.businessDescription = msg.fullName;
      if (businessDescription!=undefined && businessDescription.length>0) d.businessDescription = msg[businessDescription];
      // this strips non-significant white space
      if (msg!=undefined && typeof msg == 'object') msg = JSON.stringify(msg);
      console.log('msg: '+ msg);
      mep == 'inOut' ? d.query=msg : d.json=msg;
      d.msg_name = msgName;
      d.action='p_proxy';
      console.log('server: '+ $p.server);
      console.log('d: '+ d);
      var url = $p.server+'msg/'+$p.tenant+'/'+msgName;
      if (proxy) url = '/wp-admin/admin-ajax.php';
      $('html, body').css("cursor", "wait");
      return $.ajax({
        type: type,
        url: url,
        /* Uncomment to send as single JSON blob instead of form params
        contentType: 'application/json',*/
        crossDomain: true,
        data: d,
        dataType: 'text',
        timeout: 30000,
        username: $p.k,
        password: $p.v,
        headers: {
          "Authorization": "Basic " + btoa($p.k + ":" + $p.v)
        },
        xhrFields: {withCredentials: true},
        success: function(response, textStatus, jqxhr) {
          console.log('successfully start instance by msg: '+jqxhr.getResponseHeader('Location'));
          console.log('  headers: '+JSON.stringify(jqxhr.getAllResponseHeaders()));
          console.log('  response: '+response);
          try { $p.response = JSON.parse(response); }
          catch (e) { $p.response = response; }
          if ($p['onResponse'] != undefined) $p.onResponse();
          $p.hideActivityIndicator();
          switch (type) {
          case 'GET':
            //$p.showMessage('Loaded successfully...','bg-success text-success');
            break;
          default:
            $p.showMessage('Your information has been received','bg-success text-success');
          }
          if (undefined != redirect) window.location.href=redirect;
        },
        error: function(jqXHR, textStatus, errorThrown) {
          var msg = 'Error saving: '+textStatus+' '+errorThrown;
          $p.err = jqXHR;
          switch (jqXHR.status) {
          case 404:
            msg = "There is no workflow deployed to handle '"+msgName+"' messages. Please contact your administrator.";
          }
          console.error(msg);
          $p.hideActivityIndicator(msg, 'error');
          switch (type) {
          case 'GET':
            $p.showMessage('Unable to load your data right now, please reload in a moment...','bg-danger text-danger');
            break;
          default:
            $p.showMessage('Unable to save your data right now, please retry in a moment...','bg-danger text-danger');
          }
        },
        complete: function(data, textStatus, jqxhr) {
          //console.log('successfully start instance by msg: '+jqxhr.getResponseHeader('Location'));
          //console.log('complete:'+textStatus+' data: '+JSON.stringify(data)+' jqxhr'+jqxhr);
          if($p['msgCallbacks'] != undefined) $p.msgCallbacks.fire();
          jQuery('html, body').css("cursor", "auto");
        }
      });
    }
  };
  this.sendMessageIfValid = function(formId, mep, msgName, msg, redirect, wp_callback, proxy, businessDescription) {
    $.each($('#'+formId+' input[type="text"],#'+formId+' textarea'), function(i,d) {
      $(d).blur(); // force sync in case browser storing values not synced
    });
    validateRadio();
    if (document.getElementById(formId).checkValidity()) {
      $p.sendMessage(mep, msgName, msg, redirect, wp_callback, proxy, businessDescription);
    } else {
      $p.showFormError(formId,'Please correct highlighted fields');
    }
  };
  /**
  * @param msg JSON or object repesentation of message to send
  */
  this.sendIntermediateMessage = function(msgName, msg, redirect, wp_callback, proxy, execId) {
    console.log('sendIntermediateMessage: '+msgName+', '+msg+','+redirect+','+wp_callback+','+proxy+','+execId);
    $p.showMessage('Saving...','bg-info text-info');

    console.log('msg: '+ msg);
    if (msg!=undefined && typeof msg == 'string' && msg.indexOf('{')==0) msg = JSON.parse(msg);
    if (window['$params'] != undefined) jQuery.extend(msg, $params);
    $p.json = msg;
    // this strips non-significant white space
    if (msg!=undefined && typeof msg == 'object') msg = JSON.stringify(msg);
    console.log('msg: '+ msg);
    console.log('server: '+ $p.server);
    var url = $p.server+$p.tenant+'/messages/'+msgName+'/'+execId;
    var d = {
      json: msg,
      msg_name: msgName,
      action: 'p_proxy',
      executionId: execId
    };
    $('html, body').css("cursor", "wait");
    return $.ajax({
      type: 'POST',
      url: (proxy ? '/wp-admin/admin-ajax.php' : url),
      contentType: (proxy ? 'application/x-www-form-urlencoded; charset=UTF-8' : 'application/json'),
      data: (proxy ? d : msg),
      timeout: 30000,
      username: $p.username,
      password: $p.password,
      headers: {
        "Authorization": "Basic " + btoa($p.username + ":" + $p.password)
      },
      xhrFields: {withCredentials: true},
      success: function(response, textStatus, jqxhr) {
        console.log('successfully sent msg to: '+execId);
        console.log('  headers: '+JSON.stringify(jqxhr.getAllResponseHeaders()));
        console.log('  response: '+response);
        try { $p.response = JSON.parse(response); }
        catch (e) { $p.response = response; }
        if ($p['onResponse'] != undefined) $p.onResponse();
        if (wp_callback != undefined) wp_callback();
        $p.hideActivityIndicator();
        $p.showMessage('Your information has been received','bg-success text-success');
        if (undefined != redirect) window.location.href=redirect;
      }
    });
  };
  return this;
}(jQuery));

jQuery(document).ready(function() {
  console.info('Ready event fired, binding actions to data-p attributes...');
  $p.init();
});

String.prototype.toLeadingCaps = function() {
  return this.substring(0,1).toUpperCase()+this.substring(1).toLowerCase();
};

// insert additional content into textarea
function insertAtCursor(myField, myValue) {
  //IE support
  if (document.selection) {
    myField.focus();
    sel = document.selection.createRange();
    sel.text = myValue;
  }
  //MOZILLA and others
  else if (myField.selectionStart || myField.selectionStart == '0') {
    var startPos = myField.selectionStart;
    var endPos = myField.selectionEnd;
    myField.value = myField.value.substring(0, startPos)
    + myValue
    + myField.value.substring(endPos, myField.value.length);
  } else {
    myField.value += myValue;
  }
}

