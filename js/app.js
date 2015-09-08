var app = angular.module('myApp', ['ngCookies', 'Game']);

app.controller('myCtrl', ['$scope', 'GameManager', function ($scope, GameManager) {
	this.game = GameManager;
}]);