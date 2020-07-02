$(document).ready(function() {

  $('#searchButton').click(function () {
    var valQuery = $('#searchInput').val()
    if (valQuery != '') {
      ajaxCall(valQuery)
    } else {
      alert('Il campo è vuoto. La ricerca non ha prodotto risultati.')
    }
  })

  // Aggiungo funzionalità al click del tasto invio sulla tastiera
  $('#searchInput').keypress(
    function (event) {
      if (event.which === 13) {
        var valQuery = $('#searchInput').val()
        if (valQuery != '') {
          ajaxCall(valQuery)
        } else {
          alert('Il campo è vuoto. La ricerca non ha prodotto risultati.')
        }
      }
    }
  )

  function ajaxCall(valQuery) {
    $.ajax(
      {
        url: 'https://api.themoviedb.org/3/search/movie',
        method: 'GET',
        data: {
          api_key: '963cb474d673e5002daba73431170dc1',
          query: valQuery,
          language: 'it-IT'
        },
        success: function(dataMovies) {
          movieContainer = $('.moviesContainer').html('')
          if (dataMovies.total_results > 0) {
            printObject(dataMovies.results,movieContainer,'movies')
          } else {
            var messaggio = 'Non ci sono film corrispondenti'
            $('.moviesContainer').append(messaggio)
          }
          $('#searchInput').val('')
          $('#moviesCounter').html('').append('Movies (' + dataMovies.total_results + ')')
        },
        error: function () {
          alert('Attenzione si è verificato un errore')
        }
      },
      $.ajax(
        {
          url: 'https://api.themoviedb.org/3/search/tv',
          method: 'GET',
          data: {
            api_key: '963cb474d673e5002daba73431170dc1',
            query: valQuery,
            language: 'it-IT'
          },
          success: function(dataMovies) {
            tvContainer = $('.tvsContainer').html('')
            if (dataMovies.total_results > 0) {
              printObject(dataMovies.results,tvContainer,'tvs')
            } else {
              var messaggio = 'Non ci sono serie Tv corrispondenti'
              $('.tvsContainer').append(messaggio)
            }
            $('#searchInput').val('')
            $('#tvsCounter').html('').append('Serie TV (' + dataMovies.total_results + ')')
          },
          error: function () {
            alert('Attenzione si è verificato un errore')
          }
        }
      )
    );
  }

  function printObject(array,container,type) {
    if (type === 'movies') {
      var source = $('#entry-template').html()
      var template = Handlebars.compile(source);
      for (var i = 0; i < array.length; i++) {
        var singleMovie = array[i]
        var starVote = star(singleMovie.vote_average)
        var poster = posterPath(singleMovie.poster_path)
        var context = {
          poster: poster,
          title: singleMovie.title,
          original_title: singleMovie.original_title,
          original_language: singleMovie.original_language,
          vote_average: starVote
        }
        // singleMovie.css("background-image", 'url(' + poster + ')')
        var html = template(context);
        console.log(html)
        container.append(html)
      }

    } else {
      var source = $('#entry-template').html()
      var template = Handlebars.compile(source);
      for (var i = 0; i < array.length; i++) {
        var singleTv = array[i]
        var starVote = star(singleTv.vote_average)
        var poster = posterPath(singleTv.poster_path)
        var context = {
          poster: poster,
          total_tvs_results: singleTv.total_results,
          title: singleTv.name,
          original_title: singleTv.original_name,
          original_language: singleTv.original_language,
          vote_average: starVote
        }
        console.log(singleTv)
        // singleTv.css("background-image", 'url(' + poster + ')')
        var html = template(context);
        container.append(html)
        console.log(poster)
      }
    }

  }

  function star(vote) {
    var voteApprox = Math.ceil((vote/2))
    var emptyVote = 5 - voteApprox
    var starVote = ''
    var emptyStarVote = ''
    var totalStarVote = ''
    for (var i = 0; i < voteApprox; i++) {
      starVote += '<i class="fas fa-star"></i>'
    }
    for (var i = 0; i < emptyVote; i++) {
      emptyStarVote += '<i class="far fa-star"></i>'
    }
    totalStarVote = starVote + emptyStarVote
    return totalStarVote
  }

  function posterPath(path) {
    if (path != null) {
      var finalPath = 'https://image.tmdb.org/t/p/'+'w500'+path
    } else {
      var finalPath = 'img/noPoster.jpg'
    }
    return finalPath
  }

});
