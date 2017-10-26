var $r = (function ($, ractive, $auth) {
  var me = {
    dirty: false,
    rtn: undefined
  };
  // var _org = 'RDR';
  var _isCcg = false;
  var _orgType;
  var _server = $env.server;
  var _survey;
  var _surveyPeriod = '2016-17'; // TODO read system param
  var _now = new Date();
  var _period = getSearchParameters()['p'] == undefined
      ? (_now.getFullYear()-1)+'-'+(_now.getFullYear()-2000)
      : getSearchParameters()['p'];
  var _surveyName = getSearchParameters()['s'] == undefined
      ? 'SDU-'+_period
      : getSearchParameters()['s'];

  function _bindLists() {
    if ($('#ORG_NAME')!=undefined && $('#ORG_NAME[list]').length!=0) $('#ORG_NAME').attr('list','orgs');
    if ($('#ORG_TYPE option')!=undefined && $('#ORG_TYPE option').length==0 && ractive.get('orgTypes')!=undefined) {
      ractive.addSelectOptions('#ORG_TYPE', ractive.get('orgTypes'), _orgType);
    }
    $('#CCG1_SERVED,#CCG2_SERVED,#CCG3_SERVED,#CCG4_SERVED,#CCG5_SERVED,#CCG6_SERVED').attr('list','orgs');
    $('#PROVIDER1_COMMISSIONED,#PROVIDER2_COMMISSIONED,#PROVIDER3_COMMISSIONED,#PROVIDER4_COMMISSIONED,#PROVIDER5_COMMISSIONED,#PROVIDER6_COMMISSIONED,#PROVIDER7_COMMISSIONED,#PROVIDER8_COMMISSIONED').attr('list','orgs');
  }

  function _disableHeadSections() {
    console.info('disableHeadSections');
    $('#Organisation h3').wrapInner('<span class="title"></span>').append(' - <em>Please enter these details only for the current year</em>')
    $('#Policy h3').wrapInner('<span class="title"></span>').append(' - <em>Please enter these details only for the current year</em>')
    $('#Performance h3').wrapInner('<span class="title"></span>').append(' - <em>Please enter these details only for the current year</em>')
    //$('#Organisation input,#Organisation select,#Policy input,#Policy select,#Performance input,#Performance select').removeAttr('readonly').removeAttr('disabled');
    $('#Organisation ol,#Policy ol,#Performance ol').hide();
  }

  function _enableHeadSections() {
    console.info('enableHeadSections');
    $('#Organisation h3').empty().append('Organisation');
    $('#Policy h3').empty().append('Policy');
    $('#Performance h3').empty().append('Performance');
    //$('#Organisation input,#Organisation select,#Policy input,#Policy select,#Performance input,#Performance select').attr('readonly','readonly').attr('disabled','disabled');
    $('#Organisation ol,#Policy ol,#Performance ol').show();
  }

  function _fetchLists() {
    if ($auth.loginInProgress) {
      console.info('skip fetch lists while logging in');
      $auth.addLoginCallback(_fetchLists);
      return;
    }
    $.getJSON(_server+'/sdu/accounts/', function(data) {
      ractive.set('orgs', data);
      ractive.addDataList({ name: 'orgs' },data);
      // if (_survey != undefined) $('#ORG_NAME').attr('list','orgs');
      _bindLists();
    });
    $.getJSON(_server+'/sdu/organisation-types/?filter=reportingType', function(data) {
      ractive.set('orgTypes', data);
      _bindLists();
    });
  }

  // load return (fetching blank if needed)
  function _fetchReturn() {
    if ($auth.loginInProgress) {
      console.info('skip fetch return while logging in');
      $auth.addLoginCallback(_fetchReturn);
      return;
    }

    $.getJSON(_server+'/returns/findCurrentBySurveyNameAndOrg/'+_surveyName+'/'+$auth.getClaim('org'),function(data) {
      me.rtn = data;
      if (_survey!=undefined) _fill(_survey);
    });
  }

  function _fill(survey) {
    _survey = survey;
    if ($r.rtn.status != 'Draft') {
      ractive.showError('This return has been submitted and cannot be changed. If you detect a problem you may create a new version from the report pages');
    }
    for(i in survey.categories) {

      for(j in survey.categories[i].questions) {
        console.log('  fill: '+survey.categories[i].questions[j].name);

        // reset question
        ractive.set('q.categories.'+i+'.questions.'+j+'.response', undefined);
        $('#'+survey.categories[i].questions[j].name).removeAttr('readonly').removeAttr('disabled');

        // fill answer
        for (k in me.rtn.answers) {
          if (_period != me.rtn.answers[k].applicablePeriod) continue;
          if (me.rtn.answers[k].question.name==survey.categories[i].questions[j].name) {
            if (me.rtn.answers[k].question.type=='checkbox' && typeof me.rtn.answers[k].response == 'string') {
              me.rtn.answers[k].response = me.rtn.answers[k].response.split(',');
            }
            if (me.rtn.answers[k].question.type=='radio' && typeof me.rtn.answers[k].response == 'string') {
              me.rtn.answers[k].response = me.rtn.answers[k].response.split(',');
            }
            switch (me.rtn.answers[k].question.name) {
            // special handling for organisation ...
            case 'ORG_CODE':
              ractive.set('q.categories.'+i+'.questions.'+j+'.response', $auth.getClaim('org'));
              $('#ORG_CODE').attr('readonly','readonly').attr('disabled','disabled');
              break;
            case 'ORG_NAME':
              ractive.set('q.categories.'+i+'.questions.'+j+'.response', me.rtn.answers[k].response);
              if (me.rtn.answers[k].response != undefined) {
                $('#ORG_NAME').attr('readonly','readonly').attr('disabled','disabled');
              }
              break;
            case 'ORG_TYPE':
              ractive.set('q.categories.'+i+'.questions.'+j+'.response', me.rtn.answers[k].response);
              if (me.rtn.answers[k].response == 'Clinical Commissioning Group') {
                _isCcg = true;
                console.warn('Detected org is a CCG: '+_isCcg);
                _hideNotApplicable();
              }
              $('#ORG_TYPE').attr('list','orgTypes');
              _orgType = me.rtn.answers[k].response;
              if ('Submitted'==me.rtn.answers[k].status || 'Published'==me.rtn.answers[k].status) {
                $('#'+me.rtn.answers[k].question.name).attr('readonly','readonly').attr('disabled','disabled');
              } else {
                $('#'+me.rtn.answers[k].question.name).removeAttr('readonly').removeAttr('disabled');
              }
              break;
            default:
              if ('Submitted'==me.rtn.answers[k].status || 'Published'==me.rtn.answers[k].status) {
                $('#'+me.rtn.answers[k].question.name).attr('readonly','readonly').attr('disabled','disabled');
              } else {
                $('#'+me.rtn.answers[k].question.name).removeAttr('readonly').removeAttr('disabled');
              }
              // update ractive model with current value or default
              if (me.rtn.answers[k].response!=undefined && me.rtn.answers[k].response!='') {
                ractive.set('q.categories.'+i+'.questions.'+j+'.response', me.rtn.answers[k].response);
              } else if (ractive.get('q.categories.'+i+'.questions.'+j+'.defaultValue')!=undefined) {
                ractive.set('q.categories.'+i+'.questions.'+j+'.response', ractive.get('q.categories.'+i+'.questions.'+j+'.defaultValue'));
              }
            }
            // store answer that needs to receive updates
            //ractive.set('q.categories.'+i+'.questions.'+j+'.answer', me.rtn.answers[k]);
            break;
          }
        }
      }
    }
    _bindLists();

    $('#questionnaireForm input, #questionnaireForm select, #questionnaireForm textarea')
        .off().on('blur', me.submit);

    // Set questionnaire details specific to SDU return
    ractive.set('q.about.title', 'SDU return '+_period);
    ractive.set('q.about.options.previous', '$r.movePrevious()');
    ractive.set('q.about.options.next', '$r.moveNext()');
  }

  /**
   * Last category are calculations that need to be hidden.
   */
  function _hideCalcs() {
    ractive.splice('q.categories', ractive.get('q.categories').length-1, 1);
  }

  /**
   * Adapt questions according to whether CCG or provider.
   */
  function _hideNotApplicable() {
    console.info('hideNotApplicable'+_isCcg);
    if (_isCcg) {
      $('#CCG1_SERVED,#CCG2_SERVED,#CCG3_SERVED,#CCG4_SERVED,#CCG5_SERVED,#CCG6_SERVED,#NO_PATIENT_CONTACTS,#PATIENT_CONTACT_MEASURE,#DESFLURANE,#ISOFLURANE,#SEVOFLURANE,#NITROUS_OXIDE,#PORTABLE_NITROUS_OXIDE_MIX,#PORTABLE_NITROUS_OXIDE_MIX_MATERNITY,#CHP_ELECTRICAL_OUTPUT,#EXPORTED_THERMAL_ENERGY,#WOOD_LOGS_OWNED_RENEWABLE_CONSUMPTION,#WOOD_CHIPS_OWNED_RENEWABLE_CONSUMPTION,#WOOD_PELLETS_OWNED_RENEWABLE_CONSUMPTION,#ELEC_OWNED_RENEWABLE_CONSUMPTION,#OCCUPIED_BEDS,#NO_BEDS,#NO_PATIENT_CONTACTS,#PATIENT_CONTACT_MEASURE').parent().parent().hide();
      for (var idx in ractive.get('q.categories')) {
        if (ractive.get('q.categories.'+idx+'.name')=='Gases') {
          ractive.splice('q.categories', idx, 1);
        }
      }
    } else {
      $('#PROVIDER1_COMMISSIONED,#PROVIDER2_COMMISSIONED,#PROVIDER3_COMMISSIONED,#PROVIDER4_COMMISSIONED,#PROVIDER5_COMMISSIONED,#PROVIDER6_COMMISSIONED,#PROVIDER7_COMMISSIONED,#PROVIDER8_COMMISSIONED').parent().parent().hide();
    }
  }
  me.diag = function() {
    _loginSuccessful();
  }
  function _loginSuccessful() {
    // $('.questionnaire').slideDown();
    console.debug('  username:'+$auth.getClaim('sub'));
    console.debug('  tenant:'+ractive.get('tenant.id'));
    console.debug('  survey:'+_survey);
    console.debug('  return:'+me.rtn);
    console.debug('  orgs:'+(ractive.get('orgs') == undefined ? 0 : ractive.get('orgs').length));
    console.debug('  orgTypes:'+(ractive.get('orgTypes') == undefined ? 0 : ractive.get('orgTypes').length));
    if (_survey == undefined) ractive.fetch();
    if (me.rtn == undefined) _fetchReturn();
    if (ractive.get('orgTypes') == undefined) _fetchLists();
  }

  function _showQuestionnaire() {
    if (_survey == undefined) _fetchReturn();
    $('section.questionnaire').slideDown();
    // Add ERIC import button
    $('h1 .importEric').remove();
    $('h1').append('<button class="btn pull-right importEric" onclick="$r.importEric()">Import ERIC data<span class="glyphicon glyphicon-import"></span></button>');
  }

  me.fill = function(survey) {
    console.info('fill survey');
    // Don't know if we'll get survey or return first
    if (me.rtn==undefined) _survey = survey;
    else _fill(survey);

    ractive.observe('q.categories.*.questions.*.response', function(newValue, oldValue, keypath) {
      if (newValue === oldValue) return;
      console.log('change '+keypath+' from '+oldValue+' to '+newValue);
      if (newValue==null) return; // loading form
      var q = ractive.get(keypath.substring(0, keypath.indexOf('.response')));
      // if (q['answer']!=undefined) {
      //   q.answer.response=newValue;
      //   $r.dirty = true;
      // }
      if ($r.rtn!=undefined && newValue!='') {
        var found = false;
        for (idx in $r.rtn.answers) {
          if (found) break;
          if ($r.rtn.answers[idx].question.name == q.name && $r.rtn.answers[idx].applicablePeriod == _period) {
            $r.rtn.answers[idx].response = newValue;
            found = true;
          }
        }
        if (!found) {
          $r.rtn.answers.push( { question: q, response: newValue, applicablePeriod: _period, status: 'Draft', revision: 1 } );
        }
        $r.dirty = true;
      }
      // apply inter-question dependencies
      switch(q.name) {
      case 'ECLASS_USER':
        if (newValue=='0-E-Class') {
          $('section#Procurement.category li:not(:first)').slideDown();
        } else {
          $('section#Procurement.category li:not(:first)').slideUp();
        }
        break;
      case 'SDMP_CRMP':
        if (newValue=='true') {
          $('section#Policy.category li:hidden').slideDown();
        } else {
          $('section#Policy.category li:gt(0):lt(3)').slideUp();
        }
        break;
      }
    });
  };

  me.getAnswer = function(qName,period) {
    if ($r.rtn!=undefined) {
      for (idx in $r.rtn.answers) {
        if ($r.rtn.answers[idx].question.name == qName && $r.rtn.answers[idx].applicablePeriod == period) {
          return $r.rtn.answers[idx];
        }
      }
    }
  }

  me.importEric = function() {
    return $.ajax({
        url: _server+'/returns/importEric/'+_surveyName+'/'+$auth.getClaim('org'),
        type: 'GET',
        contentType: 'application/json',
        success: function(data, textStatus, jqXHR) {
          console.log('imported ERIC data ok, data: '+ data);
          me.rtn = data;
          if (_survey!=undefined) _fill(_survey);
        }
      });
  }

  me.moveNext = function() {
    console.info('_moveNext');
    var currentYear = parseInt(_period.substring(0,4));
    if (currentYear >= _now.getFullYear()) {
      ractive.showError('You cannot enter data for the future');
      $('.next').hide();
      return;
    }
    _period = (currentYear+1)+'-'+(currentYear+2-2000);
    ractive.set('q.about.title', 'SDU return '+_period);
    _fill(_survey);
    if (_period == _surveyPeriod) _enableHeadSections();
    else _disableHeadSections();
  }

  me.movePrevious = function() {
    console.info('_movePrevious');
    $('.next').show();
    var currentYear = _period.substring(0,4);
    _period = (currentYear-1)+'-'+(currentYear-2000);
    ractive.set('q.about.title', 'SDU return '+_period);
    _fill(_survey);
    if (_period == _surveyPeriod) _enableHeadSections();
    else _disableHeadSections();
  }

  me.submit = function() {
    if ($r.dirty == false || $r.rtn.status != 'Draft' || $auth.loginInProgress) {
      console.info('skip save, dirty: '+$r.dirty+', loginInProgress: '+$auth.loginInProgress);
      return;
    } else if (me.rtn == undefined) {
      ractive.fetch();
      _fetchReturn();
    }
    // _fill(_survey);
    $.each(me.rtn.links, function (i,d) {
      if (d.rel=='self') me.rtn.selfRef = d.href;
    });
    if (_server.indexOf('api.srp.digital')!=-1) {
      me.rtn.selfRef = me.rtn.selfRef.replace(/localhost/, 'api.srp.digital');
    }
    // handle checkbox options
    for (idx = 0 ; idx< me.rtn.answers.length ; idx++) {
      // console.warn(idx);
      if (Array.isArray(me.rtn.answers[idx].response)) me.rtn.answers[idx].response = me.rtn.answers[idx].response.join();
      delete me.rtn.answers[idx].question['optionNames'];
    }
    $('.save-indicator').show();
    return $.ajax({
        url: me.rtn.selfRef,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(me.rtn),
        dataType:'text',
        success: function(data, textStatus, jqXHR) {
          console.log('updated ok, data: '+ data);
          $('.save-indicator span').toggleClass('save-indicator-animation glyphicon-save glyphicon-saved');
          setTimeout(function() {
            $('.save-indicator').fadeOut(function() {
              $('.save-indicator span').toggleClass('save-indicator-animation glyphicon-save glyphicon-saved');
            });
          }, 3000);
          $r.dirty = false;
        }
      });
  };

  ractive.observe('q.activeCategory', function (newValue, oldValue, keypath) {
    if (newValue!=oldValue) {
      _hideNotApplicable();
      if (parent!=undefined && parent['notifyClick']!=undefined) {
        parent.notifyClick();
        // allow time for notify click to scroll to top and for iframe to calc new height
        setTimeout(function() {
          //parent.alert(''+$('#containerSect').height());
          parent.notifyIFrameSize($('#containerSect').height());
        },100);
      }
    }
  });

  // Correct std partial paths
  ractive.set('stdPartials', [
      { "name": "loginSect", "url": $env.server+"/webjars/auth/1.1.0/partials/login-sect.html"},
      { "name": "questionnaire", "url": "/questionnaire/partials/questionnaire.html"},
      { "name": "questionnaireContact", "url": "/questionnaire/partials/questionnaire-contact.html"}
    ])
  ractive.loadStandardPartials(ractive.get('stdPartials'));

  $('head').append('<link href="'+_server+'/css/sdu-1.0.0.css" rel="stylesheet">');
  $('head').append('<link rel="icon" type="image/png" href="/srp/images/icon/sdu-icon-16x16.png">');

  // set and load questionnaire
  ractive.set('questionnaireDef',_server+'/surveys/findByName/'+_surveyName);
  $auth.addLoginCallback(_loginSuccessful);

  if (ractive['fetchCallbacks']==undefined) ractive.fetchCallbacks = $.Callbacks();
  ractive.fetchCallbacks.add(_hideCalcs);
  ractive.fetchCallbacks.add(me.fill);
  ractive.fetchCallbacks.add(_showQuestionnaire);

  return me;
}($, ractive, $auth));

$( document ).bind('keypress', function(e) {
  switch (e.keyCode) {
  case 13: // Enter key
    if (window['ractive'] && ractive['enter']) ractive['enter']();
    break;
  case 63:   // ? key
    console.log('help requested');
    $('#helpModal').modal({});
    break;
  }
});
