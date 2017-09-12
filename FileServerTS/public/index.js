angular.module('app', []).controller('CheckCtrl', function ($scope, $http) {
    $scope.files = [];


    $scope.query = function (status) {
        $http.get("/files/query/100/1", { params: { "status": status } }).then(res => {
            $scope.files = res.data ? res.data.data : [];
        }).catch(err => {
            console.log(err);
        })
    }

    $scope.check = function (file) {
        $http.post(`/files/check/${file.code}`, { "status": !file.status }).then(res => {
            if (res && res.data && res.data == true)
                file.status = !file.status;
        }).catch(err => {
            console.log(err);
        })
    }

});