var app = angular.module("core-app", []);
app.controller("CoreController",
    ["$scope", "$http", "$sce", "$filter", function ($scope, $http, $sce, $filter) {

        $http.get("data/category.json").success(function (response) {
            $scope.categories = response
        });
        $http.get("data/pinned.json").success(function (response) {
            $scope.pinned = response
        });

        $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };

        var getQueryParams = function (qs) {
            qs = qs.split("+").join(" ");
            var params = {}, tokens, re = /#[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])]
                    = decodeURIComponent(tokens[2]);
            }
            return params;
        }

        var searchAny = function () {
            var urlParams = getQueryParams(document.location.hash);
            $scope.search = urlParams["s"];
            $scope.target = urlParams["target"]
        }

        $scope.changeSearch = function (search) {
            $scope.search = search;
        }

        window.onhashchange = function () {
            var urlParams = getQueryParams(document.location.hash);
            var postId = urlParams["post_id"]
            console.log(urlParams)
            $http.get("data/content.json").success(function (response) {
                $scope.isPostMode = false;
                $scope.newPosts = response.newPosts
                $scope.recentPosts = response.recentPosts
                var category = urlParams["category"]
                if (category !== undefined) {
                    $scope.newPosts = $scope.newPosts.filter(post => post.category.name == category)
                    $scope.recentPosts = $scope.recentPosts.filter(post => post.category.name == category)
                }
                if (postId !== undefined) {
                    let findInNewPost = $scope.newPosts.filter(post => post.id == postId)
                    let post
                    if (findInNewPost.length == 0) {
                        let findInRecentPosts = $scope.recentPosts.filter(post => post.id == postId)
                        if (findInRecentPosts == 0) {
                            post = null
                        } else {
                            post = findInRecentPosts[0]
                        }
                    } else {
                        post = findInNewPost[0]
                    }
                    if (post != null) {
                        document.title = post.description
                        $scope.isPostMode = true;
                        $scope.targetPost = post;
                    }
                }
            });
        }
        window.onhashchange();
    }]);
