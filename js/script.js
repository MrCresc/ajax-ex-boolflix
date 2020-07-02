// Rendo disponibili le funzionalità al solo caricamento completo del documento
$(document).ready(function() {
  // Applico le funzioni al click del tasto cerca
  $('#searchButton').click(function () {
    var valQuery = $('#searchInput').val()
    // Applico una condizione che esegue le funzioni solo se il campo non è vuoto
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
        // Applico una condizione che esegue le funzioni solo se il campo non è vuoto
        if (valQuery != '') {
          ajaxCall(valQuery)
        } else {
          alert('Il campo è vuoto. La ricerca non ha prodotto risultati.')
        }
      }
    }
  )

  // Al click di un titolo mostro la trama
  $(document).on('click','.object',function () {
    var overview = $(this).find('.overview').text()
    // Applico una condizione che esegue le funzioni solo se c'è una trama
    if (overview != '') {
      $(this).find('.popup_info').fadeToggle()
    }
  })

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
        var context = {
          poster: posterPath(singleMovie.poster_path),
          title: singleMovie.title,
          original_title: singleMovie.original_title,
          original_language: (singleMovie.original_language).toUpperCase(),
          vote_average: star(singleMovie.vote_average),
          langFlag: langFlag(singleMovie.original_language),
          overview: singleMovie.overview
        }
        console.log(singleMovie)
        var html = template(context);
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
          original_language: (singleTv.original_language).toUpperCase(),
          vote_average: starVote,
          langFlag: langFlag(singleTv.original_language)
        }
        console.log(singleTv)
        var html = template(context);
        container.append(html)
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
    var finalPath = 'img/noPoster.jpg'
    if (path != null) {
      var finalPath = 'https://image.tmdb.org/t/p/'+'w500'+path
    }
    return finalPath
  }

  function langFlag(language) {
    var langFlagPath = 'img/noFlag.png'
    if (language === 'en') {
      langFlagPath = 'img/eng.png'
    } else if (language === 'us') {
      langFlagPath = 'img/usa.png'
    } else if (language === 'it') {
      langFlagPath = 'img/ita.png'
    } else if (language === 'fr') {
      langFlagPath = 'img/deu.png'
    } else if (language === 'de') {
      langFlagPath = 'img/fra.png'
    } else if (language === 'es') {
      langFlagPath = 'img/esp.png'
    } else if (language === 'pt') {
      langFlagPath = 'img/ptg.png'
    } else if (language === 'ja') {
      langFlagPath = 'img/jap.png'
    }
    return langFlagPath
  }
});
