var patch = function(RCSS){
    var global = Function("return this")();
    global.__RCSS_0_i = 0;
    RCSS.registerClass = function(styleObj, options){
        options = options || {};
        var styleId;
        if(options.styleId === void 0){
            styleId = global.__RCSS_0_i;
            // Add a "c" if no prefix supplied.
            if(options.prefix !== void 0){
                styleId = options.prefix + styleId;
            }else{
                styleId = 'c' + styleId;
            }
            if(options.postfix !== void 0){
                styleId = styleId + options.postfix;
            }
            global.__RCSS_0_i++;
        }else{
            styleId = options.styleId;
        }
        global.__RCSS_0_registry[styleId] = {
            className : styleId,
            style     : styleObj
        }
        return global.__RCSS_0_registry[styleId];
    }
    // var sha1 = require('sha1');

    // function hashStyle(styleObj) {
    //   return sha1(JSON.stringify(styleObj));
    // }

    // function generateValidCSSClassName(styleId) {
    //   // CSS classNames can't start with a number.
    //   return 'c' + styleId;
    // }

    // global.__RCSS_0_registry = global.__RCSS_0_registry || {};

    // function registerClass(styleObj) {
    //   var styleId = generateValidCSSClassName(hashStyle(styleObj));

    //   if (global.__RCSS_0_registry[styleId] == null) {
    //     global.__RCSS_0_registry[styleId] = {
    //       className: styleId,
    //       style: styleObj
    //     };
    //   }

    //   // Simple shallow clone
    //   var styleObj = global.__RCSS_0_registry[styleId];
    //   return {
    //     className: styleObj.className,
    //     style: styleObj.style
    //   };
    // }

    // module.exports = registerClass;

}

module.exports = patch;
