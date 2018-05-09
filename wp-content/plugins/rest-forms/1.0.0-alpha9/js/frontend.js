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
 * Copyright 2013-17 Tim Stephenson.  License: GPLv2 or later.
 */
jQuery.fn.moustache = function(data) {
  //console.info('invoking moustache template with data: '+JSON.stringify(data));
  var output = Mustache.render($(this).html(),data);
  //console.info('produces: '+output);
  this.empty().append(output);
};

var $p = (function ($) {
  EASING_DURATION = 1000;
  TAB = 9;
  ENTER = 13;
  REQUIRED = '<span class="mandatory">*</span>';
  useReadyHandlers = true;
  allowDeprecations = false;
  fadeOutMessages = true;

  function _escapeApostrophe(str) {
    if (str==undefined) return;
    else {
      try {
        return str.replace(/'/g, '\'');
      } catch (e) {
        console.error('problem removing diacritics from '+str+', attempt to continue');
        return str;
      }
    }
  }
  function _removeDiacritics(str) {

    var defaultDiacriticsRemovalMap = [
      {'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g},
      {'base':'AA','letters':/[\uA732]/g},
      {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g},
      {'base':'AO','letters':/[\uA734]/g},
      {'base':'AU','letters':/[\uA736]/g},
      {'base':'AV','letters':/[\uA738\uA73A]/g},
      {'base':'AY','letters':/[\uA73C]/g},
      {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g},
      {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g},
      {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g},
      {'base':'DZ','letters':/[\u01F1\u01C4]/g},
      {'base':'Dz','letters':/[\u01F2\u01C5]/g},
      {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g},
      {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g},
      {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g},
      {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g},
      {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g},
      {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g},
      {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g},
      {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g},
      {'base':'LJ','letters':/[\u01C7]/g},
      {'base':'Lj','letters':/[\u01C8]/g},
      {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g},
      {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g},
      {'base':'NJ','letters':/[\u01CA]/g},
      {'base':'Nj','letters':/[\u01CB]/g},
      {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g},
      {'base':'OI','letters':/[\u01A2]/g},
      {'base':'OO','letters':/[\uA74E]/g},
      {'base':'OU','letters':/[\u0222]/g},
      {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g},
      {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g},
      {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g},
      {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g},
      {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g},
      {'base':'TZ','letters':/[\uA728]/g},
      {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g},
      {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g},
      {'base':'VY','letters':/[\uA760]/g},
      {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g},
      {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g},
      {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g},
      {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g},
      {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g},
      {'base':'aa','letters':/[\uA733]/g},
      {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g},
      {'base':'ao','letters':/[\uA735]/g},
      {'base':'au','letters':/[\uA737]/g},
      {'base':'av','letters':/[\uA739\uA73B]/g},
      {'base':'ay','letters':/[\uA73D]/g},
      {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g},
      {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g},
      {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g},
      {'base':'dz','letters':/[\u01F3\u01C6]/g},
      {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g},
      {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g},
      {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g},
      {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g},
      {'base':'hv','letters':/[\u0195]/g},
      {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g},
      {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g},
      {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g},
      {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g},
      {'base':'lj','letters':/[\u01C9]/g},
      {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g},
      {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g},
      {'base':'nj','letters':/[\u01CC]/g},
      {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g},
      {'base':'oi','letters':/[\u01A3]/g},
      {'base':'ou','letters':/[\u0223]/g},
      {'base':'oo','letters':/[\uA74F]/g},
      {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g},
      {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g},
      {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g},
      {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g},
      {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g},
      {'base':'tz','letters':/[\uA729]/g},
      {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g},
      {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g},
      {'base':'vy','letters':/[\uA761]/g},
      {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g},
      {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g},
      {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g},
        {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}
    ];

    for(var i=0; i<defaultDiacriticsRemovalMap.length; i++) {
      try {
        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
      } catch (e) {
        console.error('problem removing diacritics from '+str+', attempt to continue');
        return str;
      }
    }

    return str;

  }
  function validateRadio() {
    $('[type="radio"]:invalid').parent().parent().find('.field-hint').removeClass('hidden').css('color','red');
  }

  this.enhanceForms=true;
  this.server = '';
  this.onInitCallbacks = $.Callbacks();
  this.init = function() {
    $p.l10n = new I18nController();
    $p.bind();
    $.ajaxSetup({
      username: $p.k,
      password: $p.v,
    });
    $p.onInitCallbacks.fire();
  };
  this.deferredInit = function(func) {
    console.log('deferredInit adds '+func);
    $p.onInitCallbacks.add( func );
  };
  this.ensureInited = function(d) {
    if (d == undefined) d = {};
  };
  this.fetchAndRender = function(url,varName,templateSelector,containerSelector) {
    console.log('fetchAndRender');
    $p.getResource(url,undefined,function(response) {
      console.log('...'+response);
        $.each(response,function(i,d) {
          d.age = $p.l10n.getAgeString(new Date(d.lastUpdated));
        });
        $p[varName]=response;
        //console.log('template: '+jQuery(templateSelector).html());
        var rendered = Mustache.render(jQuery(templateSelector).html(), $p);
        //console.log('rendered starts: '+rendered.substring(0,500));
        $(containerSelector).html(rendered);
    });
  };
  /**
   * Check any objects needed by binding are initialised
   */
  this.initObj = function(d,dataAttr) {
    //console.log('init '+d.id+' from '+dataAttr);
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
  this.bind = function() {
        $('[data-p-init]').each(function(i,d) {
          eval($(d).data('p-init')+'=new Object();');
        });
        $p.sync();
        if (useReadyHandlers) _bindReadyHandlers();
        _bindActionHandlers();
        if (allowDeprecations) _bindCombos();
        _bindControls();
        if (allowDeprecations) _bindSectionsToNav();
  };
  function _bindReadyHandlers() {
        console.info('bindReadyHandlers');
        $('[data-p-ready]').each(function(i,d) {
          var f = $(d).attr('data-p-ready');
          console.info('  '+f);
          eval(f);
        });
  };
  function _bindActionHandlers() {
        $('[data-p-action]').click(function(ev) {
          var action = $(ev.target).data('p-action');
          if (action.indexOf('(') != -1) {
            console.log('invoking custom action "'+action+'"');
            eval(action);
          } else {
            console.log('sending message "'+msgName+'"');
            var mep = ($(ev.target).data('p-action')===undefined?'inOnly':'inOut');
            var msg = eval(action.substring(action.indexOf(':')+1));
            var msgName = action.substring(0,action.indexOf(':'));
            $p.sendMessage(mep,msgName,JSON.stringify(msg));
            ev.preventDefault();
          }
        });
  };
  /**
   * @deprecated This old use of jQuery should be migrated to HTML5 input with datalist.
   */
  function _bindCombos() {
    console.error('You are using bindCombos, whcih is scheduled for removal');
        console.log('bind combos');
        $('[data-p-combo]').each(function(i,d) {
          var val = $(d).data('p-combo');

          if (val.length>0){
          console.log('setting up combo for '+d.name+' with '+val.length+' values of '+val);
          //if ($(d).autocomplete != undefined) $(d).autocomplete('destroy');
          $(d).autocomplete({
            change: function( event, ui ) {
              console.info('Change event '+event+' for '+event.target.id+', new val '+event.target.value);
              if (event.target.value == '') {
                var dataHolder = $(event.target).data('p-combo-bind');
                if ($(event.target).data('p-combo-type') != 'string') dataHolder = dataHolder.substring(0,dataHolder.lastIndexOf('.'));
                var cmd=dataHolder+'= null;';
                console.log('update command: '+cmd);
                eval(cmd);
              }
            },
            minLength: 0,
            source: eval(val),
            select: function( event, ui ) {
              console.info('select event '+event+' for '+event.target.id+', selecting '+ui.item.label);
              event.target.value= ui.item.label;
              if ($(event.target).data('p-combo-bind') !== undefined) {
                var cmd=$(event.target).data('p-combo-bind')+'= ui.item.value;';
                console.log(cmd);
                eval(cmd);
              } else {
                console.warn('no data binding for '+d.id);
              }
              if ($(event.target).data('p-combo-display') !== undefined) {
                var cmd=$(event.target).data('p-combo-display')+'= ui.item.label;';
                console.log(cmd);
                eval(cmd);
              } else {
                console.warn('no label binding for '+d.id);
              }
              return false;
            }
          });
          } else {
          console.log('Skipping combo setup for '+d.name+' as '+val+' has no options');
          }
          $(d).focus(function(ev) {
            console.info('focus on '+ev.target.id+' opening drop down');
            $('#'+ev.target.id).autocomplete('search');
          });
        });
  };
  function _bindControls() {
        console.log('bindControls');
        $('.p-form input[id]:not([data-p-bind]), .p-form select[id]:not([data-p-bind]), .p-form textarea[id]:not([data-p-bind])')
          .attr('data-p-bind',function() {
            return '$p.'+$(this).closest('form')[0].id.replace(/-/g,'_')+'.'+this.id;
          });
        $('[data-p-bind]:not([placeholder])').attr('placeholder', function() { return this.title; });

        // special processing to create radio / checkbox group
        var radioCtrls = $('input.decorate[type="radio"],input.decorate[type="checkbox"]');
        //console.log('Have radios: '+radioCtrls);
        $.each(radioCtrls, function(i,d) {
          console.log('Have '+d.type);
          ctrl = '<div class="form-group" data-p-bind="$p.';
          ctrl += $(d).closest('form')[0].id.replace(/-/g,'_')+'.'+d.id;
          ctrl += '">';
          ctrl += '<label for="'+d.id+'">'+d.name+(d.required ? REQUIRED : '')+'</label><br/>';
          var options = $(d).data('options') == undefined ? [] : $(d).data('options').split(',');
          $.each(options, function(j,e) {
            console.log('  option: '+e);
            ctrl += '<span class="'+d.type+'-inline"><input data-p-bind="$p.'
            + $(d).closest('form')[0].id.replace(/-/g,'_')+'.'+d.id
            +'" onchange="p.syncToModel(event)"'
            +' name="'+d.id
            +'" '+(d.required?'required ':'')+' type="'+d.type+'" value="'+e+'">'+e+'</span>'
          });
          ctrl += '<br/><span class="field-hint hidden">Please select one of the options above.</span>';
          ctrl += '</div>';
          $(d).replaceWith(ctrl);
        });

        // special processing to create select (no autocomplete for now)
        var selectCtrls = $('select[data-options]');
        console.log('Have select: '+selectCtrls);
        $.each(selectCtrls, function(i,d) {
          console.log('Have '+d.type);
          var options = $(d).data('options') == undefined ? [] : $(d).data('options').split(',');
          if (!$(d).prop('required')) $(d).append('<option id="">Please Select</option>');
          $.each(options, function(j,e) {
            console.log('  option: '+e);
            $(d).append('<option id="'+e+'">'+e+'</option>');
          });
        });

        // decorate all other controls
        $('[data-p-bind].decorate[type!="radio"],[data-p-bind].decorate[type!="checkbox"]')
        .addClass('form-control')
        .wrap('<div class="form-group">')
        .before(function(i) {
          return '<label for="'+this.id+'">'+this.name+(this.required ? REQUIRED : '')+'</label>';
        })
        .after(function(i) {
          return '<span class="field-hint">'+(this.title ? this.title : '')+'</span>';
        })
        .removeClass('decorate');
        $('[data-p-display].decorate')
          .addClass('form-control')
          .removeClass('decorate')
          .wrap('<div class="form-group">');

        // bind data sync
        $('[data-p-bind]').each(function(i,d) {
          // check we do not have moustache template
          if ($(d).data('p-bind').indexOf('{')==-1) {
            console.info('binding control '+d.name+' to '+$(d).data('p-bind'));
            $p.initObj($(d), 'p-bind');
            if ($(d).data('p-type')=='number') $(d).autoNumeric('init', {mDec:0});
            //var val = eval($(d).data('p-bind'));
            $(d).on('blur', $p.syncToModel);
            $(d).on('change', $p.syncToModel);
          } else {
            console.log('skip binding to: '+d.id+' using: '+$(d).data('p-bind'));
          }
        });
        $('[data-p-display]').each(function(i,d) {
          if ($(d).data('p-type')=='number') $(d).autoNumeric('init', {mDec:0});
        });
  };
  /**
   * @deprecated
   */
  function _bindSectionsToNav() {
    console.error('You are using bindSectionsToNav which is scheduled for removal');
              $('[data-p-section]').each(function(i,d) {
                console.log('bind nav handler to '+$(d).data('p-section'));
                $(d).on('click',function() {
                  var sect = $(d).data('p-section');
                  console.log('clicked on nav section: '+sect);
                  $('.nav li').removeClass('active');
                  $(d).parent().addClass('active');

                  $('p-section').fadeOut(500);
                  $('#'+sect).delay(500).removeClass('hide').fadeIn(500);
                });
              });
    };
  /**
   * @deprecated
   */
  this.getResource = function(resource, searchExpr, callback) {
    console.error('You are using getResource which is scheduled for removal');
    console.log('get resource "'+resource+'", filtered by: '+JSON.stringify(searchExpr));
    if (_isOffline()) {
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
  function _handleCallback(msg, wp_callback) {
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
      $.post($p.proxyPath, data, function(response) {
        console.log('Got this from the server: ' + response);
      });
    }
  };
  this.hideActivityIndicator = function(msg, addClass) {
    if (msg === undefined) msg = '';
    $('.p-messages').empty().append(msg).removeClass('blink');
    document.body.style.cursor='auto';
    // enable to allow messages to fade away
    if (fadeOutMessages && addClass!='error') setTimeout(function() {
      $('.p-messages').fadeOut();
    }, EASING_DURATION*10);
  };
  function _isOffline() {
    return false;
  };

  /**
   * @param msg JSON or object repesentation of message to send
   */
  this.sendMessage = function(mep, msgName, msg, redirect, wp_callback, proxy, businessDescription) {
    console.log('sendMessage');
    if (wp_callback != null && wp_callback.length > 0) _handleCallback(msg, wp_callback);

    if (mep=='none') {
      console.log('Server integration turned off');
      _handleCallback(msg, 'p_send_mail');
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
      console.log('msg: '+ msg);
      if (msg!=undefined && typeof msg == 'string' && msg.indexOf('{')==0) msg = JSON.parse(msg);
      if (window['$params'] != undefined) jQuery.extend(msg, $params);
      for(idx in Object.keys(msg)) {
        var k = Object.keys(msg)[idx];
        msg[k]=_removeDiacritics(msg[k]);
        msg[k]=_escapeApostrophe(msg[k]);
      }
      msg.tenantId = $p.tenant;
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
      if (proxy) url = $p.proxyPath;
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
  this.showActivityIndicator = function(msg, addClass) {
    document.body.style.cursor='progress';
    this.showMessage(msg, addClass);
  };
  this.showError = function(msg) {
    this.showMessage(msg, 'p-error');
  };
  this.showFormError = function(formId, msg) {
    this.showError(msg);
    $('#'+formId+' :invalid').addClass('p-error');
    $('#'+formId+' :invalid')[0].focus();
  };
  this.showMessage = function(msg, additionalClass) {
    if (msg === undefined) msg = 'Working...';
    $('.p-messages').empty().append(msg).addClass(additionalClass).show();
    if (fadeOutMessages && additionalClass!='p-error') setTimeout(function() {
      $('.p-messages').fadeOut();
    }, EASING_DURATION*10);
  };
  this.sync = function() {
    //console.log('... contact is: '+JSON.stringify($p.contact));
    $('[data-p-bind]').each(function(i,d) {
      // check we do not have moustache template
      if ($(d).data('p-bind').indexOf('{')==-1) {
        $p.initObj($(d), 'p-bind');
        //$(d).blur();
        // create data binding
        var val = eval($(d).data('p-bind'));
        //if (val == undefined) { console.log('val is undefined: '+$(d).value)};
        // if val is set and not dealing with an unchecked radio, set ctrl value
        if (val != undefined  && !($(d).attr('type')=='radio' && $(d).attr('checked')==undefined)) {
          console.log('... '+i+':'+val+' into '+d.name);
          $(d).val(val);
        } else {
          console.log('... '+i+' skipping: isRadio? '+($(d).attr('type')=='radio')+', isUnchecked?'+($(d.id+':checked')));
          //console.log('... '+$(d+':checked'));
        }
        if ($(d).data('p-type')=='number') $(d).autoNumeric('init', {mDec:0});
        if (val != undefined && $(d).data('p-type')=='number') $(d).autoNumeric('set',val);
      }
    });
    $('[data-p-combo-bind]').each(function(i,d) {
      // check we do not have moustache template
      if ($(d).data('p-combo-bind').indexOf('{')==-1) {
        $p.initObj($(d), 'p-combo-bind');
        var val = eval($(d).data('p-combo-display'));
        if ($(d).data('p-l10n')!=undefined && $p.l10n!=undefined) val=$p.l10n.getLabelText(val);
        $(d).val(val);
      }
    });
    $('[data-p-display]').each(function(i,d) {
      // check we do not have moustache template
      if ($(d).data('p-display').indexOf('{')==-1) {
        $p.initObj($(d), 'p-display');
        // check we do not have moustache template
        if ($(d).data('p-display').indexOf('{')==-1) {
          // create display only binding
          var val = eval($(d).data('p-display'));
          if ($(d).data('p-l10n')!=undefined && $p.l10n!=undefined) val=$p.l10n.getLabelText(val);
          console.log('... '+i+':'+val+' into '+d.name);
          $(d).empty().append(val);
          if ($(d).data('p-type')=='number') $(d).autoNumeric('init', {mDec:0});
          if (val != undefined && $(d).data('p-type')=='number') $(d).autoNumeric('set',val);
        }
      }
    });
  };
  this.syncToModel = function (ev) {
    console.info('Blur on '+ev.target.name+'='+ev.target.value+', checked:'+$(ev.target).find(':checked').name);
    var t = $(ev.target);

    var cmd;
    switch (true) {
    case (t.val().trim().length==0):
      console.log('have empty value');
      cmd = t.data('p-bind')+'=null;';
      break;
    case (t.data('p-type')=='number'):
      console.log('have number');
      cmd = t.data('p-bind')+'="'+t.autoNumeric('get')+'";';
      break;
    case (ev.target.type=='radio' && t.data('p-bind')!=undefined):
      console.log('have radio');
      // legacy radio controls before options synthesized?
      cmd = t.data('p-bind')+'= $(\'[data-p-bind="'+t.data('p-bind')+'"]:checked\').val();';
      break;
    case (ev.target.type=='checkbox'):
    case (ev.target.type=='radio'):
      console.log('have '+ev.target.type);
      var formObj = $(ev.target).closest('form')[0].id.replace(/-/g,'_');
      if (eval('$p.'+formObj+'==undefined')) eval('$p.'+formObj+'={}');
      cmd = '$p.'+formObj+'.'+ev.target.name+'="'+ev.target.value+'"';
    default:
      cmd = t.data('p-bind')+'='+JSON.stringify(t.val().trim())+';';
    }
    console.log('updating data model for '+t.name+' using '+cmd);
    eval(cmd);
    $p.sync();
  };
  return this;
}(jQuery));

jQuery(document).ready(function() {
  console.info('Ready event fired, binding actions to data-p attributes...');
  $p.init();
});
