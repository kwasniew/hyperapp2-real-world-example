# Real Word Example App in Hyperapp v2

## Design decisions

### Zero-dependency micro libraries

For production dependencies prefer tiny zero-dependency libraries because:
* you can reason about their sources w/o being a core contributor
* they provide more stable abstraction and do one thing well
* they are easier to compose
* the app loads fast by default
* they don't bring their whole family to the party :)


Examples (minified+gzipped):
* [hyperapp](https://bundlephobia.com/result?p=hyperapp@2.0.0-beta.22) 1.9kB
* [htm](https://bundlephobia.com/result?p=htm@2.1.1) 0.7kB
* [hyperapp-fx](https://bundlephobia.com/result?p=hyperapp-fx@2.0.0-beta.1) 1.6kB
* [snarkdown](https://bundlephobia.com/result?p=snarkdown@1.2.2) 1.0kB
* [classcat](https://bundlephobia.com/result?p=classcat@4.0.2) 0.3kB
* [page](https://bundlephobia.com/result?p=page@1.11.4) 3.9kB (this one has 1 dependency)

### Development without tooling

Point your static web server to your src directory and you're ready to go. Startup time in milliseconds.
No bundler, no transpiler, no file watcher needed. Just your web server, static files and a refresh button.
View-source driven development in its finest form.

Common obstacles:
* browsers don't understand CommonJS syntax, so choose libraries with native ES6 modules support and write fully qualified
imports in your source code
* JSX requires transpilation, so use JavaScript (e.g. tagged templates in [htm](https://github.com/developit/htm) library)
* some transitive dependencies are not ES6 compliant, so translate npm dependencies for the browser at installation time with [pika-web](https://github.com/pikapkg/web)
* IDEs/text editors can't handle tagged templates formatting, so use prettier which does it pretty well

### Functional thinking over OO thinking

Most important functional concepts in our codebase (by convention since language can't make those guarantees):
* all JS functions w/o side effects
* one centralized immutable state and one way data flow inspired by the Elm Architecture
* view as a function of state
* actions implemented with [effects as data](https://github.com/okwolf/hyperapp-fx) so no callbacks/Promises/async/await in the
user space

I find it easier to reason about and refactor functional code.


### Minimal logic in view functions

* View functions should mostly check the presence of fields and iterate over lists
* Try to move your logic to the actions
* If there's some derived state to compute, create selector functions

Additionally this project uses functions with explicit input parameters destructuring. Tradeoff: more boilerplate but
no magic.

### Navigation pattern

We're doing client-side routing to be compliant with the RealWorld app spec. Personally I'd prefer server-side
navigation between pages (less client side code, already implemented by the browser, no back-button amnesia etc.).

Out app's navigation flow:
* open some URL (directly in a navigation bar or with a link)
* client-side router triggers page init action
* init action sets immediate state and renders initial view
* if needed, init action triggers the effect to fetch server data
* when the server data arrives view rendering completes

Ability to trigger action that sets immediate initial state is crucial as it allows to avoid unnecessary null checks
in the view code.

### Business centric code organization

Main application pages are split into individual files (pages/article.js, pages/editor.js etc.) with shared fragments
extracted into a separate directory (page/fragments).

Inside each page file we have the following structure:
```
// Actions & Effects
// ------------------
// actions and effects specific to a page
// export loadPage action for a page

// Views
// ------------------
// view fragments specific to a page
// selectors used by view fragments
// export main view function for a page
```
Since views and actions change together we keep them together (common closure principle). I find it easier to
refactor code this way.

Also when we need to delete a business feature it's just a matter of deleting one file.

Finally, I prefer to keep folders relatively flat as too much nesting makes it hard for me to find things.

### Keeping language features to a minimum

Hyperapp makes it easy to use the small subset of standard JS while skipping the bad parts and nonstandard extensions.

Things I don't use and what is used instead:
* this, new, classes -> functions and object literals
* callbacks, promises, async/await, generators -> effects as data
* imperative loops -> Array.map/filter/find
* let, var -> const
* JSX -> tagged templates
* state hooks, reactive assignments -> Elm Architecture

### Build tools as a production optimisation step

Parcel is used to create a transpiled (older browsers support) and minified/tree-shaken bundle (even faster load time).

Raw source size: < 1300 LOC (60% of the Hyperapp v1 version)

Minified+gzipped bundle: 16.5kB

Lighthouse score: 100


It makes it one of the smallest and fastest to load versions of RealWorld app.

When comparing different implementations remember that:
* code formatting matters
* some versions are more buggy than the others and do less error handling
* some version lack features

### No code splitting

I've run some experiments with this codebase and code splitting per route/page brings only minor improvements over single bundle when visiting a home page (16.5kB vs 15kB).
After navigating all the pages, single bundle minifies/gzips more effectively so we ship fewer bytes overall (16.5kB vs 31kB).

### Testing strategy

I wanted to optimize for fast, easy to write and stable tests.

I decided to go for page/component tests in jsdom. This style of testing allows for aggressive refactoring
without breaking tests.

Tools:
* mocha - popular test runner with built-in reporter, less magical than jest
* esm - allows to use ES6 modules in Node.js before we get better native support
* jsdom - faster than spinning the browser (jsdom startup time is still our major bottleneck)
* polly.js - on first test run we're recording HTTP traffic (faster than writing manual stubs). For subsequent runs
we reply the recorded responses for faster I/O
* dom-testing-library - convenient utils for async waiting, DOM querying and firing events
