angular.module('starter.services', [])

  .service('PointService', function () {
    this.mauvaiseReponse = 0;
    this.bonneReponse = 0;
    this.nonRepondus = 0;
    this.tailleQuestion = 0;
    this.setPoint = function (point) {
      this.mauvaiseReponse = point;
      console.log(" this.mauvaiseReponse " +  this.mauvaiseReponse );
    };

    this.getPoint = () => {
      return this.mauvaiseReponse;
    };
    this.setBonneReponse = function (points) {
      this.bonneReponse = points;
    };

    this.getBonneReponse = () => {
      return this.bonneReponse;
    };

    this.setNonRepondus = function (points) {
      this.nonRepondus = points;
    };

    this.getNonRepondus = () => {
      return this.nonRepondus;
    };
    this.setTailleQuestion = function (taille) {
      this.tailleQuestion = taille;
    };

    this.getTailleQuestion = () => {
      return this.tailleQuestion;
    };
  })
  .service('LoginService', function(){
    this.name = null;
    this.email = null;
    this.image = null;
    this.friends = 0;
    this.firstName = null;
    this.friendsIsActif = {}
    this.setName = function (name) {
      this.name = name;
      console.log("le nom: "+ this.name);
    };

    this.getName = () => {
      return this.name;
    };

    this.setFirstName = function (firstName) {
      this.firstName = firstName;
    };

    this.getFirstName = () => {
      return this.firstName;
    };
    this.setEmail = function (email) {
      this.email = email;
    };

    this.getEmail = () => {
      return this.email;
    };

     this.setImage = function (image) {
      this.image = image;
    };

    this.getImage = () => {
      return this.image;
    };
     this.setNbAmie = function (nbAmie) {
      this.friends = nbAmie;
    };

    this.getNbAmie = () => {
      return this.friends;
    };

    this.setFriendsIsActif = function (friendsIsActif) {
      this.friendsIsActif = friendsIsActif;
    };

    this.getFriendsIsActif = () => {
      return this.friendsIsActif;
    };
  })
  .factory('LoginFactory',['$q', function($q){
    return null;
  }])
  .factory('CategoryFactory', ['$q', function ($q) {
    const factory = {};

    factory.getAllCategory = function () {
      const deffered = $q.defer();

      const refCat = firebase.database().ref('category');

      refCat.on('value', function (data) {
        const resp = data.val();
        const cats = [];
        for (var prop in resp) {
          cats.push({
            id: prop,
            value: resp[prop].name
          });
        }

        deffered.resolve(cats);
      });

      return deffered.promise;
    }

    return factory;

  }])

  .factory('FirebaseQueryFactory', ['$q', function ($q) {

    const factory = {};

    factory.getQuestionsByCategory = function (categoryId) {
      const deffered = $q.defer();
      var refQuestion = firebase.database().ref('question');
      refQuestion.orderByChild('categoryId').equalTo(categoryId).on('value', function (resp) {
        const data = resp.val();
        const questionList = [];
        for (const prop in data) {
          questionList.push({
            id: prop,
            value: data[prop].value
          });
        }

        deffered.resolve(questionList);
      });
      return deffered.promise;
    }

    factory.getReponsesByQuestionId = function (questId) {
      const deffered = $q.defer();

      var refRep = firebase.database().ref('reponse');

      refRep.orderByChild('questId').equalTo(questId).on('value', function (resp) {
        var data = resp.val();


        if (!data) {
          deffered.resolve({});
          return;
        }
        const ret = {};
        const keys = Object.keys(data);
		console.log(keys);
        const reponses = keys.reduce((acc, key) => {
          acc.push({
            value: data[key].value,
            isTrue: data[key].isTrue
          });
          //acc.push(data[key].isTrue);
          return acc;
        }, []);

        ret[questId] = reponses;
        deffered.resolve(ret);
      });

      return deffered.promise;
    }

    factory.getReponsesByQuestionIds = function (questionList) {
		
			console.log(questionList);
      return $q.all(
        questionList.map(function (question) {
			console.log("question teo  " + question.id);
          return factory.getReponsesByQuestionId(question.id)
        }));
    }


    factory.data = {};

    factory.setData = (data) => {
      factory.data = data;
    };

    factory.getData = () => {
      return factory.data;
    };

    return factory;
  }])
