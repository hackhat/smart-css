var _                   = require('lodash');
var tinycolor           = require('tinycolor2');
var mediaQueryValidator = require('valid-media-queries');
var escapeHTML          = require('escape-html');
var StyleClass          = require('./StyleClass');





/**
 * @class core.SmartCSS
 * An utility class which can be used to save CSS styles
 * and get their id. Use an instance per module.
 * @param {Object} options
 * @param {Boolean} [options.prefixStyleName=true]
 *        Prefixes all style ids with the style name.
 *        For example if you you set this to true the class names
 *        generated will have the prefix the style name and then
 *        the id.
 */
var SmartCSS = function(options){
    options = _.extend({
        prefixStyleName : true,
    }, SmartCSS.getDefaultOptions, options);

    this.__prefixStyleName = options.prefixStyleName;

    /**
     * The key is the styleName and the value is an object like this:
     * `{className: 'String', style: {color: 'red'}}`
     * @type {Object}
     * @private
     */
    this.__classes = {};
}




SmartCSS.__data = {
    styles : {},
    id     : 0,
};





/**
 * Sets the global default options. You should really don't change
 * this.
 * @static
 */
SmartCSS.setDefaultOptions = function(options){
    SmartCSS.__defaultOptions = options;
}



/**
 * Returns the global default options.
 * @static
 */
SmartCSS.getDefaultOptions = function(){
    return SmartCSS.__defaultOptions;
}



/**
 * After you add the styles call this function to apply the styles.
 */
SmartCSS.injectStyles = function(){
    var tag = document.createElement('style');
    tag.innerHTML = SmartCSS.getStylesAsString();
    document.getElementsByTagName('head')[0].appendChild(tag);
}



SmartCSS.deleteStyles = function(){
    SmartCSS.__data.styles = {};
}



/**
 * After you add the styles call this function to get the styles as string.
 */
SmartCSS.getStylesAsString = function(){
    var styles = SmartCSS.__data.styles;
    var str = '';
    for(var key in styles){
        if(!styles.hasOwnProperty(key)){
            continue;
        }
        var styleClass = styles[key];
        str += renderStyleClass(styleClass);
    }
    return str;
}

var renderStyleClass = function(styleClass){
    var styleDef = styleClass.getStyleDef();
    var styleBody = '';
    for(var key in styleDef){
        if(!styleDef.hasOwnProperty(key)){
            continue;
        }
        styleBody += ruleToString(key, styleDef[key]);
    }

    var hover = styleClass.getHover();
    var styleHeader = '.' + styleClass.getClassName();
    if(hover === true){
        styleHeader += ':hover';
    }else if(hover){
        var smartCss = styleClass.getSmartCss();
        styleHeader = '.' + smartCss.getClass(hover) + ':hover ' + styleHeader;
    }

    var styleFull = styleHeader + '{' + styleBody + '}';

    var media = styleClass.getMedia();
    if(media){
        styleFull = '@media (' + media + '){' + styleFull + '}'
    }

    return styleFull;
}


var rulesToString = function(className, styleObj){
    var markup       = '';
    var pseudos      = '';
    var mediaQueries = '';

    for(var key in styleObj){
        if(!styleObj.hasOwnProperty(key)){
            continue;
        }
        // Skipping the special pseudo-selectors and media queries.
        if(key[0] === ':'){
            pseudos += '.' + className + key + '{' +
                _rulesToStringHeadless(styleObj[key]) + '}';
        }else if(key.substring(0, 6) === '@media'){
            if(!mediaQueryValidator(key)){
                console.log('%s is not a valid media query.', key);
                continue;
            }
            mediaQueries += key + '{' + rulesToString(className, styleObj[key]) + '}';
        }else{
            markup += ruleToString(key, styleObj[key]);
        }
    }

    if(markup !== ''){
        markup = '.' + className + '{' + markup + '}';
    }

    return markup + pseudos + mediaQueries;
}

var _rulesToStringHeadless = function(styleObj){
    var markup = '';

    for(var key in styleObj){
        if(!styleObj.hasOwnProperty(key)){
            continue;
        }

        if(key[0] === ':' || key.substring(0, 6) === '@media'){
            continue;
        }
        markup += ruleToString(key, styleObj[key]);
    }
    return markup;
}
var ruleToString = function(propName, value){
    var cssPropName = hyphenateProp(propName);
    if(value instanceof tinycolor) value = value.toHslString();
    return cssPropName + ':' + escapeValueForProp(value, cssPropName) + ';';
}
var _uppercasePattern = /([A-Z])/g;
var msPattern = /^ms-/;
var hyphenateProp = function(string){
    // MozTransition -> -moz-transition
    // msTransition -> -ms-transition. Notice the lower case m
    // http://modernizr.com/docs/#prefixed
    // thanks a lot IE
    return string.replace(_uppercasePattern, '-$1')
        .toLowerCase()
        .replace(msPattern, '-ms-');
}
var escapeValueForProp = function(value, prop){
    return value;
    // Still don't know why I should escape values?!
    // return escapeHTML(value);
}


SmartCSS.registerClass = function(styleObj, options){
    options = _.extend({
        prefix   : void 0,
        postfix  : void 0,
        styleId  : void 0,
        hover    : void 0,
        media    : void 0,
        smartCss : void 0
    }, options);
    var styleId;
    if(options.styleId === void 0){
        styleId = SmartCSS.__data.id;
        // Add a "c" if no prefix supplied.
        if(options.prefix !== void 0){
            styleId = options.prefix + styleId;
        }else{
            // Add a character because a style can't start with a number.
            styleId = 'c' + styleId;
        }
        if(options.postfix !== void 0){
            styleId = styleId + options.postfix;
        }
        SmartCSS.__data.id++;
    }else{
        styleId = options.styleId;
    }
    var styleDef = new StyleClass({
        className : styleId,
        styleDef  : styleObj,
        hover     : options.hover,
        media     : options.media,
        smartCss  : options.smartCss
    })
    SmartCSS.__data.styles[styleId] = styleDef;
    return styleDef;
}





_.extend(SmartCSS.prototype, {



    /**
     * Gets the style id of a style name.
     * @param  {String} styleName
     * @return {String} The class id. This is the real class that is attached to the DOM.
     */
    getClass: function(styleName){
        // Warn if class is missing and return '' by default.
        if(this.__classes[styleName] === void 0){
            console.warn('Class "' + styleName + '" not set.');
            return '';
        }
        return this.__classes[styleName].getClassName();
    },



    /**
     * Returns multiple classes.
     * Example:
     *
     *     css.getClasses({
     *         a: true,
     *         b: false,
     *         c: true,
     *     });
     *     // Will return a string with the class for `a` and `b` only.
     * @param {Object} styleNames Example {returnThisClass: true, dontReturnThisClass: false}
     * @param {Boolean} [asArray=true] If true returns an array, if not returns a string.
     * @return {String} The classes' ids. These are the real classes that are attached to the DOM.
     */
    getClasses: function(styleNames, asArray){
        var classesAsArray = [];
        _.forEach(styleNames, function(include, styleName){
            if(include){
                classesAsArray.push(this.getClass(styleName));
            }
        }.bind(this))
        if(asArray){
            return classesAsArray;
        }else{
            return classesAsArray.join(' ');
        }
    },



    /**
     * Returns an object where the key is the friendly class name
     * and the value is an object with 2 keys: className and style.
     * @return {Object}
     */
    getClassesAsMap: function(){
        return _.clone(this.__classes);
    },



    /**
     * Defines a style.
     * @param {String} name The style name, then you can get the style id with `getClass` or `getClasses`.
     * @param {Object} def The style definition `{color: 'red'}` as javascript object.
     * @param {Object} options
     * @param {String} options.prefix
     * @param {String} options.postfix
     * @param {String} options.styleId
     * @param {String} options.hover
     * @param {String} options.media
     */
    setClass: function(styleName, def, options){
        options = _.extend({
            smartCss: this
        }, options)
        if(options.styleId === void 0){
            if(this.__prefixStyleName){
                var addPrefix = styleName + '-';
                if(options.prefix === void 0){
                    options.prefix = '';
                }
                options.prefix = addPrefix + options.prefix;
            }
        }
        this.__classes[styleName] = SmartCSS.registerClass(def, options);
        return this.__classes[styleName];
    }


})





module.exports = SmartCSS;
