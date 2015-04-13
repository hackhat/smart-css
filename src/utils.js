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
    return !utils.isNumber(className[0]);
}



/**
 * @method isNumber
 * Checks whenever is a number. If is a string like `'1'` is considered a number.
 * @param  {*} n
 * @return {Boolean} Returns true if is a number, false other ways.
 */
utils.isNumber = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
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
        styleBody += utils.ruleToString(key, styleDef[key]);
    }
    var styleHeader = utils.renderSelectorObject(styleClass.getSelectorObject(), classNamesAsMap);
    var styleFull = styleHeader + '{' + styleBody + '}';
    var media = styleClass.getMedia();
    if(media){
        styleFull = '@media (' + media + '){' + styleFull + '}'
    }
    return styleFull;
}



/**
 * @method renderSelectorObject
 * Renders a css header definition from the selectorObject
 * and a classMap. The classMap is needed to replace the class
 * names from the selectorObject.
 */
utils.renderSelectorObject = function(selectorObject, classMap){
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



utils.ruleToString = function(propName, value){
    var cssPropName = utils.hyphenateProp(propName);
    // For example if you have a border like this:
    //     border: ['1px solid', tinycolor('red')]
    // Will join them before converting the tinycolor to a css color.
    if(_.isArray(value)){
        value = value.map(utils.parseValueAtom).join(' ');
    }else{
        value = utils.parseValueAtom(value);
    }
    return cssPropName + ':' + utils.escapeValueForProp(value, cssPropName) + ';';
}



utils.parseValueAtom = function(value){
    if(value instanceof tinycolor) return value.toHslString();
    return value;
}



utils.__uppercasePattern = /([A-Z])/g;
utils.__msPattern = /^ms-/;
utils.hyphenateProp = function(string){
    // MozTransition -> -moz-transition
    // msTransition -> -ms-transition. Notice the lower case m
    // http://modernizr.com/docs/#prefixed
    // thanks a lot IE
    return string.replace(utils.__uppercasePattern, '-$1')
        .toLowerCase()
        .replace(utils.__msPattern, '-ms-');
}



utils.escapeValueForProp = function(value, prop){
    return value;
    // Still don't know why I should escape values?!
    // return escapeHTML(value);
}





module.exports = utils;
