window.ItemCombiner = new (function() {
  
  this.ROOT_ID = 'item-combiner-wrapper';

  this.imageHeight = 50;
  this.imageWidth = 50;

  this.imageStore = [];

  this.init = function(imageStore) {
    this.imageStore = (typeof imageStore !== 'undefined') ? imageStore : [];
    //var root = document.createElement('div');
    //root.id = this.ROOT_ID;
    //document.body.innerHTML = root.outerHTML;
    this.combineAndDrawAllImages();
  },

  this.drawNewCanvas = function() {
    var canvas = document.createElement('canvas');
    canvas.height = this.imageHeight;
    canvas.width = this.imageWidth;
    document.getElementById(this.ROOT_ID).appendChild(canvas);
    return canvas;
  },

  this.clearImageStore = function() {
    this.imageStore = [];
  },

  this.resetRootNode = function() {
    var root = document.getElementById(this.ROOT_ID);
    root.style.width = this.imageWidth * this.imageStore.length + 'px';
    root.style.height = this.imageHeight * this.imageStore.length + 'px';
    root.innerHTML = '';
  },

  // DEMO
  this.demo = function() {
    this.getAllItemSources('party');
  },

  this.getAllItemSources = function(search) {
    this.clearImageStore();
    this.getPage(1, search);
  },

  this.getPage = function(pageNumber, search) {
    fetch('http://2007rshelp.com/items.php?page=' + pageNumber + '&order=ASC&category=name&search_area=name&search_term=' + search, {
      headers: {
        'Content-Type': 'text/html'
      }
    }).then(res => res.text())
    .then(function(response) {
      //console.log(response);
      var currentStoreSize = ItemCombiner.imageStore.length;
      var responseHtml = document.createElement('html');
      responseHtml.innerHTML = response;
      imageTags = responseHtml.getElementsByTagName('img');
      for (var i = 0; i < imageTags.length; i++) {
        if (imageTags[i].height == ItemCombiner.imageHeight && imageTags[i].width == ItemCombiner.imageWidth)
          ItemCombiner.imageStore.push(imageTags[i].src);
      }
      if (ItemCombiner.imageStore.length > currentStoreSize) ItemCombiner.getPage(pageNumber + 1, search);
    });
  },

  this.combineAndDrawAllImages = function() {
    this.resetRootNode();
    for (var i = 0; i < this.imageStore.length; i++) {
      for (var j = 0; j < this.imageStore.length; j++) {
        this.combineAndDrawImages(this.imageStore[i], this.imageStore[j]);
      }
    }
  },

  this.combineAndDrawImages = function(imageSrc1, imageSrc2) {
    var canvas = this.drawNewCanvas();
    var context = canvas.getContext('2d');
    context.globalAlpha = 0.5;
    var imageObj1 = new Image();
    var imageObj2 = new Image();
    imageObj1.src = imageSrc1;
    imageObj1.onload = function() {
       context.drawImage(imageObj1, 0, 0, ItemCombiner.imageHeight, ItemCombiner.imageWidth);
       imageObj2.src = imageSrc2;
       imageObj2.onload = function() {
          context.drawImage(imageObj2, 0, 0, ItemCombiner.imageHeight, ItemCombiner.imageWidth);
          //var combinedImage = canvas.toDataURL("image/png");
          //document.write('<img src="' + combinedImage + '" width="' + ItemCombiner.imageHeight + '" height="' + ItemCombiner.imageWidth + '"/>');
       }
    };
  }
});
