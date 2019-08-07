$( () => {
  $.getJSON("https://favqs.com/api/qotd", (data) => {
    $("#api-quote").html(`"${data.quote.body}" -- ${data.quote.author}`)
  })
})
