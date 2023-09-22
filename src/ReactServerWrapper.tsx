import Nullstack, { NullstackClientContext } from 'nullstack'

import React from 'react'
import ReactDomServer from 'react-dom/server'
import { Writable } from 'stream'

interface ReactWrapperProps {
  component: any
  attributes: any
}

class ReactServerWrapper extends Nullstack<ReactWrapperProps> {

  rootRef = null
  reactRoot: any = null
  innerHtml: any = null

  async initiate(context: NullstackClientContext<ReactWrapperProps>) {
    const { environment, component, attributes } = context

    if (environment.server) {
      this.innerHtml = await renderToPipeableStreamAsync(React.createElement(component, attributes))
    }
  }

  render() {
    return <div ref={this.rootRef} html={this.innerHtml} class={context.attributes['data-wrapper-class']} />
  }

}

async function renderToPipeableStreamAsync(vnode) {
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

export default ReactServerWrapper
