import Nullstack from 'nullstack'

import React from 'react'
import ReactDOM from 'react-dom/server'

interface CreatePluginOptions {
  renderWrapper: (component: any, attributes: any) => any
}

export function createPlugin(options: CreatePluginOptions) {
  const { renderWrapper } = options
  function checkIfReact(node) {
    if (Object.keys(node.type || {}).includes('__useReact') && !node.type.__useReact) return

    if (typeof node.type === 'object') {
      const $$typeof = node.type.$$typeof
      return $$typeof && $$typeof.toString().slice('Symbol('.length).startsWith('react')
    }
    if (typeof node.type !== 'function') return false
    if (node.type.prototype != null && typeof node.type.prototype.render === 'function') {
      return React.Component.isPrototypeOf(node.type) || React.PureComponent.isPrototypeOf(node.type)
    }

    let error = null
    function Tester(...args) {
      try {
        const vnode = node.type(...args)
        node.type.__useReact = vnode && vnode.$$typeof === reactTypeof
      } catch (err) {
        if (!errorIsComingFromPreactComponent(err)) {
          error = err
          node.type.__useReact = false
        }
      }

      return React.createElement('div')
    }

    if (!node.type.__useReact) {
      tryReactRender(Tester, node.attributes, node.children)
    }

    if (node.type.__useReact && !node.type.__useReactInstance) {
      const keys = Object.keys(node.attributes)
      const Component = node.type
      node.type.__useReactInstance = class ReactEntrypoint extends Nullstack {

        render(context) {
          const attributes = keys.reduce((prev, currentKey) => {
            return {
              ...prev,
              [currentKey]: context[currentKey],
            }
          }, {})

          return renderWrapper(Component, attributes)
        }
      
}
    }

    if (node.type.__useReactInstance) {
      node.type = node.type.__useReactInstance
    }
  }

  // const slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_, w) => w.toUpperCase())
  const reactTypeof = Symbol.for('react.element')

  function errorIsComingFromPreactComponent(err) {
    return (
      err.message && (err.message.startsWith("Cannot read property '__H'") || err.message.includes("(reading '__H')"))
    )
  }

  function tryReactRender(Component, props, children) {
    const vnode = React.createElement(Component, { ...props, children })
    try {
      ReactDOM.renderToString(vnode)
    } catch (e) {}
  }

  return (options) => {
    const { node } = options

    if (node && Array.isArray(node.children)) {
      node.children?.forEach(checkIfReact)
    }
  }
}
