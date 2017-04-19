var $r = (function ($, ractive, $auth) {
  var me = {
    dirty: false,
    rtn: undefined
  };
  // var _org = 'RDR';
  var _isCcg = false;
  var _server = 'http://localhost:8083'; /* trakeo.com:8090 */
  var _survey;
  var _now = new Date();
  var _period = getSearchParameters()['p'] == undefined
      ? (_now.getFullYear()-1)+''+(_now.getFullYear()-2000)
      : getSearchParameters()['p'];
  var _surveyName = getSearchParameters()['s'] == undefined
      ? 'Sdu-'+_period
      : getSearchParameters()['s'];

  // set and load questionnaire
  ractive.set('questionnaireDef',_server+'/surveys/findByName/'+_surveyName);
  ractive.fetch();

  // load return (fetching blank if needed)
  $.getJSON(_server+'/returns/findCurrentBySurveyNameAndOrg/'+_surveyName+'/'+$auth.getClaim('org'),function(data) {
    me.rtn = data;
    if (_survey!=undefined) _fill(_survey);
  });

  // Correct std partial paths
  ractive.set('stdPartials', [
      { "name": "questionnaire", "url": "/questionnaire/partials/questionnaire.html"}
    ])
  ractive.loadStandardPartials(ractive.get('stdPartials'));

  function _fill(survey) {
    _survey = survey;
    for(i in survey.categories) {

      for(j in survey.categories[i].questions) {
        console.log('  fill: '+survey.categories[i].questions[j].name);
        for (k in me.rtn.answers) {
          if (me.rtn.answers[k].question.name==survey.categories[i].questions[j].name) {
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
              break;
            default:
              // update ractive model with value
              ractive.set('q.categories.'+i+'.questions.'+j+'.response', me.rtn.answers[k].response);
            }
            // store answer that needs to receive updates
            ractive.set('q.categories.'+i+'.questions.'+j+'.answer', me.rtn.answers[k]);
            break;
          }
        }
      }
    }
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

  me.fill = function(survey) {
    console.info('fill survey');
    if (me.rtn==undefined) _survey = survey;
    else _fill(survey);

    ractive.observe('q.categories.*.questions.*.response', function(newValue, oldValue, keypath) {
      console.log('change '+keypath+' from '+oldValue+' to '+newValue);
      if (newValue==null) return; // loading form
      var q = ractive.get(keypath.substring(0, keypath.indexOf('.response')));
      if (q['answer']!=undefined) {
        q.answer.response=newValue;
        $r.dirty = true;
      }
      if ($r.rtn!=undefined && newValue!='') {
        var found = false;
        for (idx in $r.rtn.answers) {
          if ($r.rtn.answers[idx].question.name == q.name) {
            $r.rtn.answers[idx].response = newValue;
            found = true;
          }
        }
        if (!found) {
          $r.rtn.answers.push( { question: q, response: newValue } );
        }
        $r.dirty = true;
      }
    });
  };

  me.submit = function() {
    //console.info('submit return');
    if ($r.dirty == false || me.rtn == undefined) {
      //console.debug('skip save, not dirty');
      return;
    }
    // _fill(_survey);
    $.each(me.rtn.links, function (i,d) {
      if (d.rel=='self') me.rtn.selfRef = d.href;
    });
    // TODO
    //me.rtn.selfRef = me.rtn.selfRef.replace(/localhost/, 'trakeo.com');
    return $.ajax({
        url: me.rtn.selfRef,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(me.rtn),
        dataType:'text',
        success: completeHandler = function(data, textStatus, jqXHR) {
          console.log('updated ok, data: '+ data);
          $r.dirty = false;
        }
      });
// prep question for subsequent save
            //me.rtn.answers[k].question = '/me.rtn.answers[k].question.id;
  };

  ractive.observe('q.activeCategory', function (newValue, oldValue, keypath) {
    if (newValue!=oldValue) {
      _hideNotApplicable();
    }
  });

  $('head').append('<link href="'+_server+'/css/sdu-1.0.0.css" rel="stylesheet">');
  setInterval(me.submit, 5000);

  ractive.fetch();
  $auth.addLoginCallback(ractive.fetch);

  if (ractive['fetchCallbacks']==undefined) ractive.fetchCallbacks = $.Callbacks();
  ractive.fetchCallbacks.add(_hideCalcs);
  ractive.fetchCallbacks.add(me.fill);

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
