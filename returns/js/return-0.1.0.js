var $r = (function ($, ractive) {
  $.ajaxSetup({
    // TODO required whilst testing between 2 localhost servers
    headers: {
      "Authorization": "Basic " + btoa('tstephen' + ":" + 'tstephen')
    },
  });
  var me = {};
  var _survey;
  $.getJSON('js/R1C.json',function(data) {
    me.rtn = data;
    if (_survey!=undefined) _fill(_survey);
  });
  // Correct std partial paths
  ractive.set('stdPartials', [
      { "name": "questionnaire", "url": "/questionnaire/partials/questionnaire.html"}
    ])
  ractive.loadStandardPartials(ractive.get('stdPartials'))

  function _fill(survey) {
    for(i in survey.categories) {
      for(j in survey.categories[i].questions) {
        console.log('  fill: '+survey.categories[i].questions[j].name);
        for (k in me.rtn.answers) {
          if (me.rtn.answers[k].question.name==survey.categories[i].questions[j].name) {
            // update ractive model with value
            ractive.set('q.categories.'+i+'.questions.'+j+'.response', me.rtn.answers[k].response);
            // store answer that needs to receive updates
            ractive.set('q.categories.'+i+'.questions.'+j+'.answer', me.rtn.answers[k]);
            break;
          }
        }
      }
    }
  }

  me.fill = function(survey) {
    console.info('fill survey');
    if (me.rtn==undefined) _survey = survey;
    else _fill(survey);
    ractive.observe('q.categories.*.questions.*.response', function(newValue, oldValue, keypath) {
      console.log('change '+keypath+' from '+oldValue+' to '+newValue);
      var q = ractive.get(keypath.substring(0, keypath.indexOf('.response')));
      if (q['answer']!=undefined) q.answer.response=newValue;
      /*for (k in me.rtn.answers) {
        if (me.rtn.answers[k].question.name==q.name) {
          me.rtn.answers[k].response = );
          break;
        }
      }*/
    });
  };

  me.submit = function() {
    console.info('submit return');
    $.each(me.rtn.links, function (i,d) {
      if (d.rel=='self') me.rtn.selfRef = d.href;
    });
    return $.ajax({
        url: me.rtn.selfRef,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(me.rtn),
        dataType:'text',
        success: completeHandler = function(data, textStatus, jqXHR) {
          console.log('updated ok, data: '+ data);
        }
      });
// prep question for subsequent save
            //me.rtn.answers[k].question = '/me.rtn.answers[k].question.id;
  };

  if (ractive['fetchCallbacks']==undefined) ractive.fetchCallbacks = $.Callbacks();
  ractive.fetchCallbacks.add(me.fill);

  return me;
}($, ractive));
