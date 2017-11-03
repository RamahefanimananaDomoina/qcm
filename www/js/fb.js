function getCategoryId(name) {
    var refCat = firebase.database().ref('category');

    return new Promise(function(resolve, reject) {
        refCat.orderByChild('name').equalTo(name).on('value', function (data) {
            var ret;
            for (var prop in data.val()) {
                 ret = prop;
            }
            resolve(ret);
        });
    });
}

function addCategory(name) {
    var refCat = firebase.database().ref('category');
    refCat.push({
        name
    });
}

function getQuestionIds(questId) {
    var refQuestion= firebase.database().ref('question');

    return new Promise(function(resolve, reject) {
        refQuestion.orderByChild('categoryId').equalTo(questId).on('value', function (data) {
            var ret = data.val();
            var keys =[];

            for (var key in data.val()) {
                 keys.push(key);
            }
            resolve(keys);
        });
    });
}

function addQuestion(catId, value) {
    var refQuestion= firebase.database().ref('question');
    var question = {};

    question.categoryId=catId;
    question.value=value;

    refQuestion.push(question);
}


function addReponse(questId, value) {
    /*recuperation ou creation de la table*/
    var refRep= firebase.database().ref('reponse');
    var reponse = {
        questId,
        value
    };

    refRep.push(reponse);
}

function getReponses(questId) {
    var refRep= firebase.database().ref('reponse');

    return new Promise(function(resolve, reject) {
        refRep.orderByChild('questId').equalTo(questId).on('value', function (data) {
            var ret = data.val();

            resolve(ret);
        });
    });
}
/*
// addCategory('CALCUL_MENT')
getCategoryId('PHP').then(function(id) {
    // addQuestion(id, 'Question calcul mental 1');
    getQuestionIds(id).then(function(questionKeys) {
        questionKeys.forEach(function(key) {
            addReponse(key, 'Reponse de ' + key);
        });
    });
});
*/
// app

function getQCMByCategory(catName) {
    return new Promise(function(resolve, reject) {
        getCategoryId(catName).then(function(id) {
            // addQuestion(id, 'Question calcul mental 1');
            // ESSAYER A SUppR RETurn
            var respList = [];
            return getQuestionIds(id).then(function(questionKeys) {
                
                questionKeys.forEach(function(key) {
                    // Promise.all([]);
                    getReponses(key).then(function(reponse) {
                        respList.push(reponse);
                        resolve(respList);
                    });
                });
            });
        });
    });
}

getQCMByCategory('PHP').then(function(data) {
    console.log(data);
});


