# smart-css

Styling with proper names without worrying about CSS 

## Get started

Is very easy to get started:

 - Install the library with `npm install smart-css --save`;
 - Use it in your app like this:

    ```javascript
    // In componentA.js
    // Creates a new context `css` variable where you add styles.
    var css = new SmartCSS();
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
        className   : css.getClasses({
            root      : true,
            rootHover : this.state.hover,
        })
    })
    ```
