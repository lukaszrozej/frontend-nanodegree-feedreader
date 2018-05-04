# FeedReader testing

This is a project made for Udacity Front-End Nanodegree.
The goal was to write tests for a FeedReader application.
For more information read [overview provided by Udacity](https://github.com/lukaszrozej/frontend-nanodegree-feedreader/blob/master/README.md)

## Additional stuff

1. I'm testing if URLs of feeds are properly formatted using [regular expression by Diego Perini](https://gist.github.com/dperini/729294)
2. I'm testing menu visiblility using custom matcher that checks if an element is outside the bounds of the document.
3. I'm overwritting the global array allFeeds for the duration of the tests of loadFeed function,
to make sure the function is tested independently of the array.

## Runnning the application

1. Download or clone this repository and open index.html locally.
2. See it online [here](https://lukaszrozej.github.io/frontend-nanodegree-feedreader/)