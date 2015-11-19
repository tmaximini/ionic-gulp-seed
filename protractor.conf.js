exports.config = {
	framework: 'mocha',

    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://localhost:9000',

    multiCapabilities: [{
        browserName: 'chrome'
    }],

    mochaOpts: {
    	timeout: 4000
    },

    onPrepare: function(){
    	global.expect = require('chai').expect;
    }
}