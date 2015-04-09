var _ = require('lodash');




/**
 * @class core.StyleClass
 */
var StyleClass = function(options){
    options = _.extend({
        className : void 0,
        styleDef  : void 0,
        hover     : void 0,
    }, options);
    this.__className = options.className;
    this.__styleDef  = options.styleDef;
    this.__hover     = options.hover;
}





_.extend(StyleClass.prototype, {



    getClassName: function(){
        return this.__className;
    },



    getStyleDef: function(){
        return this.__styleDef;
    },



    getHover: function(){
        return this.__hover;
    }



})





module.exports = StyleClass;
