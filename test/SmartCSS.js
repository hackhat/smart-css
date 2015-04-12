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



    it('should use the same class name for the same class id', function(){
        var css = new SmartCSS({});
        css.setClass('.a', {color: 'red'});
        css.setClass('.a:hover', {color: 'yellow'});
        var expected = '.' + css.getClass('a') + '{color:red;}' +
                       '.' + css.getClass('a') + ':hover{color:yellow;}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
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




    describe('colors', function(){



        describe('tinycolor', function(){



            it('should convert to a hsl color by default (simple input)', function(){
                var css = new SmartCSS();
                css.setClass('.myClassName', {color: tinycolor('red')});
                var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
                var current  = SmartCSS.getStylesAsString();
                expect(current).to.be.equal(expected);
            })



            it('should convert to a hsl color by default (array input)', function(){
                var css = new SmartCSS();
                css.setClass('.a', {
                    border: ['1px solid', tinycolor('red')]
                });
                var expected = '.' + css.getClass('a') + '{border:1px solid hsl(0, 100%, 50%);}';
                var current  = SmartCSS.getStylesAsString();
                expect(current).to.be.equal(expected);
            })



        })



        it('should allow hsl colors', function(){
            var css = new SmartCSS();
            css.setClass('.myClassName', {color: 'hsl(0, 100%, 50%)'});
            var expected = '.' + css.getClass('myClassName') + '{color:hsl(0, 100%, 50%);}';
            var current  = SmartCSS.getStylesAsString();
            expect(current).to.be.equal(expected);
        })



        it('should allow hex colors', function(){
            var css = new SmartCSS();
            css.setClass('.myClassName', {color: '#FF0000'});
            var expected = '.' + css.getClass('myClassName') + '{color:#FF0000;}';
            var current  = SmartCSS.getStylesAsString();
            expect(current).to.be.equal(expected);
        })



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



    it('should allow proper content property as string', function(){
        var css = new SmartCSS({});
        css.setClass('.a', {content: '"string"'});
        var expected = '.' + css.getClass('a') + '{content:"string";}';
        var current  = SmartCSS.getStylesAsString('a');
        expect(current).to.be.equal(expected);
    })



    it('should allow to create a hardcoded className', function(){
        var css = new SmartCSS({});
        css.setClass('.a', {color: 'red'}, {className: 'abc'});
        var expected = '.abc{color:red;}';
        var current  = SmartCSS.getStylesAsString();
        expect(current).to.be.equal(expected);
    })



    it('should throw an error if tries to set a class with a hardcoded class name when another class name is already assigned for that class id', function(){
        var css = new SmartCSS({});
        css.setClass('.a', {color: 'red'});
        expect(css.setClass.bind(css, '.a:hover', {color: 'red'}, {className: 'abc'})).to.throw(Error, 'Can\'t use hardcoded class name because already exists one for the same class id');
    })



    it('should be able to render the childrens\' context', function(){
        var cssParent = new SmartCSS({});
        cssParent.setClass('.a', {color: 'red'});
        var cssChild = new SmartCSS({});
        cssChild.setClass('.a', {color: 'red'});
        cssParent.addChildContext(cssChild);
        var expected = '.' + cssParent.getClass('a') + '{color:red;}' +
                       '.' + cssChild.getClass('a')  + '{color:red;}';
        var current  = cssParent.getStylesAsString();
        expect(current).to.be.equal(expected);
    })




    it('should throw an error if className starts with a number', function(){
        var css = new SmartCSS({});
        expect(css.setClass.bind(css, '.a', {color: 'red'}, {className: '2'})).to.throw(Error, 'Invalid class name');
    })



    it('should throw an error if the same class id and object selector is set', function(){
        var css = new SmartCSS({});
        css.setClass('.a', {color: 'red'})
        expect(css.setClass.bind(css, '.a', {color: 'red'})).to.throw(Error, 'Class id already exists for this selector');
    })



    describe('.getClasses()', function(){



        it('should return multiple classes', function(){
            var css = new SmartCSS({});
            css.setClass('.a', {color: 'red'});
            css.setClass('.b', {color: 'yellow'});
            var current = css.getClasses({
                a : true,
                b : true
            });
            var expected = css.getClass('a') + ' ' + css.getClass('b');
            expect(current).to.be.equal(expected);
        })



        it('should return multiple classes as array', function(){
            var css = new SmartCSS({});
            css.setClass('.a', {color: 'red'});
            css.setClass('.b', {color: 'yellow'});
            var current = css.getClasses({
                a : true,
                b : true
            }, true);
            var expected = [css.getClass('a'), css.getClass('b')];
            expect(current).to.deep.equal(expected);
        })



        it('should only return the classes set as true', function(){
            var css = new SmartCSS({});
            css.setClass('.a', {color: 'red'});
            css.setClass('.b', {color: 'yellow'});
            css.setClass('.c', {color: 'green'});
            var current = css.getClasses({
                a : true,
                b : false,
                c : true,
            });
            var expected = css.getClass('a') + ' ' + css.getClass('c');
            expect(current).to.be.equal(expected);
        })



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



        it('should allow pseudo class with value', function(){
            var css = new SmartCSS();
            css.setClass('.a:nth-child(27)', {color: 'red'});
            var expected = '.' + css.getClass('a') + ':nth-child(27){color:red;}';
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
