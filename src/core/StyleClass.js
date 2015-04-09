var _ = require('lodash');




/**
 * @class core.StyleClass
 */
var StyleClass = function(options){
    options = _.extend({
        className : void 0,
        styleDef  : void 0,
        hover     : void 0,
        media     : void 0,
        // Instace of smartCss
        smartCss  : void 0,
    }, options);
    this.__className = options.className;
    this.__styleDef  = options.styleDef;
    this.__hover     = options.hover;
    this.__media     = options.media;
    this.__smartCss  = options.smartCss;
}





_.extend(StyleClass.prototype, {



    // This is the class Id. Should be called like this.
    getClassName: function(){
        return this.__className;
    },



    getStyleDef: function(){
        return this.__styleDef;
    },



    getHover: function(){
        return this.__hover;
    },



    getMedia: function(){
        return this.__media;
    },



    /**
     * Temporary is necessary to keep tracking of the SmartCSS instance.
     * Bad practice, but can wait until refactor.
     */
    getSmartCss: function(){
        return this.__smartCss;
    }



})





module.exports = StyleClass;
