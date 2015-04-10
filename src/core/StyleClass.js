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



    // This is the class Id. Should be called like this.
    getClassName: function(){
        return this.__className;
    },



    getStyleDef: function(){
        return this.__styleDef;
    },



    getSelectorObject: function(){
        return this.__selectorObject;
    },



    getMedia: function(){
        return this.__media;
    }



})





module.exports = StyleClass;
