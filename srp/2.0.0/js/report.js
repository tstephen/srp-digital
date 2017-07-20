/*******************************************************************************
 * Copyright 2015, 2017 Tim Stephenson and contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
var ractive = new BaseRactive({
  el: 'container',
  lazy: true,
  template: '#template',
  data: {
    org: 'RDR',
    server: $env.server,
    survey: 'SDU-2016-17',
    tenant: { id: 'sdu' },
    username: localStorage['username'],
    formatAnswer: function(qName) {
      if (qName==undefined || ractive.get('surveyReturn')==undefined) return '';
      else {
        var answer = ractive.getAnswer(qName);
        return answer == undefined ? '' : answer;
      }
    },
    isCcg: function() {
      if (ractive.get('surveyReturn')==undefined) return '';
      if (ractive.getAnswer('ORG_TYPE')=='CCG') return true;
      else return false;
    },
    stdPartials: [
      { "name": "loginSect", "url": $env.server+"/webjars/auth/1.0.0/partials/login-sect.html"}
    ],
  },
  enter: function () {
    console.log('enter...');
    ractive.login();
  },
  fetch: function() {
    console.info('fetch...');
    ractive.set('org',$auth.getClaim('org'));
    $.ajax({
      dataType: "json",
      url: ractive.getServer()+'/returns/findCurrentBySurveyNameAndOrg/'+ractive.get('survey')+'/'+ractive.get('org'),
      crossDomain: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Authorization": "Bearer "+localStorage['token'],
        "Cache-Control": "no-cache"
      },
      success: function( data ) {
        ractive.set('saveObserver', false);
        if (Array.isArray(data)) ractive.set('surveyReturn', data[0]);
        else ractive.set('surveyReturn', data);
        //if (ractive.hasRole('admin')) $('.admin').show();
        //if (ractive.hasRole('power-user')) $('.power-user').show();
        if (ractive.fetchCallbacks!=null) ractive.fetchCallbacks.fire();
        //ractive.set('searchMatched',$('#contactsTable tbody tr:visible').length);
        $('.rpt.pie').each(function(i,d) {
          ractive.fetchCsv(d, renderPie);
        });
        $('.rpt.stacked').each(function(i,d) {
          ractive.fetchCsv(d, renderStacked);
        });
        $('.rpt.table').each(function(i,d) {
          ractive.fetchTable(d);
        });
        ractive.set('saveObserver', true);
      }
    });
  },
  fetchCsv: function(ctrl, callback) {
    var url = $(ctrl).data('src').indexOf('//')==-1
        ? ractive.getServer()+$(ctrl).data('src')
        : $(ctrl).data('src').replace(/host:port/,window.location.host);
    $.ajax({
      dataType: "text",
      url: url,
      crossDomain: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Authorization": "Bearer "+localStorage['token'],
        "Cache-Control": "no-cache"
      },
      success: function( data ) {
        ractive.set('saveObserver', false);
        //ractive.set(keypath,data);
        var options = {};
        if ($(ctrl).data('colors') != undefined) options.colors = $(ctrl).data('colors').split(',');
        if ($(ctrl).data('x-axis-label') != undefined) options.xAxisLabel = $(ctrl).data('x-axis-label');
        if ($(ctrl).data('y-axis-label') != undefined) options.yAxisLabel = $(ctrl).data('y-axis-label');
        callback('#'+ctrl.id, data, options);
        ractive.set('saveObserver', true);
      }
    });
  },
  fetchTable: function(ctrl) {
    $.ajax({
      dataType: "html",
      url: ractive.getServer()+$(ctrl).data('src'),
      crossDomain: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Authorization": "Bearer "+localStorage['token'],
        "Cache-Control": "no-cache"
      },
      success: function( data ) {
        ractive.set('saveObserver', false);
        $(ctrl).empty().append(data);
        ractive.set('saveObserver', true);
      }
    });
  },
  formatNumber: function() {
    $('.number').each(function(i,d) {
      var a = d.innerText.substring(0,d.innerText.indexOf('.'));
      d.innerText = a.replace(new RegExp("^(\\d{" + (a.length%3?a.length%3:0) + "})(\\d{3})", "g"), "$1,$2").replace(/(\d{3})+?/gi, "$1,").replace(/^,/,'').slice(0,-1);
    });
  },
  getAnswer: function(qName) {
    for (idx in ractive.get('surveyReturn.answers')) {
      var a = ractive.get('surveyReturn.answers.'+idx);
      if (a.question.name == qName && a.response=='true') {
        return true;
      } else if (a.question.name == qName && a.response=='false') {
        return false;
      } else if (a.question.name == qName) {
        return a.response;
      }
    }
    return undefined;
  },
  reset: function() {
    console.info('reset');
    if (document.getElementById('resetForm').checkValidity()) {
      $('#resetSect').slideUp();
      $('#loginSect').slideDown();
      var addr = $('#email').val();
      $.ajax({
        url: ractive.getServer()+'/msg/srp/omny.passwordResetRequest.json',
        type: 'POST',
        data: { json: JSON.stringify({ email: addr, tenantId: 'srp' }) },
        dataType: 'text',
        success: function(data) {
          ractive.showMessage('An reset link has been sent to '+addr);
        },
      });
    } else {
      ractive.showError('Please enter the email address you registered with');
    }
  },
  showReset: function() {
    $('#loginSect').slideUp();
    $('#resetSect').slideDown();
  }
});

$(document).ready(function() {
  $('head').append('<link href="'+ractive.getServer()+'/css/sdu-1.0.0.css" rel="stylesheet">');

  if (Object.keys(getSearchParameters()).indexOf('error')!=-1) {
    ractive.showError('The username and password provided do not match a valid account');
  } else if (Object.keys(getSearchParameters()).indexOf('logout')!=-1) {
    ractive.showMessage('You have been successfully logged out');
  }
  ractive.fetch();
  $auth.addLoginCallback(ractive.fetch);
})
