
angular.module('angular-masonry-layout', ['ng']);

angular.module('angular-masonry-layout').directive('masonryLayout', function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div class="masonry-layout" ng-transclude></div>',
        controller: ['$scope', function($scope) {
            var lastColumn = -1;
            this.reload = function(elem) {
                var mosaic = $(elem).closest('.masonry-layout');
                mosaic.masonry();
            };
            this.removeTile = function(elem) {
                //find all the mosaic-columns available
                var mosaic = $(elem).closest('.masonry-layout');
                mosaic.masonry()
                    .masonry( 'remove', elem )
                    .masonry('resize')
                    // layout
                    .masonry();
            };

            this.registerTile = function(elem) {
                //find all the mosaic-columns available
                var mosaic = $(elem).closest('.masonry-layout');
                //get the col size from the data attribute
                var colSize = $(mosaic).attr('data-col-size');
                $(elem).css("width", colSize + 'px');
                mosaic.masonry()
                    .append( elem )
                    .masonry( 'appended', elem )
                    .masonry('resize')
                    // layout
                    .masonry();
            };
        }],
        link: function(scope, element, attrs, fn) {
            //determine the column width based on the number of columns
            var columns = attrs.columns ? parseInt(attrs.columns) : 3;
            var el = $(element).find('.masonry-layout');
            var elsize = $(el).outerWidth();
            var colWidth = elsize / columns;
            $(el).masonry({
                // options
                itemSelector: '.masonry-layout-tile',
                columnWidth: colWidth
            });
            $(el).attr('data-col-size', colWidth);
        }
    };
});

angular.module('angular-masonry-layout').directive('masonryTileLayout', function() {
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        require: '^^masonryLayout',
        template: '<div class="masonry-layout-tile"><div ng-transclude/></div>',
        link: function(scope, element, attrs, mosaic) {
            mosaic.registerTile(element);
            element.resize(function() {
                mosaic.reload(element);
            });
            scope.$on('$destroy', function() {
                mosaic.removeTile(element);
            });
        }
    };
});
