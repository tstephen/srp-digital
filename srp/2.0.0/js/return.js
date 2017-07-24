var $r = (function ($, ractive, $auth) {
  var me = {
    dirty: false,
    rtn: undefined
  };
  // var _org = 'RDR';
  var _isCcg = false;
  var _server = $env.server;
  var _survey;
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
      ractive.addSelectOptions('#ORG_TYPE', ractive.get('orgTypes'));
    }
  }

  function _fetchLists() {
    $.getJSON(_server+'/sdu/accounts/', function(data) {
      ractive.set('orgs', data);
      ractive.addDataList({ name: 'orgs' },data);
      // if (_survey != undefined) $('#ORG_NAME').attr('list','orgs');
      _bindLists();
    });
    $.getJSON(_server+'/sdu/organisation-types/?filter=reportingType', function(data) {
      ractive.set('orgTypes', data);
      //if (_survey != undefined) ractive.addSelectOptions('#ORG_TYPE', data);
      _bindLists();
    });
  }

  // load return (fetching blank if needed)
  function _fetchReturn() {
    $.getJSON(_server+'/returns/findCurrentBySurveyNameAndOrg/'+_surveyName+'/'+$auth.getClaim('org'),function(data) {
      me.rtn = data;
      if (_survey!=undefined) _fill(_survey);
    });
  }

  function _fill(survey) {
    _survey = survey;
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
              if (me.rtn.answers[k].response == 'CCG') _isCcg = true;
              $('#ORG_TYPE').attr('list','orgTypes');
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
    if (_isCcg) {
      $('#CCGS_SERVED,#NO_PATIENT_CONTACTS,#PATIENT_CONTACT_MEASURE,#DESFLURANE,#ISOFLURANE,#SEVOFLURANE,#NITROUS_OXIDE,#PORTABLE_NITROUS_OXIDE_MIX,#PORTABLE_NITROUS_OXIDE_MIX_MATERNITY,#CHP_ELECTRICAL_OUTPUT,#EXPORTED_THERMAL_ENERGY,#WOOD_LOGS_OWNED_RENEWABLE_CONSUMPTION,#WOOD_CHIPS_OWNED_RENEWABLE_CONSUMPTION,#WOOD_PELLETS_OWNED_RENEWABLE_CONSUMPTION,#ELEC_OWNED_RENEWABLE_CONSUMPTION').parent().parent().hide();
      for (var idx in ractive.get('q.categories')) {
        if (ractive.get('q.categories.'+idx+'.name')=='Gases') {
          ractive.splice('q.categories', idx, 1);
        }
      }
    } else {
      $('#PROVIDERS_COMMISSIONED').parent().parent().hide();
    }
  }

  function _showQuestionnaire() {
    if (_survey == undefined) _fetchReturn();
    $('section.questionnaire').slideDown();
    // Add ERIC import button
    $('h1 .importEric').remove();
    $('h1').append('<span class="btn glyphicon glyphicon-btn glyphicon-import pull-right importEric" onclick="$r.importEric()">Import ERIC data</span>');
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
    _period = (currentYear+1)+'-'+(currentYear+2-2000);
    ractive.set('q.about.title', 'SDU return '+_period);
    _fill(_survey);
  }

  me.movePrevious = function() {
    console.info('_movePrevious');
    var currentYear = _period.substring(0,4);
    _period = (currentYear-1)+'-'+(currentYear-2000);
    ractive.set('q.about.title', 'SDU return '+_period);
    _fill(_survey);
  }

  me.submit = function() {
    //console.info('submit return');
    // bit of a hack as can't figure the load order issue that hides form
    if (!$('.questionnaire').is('visible')) $('.questionnaire').slideDown();
    if ($r.dirty == false) {
      //console.debug('skip save, not dirty');
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
    return $.ajax({
        url: me.rtn.selfRef,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(me.rtn),
        dataType:'text',
        success: function(data, textStatus, jqXHR) {
          console.log('updated ok, data: '+ data);
          $r.dirty = false;
        }
      });
  };

  ractive.observe('q.activeCategory', function (newValue, oldValue, keypath) {
    if (newValue!=oldValue) {
      _hideNotApplicable();
    }
  });

  // Correct std partial paths
  ractive.set('stdPartials', [
      { "name": "loginSect", "url": $env.server+"/webjars/auth/1.0.0/partials/login-sect.html"},
      { "name": "questionnaire", "url": "/questionnaire/partials/questionnaire.html"},
      { "name": "questionnaireContact", "url": "/questionnaire/partials/questionnaire-contact.html"}
    ])
  ractive.loadStandardPartials(ractive.get('stdPartials'));

  $('head').append('<link href="'+_server+'/css/sdu-1.0.0.css" rel="stylesheet">');

  setInterval(me.submit, 5000);

  // set and load questionnaire
  ractive.set('questionnaireDef',_server+'/surveys/findByName/'+_surveyName);
  ractive.fetch();
  _fetchReturn();
  _fetchLists();
  $('.questionnaire').slideDown();
  // $auth.addLoginCallback(ractive.fetch);
  // $auth.addLoginCallback(_fetchReturn);
  // $auth.addLoginCallback(_fetchLists());
  // $auth.addLoginCallback(_bindLists());
  $auth.addLoginCallback(function() { $('.questionnaire').slideDown(); });

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
