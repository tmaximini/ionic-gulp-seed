# Ionic Gulp Seed
### An ionic starter project with a gulp toolchain


## Installation

1. Clone this project `git clone https://github.com/tmaximini/ionic-gulp-seed.git <YOUR-PROJECT-NAME>`
2. Change remote to your repo `git remote set-url origin https://github.com/<YOUR-USERNAME>/<YOUR-PROJECT-NAME>.git`
3. run `npm install` and `bower install` to install dependencies


## Structure

The source code lives inside the `app` folder.

| Source Files  | Location |
| ------------- | ------------- |
| Javascript    | `app/scripts`  |
| Styles (Scss) | `app/styles`  |
| Templates     | `app/templates`  |
| Images        | `app/images`  |
| Fonts         | `app/fonts`  |
| Icons         | `app/icons`  |

A lot of starter kits and tutorials encourage you to work directly inside the `www` folder, but I chose `app` instead, as it conforms better with most Angular.js projects. Note that `www` is gitignored and will be created dynamically during our build process.

All 3rd party Javascript sources have to be manually added into `.vendor.json` and will be concatenated into a single `vendor.js` file.
I know there is [wiredep](https://github.com/taptapship/wiredep) but I prefer to explicitly control which files get injected and also wiredep ends up adding lots of `<script>` tags in your index.html instead of building a single vendor.json file.


## Workflow

This doc assumes you have `gulp` globally installed (`npm install -g gulp`).
If you do not have / want gulp globally installed, you can run `npm run gulp` instead.

#### Development mode

By running just `gulp`, we start our development build process, consisting of:

- compiling, concatenating, auto-prefixing of all `.scss` files required by `app/styles/main.scss`
- creating `vendor.js` file from external sources defined in `./vendor.json`
- linting all `*.js` files `app/scripts`, see `.jshintrc` for ruleset
- automatically inject sources into `index.html` so we don't have to add / remove sources manually
- build everything into `.tmp` folder (also gitignored)
- start local development server and serve from `.tmp`
- start watchers to automatically lint javascript source files, compile scss and reload browser on changes


#### Build mode

By running just `gulp --build` or short `gulp -b`, we start gulp in build mode

- concat all `.js` sources into single `app.js` file
- version `main.css` and `app.js`
- build everything into `www` folder


#### Emulate

By running `gulp -e <platform>`, we can run our app in the simulator

- <platform> can be either `ios` or `android`, defaults to `ios`
- make sure to have iOS Simulator installed in XCode, as well as `ios-sim` package installed (`npm install -g ios-sim`)
- for Android, [Genymotion](https://www.genymotion.com/) seems to be the emulator of choice
- It will run the `gulp --build` before, so we have a fresh version to test

#### Run

By running `gulp -r <platform>`, we can run our app on a connected device

- <platform> can be either `ios` or `android`, defaults to `ios`
- It will run the `gulp --build` before, so we have a fresh version to test


