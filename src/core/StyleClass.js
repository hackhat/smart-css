var _ = require('lodash');




/**
 * @class core.StyleClass
 */
var StyleClass = function(options){
    options = _.extend({
        className      : void 0,
        styleDef       : void 0,
        selectorObject : void 0,
        media          : void 0,
    }, options);
    this.__className      = options.className;
    this.__styleDef       = options.styleDef;
    this.__media          = options.media;
    this.__selectorObject = options.selectorObject;
}





_.extend(StyleClass.prototype, {



    /**
     * @return {String} Class name of this style class.
     */
    getClassName: function(){
        return this.__className;
    },



    /**
     * @return {Object} A copy of #.__styleDef.
     */
    getStyleDef: function(){
        return _.clone(this.__styleDef);
    },



    /**
     * @return {Object} A copy of #.__selectorObject.
     */
    getSelectorObject: function(){
        return _.clone(this.__selectorObject);
    },



    /**
     * @return {String} Media CSS.
     */
    getMedia: function(){
        return this.__media;
    }



})





module.exports = StyleClass;
