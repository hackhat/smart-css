# smart-css [![Build Status](https://travis-ci.org/hackhat/smart-css.svg?branch=dev)](https://travis-ci.org/hackhat/smart-css) [![Coverage Status](https://coveralls.io/repos/hackhat/smart-css/badge.svg)](https://coveralls.io/r/hackhat/smart-css)

Write CSS in JavaScript with namespaces, proper names, no conflicts and expected results for react.js. 

Read the **[API](https://rawgit.com/hackhat/smart-css/v0.0.6/docs/jsduck/index.html)**.



## Get started

Is very easy to get started:

 - Install the library with `npm install smart-css --save`;
 - Use it in your app like this:

    ```javascript
    // In componentA.js
    // Creates a new namespace/context with the `css` variable where you 
    // add the componentA's styles.
    var SmartCSS = require('smart-css');
    var css      = new SmartCSS();
    // You can name a style without worring about other
    // components because you are adding all the styles
    // to the componentA only.
    css.setClass('root', {
        background: 'red'
    })
    css.setClass('rootHover', {
        background: 'green'
    })

    // Your components will look like this:
    React.DOM.div({
        // This will return a string with the classes that you set
        // true.
        className   : css.getClasses({
            root      : true,
            rootHover : this.state.hover,
        })
    })


    // In componentB.js
    // Creates a new context, only for componentB.
    var SmartCSS = require('smart-css');
    var css      = new SmartCSS();
    // Notice how we used the exact class name as componentA's.
    // This is the power of namespaces, you can keep the name
    // you want without worrying about conflicts with other
    // classes you defined.
    css.setClass('root', {
        background: 'yellow'
    })
    React.DOM.div({
        className : css.getClass('root')
    })

    // Then apply all the styles, only after this command is ran
    // your styles are added to the DOM.
    SmartCSS.injectStyles();
    ```



## Features

 - Easy to know which styles are applied to a certain element because:
   - Styles are in the same file as the element definition;
 - You don't have to worry about which styles are applied to your component because:
   - You know that no other style will have any effect on your element;
   - A new developer can come and create a component without having to look at any
     existing CSS code.
 - Integrates perfectly with the react.js way to thought;



## Examples:

All examples expect you to set the setup code before:

    ```javascript
    var SmartCSS = require('smart-css');
    var css      = new SmartCSS();
    ```


### Add a hover style

    ```javascript
    css.setClass('root', {
        background: 'red',
        ':hover': {
            background: 'green'
        }
    })
    ```



## Roadmap

### Auto prefix specific vendors

### Enable to make themable styles

The css can't be static to do this. This should be done with some wrapper function which
receives some options about the theme.

### Find a better way to define data

For example setting the width of an element is done like this:

    width: '22px'

which is not optimal because the 'px'. Now if you want to increase the width by 5px you have to extract the number 22 from the string `22px`, increase 5 and then add the 'px'.


## Tests

Run tests:

 - With code coverage: `istanbul cover --root ./src --hook-run-in-context node_modules/mocha/bin/_mocha -- -R spec`
 - Without code coverage: `mocha`;


## Questions


### Q: If I want to change a style at runtime what should I do?

A: You can add inline styles like this: `style: {color: 'red'}` 


## More

This library uses [RCSS](https://github.com/chenglou/RCSS) under the hood. Thanks to [chenglou](https://github.com/chenglou).
