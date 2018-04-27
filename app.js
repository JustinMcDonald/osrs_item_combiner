var express = require('express')
  , request = require('request')
  , jsdom = require('jsdom')
  , logger = require('morgan')
  , app = express()
  , template = require('jade').compileFile(__dirname + '/source/templates/home.jade')

const { JSDOM } = jsdom;

const TITLE = 'Item Combiner';

app.use(logger('dev'))
app.use(express.static(__dirname + '/public'))
app.use('/js', express.static(__dirname + '/public/js'))

app.get('/', function (req, res, next) {
  try {
    getAllItemSources('uncut gems', res)
  } catch (e) {
    next(e)
  }
})

app.get('/search', function(req, res, next) {
  try {
    getAllItemSources(req.query.search, res)
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 8081, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 8081))
})

getAllItemSources = function(search, res) {
  getPage(1, search, [], res);
}

getPage = function(pageNumber, search, imageStore, res) {
  request({
    url: 'http://2007rshelp.com/items.php?page=' + pageNumber + '&order=ASC&category=name&search_area=name&search_term=' + search,
    headers: {
      'Content-Type': 'text/html'
    }
  }, function(error, response, body) {
    var currentStoreSize = imageStore.length;
    var dom = new JSDOM(body);
    imageTags = dom.window.document.getElementsByTagName('img');
    console.log(imageTags.length);
    for (var i = 0; i < imageTags.length; i++) {
      if (imageTags[i].height == 50 && imageTags[i].width == 50)
        imageStore.push('http://2007rshelp.com' + imageTags[i].src);
    }
    if (imageStore.length > currentStoreSize) getPage(pageNumber + 1, search, imageStore, res);
    else res.send(template({
      title: TITLE,
      hero: 'Search for Items',
      imageStore: imageStore,
      search: search
    }))
  });
}
