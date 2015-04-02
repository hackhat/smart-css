var SmartCSS = require('../src/core/SmartCSS');
var expect   = require('chai').expect;





describe('SmartCSS', function(){





    beforeEach(function(){
    });



    afterEach(function(){
    });



    describe('.setClass()', function(){



        it('should set a class correctly', function(){
            var css = new SmartCSS({});
            css.setClass('a', {color: 'red'});
            var expectedCSSString = '.' + css.getClass('a') + '{color:red;}'
            console.log(expectedCSSString);
            // console.log(SmartCSS.getStylesString('a'))
            // console.log(SmartCSS.getStylesString('a'))
            expect(expectedCSSString).to.be.equal(SmartCSS.getStylesString('a'));
        })



    })



})
