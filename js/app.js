var app = angular.module("core-app", []);
app.controller("CoreController",
    ["$scope", "$http", "$sce", "$filter", function ($scope, $http, $sce, $filter) {

        $scope.allPosts = []
        $scope.newPosts = []
        $scope.posts = []

        $http.get("data/category.json").success(function (response) {
            $scope.categories = response
            $http.get("data/pinned.json").success(function (response) {
                $scope.pinned = response
                $http.get("data/posts.json").success(function (response) {
                    $scope.allPosts = response
                    coreFunction()
                });
            });
        });

        var getPostById = function (id) {
            var result = $scope.allPosts.filter(function (post) {
                return post.id == id;
            })[0]
            return result;
        }

        $scope.homeRedirect = function () {
            $scope.isTarget = false;
            $scope.newPosts = $scope.allPosts.slice(0, 2);
            $scope.posts = $scope.allPosts.slice(2);
            document.title = "Constantine's blog";
            document.location = document.location;
            document.location.hash = "";
            console.log("homeRedirect")
        }

        $scope.clickPost = function (id) {
            var post = getPostById(id)
            $scope.isTarget = true;
            $scope.postUrl = "data/html/" + post.id + ".html";
            $scope.target = id;
            $scope.targetPost = post;
            document.title = post.description;
            document.location.hash = "?target=" + id;
            console.log("clickPost=" + id)
        }

        $scope.clickCategory = function (category) {
            let filteredPosts = $scope.allPosts.filter(post => post.category.name == category)
            document.title = "Constantine's blog"
            if (filteredPosts.length > 2) {
                $scope.newPosts = filteredPosts.slice(0, 2)
                $scope.posts = filteredPosts.slice(2)
            } else {
                $scope.newPosts = filteredPosts
                $scope.posts = []
            }
            document.location.hash = "?category=" + category;
            console.log("clickCategory=" + category)
        }

        var getQueryParams = function (qs) {
            qs = qs.split("+").join(" ");
            var params = {}, tokens, re = /#[?&]?([^=]+)=([^&]*)/g;
            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])]
                    = decodeURIComponent(tokens[2]);
            }
            return params;
        }

        $scope.changeSearch = function (search) {
            $scope.search = search;
            document.location.hash = "?s=" + search;
            console.log("search=" + search)
        }

        var coreFunction = function () {
            var params = getQueryParams(document.location.hash);
            console.log(params);
            $scope.isTarget = false;
            var category = params["category"];
            if (category !== undefined) {
                $scope.clickCategory(category);
            } else {
                var postId = params["target"];
                if (postId !== undefined) {
                    $scope.clickPost(postId);
                } else {
                    if (params.s === undefined) {
                        $scope.homeRedirect();
                    }
                }
            }
        }

        window.onhashchange = function () {
            this.console.log("onhashchange");
            coreFunction();
            $scope.$apply();
        }
    }]);
