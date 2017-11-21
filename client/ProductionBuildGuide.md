Step 1:
- run 'npm run build'
After this,the production build should be in the build folder
Step 2:
- Clone this repo to start serving production build on heroku:
https://github.com/qhuydtvt/node-simple
- Copy everything in 'build' folder into 'public' folder of 'node_simple'
- Serve html, css, and js files in this folder using nodejs https://codeforgeek.com/2015/01/render-html-file-expressjs/

For example:
var path = require('path');
...
app.use(express.static(__dirname + '/public'));
...
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname+'public/index.html'));
});
