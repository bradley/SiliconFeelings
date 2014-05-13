Silicon Feelings
===========
Silicon Feelings is a real time display of Emoji being tweeted by people across Earth using Node.js, Express, AngularJS, and three.js with WebGL.

You can view the production site at [silicons.co](http://silicons.co).

Setup
-----

Install packages needed for server: `npm install`

Install packages needed for client: `bower install`

Symlink app directory with node modules: `cd node_modules && ln -nsf ../app && cd ..`
The node_modules directory is gitignored by default, but if you intend to copy this project's structure and store it in git, you should also commit the symlink: `git add -f node_modules/app`

Create a .env file in the root of the project and fill in your Twitter API credentials following the example content in .example.env

Start app (local): foreman start


Attribution :revolving_hearts:
-----

I'd like to give a massive thank you to Tom Patterson at [shadedrelief.com](http://www.shadedrelief.com/natural3/pages/textures.html) for providing beautiful Earth texture maps as a public service. Additionally, the blogging of [ Bjørn Sandvik](http://thematicmapping.org/) and of [Jos Dirksen](http://www.smartjava.org/content/render-open-data-3d-world-globe-threejs) proved invalubale in guiding my understanding of [three.js](http://threejs.org/) and with mapping Earth data to three.js sphere geometry. Finally on this note, [Varun Vachhar](http://www.winkervsbecks.com/about.html)'s [example of how to use WebGL as an AngularJS directive](http://winkervsbecks.github.io/angularWebglDirective/) was very helpful in getting me on my way.

As for my understanding of working with emoji in the browser, and with streaming emoji data from Twitter, the blogging and public source code offerings of [Matthew Rothenberg](https://medium.com/medium-long/179cfd8238ac) (creator of [emojitracker.com](http://www.emojitracker.com/)) were extremely influential and helpful... much of my work in app/lib is in part a port of his code in Ruby to Javascript.

I'd also like to thank [Sergey Yakunin](http://yakunins.com/my-work/) for allowing me to use his font, [Rayon](http://yakunins.com/rayon/specimen/rayon.html) for this project.

Finally, I used the [hi resolution emoji images](https://github.com/greaterweb/emoji-highres) provided by [greaterweb](https://github.com/greaterweb) – shrunken slightly and mapped to a sprite sheet using [TexturePacker](http://www.codeandweb.com/texturepacker) – for the emoji displayed on the client side.

Arrow icons by [Molly Bramlet](http://thenounproject.com/mollybramlet/) from The Noun Project.
