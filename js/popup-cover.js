// 蓋版廣告
$(".popup-cover").click(function(){
    $(this).fadeOut();
    $(".popup-cover__inner").fadeOut();
});
$(".popup-cover-close").click(function(){
    $(".popup-cover").fadeOut();
    $(".popup-cover__inner").fadeOut();
});