//checking/Reporting
$(function() {
    $('#DP-div1').find('input').click(function() {
        $('#DP-div1').find('input').attr('class', '');
        $('.DP-contentContainer').find('.DP-showpage').css('display', 'none');
        $(this).attr('class', 'active');
        $('.DP-contentContainer').find('.DP-showpage').eq($(this).index()).css('display', 'block');

    })
})

//detection list
$(function (){
    $("#DP-accordion>div>p").click( function (){
        if($(".DP-dpMenu").css("display")==="none"){
            $(".DP-dpMenu").css('display', 'block')
            $(this).nextAll().slideDown().end().parent().siblings().children("div");
        }else{
            $(".DP-dpMenu").css('display', 'none')
        }

    })
})

//check box
$('input[name="checkItem"]').change(function(){
    $("box2").prop('checked',true);
})
//textResult & Piechart
$(function() {
    $('#DP-result-area-button').find('input').click(function() {
        $('#DP-result-area-button').find('input').attr('class', '');
        $('#DP-result-area').find('.DP-area').css('display', 'none');
        $(this).attr('class', 'DPactive_result');
        $('#DP-result-area').find('.DP-area').eq($(this).index()).css('display', 'block');
    })
})


