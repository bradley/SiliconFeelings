EmojiEarth
===========

:earth_americas: :earth_africa: :earth_asia:


Dependencies
-----

For Heroku:

- To use this app on Heroku, you will need to add a MongoDB database using one of the MongoDB addons: `heroku addons:add mongolab`


Setup
-----

Install packages needed for server: `npm install`
Install packages needed for client: `bower install`
Start app (local): foreman start


Attribution :revolving_hearts:
-----

I'd like to give a massive thank you to Tom Patterson at [www.shadedrelief.com](www.shadedrelief.com) for providing beautiful Earth texture maps as a public service. Additionally, the blogging of [ Bjørn Sandvik](http://thematicmapping.org/) and of [Jos Dirksen](http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs) proved invalubale in guiding my understanding of [three.js](http://threejs.org/) and with mapping Earth data to three.js sphere geometry. Finally on this note, [Varun Vachhar](http://www.winkervsbecks.com/about.html)'s [example of how to use WebGL as an AngularJS directive](http://winkervsbecks.github.io/angularWebglDirective/) was very helpful in getting me on my way.

As for my understanding of working with emoji in the browser, and with streaming emoji data from Twitter, the blogging and public source code offerings of [Matthew Rothenberg](https://medium.com/medium-long/179cfd8238ac) (creator of [emojitracker.com](http://www.emojitracker.com/)) were extremely influential and helpful... much of my work in app/lib is in part a port of his code in Ruby to Javascript.

Finally, I used the [hi resolution emoji images](https://github.com/greaterweb/emoji-highres) provided by [greaterweb](https://github.com/greaterweb) – shrunken slightly and mapped to a sprite sheet using [TexturePacker](http://www.codeandweb.com/texturepacker) – for the emoji displayed on the client side.