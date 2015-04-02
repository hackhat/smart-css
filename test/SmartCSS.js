var SmartCSS = require('../src/core/SmartCSS');
var expect   = require('chai').expect;
var _        = require('lodash');





describe('SmartCSS', function(){





    beforeEach(function(){
    });



    afterEach(function(){
    });



    describe('.setClass()', function(){



        it('should set a class correctly (prefixStyleName=default)', function(){
            var css = new SmartCSS({});
            css.setClass('myClassName', {color: 'red'});
            var expectedCSSString = '.' + css.getClass('myClassName') + '{color:red;}';
            var currentCSSString  = SmartCSS.getStylesString('myClassName');
            expect(_.startsWith(expectedCSSString, '.myClassName')).to.be.ok;
            expect(expectedCSSString).to.be.equal(currentCSSString);
        })



        it('should set a class correctly (prefixStyleName=false)', function(){
            var css = new SmartCSS({prefixStyleName: false});
            css.setClass('myClassName', {color: 'red'});
            var expectedCSSString = '.' + css.getClass('myClassName') + '{color:red;}';
            var currentCSSString  = SmartCSS.getStylesString('myClassName');
            expect(_.startsWith(expectedCSSString, '.myClassName')).to.be.false;
            expect(expectedCSSString).to.be.equal(currentCSSString);
        })




    })



})
