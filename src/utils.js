var _         = require('lodash');
var tinycolor = require('tinycolor2');





/**
 * @class utils
 * An utility object.
 */
var utils = {};



/**
 * @method isValidClassName
 * Checks whenever is a valid class name.
 * @param  {String} className
 * @return {Boolean} Returns true if is a valid class, false other ways.
 */
utils.isValidClassName = function(className){
    if(!className) return false;
    // Is valid if the first letter is not a number.
    // @todo: a stronger check.
    return !utils.__isNumber(className[0]);
}



/**
 * @method renderStyleClass
 * Renders a core.StyleClass to string.
 * @param  {core.StyleClass} styleClass
 * @param  {Object} classNamesAsMap
 * @return {String} The rendered core.StyleClass as string.
 */
utils.renderStyleClass = function(styleClass, classNamesAsMap){
    var styleDef = styleClass.getStyleDef();
    var styleBody = '';
    for(var key in styleDef){
        styleBody += utils.__ruleToString(key, styleDef[key]);
    }
    var styleHeader = utils.__renderSelectorObject(styleClass.getSelectorObject(), classNamesAsMap);
    var styleFull = styleHeader + '{' + styleBody + '}';
    var media = styleClass.getMedia();
    if(media){
        styleFull = '@media ' + media + '{' + styleFull + '}'
    }
    return styleFull;
}



/**
 * @method __isNumber
 * Checks whenever is a number. If is a string like `'1'` is considered a number.
 * @private
 * @param  {*} n
 * @return {Boolean} Returns true if is a number, false other ways.
 */
utils.__isNumber = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}



/**
 * @method __renderSelectorObject
 * Renders a css header definition from the selectorObject
 * and a classMap. The classMap is needed to replace the class
 * names from the selectorObject.
 * @private
 * @return {String}
 */
utils.__renderSelectorObject = function(selectorObject, classMap){
    var str = [];
    var getClassName = function(classId){
        return classMap[classId];
    }
    _.forEach(selectorObject, function(segment, i){
        if(i !== 0) str.push(segment.combinator);
        str.push('.' + getClassName(segment.classList[0]));
        _.forEach(segment.pseudos, function(pseudo){
            if(pseudo.type === 'class')   str.push(':')
            if(pseudo.type === 'element') str.push('::')
            str.push(pseudo.name);
            if(pseudo.value){
                str.push('(' + pseudo.value + ')');
            }
        })
    })
    return str.join('');
}



/**
 * @method __ruleToString
 * Converts a rule name and rule value to a single CSS string.
 * @private
 * @param  {String} propName
 * @param  {String} value
 * @return {String} A single CSS string.
 */
utils.__ruleToString = function(propName, value){
    var cssPropName = utils.__hyphenateProp(propName);
    // For example if you have a border like this:
    //     border: ['1px solid', tinycolor('red')]
    // Will join them before converting the tinycolor to a css color.
    if(_.isArray(value)){
        value = value.map(utils.__parseValueAtom).join(' ');
    }else{
        value = utils.__parseValueAtom(value);
    }
    return cssPropName + ':' + utils.__escapeValueForProp(value, cssPropName) + ';';
}



/**
 * @method __parseValueAtom
 * Parses a single value to be compatible with CSS.
 * @private
 * @param  {*} value
 * @return {String} Parsed value as string.
 */
utils.__parseValueAtom = function(value){
    if(value instanceof tinycolor) return value.toHslString();
    return value;
}



/**
 * @property __uppercasePattern
 * Cached regexp pattern.
 * @private
 * @type {RegExp}
 */
utils.__uppercasePattern = /([A-Z])/g;



/**
 * @property __msPattern
 * Cached regexp pattern.
 * @private
 * @type {RegExp}
 */
utils.__msPattern = /^ms-/;



/**
 * @method __hyphenateProp
 * Hypernates a CSS property.
 * @private
 * @param  {String} string
 * @return {String} Hypernated property.
 */
utils.__hyphenateProp = function(string){
    // MozTransition -> -moz-transition
    // msTransition -> -ms-transition. Notice the lower case m
    // http://modernizr.com/docs/#prefixed
    // thanks a lot IE
    return string.replace(utils.__uppercasePattern, '-$1')
        .toLowerCase()
        .replace(utils.__msPattern, '-ms-');
}



/**
 * @method __escapeValueForProp
 * Noop
 * @private
 * @param  {String} value
 * @param  {String} prop
 * @return {String}
 */
utils.__escapeValueForProp = function(value, prop){
    return value;
    // Still don't know why I should escape values?!
    // return escapeHTML(value);
}





module.exports = utils;
