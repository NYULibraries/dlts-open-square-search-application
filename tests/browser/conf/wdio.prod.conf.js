'use strict';

let merge        = require( 'deepmerge' );
let wdioMainConf = require( './wdio.main.conf.js' );

exports.config = merge( wdioMainConf.config, {
    baseUrl                   : 'https://opensquare.nyupress.org/',
    openSquareGoogleAnalytics : true,
} );
