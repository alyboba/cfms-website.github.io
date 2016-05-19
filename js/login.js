---
---

var authApp = angular.module('authApp', ["firebase"]);

//Switches symbol from curly braces so that it won't conflict with Jekyll
authApp.config(function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
});

//Factory for Authorization Code
authApp.factory("Auth", function($firebaseAuth){
    var ref = new Firebase ("{{ site.firebase_url }}");
    return $firebaseAuth(ref)
});

authApp.controller("AuthController", function($scope, Auth) {
    //Code triggered with change in authentication data.
    Auth.$onAuth(function(authData){
        $scope.authData = authData;
    });

    //New User Code
    $scope.create_new_user = function(){
        Auth.ref.$createUser({
            email: "foo@bar.com",
            password: "password"
        }).then(function(authData){
            //User created
            //Save the user's profile into Firebase so we can list users,
            //Use them in Security and Firebase Rules, and show profiles
            ref.child("users").child(authData.uid).set({
                provider: authData.provider,
                name: getName(authData)
            });
        }).catch(function(error){
            //Error creating user
        });
    }

    //Login Code
    $scope.login = function(email, password){
        Auth.$authWithPassword({
            email: email,
            password: password
        }).catch(function(error){
            //Authentication Error
            //console.error(error);
            vex.dialog.alert("<h3><strong>Error logging onto cfms.org</strong></h3><p>Your username and/or password were incorrect.<br>Please try again.</p>");
        });
    }
    //Logout code
    $scope.logout = function() {
        Auth.$unauth();
    }

    $scope.forgot_password = function() {
        console.log("hi");
    }
});