const [server, client] = require('nullstack/webpack.config')

const path = require('path')

function swc(target, other) {
  const config = {
    test: other.test,
    use: {
      loader: require.resolve('swc-loader'),
      options: { jsc: {}, env: {} },
    },
  }

  if (target === 'server') {
    config.use.options.env.targets = { node: process.versions.node }
  } else {
    config.use.options.env.targets = 'defaults'
  }

  config.use.options.jsc.parser = {
    syntax: other.syntax,
    exportDefaultFrom: true,
  }

  if (other.template) {
    config.use.options.jsc.parser[other.template] = true
  }

  config.use.options.jsc.transform = {
    // react: {
    //   throwIfNamespace: true,
    // },
  }

  return config
}

interface LanguageOptions {
  target: string
  test?: string
}

function js(options: LanguageOptions) {
  return swc(options.target, {
    test: options.test || /.*react\/.*\.(js|jsx)$/,
    syntax: 'ecmascript',
    template: 'jsx',
  })
}

function ts(options: LanguageOptions) {
  return swc(options.target, {
    test: options.test || /.*react\/.*\.(ts|tsx)$/,
    syntax: 'typescript',
    template: 'tsx',
  })
}
interface ConfigureReactOptions {
  customClient?: any
  test?: {
    js?: string
    ts: string
  }
}

export function configureReactClient(options: ConfigureReactOptions) {
  const { customClient = client, test } = options
  return (...args) => {
    const config = customClient(...args)
    config.module.rules.push(js({ target: 'client', test: test?.js }))
    config.module.rules.push(ts({ target: 'client', test: test?.ts }))

    return config
  }
}

export function configureReactServer(options: ConfigureReactOptions) {
  const { customClient = client, test } = options
  return (...args) => {
    const config = customClient(...args)
    config.module.rules.push(js({ target: 'server', test: test?.js }))
    config.module.rules.push(ts({ target: 'server', test: test?.ts }))

    return config
  }
}
