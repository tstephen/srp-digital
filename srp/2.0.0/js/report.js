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
        try {
          var answer = ractive.getAnswer(qName);
          return answer == undefined ? '' : answer;
        } catch (e) {
          return '';
        }
      }
    },
    formatCommissionerAnswer: function(idx,qName) {
      if (qName==undefined || ractive.get('surveyReturn.commissioners.'+idx)==undefined) return '';
      else {
        try {
          var answer = ractive.getAnswer(qName, ractive.get('surveyReturn.commissioners.'+idx+'.answers'));
          return answer;
        } catch (e) {
          return '';
        }
      }
    },
    formatDateTime: function(timeString) {
      // console.log('formatDate: '+timeString);
      if (timeString==undefined) return 'n/a';
      return new Date(timeString).toLocaleString(navigator.languages);
    },
    formatProviderAnswer: function(idx,qName) {
      if (qName==undefined || ractive.get('surveyReturn.providers.'+idx)==undefined) return '';
      else {
        try {
          var answer = ractive.getAnswer(qName, ractive.get('surveyReturn.providers.'+idx+'.answers'));
          return answer;
        } catch (e) {
          return '';
        }
      }
    },
    isCcg: function() {
      return ractive.isCcg();
    },
    stdPartials: [
      { "name": "loginSect", "url": $env.server+"/webjars/auth/1.0.0/partials/login-sect.html"},
      { "name": "statusSect", "url": "/srp/2.0.0/partials/status-sect.html"}
    ],
  },
  partials: {
    'loginSect': '',
    'shareCtrl': '<div class="controls pull-right" style="display:none">'
                +'  <span class="glyphicon glyphicon-btn glyphicon-share"></span>'
                +'  <!--span class="glyphicon glyphicon-btn glyphicon-link"></span-->'
                +'  <!--span class="glyphicon glyphicon-btn glyphicon-copy"></span-->'
                +'</div>'
  },
  calculate: function () {
    console.info('calculate...');
    $('#ajax-loader').show();
    $.ajax({
      dataType: "json",
      type: 'POST',
      url: ractive.getServer()+'/calculations/'+ractive.get('survey')+'/'+ractive.get('org'),
      crossDomain: true,
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-Authorization": "Bearer "+localStorage['token'],
        "Cache-Control": "no-cache"
      },
      success: function( data ) {
        console.info('calculation requested, returns: '+ data);
        $('#ajax-loader').hide();
        ractive.fetch();
      }
    });
  },
  enter: function () {
    console.info('enter...');
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
        if (ractive.isCcg()) ractive.fetchProviderData();
        else ractive.fetchCommissionerData();
        //if (ractive.hasRole('admin')) $('.admin').show();
        //if (ractive.hasRole('power-user')) $('.power-user').show();
        if (ractive.fetchCallbacks!=null) ractive.fetchCallbacks.fire();
        //ractive.set('searchMatched',$('#contactsTable tbody tr:visible').length);
        $('.rpt.pie').each(function(i,d) {
          ractive.fetchCsv(d, renderPie);
        });
        $('.rpt.stacked').each(function(i,d) {
          switch (true) {
          case (window.innerWidth < 480):
            $(d).attr('width',440).attr('height', window.innerHeight* .4);
            break;
          case (window.innerWidth < 768):
            $(d).attr('width',720).attr('height', window.innerHeight* .4);
            break;
          case (window.innerWidth < 980):
            $(d).attr('width',720).attr('height', window.innerHeight* .4);
            break;
          case (window.innerWidth < 1200):
            $(d).attr('width',window.innerWidth* .8).attr('height', window.innerHeight* .4);
            break;
          default:
            $(d).attr('width',1140).attr('height', window.innerHeight* .4);
          }
          ractive.fetchCsv(d, renderStacked);
        });
        $('.rpt.table').each(function(i,d) {
          ractive.fetchTable(d);
        });
        ractive.set('saveObserver', true);
      }
    });
  },
  fetchCommissionerData: function() {
    console.info('fetchCommissionerData');
    $( "#ajax-loader" ).show();
    ractive.set('surveyReturn.commissioners',[]);
    for (var idx = 1 ; idx < 9 ; idx++) {
      var commissioner = ractive.getAnswer('CCG'+idx+'_SERVED');
      if (commissioner == undefined) continue;
      $.ajax({
        dataType: "json",
        url: ractive.getServer()+'/returns/findCurrentBySurveyNameAndOrg/'+ractive.get('survey')+'/'+commissioner,
        crossDomain: true,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-Authorization": "Bearer "+localStorage['token'],
          "Cache-Control": "no-cache"
        },
        success: function( data ) {
          ractive.set('saveObserver', false);
          for (j = 0 ; j < ractive.get('surveyReturn.commissioners').length ; j++) {
            if (ractive.get('surveyReturn.commissioners.'+j+'.org') == data.org) {
              ractive.splice('surveyReturn.commissioners',j,1);
            }
          }
          ractive.push('surveyReturn.commissioners', data);
          $( "#ajax-loader" ).hide();
          ractive.set('saveObserver', true);
        },
        error: function(jqXHR, textStatus, errorThrown ) {
          var commissioner = this.url.substring(this.url.lastIndexOf('/')+1);
          console.warn('Unable to fetch data for '+commissioner+'.'+jqXHR.status+':'+textStatus+','+errorThrown);
          for (j = 0 ; j < ractive.get('surveyReturn.commissioners').length ; j++) {
            if (ractive.get('surveyReturn.commissioners.'+j+'.orgName') == commissioner) {
              ractive.splice('surveyReturn.commissioners',j,1);
            }
          }
          ractive.push('surveyReturn.commissioners', {
                orgName: commissioner, answers: [
                  { question: { name: 'ORG_NAME' }, response: commissioner },
                  { question: { name: 'SDMP_CRMP' }, response: 'n/a' },
                  { question: { name: 'LAST_GCC_SCORE' }, response: 'n/a' },
                  { question: { name: 'ADAPTATION_PLAN_INC' }, response: 'n/a' },
                  { question: { name: 'SDU_RPT_SCORE' }, response: 'n/a' }
                ]
              });
          $( "#ajax-loader" ).hide();
          ractive.set('saveObserver', true);
        }
      });
    }
  },
  fetchCsv: function(ctrl, callback) {
    var url = $(ctrl)
        .data('src').indexOf('//')==-1
            ? ractive.getServer()+$(ctrl).data('src')
            : $(ctrl).data('src').replace(/host:port/,window.location.host)
        .attr('width', '1024')
        .attr('width', '400')
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

        $(ctrl)
          .on('mouseover', function(ev) {
            $('#'+ev.currentTarget.id+' .controls').show();
          })
          .on('mouseout', function(ev) {
            $('#'+ev.currentTarget.id+' .controls').hide();
          });
        $('#'+ctrl.id+' .controls .glyphicon-share').wrap('<a href="'+ractive.getServer()+$(ctrl).data('src')+'" target="_blank"></a>');
        callback('#'+ctrl.id, data, options);
        ractive.set('saveObserver', true);
      }
    });
  },
  fetchProviderData: function() {
    console.info('fetchProviderData');
    $( "#ajax-loader" ).show();
    ractive.set('saveObserver', false);
    ractive.set('surveyReturn.providers', []);
    for (var idx = 1 ; idx < 9 ; idx++) {
      try {
        var provider = ractive.getAnswer('PROVIDER'+idx+'_COMMISSIONED');
        if (provider == undefined) continue;
        $.ajax({
          dataType: "json",
          url: ractive.getServer()+'/returns/findCurrentBySurveyNameAndOrg/'+ractive.get('survey')+'/'+provider,
          crossDomain: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-Authorization": "Bearer "+localStorage['token'],
            "Cache-Control": "no-cache"
          },
          success: function( data ) {
            ractive.set('saveObserver', false);
            for (j = 0 ; j < ractive.get('surveyReturn.providers').length ; j++) {
              if (ractive.get('surveyReturn.providers.'+j+'.org') == data.org) {
                ractive.splice('surveyReturn.providers',j,1);
              }
            }
            ractive.push('surveyReturn.providers', data);
            $( "#ajax-loader" ).hide();
            ractive.set('saveObserver', true);
          },
          error: function(jqXHR, textStatus, errorThrown ) {
            var provider = this.url.substring(this.url.lastIndexOf('/')+1);
            console.warn('Unable to fetch data for '+provider+'.'+jqXHR.status+':'+textStatus+','+errorThrown);
            for (j = 0 ; j < ractive.get('surveyReturn.providers').length ; j++) {
              if (ractive.get('surveyReturn.providers.'+j+'.orgName') == provider) {
                ractive.splice('surveyReturn.providers',j,1);
              }
            }
            ractive.push('surveyReturn.providers', {
                  orgName: provider, answers: [
                    { question: { name: 'ORG_NAME' }, response: provider },
                    { question: { name: 'SDMP_CRMP' }, response: 'n/a' },
                    { question: { name: 'ON_TRACK' }, response: 'n/a' },
                    { question: { name: 'LAST_GCC_SCORE' }, response: 'n/a' },
                    { question: { name: 'HEALTHY_TRANSPORT_PLAN' }, response: 'n/a' },
                    { question: { name: 'ADAPTATION_PLAN_INC' }, response: 'n/a' },
                    { question: { name: 'SDU_RPT_SCORE' }, response: 'n/a' },
                    { question: { name: 'TOTAL_ENERGY' }, response: 'n/a' },
                    { question: { name: 'TOTAL_ENERGY_BY_WTE' }, response: 'n/a' },
                    { question: { name: 'WATER_VOL' }, response: 'n/a' },
                    { question: { name: 'WATER_VOL_BY_WTE' }, response: 'n/a' }
                  ]
                });
            $( "#ajax-loader" ).hide();
            ractive.set('saveObserver', true);
          }
        });
      } catch (e) {
        console.info('Assume no provider at idx: '+idx);
      }
    }
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
        $(ctrl).empty().append(data)
          .on('mouseover', function(ev) {
            $('#'+ev.currentTarget.id+' .controls').show();
          })
          .on('mouseout', function(ev) {
            $('#'+ev.currentTarget.id+' .controls').hide();
          });
        $('#'+ctrl.id+' .controls .glyphicon-share').wrap('<a href="'+ractive.getServer()+$(ctrl).data('src')+'" target="_blank"></a>');
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
  getAnswer: function(qName, answers) {
    if (answers == undefined) answers = ractive.get('surveyReturn.answers');
    for (var idx = 0 ; idx < answers.length ; idx++) {
      var a = answers[idx];
      if (a.question.name == qName && a.response=='true') {
        return true;
      } else if (a.question.name == qName && a.response=='false') {
        return false;
      } else if (a.question.name == qName && a.question.type == 'number') {
        return parseFloat(a.response).sigFigs(3);
      } else if (a.question.name == qName) {
        return a.response;
      }
    }
    return undefined;
  },
  isCcg: function() {
    if (ractive.get('surveyReturn')==undefined) return false;
    if (ractive.getAnswer('ORG_TYPE')=='Clinical Commissioning Group') return true;
    else return false;
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
  $auth.addLoginCallback(ractive.fetch);
})
