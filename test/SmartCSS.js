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



    it('should create a final class including the class name when (prefixStyleName=default)', function(){
        var css = new SmartCSS({});
        css.setClass('myClassName', {color: 'red'});
        var expected = '.' + css.getClass('myClassName') + '{color:red;}';
        var current  = SmartCSS.getStylesAsString();
        expect(_.startsWith(expected, '.myClassName')).to.be.ok;
        expect(current).to.be.equal(expected);
    })



    it('should create a final class not including the class name when (prefixStyleName=false)', function(){
        var css = new SmartCSS({prefixStyleName: false});
        css.setClass('myClassName', {color: 'red'});
        var expected = '.' + css.getClass('myClassName') + '{color:red;}';
        var current  = SmartCSS.getStylesAsString();
        expect(_.startsWith(expected, '.myClassName')).to.be.false;
        expect(current).to.be.equal(expected);
    })



    // RCSS deletes the styles after you call `getStylesAsString`.
    it('should not the delete the current css after you get it', function(){
        var css = new SmartCSS({});
        css.setClass('myClassName', {color: 'red'});
        var expected = '.' + css.getClass('myClassName') + '{color:red;}';
        var current  = SmartCSS.getStylesAsString();
        current      = SmartCSS.getStylesAsString(); // Get twice to check if it works.
        expect(_.startsWith(expected, '.myClassName')).to.be.ok;
        expect(current).to.be.equal(expected);
    })



    it('should convert tinycolor to a hsl by default', function(){
        var css = new SmartCSS();
        css.setClass('myClassName', {color: tinycolor('red')});
        var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow hsl colors', function(){
        var css = new SmartCSS();
        css.setClass('myClassName', {color: 'hsl(0, 100%, 50%)'});
        var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow normal colors', function(){
        var css = new SmartCSS();
        css.setClass('myClassName', {color: '#FF0000'});
        var expected = '.' + css.getClass('myClassName') + '{color:#FF0000;}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })

    // Add multiple styles

    it('should allow :hover and similar properties', function(){
        var css = new SmartCSS();
        css.setClass('myClassName', {color: 'red'}, {hover: true});
        var expected = '.' + css.getClass('myClassName') + ':hover{color:red;}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow @media property', function(){
        var css = new SmartCSS();
        var def = {color: 'red'};
        css.setClass('myClassName', def, {media: 'max-width: 500px'});
        var expected = '@media (max-width: 500px){.' + css.getClass('myClassName') + '{color:red;}}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    // RCSS: automatically adds quotes.
    it('should allow proper content variable', function(){
        var css = new SmartCSS({});
        css.setClass('a', {content: 'attr(data-hover)'});
        var expected = '.' + css.getClass('a') + '{content:attr(data-hover);}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should allow proper content string', function(){
        var css = new SmartCSS({});
        css.setClass('a', {content: '"string"'});
        var expected = '.' + css.getClass('a') + '{content:"string";}';
        var current  = SmartCSS.getStylesAsString('a');
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
        css.setClass('a', {});
        css.setClass('b', {
            background: 'red'
        }, {hover: 'a'});
        var expected = '.' + css.getClass('a') + ':hover .' + css.getClass('b') + '{background:red;}';
        var current  = SmartCSS.getStylesAsString('a');
        expect(current).to.be.equal(expected);
    })



})
