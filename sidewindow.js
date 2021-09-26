//checking/Reporting
$(function() {
    $('#div1').find('input').click(function() {
        $('#div1').find('input').attr('class', '');
        $('.contentContainer').find('.showpage').css('display', 'none');
        $(this).attr('class', 'active');
        $('.contentContainer').find('.showpage').eq($(this).index()).css('display', 'block');
    })
})

//detection list
$(function (){
    $("#accordion>div>p").click( function (){
        if($(".dpMenu").css("display")==="none"){
            $(".dpMenu").css('display', 'block')
            $(this).nextAll().slideDown().end().parent().siblings().children("div");
        }else{
            $(".dpMenu").css('display', 'none')
       }

    })
})

//check box
$('input[name="checkItem"]').change(function(){
    $("#box2").prop('checked',true);
})
//textResult & Piechart
$(function() {
    $('#result-area-button').find('input').click(function() {
        $('#result-area-button').find('input').attr('class', '');
        $('#result-area').find('.area').css('display', 'none');
        $(this).attr('class', 'active_result');
        $('#result-area').find('.area').eq($(this).index()).css('display', 'block');
    })
})


