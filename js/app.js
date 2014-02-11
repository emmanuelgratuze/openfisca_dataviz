define([

	'appV',
	'router',

	'jquery',
	'underscore',
	'backbone'
	],
	function (appV, Router) {

		var App = function () {};
		App.prototype = {
			init: function () {
				this.router = Router.init();
				this.view = appV;
			}
		};

		var app = new App();
		return app;
});