function getSearchParameters() {
  var prmstr = window.location.search.substr(1);
  return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}

/**
 * @return the unique values in an array of _simple_ types.
 */
function uniq(a) {
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for(var i = 0; i < len; i++) {
         var item = a[i];
         if(seen[item] !== 1) {
               seen[item] = 1;
               out[j++] = item;
         }
    }
    return out;
}



$(document).ready(function() {
  ractive.set('saveObserver',false);

  ractive.observe('username', function(newValue, oldValue, keypath) {
    if (ractive['getProfile'] != undefined) ractive.getProfile();
  });

  if (typeof ractive['fetch'] == 'function') {
    if (ractive.tenantCallbacks==undefined) ractive.tenantCallbacks = $.Callbacks();
    ractive.tenantCallbacks.add(function() {
      ractive.fetch();
    });
  }
  if (ractive.brandingCallbacks==undefined) ractive.brandingCallbacks = $.Callbacks();
  ractive.brandingCallbacks.add(function() {
    ractive.initControls();
  });

  var s = getSearchParameters()['s'];
  if (s!=undefined) ractive.set('searchTerm',s);

  var id = getSearchParameters()['id'];
  if (id!=undefined) {
    ractive.set('searchId',id);
    if (ractive.fetchCallbacks==undefined) ractive.fetchCallbacks = $.Callbacks();
    ractive.fetchCallbacks.add(function() {
      ractive.edit(ractive.find(ractive.get('searchId')));
    });
  }

  ractive.set('saveObserver', true);
});
