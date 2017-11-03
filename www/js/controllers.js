angular.module('starter.controllers', [])


  .controller('CategoryCtrl', ['$scope', 'CategoryFactory', 'FirebaseQueryFactory', '$q', '$state', 'LoginService', '$ionicLoading', '$ionicActionSheet', function ($scope, CategoryFactory, FirebaseQueryFactory, $q, $state, LoginService, $ionicLoading, $ionicActionSheet) {
    CategoryFactory.getAllCategory().then(function (catList) {
      $scope.allCategories = catList;
      console.log(catList);
    });

    function generateQCM(selectedItem) {
      const deffered = $q.defer();

      FirebaseQueryFactory.getQuestionsByCategory(selectedItem.id).then((questionList) => {
        if (questionList.length) {
          return FirebaseQueryFactory.getReponsesByQuestionIds(questionList)
            .then(function (responseList) {
              var demo = FirebaseQueryFactory.getReponsesByQuestionIds(questionList);
              console.log("reponseeeeeeeeeeeeeeeee");
              console.log(Object.entries(responseList));
              const resp = responseList.reduce((acc, rep) => {
                console.log(rep);
                const key = Object.keys(rep)[0];
                const arr = rep[key];
                console.log(key);
                acc[key] = arr;
                return acc;
              }, {});

              const data = {};

              data.category = selectedItem.value;
              data.questions = [];
              console.log(resp);

              questionList.map((question) => {
                console.log(question);
                const dataQuestion = {};
                dataQuestion.value = question.value;
                dataQuestion.responses = resp[question.id];
                data.questions.push(dataQuestion);
              });

              deffered.resolve(data);
              $scope.getQuestion = [];
              $scope.getQuestion = data.questions[0].value;
              console.log(data);
              console.log("xxxx" + data.questions[0].value);

              /*console.log('réponse :');
              console.log(data.questions[0].responses);*/
            });
        }
      });

      return deffered.promise;
    }

    function doLogout() {
      var hideSheet = $ionicActionSheet.show({
        destructiveText: 'Déconnecter',
        titleText: 'Êtes-vous sûr de vouloir vous déconnecter?',
        cancelText: 'Annuler',
        cancel: function () {},
        buttonClicked: function (index) {
          return true;
        },
        destructiveButtonClicked: function () {
          $ionicLoading.show({
            template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
          })
          facebookConnectPlugin.logout(function () {
            $ionicLoading.hide();
            console.log("Logged out");
            $state.go('tab.login');
          }, function (fail) {
            $ionicLoading.hide();
            console.log("Failed Logged out");
          });
        }
      });
    }
    $scope.onSelectCategoryChange = function (selectedItem) {
      generateQCM(selectedItem).then((data) => {
        console.log(data);
        FirebaseQueryFactory.setData(data);
        $state.go('tab.qcm');
      });
    };
    console.log('Nom :' + LoginService.getName());
    $scope.name = LoginService.getName();
    $scope.image = LoginService.getImage();
    $scope.friendsCount = LoginService.getNbAmie();
    $scope.firstName = LoginService.getFirstName();
    $("#doLogout").on('click', doLogout);
  }])

  .controller('LoginCtrl', ['$scope', 'LoginFactory', '$state', '$ionicLoading', '$ionicModal', 'LoginService', function ($scope, LoginFactory, $state, $ionicLoading, $ionicModal, LoginService) {


    $scope.loginData = {};
    $ionicModal.fromTemplateUrl('templates/tab-login.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.modal = modal;
    });
    $scope.closeLogin = function () {
      $scope.modal.hide();
    };

    $scope.login = function () {
      $scope.modal.show();
    };

    function toggleSignIn() {
      $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
      });

      console.log("dans la fonction toggleSignIn");
      if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        // [END signout]
      } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
            $ionicLoading.hide();
          } else {
            alert(errorMessage);
            $ionicLoading.hide();
          }
          console.log(error);
          document.getElementById('quickstart-sign-in').disabled = false;
        });
      }
      document.getElementById('quickstart-sign-in').disabled = true;
      console.log("veeeeeee");
      firebase.auth().onAuthStateChanged(function (user) {
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE]
          console.log("vous etes connecter");

          $state.go('tab.cat');
          $ionicLoading.hide();
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE]

          document.getElementById('quickstart-sign-in').textContent = 'Se connecter';

        }
        document.getElementById('quickstart-sign-in').disabled = false;
      });

      document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);

    }

    function getFriendsIsConnected() {

    }

    function doLogin() {

      console.log('Doing login');
      facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'],
        function (response) {
          console.log('successefully logged is ' + JSON.stringify(response));
          console.log('conneccté sa tsi : ' + response.status);


          var authResponse = response.authResponse;
          facebookConnectPlugin.api("/me?fields=id,email,friends,picture.type(large),first_name,last_name,name&access_token=" + authResponse.accessToken, null,
            function (profileInfo) {
              console.log('successefully fetched in ' + JSON.stringify(profileInfo));
              $scope.username = profileInfo.name;
              //$scope.friendsIsActif = profileInfo.taggable_friends.data;
              $scope.friendsCount = profileInfo.friends.summary.total_count;
              $scope.first_name = profileInfo.first_name;
              LoginService.setName($scope.username);
              $scope.firiendsIsConnected = "https://graph.facebook.com/" + authResponse.userID + "/friends?fields=installed"
              $scope.userPicUrl = "https://graph.facebook.com/" + authResponse.userID + "/picture?type=large";
              console.log(JSON.stringify(profileInfo));
              LoginService.setImage(($scope.userPicUrl));
              LoginService.setNbAmie(($scope.friendsCount));
              LoginService.setFirstName(($scope.first_name));
              //LoginService.setFriendsIsActif($scope.friendsIsActif);
              console.log(JSON.stringify($scope.firiendsIsConnected));
              $state.go('tab.cat');
            },
            function (fail) {
              console.log(fail);
            });
        },
        function (error) {
          console.log(error);
        }

      );

    }
    $("#quickstart-sign-in").on('click', toggleSignIn);
    $("#doLogin").on('click', doLogin);
  }])

  .controller('BaremCtrl', ['$scope', 'LoginService', 'PointService', 'FirebaseQueryFactory', function ($scope, LoginService, PointService, FirebaseQueryFactory) {
    //drawPieChart();
    $scope.totalBareme = 0;
    $scope.allFriend = [];
    $scope.reponseFaux = PointService.getPoint();
    $scope.reponseVrai = PointService.getBonneReponse();
    $scope.tailleQuestion = PointService.getTailleQuestion();
    $scope.firstName = LoginService.getFirstName();
    $scope.friendsIsActif = LoginService.getFriendsIsActif();
    $scope.toggleGroup = function (group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function (group) {
      return $scope.shownGroup === group;
    };

    function share() {

      FB.ui({
        method: 'share',
        display: 'popup',
        href: 'https://github.com/rdomoina/qcm',
      }, function (response) {});
    };

    function invite() {
      FB.ui({
        method: 'apprequests',
        title: 'Découvrez cette application!',
        message: 'Je vous invite a télecharger cet application!!!',
        display: 'popup'
      }, function requestCallback(response) {
        console.log(response);
      });

    };
    FB.api(
      '/me/friends',
      'GET', {
        "fields": "name,id,first_name,picture"
      },
      function (response) {
        $scope.$apply(() => {
          $scope.allFriend = response.data;
        })

        for ($i = 0; $i < response.data.length; $i++) {
          console.log('listes ' + response.data[$i].name)
          $scope.resultat = response.data[$i];
          const arr = Object.keys(response.data).map(function (key) {
            $scope.allFriends = response.data[key];
            console.log(response.data[key])
            return response.data[key];
          });

        }


        console.log($scope.resultat);
      }


    );
    FB.getLoginStatus(function (response) {
      if (response.status === 'connected') {
        var access_token = FB.getAuthResponse()['accessToken'];
        console.log('eeeeeeehhhhhhhhh', access_token);
        FB.api('/me/scores/', 'post', {
          scores: 1000
        }, function (response) {
          console.log('eeeeeeehhhhhhhhh');
          console.log(response);
          FB.api('/1604948252909779/scores/', 'get', function (response2) {
            console.log(response2);
          });
        });
      }
    });


    function getCategory() {
      const ref = firebase.database().ref('category');
      var resultat = [];
      ref.on('value', function (data) {
        const resp = data.val();
        var cats = [];
        var statistique = [];
        var tabCat = [];

        var i = 0;
        for (var prop in resp) {
          cats[i] = resp[prop].name;
          statistique[i] = resp[prop].statistique;
          tabCat.push({
            category: cats[i],
            stat: statistique[i]
          });
          resultat.push([tabCat[i].category, tabCat[i].stat]);
          i++;
        }
        //console.log('resultat : ', resultat);

      });
      return resultat;
    }
    const drawChartCallback = () => {
      const ref = firebase.database().ref('category');
      var resultat = [['Task', 'Hours per Day']];
      ref.on('value', function (data) {
        const resp = data.val();
        var cats = [];
        var statistique = [];
        var tabCat = [];

        var i = 1;
        for (var prop in resp) {
          //cats += '['+resp[prop].name + ','+resp[prop].statistique+']';
          cats[i] = resp[prop].name,
            statistique[i] = resp[prop].statistique;
          tabCat.push({
            category: cats[i],
            stat: statistique[i]
          });
          i++;
        }
        var taille = Object.keys(resp).length;
        for (var j = 0; j < taille; j++) {
          resultat.push([tabCat[j].category, tabCat[j].stat]);
        }
      });
      var data = google.visualization.arrayToDataTable(
        resultat
        //['Task', 'Hours per Day'],
        // ['Calcul mental', 11],
        // ['PHP', 2],
        // ['DotNet', 2],
        // ['XML', 2],
        // ['Java', 7]
      );

      var options = {
        title: 'Catégories les plus répandues',
        is3D: true,
      };

      var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
      chart.draw(data, options);
    }

    const showChart = () => {
      const google = window.google;
      if (google) {
        google.load("visualization", "1", {
          packages: ["corechart"],
          callback: drawChartCallback
        });
      }
    };

    function getCategoryId(name) {
      var refCat = firebase.database().ref('category');

      return new Promise(function (resolve, reject) {
        refCat.orderByChild('name').equalTo(name).on('value', function (data) {
          var ret;
          for (var prop in data.val()) {
            ret = prop;
          }
          resolve(ret);
        });
      });
    }

    function updateStatical() {
      const data = FirebaseQueryFactory.getData();
      let cat = data.category;
      let responseFalse = $scope.reponseFaux;
      let responseTrue = $scope.reponseVrai;
      let value = (responseTrue * 100) / $scope.tailleQuestion;
      console.log("statstisque : " + value + " %  category " + cat);
      getCategoryId(cat).then(function (id) {
        console.log("id eeeee : " + id);
        var refCat = firebase.database().ref().child("category").child(id);
        var countUsers = 0;
        var stat = 0;
        refCat.once('value', function(snapshot){
          countUsers = snapshot.val().countUser + 1;
          stat = snapshot.val().statistique;
        }); 
        var statistique = (stat + value) / countUsers;      
        refCat.update({
          statistique: statistique,
          countUser: countUsers
        });
      })
      return value;
    }
    showChart();
    updateStatical();

    $("#doShare").on('click', share);
    $("#doInvite").on('click', invite);

  }])

  .controller("QcmCtrl", ['$scope',
    'FirebaseQueryFactory',
    '$rootScope',
    '$ionicLoading',
    '$state',
    'PointService',
    function ($scope, FirebaseQueryFactory, $rootScope, $ionicLoading, $state, PointService) {
      const data = FirebaseQueryFactory.getData();
      var json;
      var compter = 0;
      var radom = Math.floor(Math.random() * data.questions.length);
      $ionicLoading.show({
        template: '<div class="loader"><svg class="circular"><circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg></div>'
      });
      $scope.temp = [];
      $scope.bareme = 0;
      $scope.totalBareme = 0;
      $scope.reponseFaux = 0;
      $scope.reponseVrai = 0;

      function precedent() {
        $scope.questionList = data.questions;
        json = data;
        if (compter < json.questions.length) {
          document.getElementById("questionEncours").innerHTML = "<label class='label label-default'>Question : </label>" + json.questions[compter].value;
          document.getElementById("button").innerHTML = "<nav aria-label='navigation'><ul class='pager'><li class='previous'><a title='Précédent' id='precedent'>Précédent</a></li><li class='next'><a title='Suivant' id='suivant'>Suivant</a></li></ul></nav>";
          document.getElementById("reponsesList").innerHTML = "";
          for (var i = 0; i < json.questions[compter].responses.length; i++) {
            var contentInput = json.questions[compter].responses[i].value;
            var span = document.createElement('span');
            var att = document.createAttribute('class');
            att.value = 'row';
            span.setAttributeNode(att);
            span.innerHTML = ['<div><input type="radio" id="reponse" value=', json.questions[compter].responses[i].isTrue, '  name="radio"></div> ', contentInput].join('');
            document.getElementById("reponsesList").insertBefore(span, null);

          }
          compter--;
          $("#precedent").on('click', precedent);
          $(".row").on('click', insert);
          $("#suivant").one('click', insert);
        }
      }

      function insert() {

        if ($('input[name=radio]:checked').val() == 'true') {
          console.log("bravo!!!" + $('input[name=radio]:checked').val());
          $scope.bareme = $scope.bareme + 1;
          $scope.reponseVrai = $scope.reponseVrai + 1;
        } else if ($('input[name=radio]:checked').val() == 'false') {
          $scope.reponseFaux = $scope.reponseFaux + 1;
          console.log("Vous etes null!!" + $('input[name=radio]:checked').val());
        }
        PointService.setPoint($scope.reponseFaux);
        PointService.setBonneReponse($scope.reponseVrai);
        console.log('reponse vraie : ' + $scope.reponseVrai);
        console.log('reponse fausse : ' + $scope.reponseFaux);
        console.log('reponse total point : ' + $scope.bareme);

        $scope.questionList = data.questions;
        PointService.setTailleQuestion(data.questions.length);
        json = data;
        if (compter < json.questions.length) {

          document.getElementById("questionEncours").innerHTML = "<label class='label label-default'>Question : </label>" + json.questions[compter].value;
          document.getElementById("button").innerHTML = "<nav aria-label='navigation'><ul class='pager'><li class='previous'><a title='Précédent' id='precedent'>Précédent</a></li><li class='next'><a title='Suivant' id='suivant'>Suivant</a></li></ul></nav>";
          document.getElementById("reponsesList").innerHTML = "";
          for (var i = 0; i < json.questions[compter].responses.length; i++) {
            var contentInput = json.questions[compter].responses[i].value;
            var span = document.createElement('span');
            var att = document.createAttribute('class');
            att.value = 'row';
            span.setAttributeNode(att);
            span.innerHTML = ['<div><input type="radio" id="reponse" value=', json.questions[compter].responses[i].isTrue, '  name="radio"></div> ', contentInput].join('');
            document.getElementById("reponsesList").insertBefore(span, null);

          }

          compter++;
          $("#precedent").on('click', precedent);
          $(".row").on('click', insert);
          $("#suivant").one('click', insert);


        } else {
          console.log("Y a plus de question");
          $state.go('tab.resultat');
          console.log("Changement de page");
        }

      };

      if (data.category) {
        console.log("il y en a des catégories ");
        $ionicLoading.hide();


        $("#demarre").click(function () {
          var boutton = document.getElementById('demarre').innerHTML = 'Pause';
          var att = document.createAttribute("class");
          att.value = "pause";
          drawCanvas();
          $scope.questionList = data.questions;
          json = data;
          document.getElementById("questionEncours").innerHTML = "<label class='label label-default'>Question :</label> " + json.questions[compter].value;
          document.getElementById("timing").innerHTML = "<label><i class='glyphicon glyphicon-time'></i> Temps restant :</label>";
          document.getElementById("button").innerHTML = "<nav aria-label='navigation'><ul class='pager'><li class='previous disabled'><a title='Précédent' id='precedent'>Précédent</a></li><li class='next'><a title='Suivant' id='suivant'>Suivant</a></li></ul></nav>";
          var input = "";
          document.getElementById("reponsesList").innerHTML = "";
          for (var i = 0; i < json.questions[compter].responses.length; i++) {
            var contentInput = json.questions[compter].responses[i].value;
            var span = document.createElement('span');
            var att = document.createAttribute('class');
            att.value = 'row';
            span.setAttributeNode(att);
            span.innerHTML = ['<div id="input"><input type="radio"  value=', json.questions[compter].responses[i].isTrue, ' name="radio"></div> ', contentInput].join('');
            document.getElementById("reponsesList").insertBefore(span, null)


          }

          compter++;
          $("#suivant").one('click', insert);
          $(".row").one('click', insert);

        });
        $(".pause").one('click', function () {
          console.log('On est Pause');
        });

      }


    }
  ]);
