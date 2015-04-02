var SmartCSS  = require('../src/core/SmartCSS');
var expect    = require('chai').expect;
var _         = require('lodash');
var tinycolor = require('tinycolor2');




describe('SmartCSS', function(){





    beforeEach(function(){
        SmartCSS.deleteStyles();
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



        it('should not the delete the current css after retrival', function(){
            var css = new SmartCSS({});
            css.setClass('myClassName', {color: 'red'});
            var expected = '.' + css.getClass('myClassName') + '{color:red;}';
            var current  = SmartCSS.getStylesString('myClassName');
            current  = SmartCSS.getStylesString('myClassName'); // Get twice to check if it works.
            expect(_.startsWith(expected, '.myClassName')).to.be.ok;
            expect(expected).to.be.equal(current);
        })



        it('should convert tinycolor to a hsl by default', function(){
            var css = new SmartCSS();
            css.setClass('myClassName', {color: tinycolor('red')});
            var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
            var current  = SmartCSS.getStylesString('myClassName');
            expect(expected).to.be.equal(current);
        })



        it('should allow hsl colors', function(){
            var css = new SmartCSS();
            css.setClass('myClassName', {color: 'hsl(0, 100%, 50%)'});
            var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
            var current  = SmartCSS.getStylesString('myClassName');
            expect(expected).to.be.equal(current);
        })



        it('should allow normal colors', function(){
            var css = new SmartCSS();
            css.setClass('myClassName', {color: '#FF0000'});
            var expected = '.' + css.getClass('myClassName') + '{color:#FF0000;}';
            var current  = SmartCSS.getStylesString('myClassName');
            expect(expected).to.be.equal(current);
        })


        it('should allow :hover and similar properties', function(){
            var css = new SmartCSS();
            css.setClass('myClassName', {':hover': {color: 'red'}});
            var expected = '.' + css.getClass('myClassName') + ':hover' + '{color:red;}';
            var current  = SmartCSS.getStylesString('myClassName');
            expect(expected).to.be.equal(current);
        })



        it('should allow @media property', function(){
            var css = new SmartCSS();
            var mediaString = '@media (max-width: 500px)';
            var def = {};
            def[mediaString] = {color: 'red'};
            css.setClass('myClassName', def);
            var expected = mediaString + '{.' + css.getClass('myClassName') + '{color:red;}}';
            var current  = SmartCSS.getStylesString('myClassName');
            expect(expected).to.be.equal(current);
        })



        // it('should allow nested :hover', function(){
        //     var css = new SmartCSS();
        //     css.setClass('myClassName', {':hover': {color: 'red'}});
        //     var expected = '.' + css.getClass('myClassName') + ':hover' + '{color:red;}';
        //     var current  = SmartCSS.getStylesString('myClassName');
        //     console.log(expected)
        //     console.log(current)
        //     expect(expected).to.be.equal(current);
        // })

        // text css
        // :hover in @media

    })



})
