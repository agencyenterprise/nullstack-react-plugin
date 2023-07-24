const [server, client] = require("nullstack/webpack.config");

const path = require("path");

function swc(options, other) {
  const config = {
    test: other.test,
    use: {
      loader: require.resolve("swc-loader"),
      options: { jsc: {}, env: {} },
    },
  };

  if (options.target === "server") {
    config.use.options.env.targets = { node: process.versions.node };
  } else {
    config.use.options.env.targets = "defaults";
  }

  config.use.options.jsc.parser = {
    syntax: other.syntax,
    exportDefaultFrom: true,
  };

  if (other.template) {
    config.use.options.jsc.parser[other.template] = true;
  }

  config.use.options.jsc.transform = {
    // react: {
    //   throwIfNamespace: true,
    // },
  };

  return config;
}

function js(options) {
  return swc(options, {
    test: /.*react\/.*\.(js|jsx)$/,
    syntax: "ecmascript",
    template: "jsx",
  });
}

function ts(options) {
  return swc(options, {
    test: /.*react\/.*\.(ts|tsx)$/,
    syntax: "typescript",
    template: "tsx",
  });
}

function customClient(...args) {
  const config = client(...args);
  config.module.rules.push(js({ target: "client" }));
  config.module.rules.push(ts({ target: "client" }));

  return config;
}

function customServer(...args) {
  const config = server(...args);
  config.module.rules.push(js({ target: "server" }));
  config.module.rules.push(ts({ target: "server" }));
  return config;
}

module.exports = [customServer, customClient];
