$(document).ready(function () {

  $('#getHighScores').click(function() {
    getHighScores();
  });

  $('.saveHighScore').click(function() {
    saveHighScore();
  });

  $(".start").submit(function(e) {
    name = document.getElementById("input-name").value;
    localStorage.setItem('name', name);
    init();
    e.preventDefault();
  });

  $(".pause").click(function( e ) {
    pause();
    e.preventDefault();
  });

  $(".icon").click(function() {
    $(".controls").toggleClass("active");
    if ($(this).text() == "options")
      $(this).text("game")
    else
      $(this).text("options");
  });

  $( ".addNewPlayer" ).click(function(e) {
    domElements.classify('players', 'toilet1');
    e.preventDefault();
  });
});



