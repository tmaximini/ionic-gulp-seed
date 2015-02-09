'use strict';

// change this to your app's name (angular module)
var appName = 'IonicGulpSeed';


var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var beep = require('beepbeep');
var express = require('express');
var path = require('path');
var open = require('open');
var stylish = require('jshint-stylish');
var connectLr = require('connect-livereload');
var streamqueue = require('streamqueue');
var runSequence = require('run-sequence');
var merge = require('merge-stream');

var args = require('yargs')
    .alias('e', 'emulate')
    .alias('b', 'build')
    .alias('r', 'run')
    .default('build', false)
    .default('port', 9000)
    .argv;



var build = args.build || args.emulate || args.run;
var emulate = args.emulate;
var run = args.run;
var port = args.port;
var targetDir = path.resolve(build ? 'www' : '.tmp');


if (emulate || run) {
    // if we just use emualate without specifying platform, we assume iOS
    if (emulate === true) {
        emulate = 'ios';
    }
    if (run === true) {
        run = 'ios';
    }
    if (emulate) {
        console.info('ionic emulate ' + emulate + '. building first...');
    }
    if (run) {
        console.info('ionic run ' + run + '. building first...');
    }
}


var minifyConfig = {
  collapseWhitespace: true,
  collapseBooleanAttributes: true,
  removeAttributeQuotes: true,
  removeComments: true
};

gulp.task('clean', function(done) {
  del([targetDir], done);
});

var errorHandler = function(error) {
  if (build || prePush) {
    throw error;
  } else {
    beep(2, 170);
    plugins.util.log(error);
  }
};


gulp.task('styles', function() {
  var options = build ?
                { style: 'compressed' } :
                { style: 'expanded' };

  var sassStream = plugins.rubySass('app/styles/main.scss', options)
      .pipe(plugins.autoprefixer('last 1 Chrome version', 'last 3 iOS versions', 'last 3 Android versions'))


  var cssStream = gulp
    .src('bower_components/ionic/css/ionic.min.css');


  return streamqueue({ objectMode: true }, cssStream, sassStream)
    .pipe(plugins.concat('main.css'))
    .pipe(plugins.if(build, plugins.stripCssComments()))
    .pipe(plugins.if(build, plugins.rev()))
    .pipe(gulp.dest(path.join(targetDir, 'styles')))
    .on('error', errorHandler);
});


gulp.task('scripts', function() {
  var dest = path.join(targetDir, build ? '' : 'scripts');

  var templateStream = gulp
    .src('**/*.html', { cwd: 'app/templates'})
    .pipe(plugins.angularTemplatecache('templates.js', {
      root: 'templates/',
      module: appName,
      htmlmin: build && minifyConfig
    }));

  var scriptStream = gulp
    .src(['templates.js', 'app.js', '**/*.js'], { cwd: 'app/scripts' })
    .pipe(plugins.if(!build, plugins.changed(dest)));

  return streamqueue({ objectMode: true }, scriptStream, templateStream)
    .pipe(plugins.if(build, plugins.ngAnnotate()))
    .pipe(plugins.if(build, plugins.concat('app.js')))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build, plugins.rev()))

    .pipe(gulp.dest(dest))

    .on('error', errorHandler);
});

gulp.task('fonts', function() {
  return gulp
    .src(['app/fonts/*.*', 'bower_components/ionic/fonts/*.*'])

    .pipe(gulp.dest(path.join(targetDir, 'fonts')))

    .on('error', errorHandler);
});

gulp.task('templates', function() {
  return gulp
    .src('app/templates/**/*.*')

    .pipe(gulp.dest(path.join(targetDir, 'templates')))

    .on('error', errorHandler);
});
/*
gulp.task('iconfont', function(){
  return gulp.src('app/icons/*.svg', {
        buffer: false
    })
    .pipe(plugins.iconfontCss({
      fontName: 'spaIconFont',
      path: 'app/icons/spa-icons-template.css',
      targetPath: '../styles/spa-icons.css',
      fontPath: '../fonts/'
    }))
    .pipe(plugins.iconfont({
        fontName: 'spaIconFont'
    }))
    .pipe(gulp.dest(path.join(targetDir, 'fonts')))
    .on('error', errorHandler);
});

*/

gulp.task('images', function() {
  return gulp
    .src('app/images/**/*.*')

    .pipe(gulp.dest(path.join(targetDir, 'images')))

    .on('error', errorHandler);
});



gulp.task('jsHint', function(done) {

  return gulp
    .src('app/scripts/**/*.js')
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))

    .on('error', errorHandler);
    done();
});

gulp.task('vendor', function() {
  var vendorFiles = require('./vendor.json');

  return gulp
    .src(vendorFiles)

    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.if(build, plugins.uglify()))
    .pipe(plugins.if(build, plugins.rev()))

    .pipe(gulp.dest(targetDir))

    .on('error', errorHandler);
});

var _inject = function(src, tag) {
  return plugins.inject(src, {
    starttag: '<!-- inject:' + tag + ':{{ext}} -->',
    read: false,
    addRootSlash: false
  });
};

var _getScriptDevSrc = function() {
  var scriptStream = gulp.src(['scripts/app.js', 'scripts/**/*.js'], { cwd: targetDir });
  return streamqueue({ objectMode: true }, scriptStream);
};

// inject the files in index.html
gulp.task('index', function() {

  // build has a '-versionnumber' suffix
  var cssNaming = build ? 'styles/main-*' : 'styles/main*';

  return gulp

    .src('app/index.html')

    .pipe(_inject(gulp.src(cssNaming, { cwd: targetDir }), 'app-styles'))
    .pipe(_inject(gulp.src('vendor*.js', { cwd: targetDir }), 'vendor'))
    .pipe(plugins.if(build,
      _inject(gulp.src('app*.js', { cwd: targetDir }), 'app'),
      _inject(_getScriptDevSrc(), 'app')
    ))

    .pipe(gulp.dest(targetDir))

    .on('error', errorHandler);
});

gulp.task('serve', function() {
  express()
    .use(!build ? connectLr() : function(){})
    .use(express.static(targetDir))
    .listen(port);

  open('http://localhost:' + port + '/', 'Google Chrome');
});

gulp.task('ionic:emulate', plugins.shell.task([
  'ionic emulate ' + emulate
]));

gulp.task('ionic:run', plugins.shell.task([
  'ionic run ' + run
]));

gulp.task('watchers', function() {
  plugins.livereload.listen();

  gulp.watch('app/styles/**/*.scss', ['styles']);
  gulp.watch('app/fonts/**', ['fonts']);
  // gulp.watch('app/icons/**', ['iconfont']);
  gulp.watch('app/images/**', ['images']);
  gulp.watch('app/scripts/**/*.js', ['jsHint', 'scripts', 'index']);
  gulp.watch('./vendor.json', ['vendor']);
  gulp.watch('app/templates/**/*.html', ['scripts', 'index']);
  gulp.watch('app/index.html', ['index']);

  gulp.watch(targetDir + '/**')
    .on('change', plugins.livereload.changed)
    .on('error', errorHandler);
});

gulp.task('noop', function() {});

gulp.task('default', function(done) {
  runSequence(
    'clean',
    //'iconfont',
    [
      'fonts',
      'templates',
      'styles',
      'images',
      'jsHint',
      'scripts',
      'vendor'
    ],
    'index',
    build ? 'noop' : 'watchers',
    build ? 'noop' : 'serve',
    emulate ? 'ionic:emulate' : 'noop',
    run ? 'ionic:run' : 'noop',
    done);
});
