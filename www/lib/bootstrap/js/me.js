var centi = 0 
var secon = 0 
var minu = 0 

function chrono() {
    centi++; //incrémentation des dixièmes de 1
    if (centi > 9) {
        centi = 0;
        secon++
    } //si les dixièmes > 9 
    if (secon > 59) {
        secon = 0;
        minu++
    } //si les secondes > 59, 
    document.forsec.secc.value = " " + centi 
    document.forsec.seca.value = " " + secon 
    document.forsec.secb.value = " " + minu 
    compte = setTimeout('chrono()', 100) 
}

function rasee() { 
    clearTimeout(compte)
    centi = 0;
    secon = 0;
    minu = 0;
    document.forsec.secc.value = " " + centi
    document.forsec.seca.value = " " + secon
    document.forsec.secb.value = " " + minu
}
var temp = 0;
if (temp === 0) {
    var elmt = document.getElementById("question2");
    document.getElementById("question3").style.display = "none";
    document.getElementById("question4").style.display = "none";
    document.getElementById("question5").style.display = "none";
    document.getElementById("question6").style.display = "none";
    document.getElementById("question7").style.display = "none";
    document.getElementById("question8").style.display = "none";
    document.getElementById("question9").style.display = "none";
    document.getElementById("question10").style.display = "none";

    document.getElementById("note").style.display = "none";
    elmt.style.display = "none";
    temp = 1;
}
jQuery(document).ready(function(){
    $('#select').on('change', function (event) {
        var categorie = $('#select').val();
        
        $("#demarre").click(function () {
            $("p").append(" <b>Appended text</b>.");
            $("#question").show();
            $("#pause").show();
            var categorie = $('#select').val();
                
            $.ajax({
                url: 'http://localhost/QCM/web/app_dev.php/accueil',
                type: "POST",
                data: 'categorie=' +categorie,
                dataType: 'html',
                success: function (data) {
                    document.getElementById("questionEncours").innerHTML=categorie;
                    console.log('success');
                    
                    
                },
                error: function (xhr, ajaxOptions, thrownError) {console.log('error');}
                
            });
            
        });
        
    });

    $("#pause").click(function () {
        $("#question").hide();
        $("#pause").hide();
            $('#questionEnCours').append("Some appended text.");
    });
    
        //var categorie=[selectedIndex].value;
    $("#input1").click(function () {
        $("#question").hide();
        document.getElementById('question2').style.display = "block";
        var reponse = $('input[name=reponse]:checked').val();
        var categorie =$('#select').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse + '&categorie=' +categorie,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });


        console.log("on est à la question numero 2  et la reponse = " + reponse)

    });
    $("#input2").click(function () {
        $("#question2").hide();
        document.getElementById('question3').style.display = "block";
        var reponse2 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse2,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 3 " + reponse2)
    });
    $("#input3").click(function () {
        $("#question3").hide();
        document.getElementById('question4').style.display = "block";
        var reponse3 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse3,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 4 " + reponse3)
    });
    $("#input4").click(function () {
        $("#question4").hide();
        document.getElementById('question5').style.display = "block";
        var reponse4 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse4,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 5 " + reponse4)
    });
    $("#input5").click(function () {
        $("#question5").hide();
        document.getElementById('question6').style.display = "block";
        var reponse5 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse5,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 6 " + reponse5)
    });
    $("#input6").click(function () {
        $("#question6").hide();
        document.getElementById('question7').style.display = "block";
        var reponse6 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse6,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 7 " + reponse6)
    });
    $("#input7").click(function () {
        $("#question7").hide();
        document.getElementById('question8').style.display = "block";
        var reponse7 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse7,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 8 " + reponse7)
    });
    $("#input8").click(function () {
        $("#question8").hide();
        document.getElementById('question9').style.display = "block";
        var reponse8 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse8,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 9 " + reponse8)
    });
    $("#input9").click(function () {
        $("#question9").hide();
        document.getElementById('question10').style.display = "block";
        var reponse9 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse9,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("on est à la question numero 10 " + reponse9)
    });
    $("#input10").click(function () {
        $("#question10").hide();
        document.getElementById('note').style.display = "block";
        var reponse10 = $('input[name=reponse]:checked').val();
        $.ajax({
            url:'http://localhost/QCM/web/app_dev.php/accueil',
            type: "POST",
            data: 'reponse=' + reponse10,
            dataType: 'html',
            success: function (htmlText) {
                $("#").html(htmlText);
            },
            error: function (xhr, ajaxOptions, thrownError) {

            }

        });
        console.log("note finale ")
        clearTimeout(compte)
        $("#pause").hide();
        $("#demarre").hide();
    });
});


