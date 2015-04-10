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



    it('should create a final class including the class name when (prefixClassId=default)', function(){
        var css = new SmartCSS({});
        css.setClass('.myClassName', {color: 'red'});
        var expected = '.' + css.getClass('myClassName') + '{color:red;}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
        expect(_.startsWith(expected, '.myClassName')).to.be.ok;
    })



    it('should create a final class not including the class name when (prefixClassId=false)', function(){
        var css = new SmartCSS({prefixClassId: false});
        css.setClass('.myClassName', {color: 'red'});
        var expected = '.' + css.getClass('myClassName') + '{color:red;}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
        expect(_.startsWith(expected, '.c-myClassName')).to.be.false;
    })



    // RCSS deletes the styles after you call `getStylesAsString`.
    it('should not the delete the current css after you get it', function(){
        var css = new SmartCSS({});
        css.setClass('.myClassName', {color: 'red'});
        expect(SmartCSS.getStylesAsString()).to.be.equal(SmartCSS.getStylesAsString());
    })



    it('should work correctly with multiple css properties', function(){
        var css = new SmartCSS({});
        css.setClass('.myClassName', {color: 'red', background: 'red'});
        var expected = '.' + css.getClass('myClassName') + '{color:red;background:red;}';
        var current  = SmartCSS.getStylesAsString();
        current      = SmartCSS.getStylesAsString(); // Get twice to check if it works.
        expect(current).to.be.equal(expected);
    })



    it('should convert tinycolor to a hsl by default', function(){
        var css = new SmartCSS();
        css.setClass('.myClassName', {color: tinycolor('red')});
        var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow hsl colors', function(){
        var css = new SmartCSS();
        css.setClass('.myClassName', {color: 'hsl(0, 100%, 50%)'});
        var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow normal colors', function(){
        var css = new SmartCSS();
        css.setClass('.myClassName', {color: '#FF0000'});
        var expected = '.' + css.getClass('myClassName') + '{color:#FF0000;}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow @media property', function(){
        var css = new SmartCSS();
        var def = {color: 'red'};
        css.setClass('.myClassName', def, {media: 'max-width: 500px'});
        var expected = '@media (max-width: 500px){.' + css.getClass('myClassName') + '{color:red;}}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    // RCSS: automatically adds quotes.
    it('should allow proper content variable', function(){
        var css = new SmartCSS({});
        css.setClass('.a', {content: 'attr(data-hover)'});
        var expected = '.' + css.getClass('a') + '{content:attr(data-hover);}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow proper content string', function(){
        var css = new SmartCSS({});
        css.setClass('.a', {content: '"string"'});
        var expected = '.' + css.getClass('a') + '{content:"string";}';
        var current  = SmartCSS.getStylesAsString('a');
        expect(current).to.be.equal(expected);
    })



    it('should throw an error if className starts with a number', function(){
        var css = new SmartCSS({});
        expect(css.setClass.bind(css, '.a', {color: 'red'}, {className: '2'})).to.throw(Error, 'Invalid class name');
    })



    describe('should allow pseudo classes/elements', function(){



        it('should allow :hover', function(){
            var css = new SmartCSS();
            css.setClass('.myClassName:hover', {color: 'red'});
            var expected = '.' + css.getClass('myClassName') + ':hover{color:red;}';
            var current  = SmartCSS.getStylesAsString();
            expect(current).to.be.equal(expected);
        })



        it('should allow pseudo elements like (::first-line)', function(){
            var css = new SmartCSS();
            css.setClass('.a::first-line', {color: 'red'});
            var expected = '.' + css.getClass('a') + '::first-line{color:red;}';
            var current  = SmartCSS.getStylesAsString();
            expect(current).to.be.equal(expected);
        })



        /**
         * Sometimes you have this hierarchy:
         *
         *  - li
         *   - a
         *
         * And you want to change the `a` element background when
         * `li` element is hovered.
         */
        it('should allow :hover on parent', function(){
            var css = new SmartCSS({});
            css.setClass('.a', {color: 'red'});
            css.setClass('.a:hover .b', {
                background: 'red'
            });
            var expected = '.' + css.getClass('a') + '{color:red;}' +
                           '.' + css.getClass('a') + ':hover .' + css.getClass('b') + '{background:red;}';
            var current  = SmartCSS.getStylesAsString('a');
            expect(current).to.be.equal(expected);
        })



        it('should throw error if more than one selector is defined', function(){
            var css = new SmartCSS({});
            expect(css.setClass.bind(css, '.a, .b', {})).to.throw(Error, 'Doesn\'t accept multiple definitions at once.');
        })



        it('should throw error if more than one class has been defined', function(){
            var css = new SmartCSS({});
            expect(css.setClass.bind(css, '.a.b', {})).to.throw(Error, 'Doesn\'t accept multiple classes at once.');
        })



        it('should throw error if previous selector segment has not been defined', function(){
            var css = new SmartCSS({});
            expect(css.setClass.bind(css, '.a .b', {})).to.throw(Error, 'Ancestor not defined.');
        })



    })



})
