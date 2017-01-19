# Fake news

A command-line tool to determine whether a url is fake news or legit.

This is a very early version that doesn't do much at all, really.
Eventually, this tool evolve into a web service and will use machine
learning and natural language processing.  Perhaps it will incorporate
crowd sourcing or other mechanical turk features, too.

## Try it

After cloning into a folder, `cd` into the folder and then type:

```
npm install
```

Test the code:

```
npm test
```

Run the code (dev):

```
npm run dev
```

Run the code (prod):

```
npm run build && npm start
```

For a handy ES2016 repl:

```
npm run repl
```

## Notes

* *Patterns*: This project uses functional programming patterns and
inversion of control.  JavaScript lends itself nicely to FP and IoC, imho.
I've tried really hard not to use 3rd-party FP or IoC libs.  The result
is "near native" FP and IoC.  I say "near" since I had to write some helper
functions and used creed.js's `coroutine` helper to create the coroutines.
Check out the `fn`, `trace`, and `async` folders for more info. More
extensive use of 3rd-party libs would make the code more concise.  Had I
used them, `main.js` would likely be half as long and would have far
fewer arrow functions.
* *Immutability*: I'm finding it really easy to avoid mutation these days.
There isn't any in the application code, and there's only one instance in
the helper libs (see `async`).  This app is still fairly small, so we'll see
what happens as it grows.
* *Structure*: I consider this project to be "pure IoC".  Only the composition
plans (`index.js` files) contain `import` statements.  All other files have
zero dependencies.  Most of these compostion plans only re-export values
from sibling modules, too.  Each `index.js` should be accompanied by a `README.md` to explain what a user will find therein.
* *Tests*: I'm not satisfied with any of the JavaScript test frameworks.  They
all have footguns or unfortunate features.  So why not write my own, right?
The testing framework is a bit rough and is certainly no better than any of the
popular frameworks, but it was enough to allow me to think about how to
write a decent test framework.  My next attempt will use most.js to stream
the tests through a test-report pipeline.  (Yes, I need to write more tests!)
