# Nullstack React Plugin

Plugin to allow for React components to be used within Nullstack.

## Getting Started

1. Install the package using the GitHub url like:

```
yarn add 'git+ssh://git@github.com:agencyenterprise/nullstack-react-plugin.git#v{VERSION_NUMBER}'
```

2. Add the plugin to your `server` and `client` files:

### Client:

```javascript
// client.js
import Nullstack from "nullstack";

import Application from "./src/Application";
import reactClientPlugin from "nullstack-react-plugin/client";

Nullstack.use(reactClientPlugin);
const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
};

export default context;
```

### Server:

```javascript
// server.js
import Nullstack from "nullstack";

import Application from "./src/Application";
import reactServerPlugin from "nullstack-react-plugin/server";

Nullstack.use(reactServerPlugin);
const context = Nullstack.start(Application);

context.start = async function start() {
  // https://nullstack.app/application-startup
};

export default context;
```

3. Extend your Webpack configuration from the plugin:

```javascript
// webpack.config.js
const [server, client] = require("nullstack-react-plugin/webpack.config");

module.exports = [server, client];
```

3. Create your React components under a `src/react` folder and use them normally and manually import React into them like `import React from 'react'`.

## Examples

You can find an example app [here](./examples/nullstack-app).

## Troubleshooting

### `TypeError: Cannot read properties of null (reading 'useEffect')`
Make sure you have React imported into the files you're using it, like `import React from 'react'`.

## Developing locally

**I'm seeing `TypeError: Cannot read properties of null (reading 'useEffect')`, what should I do?**

This error is caused when you have packages linked with `yarn link` and packages installed inside the "link", meaning it copies the `node_modules` folder from your lib into the example app.
Erasing the `node_modules` folder from the lib (at the root folder) should solve the issue.
