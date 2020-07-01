$(document).ready(function() {
  $('#searchButton').click(function () {
    ajaxCall()
  })

  // Aggiungo funzionalità al click del tasto invio sulla tastiera
  $('#searchInput').keypress(
    function (event) {
      if (event.which === 13) {
      ajaxCall()
      }
    }
  )

  function ajaxCall() {
    $.ajax(
      {
        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
          api_key: '963cb474d673e5002daba73431170dc1',
          query: $('#searchInput').val(),
          language: 'it-IT'
        },
        success: function(dataMovies) {
          $('.container').html('')
          console.log(dataMovies)
          printMovies(dataMovies.results)
          $('#searchInput').val('')
        },
        error: function () {
          alert('Attenzione si è verificato un errore')
        }
      }
    );
  }

  function printMovies(arrayMovies) {
    var source = $('#entry-template').html()
    var template = Handlebars.compile(source);

    for (var i = 0; i < arrayMovies.length; i++) {
      var singleMovie = arrayMovies[i]
      console.log(singleMovie.title)
      var html = template(singleMovie);
      $('.container').append(html)
    }
  }
});
