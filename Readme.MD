# smart-css

Write CSS in JavaScript with namespaces, proper names, no conflicts and expected results for react.js.



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


## Questions

### Q: If I want to change a style at runtime what should I do?

A: You can add inline styles like this: `style: {color: 'red'}` 
