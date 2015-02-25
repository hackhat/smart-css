var RCSS      = require('RCSS');
var _         = require('lodash');
var RCSSPatch = require('./patches/RCSS');
RCSSPatch(RCSS);





/**
 * An utility class which can be used to save CSS styles
 * and get their id. Use an instance per module.
 * @param {[type]} options [description]
 */
var SmartCSS = function(options){
    options = _.extend({
        /**
         * Prefixes all style ids with the style name.
         * For example if you you set this to true the class names
         * generated will have the prefix the style name and then
         * the id.
         * @type {String}
         */
        prefixStyleName : true,
    }, SmartCSS.getDefaultOptions, options);

    this.__prefixStyleName = options.prefixStyleName;

    /**
     * The key is the styleName and the value is an object like this:
     * `{className: 'String', style: {color: 'red'}}`
     * @type {Object}
     */
    this.__classes = {};
}





SmartCSS.setDefaultOptions = function(options){
    SmartCSS.__defaultOptions = options;
}



SmartCSS.getDefaultOptions = function(){
    return SmartCSS.__defaultOptions;
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
        return this.__classes[styleName].className;
    },



    /**
     * Returns multiple classes.
     * @param {Object} styleNames Example {returnThisClass: true, dontReturnThisClass: false}
     * @param {Boolean} [asArray=true] If true returns an array, if not returns a string.
     * @type {String|[String]} depending on
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
     */
    setClass: function(styleName, def, options){
        options = options || {};
        if(options.styleId === void 0){
            if(this.__prefixStyleName){
                var addPrefix = styleName + '-';
                if(options.prefix === void 0){
                    options.prefix = '';
                }
                options.prefix = addPrefix + options.prefix;
            }
        }
        this.__classes[styleName] = RCSS.registerClass(def, options);
        return this.__classes[styleName];
    }
})





module.exports = SmartCSS;
