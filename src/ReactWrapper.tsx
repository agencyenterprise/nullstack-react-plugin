import Nullstack, { NullstackClientContext } from 'nullstack'

import React from 'react'
import ReactDomClient from 'react-dom/client'
import ReactDomServer from 'react-dom/server'

interface ReactWrapperProps {
  component: any
  attributes: any
}

class ReactWrapper extends Nullstack<ReactWrapperProps> {

  rootRef = null
  reactRoot: any = null
  innerHtml: any = null
  serverRendered = false

  async initiate(context: NullstackClientContext<ReactWrapperProps>) {
    const { environment, component, attributes } = context

    if (environment.server) {
      // this.innerHtml = await renderToPipeableStreamAsync(React.createElement(component, attributes))
      this.innerHtml = ReactDomServer.renderToString(React.createElement(component, attributes))
      this.serverRendered = true
      if (this.rootRef) {
        ;(this.rootRef as any).innerHtml = this.innerHtml
      }
    } else {
      this.reactRoot = ReactDomClient.createRoot(this.rootRef)
      this.reactRoot.render(React.createElement(component, attributes))
    }
  }

  update({ environment, component, attributes }: NullstackClientContext<ReactWrapperProps>) {
    if (this.reactRoot) {
      this.reactRoot.render(React.createElement(component, attributes))
    } else {
      // this.reactRoot = ReactDomClient.hydrateRoot()
    }
  }

  terminate(context: NullstackClientContext<ReactWrapperProps>) {
    if (this.reactRoot) {
      this.reactRoot.unmount()
      this.reactRoot = null
    }
  }

  render() {
    return <div ref={this.rootRef} />
  }

}

async function getNodeWritable() {
  const nodeStreamBuiltinModuleName = 'stream'
  const { Writable } = await import(/* @vite-ignore */ nodeStreamBuiltinModuleName)
  return Writable
}

async function renderToPipeableStreamAsync(vnode) {
  const Writable = await getNodeWritable()
  let html = ''
  return new Promise((resolve, reject) => {
    let error
    const stream = ReactDomServer.renderToPipeableStream(vnode, {
      onError(err) {
        error = err
        reject(error)
      },
      onAllReady() {
        stream.pipe(
          new Writable({
            write(chunk, _encoding, callback) {
              html += chunk.toString('utf-8')
              callback()
            },
            destroy() {
              resolve(html)
            },
          }),
        )
      },
    })
  })
}

export default ReactWrapper
