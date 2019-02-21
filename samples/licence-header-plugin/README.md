# licence-header-plugin
licence-header-plugin example for che-theia. Plugin generates new MIT license file header on file edition in format:

```js
/*
* Copyright (c) 2019 Simon's cat. All rights reserved.
* @license MIT
*/

function meow() {
    console.log('Feed me');
}
```

# How to test it
This plugin works with node projects with file extensions '.js', '.ts'. In the package.json should be declared licence type 'MIT' and author(optinal):
```json
{
  "name": "SimonEmulator",
  "version": "1.0.0",
  "description": "Let's feed Simon's cat",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Info: no test specified\" && exit 1"
  },
  "author": "Simon's cat",
  "license": "MIT"
}
```

Open project in the che-theia and open any '.js' or '.ts' file. Change something in the file. Plugin analizes file content.
In case if file doesn't contains MIT license header, than plugin generate it on the top of the file.
