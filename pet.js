var app = angular.module("PetApp", []);

app.controller("PetController", function ($scope, $http) {
    $scope.pets = [];
    // Fetch JSON Data
    $http.get("pet.json").then(function (response) {
        $scope.pets = response.data;
        $scope.$broadcast("jsonLoaded"); // Broadcast event when JSON is loaded
    });
    // Listen for event when JSON is loaded
    $scope.$on("jsonLoaded", function () {
        console.log("Pet data loaded successfully!");
    });
    // Watch for changes in pets array
    $scope.$watch("pets", function (newValue, oldValue) {
        console.log("Pet list updated.");
    }, true);
    // Function to broadcast pet selection
    $scope.selectPet = function (pet) {
        $scope.$emit("petSelected", pet);
    };
    // Listen for pet selection event
    $scope.$on("petSelected", function (event, pet) {
        alert("Selected Pet: " + pet.name);
    });
    // Define sorting key
    $scope.sortKey = "name";
});
