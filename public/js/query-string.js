'use strict';
var $qs = (function() {
  var strictUriEncode = function (str) {
	   return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		     return '%' + c.charCodeAt(0).toString(16);
	      });
  };

  return {
    extract: function (str) {
    	return str.split('?')[1] || '';
    },

    parse: function (str) {
    	if (typeof str !== 'string') {
    		return {};
    	}

    	str = str.trim().replace(/^(\?|#|&)/, '');

    	if (!str) {
    		return {};
    	}

    	return str.split('&').reduce(function (ret, param) {
    		var parts = param.replace(/\+/g, ' ').split('=');
    		// Firefox (pre 40) decodes `%3D` to `=`
    		// https://github.com/sindresorhus/query-string/pull/37
    		var key = parts.shift();
    		var val = parts.length > 0 ? parts.join('=') : undefined;

    		key = decodeURIComponent(key);

    		// missing `=` should be `null`:
    		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
    		val = val === undefined ? null : decodeURIComponent(val);

    		if (!ret.hasOwnProperty(key)) {
    			ret[key] = val;
    		} else if (Array.isArray(ret[key])) {
    			ret[key].push(val);
    		} else {
    			ret[key] = [ret[key], val];
    		}

    		return ret;
    	}, {});
    },

    stringify: function (obj, isSafe){
    	return obj ? Object.keys(obj).sort().map(function (key) {
    		var val = obj[key];

    		if (val === undefined) {
    			return '';
    		}

    		if (val === null) {
    			return key;
    		}

    		if (Array.isArray(val)) {
    			return val.sort().map(function (val2) {
            if(!isSafe) return key + '=' + val2;
    				return strictUriEncode(key) + '=' + strictUriEncode(val2);
    			}).join('&');
    		}

        if(!isSafe) return key + '=' + val;
    		return strictUriEncode(key) + '=' + strictUriEncode(val);
    	}).filter(function (x) {
    		return x.length > 0;
    	}).join('&') : '';
    }
  }

})();
