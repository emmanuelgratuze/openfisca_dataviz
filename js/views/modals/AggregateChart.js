define([
	'd3',
	'helpers',

	'jquery',
	'underscore',
	'backbone'
	],
	function (d3, helpers) {

		var AggregateChart = Backbone.View.extend({
			events: {},


			/* Settings */
			maxCenterNumbersByLine: 3,
			width: 980,
			height: 490,
			padding: { top: 20, right: 20, bottom: 20, left: 20 },
			outPosition: {x: -20, y: -20},
			
			/* Properties */
			title: '',
			data: {},
			elements: {},
			layout: undefined,
			parent: undefined,
			scales: {},

			valuesGroups: {},

			initialize: function (args) { var args = args || {};

			/* Have to use ? : : with several options to switch between vals) */

				// this.width = (_.isNumber(args.width)) ? args.width: this.width;
				// this.height = (_.isNumber(args.height)) ? args.height: this.height;
				// this.padding = (_.isObject(args.padding)) ? args.padding: this.padding;
				this.title = (_.isString(args.title)) ? args.title: this.title;

				if(!_.isUndefined(args.parent)) this.parent = args.parent;
				else console.error('Missing parent element arg in AggregateChart constructor');

				if(!_.isUndefined(args.sortKey)) this.sortKey = args.sortKey;
				else console.error('Missing sortKey (data key) arg in AggregateChart constructor');

				this.width = this.parent.width;
				this.height = this.parent.height;
				this.model = this.parent.model;

				this.generateValuesGroup();
				this.createLayouts();

				this.render();
			},
			generateValuesGroup: function () {
				var datas = this.model.get(this.parent.datakey),
					that = this,
					index = 0;
				_.each(datas, function (el) {
					if(typeof el[that.sortKey] == 'undefined') return;

					if(!_.has(that.valuesGroups, el[that.sortKey])) {
						that.valuesGroups[el[that.sortKey]] = {
							count: 0,
							index: index
						}
						index++;
					}
					else {
						that.valuesGroups[el[that.sortKey]].count += 1;
					}
				});
			},
			createLayouts: function () {
				this.datas = this.model.get(this.parent.datakey),
					dataGroupsLength = this.valuesGroups.length,
					that = this;

				this.scales.x = d3.scale.ordinal()
				    .domain(d3.range(Object._length(this.valuesGroups)))
				    .rangePoints([0, this.width], 1);

				// this.scales.y = d3.scale.ordinal()
				// 	.domain(d3.range(Object._length(this.valuesGroups)))
				// 	.rangePoints([0, this.height], 1);

				this.layout = d3.layout.force()
								.nodes(this.datas)
								.gravity(0)
								.charge(0)
								.size([this.width, this.height])
								.on('tick', this.tick.bind(this))
								.start();


				this.datas.map(function (d, i) {
					d.cx = (typeof d[that.sortKey] == 'undefined') ? that.outPosition.x : that.scales.x(that.valuesGroups[d.isPositive.toString()].index);
					d.cy = that.height/2;

					if(d.isPositive == true) d.fill = '#AA7858';
					else d.fill = '#AAAAAA';
				});

				this.parent.d_bubbles
					.attr('cx', function (d, i) {
						if(typeof d[that.sortKey] == 'undefined') return that.outPosition.x;
						else return ;
					})
					.attr('cy', function (d, i) {
						return that.height/2;
					})
			},
			tick: function (e) {
				var that = this;
				var collide = function (alpha) {
					var quadtree = d3.geom.quadtree(that.datas),
						maxRadius = 12,
						padding = 20;

					return function(d) {
						var r = d.r + padding,
						nx1 = d.x - r,
						nx2 = d.x + r,
						ny1 = d.y - r,
						ny2 = d.y + r;
						quadtree.visit(function(quad, x1, y1, x2, y2) {
							if (quad.point && (quad.point !== d)) {
								var x = d.x - quad.point.x,
									y = d.y - quad.point.y,
									l = Math.sqrt(x * x + y * y),
									r = d.r + quad.point.radius + (d.color !== quad.point.color) * padding;
								if (l < r) {
									l = (l - r) / l * alpha;
									d.x -= x *= l;
									d.y -= y *= l;
									quad.point.x += x;
									quad.point.y += y;
								}
							}
							return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
						});
					};
				};

				this.parent.d_bubbles
					.each(this.gravity(.02 * e.alpha).bind(this))
					.each(collide(.5))
					.attr('cx', function (d) { return d.x; })
					.attr('cy', function (d) { return d.y; });
			},
			gravity: function (alpha) {
				return function(d) {
					d.y += (d.cy - d.y) * alpha;
					d.x += (d.cx - d.x) * alpha;
				};
			},
			render: function () {

				return this;
			}
		});
		return AggregateChart;
	}
);