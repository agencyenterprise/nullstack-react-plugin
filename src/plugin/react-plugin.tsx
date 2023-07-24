import Nullstack from 'nullstack'

import React from 'react'
import ReactDOM from 'react-dom/server'

import ReactWrapper from '../ReactWrapper'

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
      }
    }

    return React.createElement('div')
  }

  if (!node.type.__useReact) {
    console.debug('testing react render')
    tryReactRender(Tester, node.attributes, node.children)
  }

  if (error) {
    throw error
  }

  if (node.type.__useReact && !node.type.__useReactInstance) {
    console.debug('creating react entrypoint')
    const keys = Object.keys(node.attributes)
    // node.type = function reactEntrypoint(context) {
    //   return <ReactWrapper component={Component} attributes={node.attributes} />
    // }
    const Component = node.type
    node.type.__useReactInstance = class ReactEntrypoint extends Nullstack {
      render(context) {
        const attributes = keys.reduce((prev, currentKey) => {
          return {
            ...prev,
            [currentKey]: context[currentKey],
          }
        }, {})
        return <ReactWrapper component={Component} attributes={attributes} />
      }
    }
  }

  if (node.type.__useReactInstance) {
    console.debug('assigning react entrypoint')
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

// async function getNodeWritable() {
//   const nodeStreamBuiltinModuleName = 'stream'
//   const { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName)
//   return Writable
// }

// async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
//   delete props.class
//   const slots = {}
//   for (const [key, value] of Object.entries(slotted)) {
//     const name = slotName(key)
//     slots[name] = React.createElement(StaticHtml, { value, name })
//   }
//   // Note: create newProps to avoid mutating `props` before they are serialized
//   const newProps = {
//     ...props,
//     ...slots,
//   }
//   if (children != null) {
//     newProps.children = React.createElement(StaticHtml, { value: children })
//   }
//   const vnode = React.createElement(Component, newProps)
//   const result = ReactDOM.renderToString(vnode)
//   console.log('result', result)
//   // let html
//   // if (metadata && metadata.hydrate) {
//   //   if ('renderToReadableStream' in ReactDOM) {
//   //     html = await renderToReadableStreamAsync(vnode)
//   //   } else {
//   //     html = await renderToPipeableStreamAsync(vnode)
//   //   }
//   // } else if ('renderToReadableStream' in ReactDOM) {
//   //   html = await renderToReadableStreamAsync(vnode)
//   // } else {
//   //   html = await renderToStaticNodeStreamAsync(vnode)
//   // }
//   // return { html }
// }

// async function renderToPipeableStreamAsync(vnode) {
//   const Writable = await getNodeWritable()
//   let html = ''
//   return new Promise((resolve, reject) => {
//     let error
//     const stream = ReactDOM.renderToPipeableStream(vnode, {
//       onError(err) {
//         error = err
//         reject(error)
//       },
//       onAllReady() {
//         stream.pipe(
//           new Writable({
//             write(chunk, _encoding, callback) {
//               html += chunk.toString('utf-8')
//               callback()
//             },
//             destroy() {
//               resolve(html)
//             },
//           }),
//         )
//       },
//     })
//   })
// }

// async function renderToStaticNodeStreamAsync(vnode) {
//   const Writable = await getNodeWritable()
//   let html = ''
//   return new Promise((resolve, reject) => {
//     const stream = ReactDOM.renderToStaticNodeStream(vnode)
//     stream.on('error', (err) => {
//       reject(err)
//     })
//     stream.pipe(
//       new Writable({
//         write(chunk, _encoding, callback) {
//           html += chunk.toString('utf-8')
//           callback()
//         },
//         destroy() {
//           resolve(html)
//         },
//       }),
//     )
//   })
// }

// /**
//  * Use a while loop instead of "for await" due to cloudflare and Vercel Edge issues
//  * See https://github.com/facebook/react/issues/24169
//  */
// async function readResult(stream) {
//   const reader = stream.getReader()
//   let result = ''
//   const decoder = new TextDecoder('utf-8')
//   while (true) {
//     const { done, value } = await reader.read()
//     if (done) {
//       if (value) {
//         result += decoder.decode(value)
//       } else {
//         // This closes the decoder
//         decoder.decode(new Uint8Array())
//       }

//       return result
//     }
//     result += decoder.decode(value, { stream: true })
//   }
// }

// async function renderToReadableStreamAsync(vnode) {
//   return readResult(await ReactDOM.renderToReadableStream(vnode))
// }

// /**
//  * Astro passes `children` as a string of HTML, so we need
//  * a wrapper `div` to render that content as VNodes.
//  *
//  * As a bonus, we can signal to React that this subtree is
//  * entirely static and will never change via `shouldComponentUpdate`.
//  */
// const StaticHtml = ({ value, name }) => {
//   if (!value) return null
//   return h('astro-slot', {
//     name,
//     suppressHydrationWarning: true,
//     dangerouslySetInnerHTML: { __html: value },
//   })
// }

// /**
//  * This tells React to opt-out of re-rendering this subtree,
//  * In addition to being a performance optimization,
//  * this also allows other frameworks to attach to `children`.
//  *
//  * See https://preactjs.com/guide/v8/external-dom-mutations
//  */
// StaticHtml.shouldComponentUpdate = () => false

function transform(options) {
  const { node, environment, page, project, pluginData } = options

  if (Array.isArray(node.children)) {
    node.children?.forEach(checkIfReact)
  } else {
  }
}

export default { transform, client: true, server: true }
