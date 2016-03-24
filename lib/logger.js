var bunyan = require('bunyan');
var _ = require('lodash');

var logger;
var initializeLogger = _.once(function(){
	var streams;
	if(process.env.NODE_ENV === 'dev' || !process.env.NODE_ENV){
		var bunyanDebugStream = require('bunyan-debug-stream');
		streams = [
			{
				level:  'info',
		        type:   'raw',
		        stream: bunyanDebugStream({
		            basepath: __dirname + '\\..\\' // this should be the root folder of your project.
		        })
			},
			{
				level: 'error',
				type:   'raw',
		        stream: bunyanDebugStream({
		            basepath: __dirname + '\\..\\' // this should be the root folder of your project.
		        })
			},
			{
				level: 'warn',
				type:   'raw',
		        stream: bunyanDebugStream({
		            basepath: __dirname + '\\..\\' // this should be the root folder of your project.
		        })
			}
		]
	} else {
		streams = [
			{
				level:  'info',
		        path:   'appServer.log'
			},
			{
				level: 'error',
				path:   'appServer.log'
			},
			{
				level: 'warn',
				path:   'appServer.log'
			}
		];
	}

	logger = bunyan.createLogger({
		name: "coreApp",
		serializers: {
			req: bunyan.stdSerializers.req,
			res: bunyan.stdSerializers.res,
	        err: bunyan.stdSerializers.err
		},
	    streams: streams
	});
});

initializeLogger();

module.exports = logger;