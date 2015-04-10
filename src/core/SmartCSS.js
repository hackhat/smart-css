var _                   = require('lodash');
var tinycolor           = require('tinycolor2');
var mediaQueryValidator = require('valid-media-queries');
var escapeHTML          = require('escape-html');
var StyleClass          = require('./StyleClass');
var Slick               = require('slick');
var util                = require('util');

// console.log(util.inspect(Slick.parse('.a:hover .basda2-12::select'), {depth:12}));




/**
 * @class core.SmartCSS
 * An utility class which can be used to save CSS styles
 * and get their id. Use an instance per module.
 *
 * Definitions:
 *  - Class id: is the name in smart-css, normally is semantic and needs context; A class
 *              id only matters if has a SmartCSS instance associated. Alone means nothing.
 *  - Class name: is the real css class, normally is ugly and short; Doesn't include the pseudo
 *                part or the dot prefix.
 *
 * @param {Object} options
 * @param {Boolean} [options.prefixClassId=true]
 *        Prefixes all style ids with the style name.
 *        For example if you you set this to true the class names
 *        generated will have the prefix the style name and then
 *        the id.
 */
var SmartCSS = function(options){
    options = _.extend({
        prefixClassId : true,
    }, SmartCSS.getDefaultOptions, options);

    this.__prefixClassId = options.prefixClassId;

    /**
     * The key is the styleName and the value is an object like this:
     * `{className: 'String', style: {color: 'red'}}`
     * @type {Object}
     * @private
     */
    this.__styleClasses = {};
    // The key is classId and maps to a className.
    this.__classNameMap = {};
    SmartCSS.registerContext(this);
}




SmartCSS.__data = {
    styles   : {},
    contexts : [],
    index    : 0,
};




SmartCSS.registerContext = function(context){
    SmartCSS.__data.contexts.push(context);
}



// Not yet used. In the future we can use this to make shorter ids.
// var alphabet = "abcdefghijklmnopqrstuvwxyz";
// alphabet = (alphabet + alphabet.toUpperCase()).split('');
SmartCSS.__getNextId = function(){
    return SmartCSS.__data.index++;
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
    SmartCSS.__data.contexts = [];
}



/**
 * After you add the styles call this function to get the styles as string.
 * @todo: add it as an instance method.
 */
SmartCSS.getStylesAsString = function(){
    var contexts = SmartCSS.__data.contexts;
    var str = '';
    contexts.forEach(function(context){
        context.getStyleClasses().forEach(function(styleClass){
            str += renderStyleClass(styleClass);
        })
    })
    return str;
}

var renderStyleClass = function(styleClass){
    var styleDef = styleClass.getStyleDef();
    var styleBody = '';
    for(var key in styleDef){
        styleBody += ruleToString(key, styleDef[key]);
    }
    var styleHeader = renderSelectorObject(styleClass.getSelectorObject(), styleClass.getSmartCss().getClassNameMap());
    var styleFull = styleHeader + '{' + styleBody + '}';
    var media = styleClass.getMedia();
    if(media){
        styleFull = '@media (' + media + '){' + styleFull + '}'
    }
    return styleFull;
}



/**
 * Renders a css header definition from the selectorObject
 * and a classMap. The classMap is needed to replace the class
 * names from the selectorObject.
 */
var renderSelectorObject = function(selectorObject, classMap){
    var str = [];
    var getClassName = function(classId){
        return classMap[classId];
    }
    // console.log('>>',selectorObject)
    _.forEach(selectorObject, function(segment, i){
        if(i !== 0) str.push(segment.combinator);
        str.push('.' + getClassName(segment.classList[0]));
        _.forEach(segment.pseudos, function(pseudo){
            if(pseudo.type === 'class')   str.push(':')
            if(pseudo.type === 'element') str.push('::')
            str.push(pseudo.name);
            if(pseudo.value/* !== void 0 || pseudo.value !== null*/){
                str.push('(' + pseudo.value + ')');
            }
        })
    })
    return str.join('');
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





_.extend(SmartCSS.prototype, {



    /**
     * Gets the style id of a style name.
     * Don't add any pseudo things. For example if you set a class like this:
     *
     *     setClass('myClass:hover', ...);
     *
     * In order to get the className you do:
     *
     *     getClass('myClass');
     *
     * And not
     *
     *     getClass('myClass:hover');
     *
     * @param  {String} styleName
     * @return {String} The class id. This is the real class that is attached to the DOM.
     */
    getClass: function(classId){
        // Warn if class is missing and return '' by default.
        if(this.__classNameMap[classId] === void 0){
            console.warn('Class "' + classId + '" not set.');
            return '';
        }
        return this.__classNameMap[classId];
    },



    getClassNameMap: function(){
        // @todo: return a copy;
        return this.__classNameMap;
    },



    getStyleClasses: function(){
        return _.values(this.__styleClasses);
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
        return _.clone(this.__styleClasses);
    },



    /**
     * Defines a style.
     * @param {String} name The style name, then you can get the style id with `getClass` or `getClasses`.
     * @param {Object} def The style definition `{color: 'red'}` as javascript object.
     * @param {Object} options
     * @param {String} options.className
     * @param {String} options.hover
     * @param {String} options.media
     */
    setClass: function(selector, styleDef, options){
        var selectorObject = Slick.parse(selector);
        validateSelectorObject(selectorObject);
        selectorObject = selectorObject[0];
        // console.log(selectorObject)
        // Checks whenever ancestors are defined.
        _.forEach(selectorObject, function(segment, i){
            // The last one obviously is not yet added to the set, therefore
            // no need to test it.
            var last = selectorObject.length - 1 === i;
            if(last) return;
            if(this.getClass(segment.classList[0]) === ''){
                throw new Error('Ancestor not defined.')
            }
        }.bind(this))
        var classId = _.last(selectorObject).classList[0];
        var pseudo  = selector.split(':');
        pseudo[0] = '';
        pseudo = pseudo.join(':');

        options = _.extend({
            smartCss  : this,
            className : void 0,
            pseudo    : pseudo,
            classId   : classId,
        }, options)

        if(options.className === void 0){
            var className = '';
            // If a class with the same classId has been defined then reuse
            // its className so :hover and other pseudo things works correctly.
            if(this.__styleClasses[classId]){
                className = this.__styleClasses[classId].getClassName();
            }else{
                if(this.__prefixClassId){
                    className += classId;
                }else{
                    className = '_' + className;
                }
            }
            className += SmartCSS.__getNextId();
        }
        if(!isValidClassName(className)){
            throw new Error('Invalid class name');
        }
        options.className = className;

        var styleClass = new StyleClass({
            className      : options.className,
            selectorObject : selectorObject,
            // pseudo         : pseudo,
            styleDef       : styleDef,
            media          : options.media,
            smartCss       : options.smartCss
        })
        this.__classNameMap[classId] = className;
        this.__styleClasses[classId + pseudo] = styleClass;
        return this.__styleClasses[classId + pseudo];
    }



})



var isValidClassName = function(className){
    if(!className) return false;
    // Is valid if the first letter is not a number.
    // @todo: a stronger check.
    return !isNumber(className[0]);
}



var isNumber = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
}



var validateSelectorObject = function(selectorObject){
    // Should only have one selector. Filters out: ".a, .b";
    if(selectorObject.length > 1){
        throw new Error('Doesn\'t accept multiple definitions at once.');
    }
    // Should only have only 1 class per segment. Filters out: ".a.b";
    _.forEach(selectorObject[0], function(segment){
        if(segment.classList.length > 1) throw new Error('Doesn\'t accept multiple classes at once.')
    })
}





module.exports = SmartCSS;
