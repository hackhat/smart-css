var SmartCSS  = require('../src/core/SmartCSS');
var expect    = require('chai').expect;
var _         = require('lodash');
var tinycolor = require('tinycolor2');




describe('SmartCSS', function(){





    beforeEach(function(){
    });



    afterEach(function(){
    });



    describe('.getClass()', function(){



        it('should set and get a class correctly (prefixStyleName=default)', function(){
            var css = new SmartCSS({});
            css.setClass('myClassName', {color: 'red'});
            var expected = '.' + css.getClass('myClassName') + '{color:red;}';
            var current  = SmartCSS.getStylesString('myClassName');
            expect(_.startsWith(expected, '.myClassName')).to.be.ok;
            expect(expected).to.be.equal(current);
        })



        it('should set and get a class correctly (prefixStyleName=false)', function(){
            var css = new SmartCSS({prefixStyleName: false});
            css.setClass('myClassName', {color: 'red'});
            var expected = '.' + css.getClass('myClassName') + '{color:red;}';
            var current  = SmartCSS.getStylesString('myClassName');
            expect(_.startsWith(expected, '.myClassName')).to.be.false;
            expect(expected).to.be.equal(current);
        })



        it('should convert tinycolor to a hsl by default', function(){
            var css = new SmartCSS();
            css.setClass('myClassName', {color: tinycolor('red')});
            var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
            var current  = SmartCSS.getStylesString('myClassName');
            console.log(expected)
            console.log(current)
            expect(expected).to.be.equal(current);
        })




    })



})
