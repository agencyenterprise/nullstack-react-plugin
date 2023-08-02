import Nullstack, { NullstackClientContext } from 'nullstack'

import React from 'react'
import ReactDomClient from 'react-dom/client'

interface ReactWrapperProps {
  component: any
  attributes: any
}

class ReactClientWrapper extends Nullstack<ReactWrapperProps> {

  rootRef = null
  reactRoot: any = null
  innerHtml: any = null
  serverRendered = false

  async initiate(context: NullstackClientContext<ReactWrapperProps>) {
    const { environment, component, attributes } = context

    if (environment.server) {
      this.serverRendered = true
    } else {
      this.reactRoot = ReactDomClient.createRoot(this.rootRef)
      this.reactRoot.render(React.createElement(component, attributes))
    }
  }

  update({ component, attributes }: NullstackClientContext<ReactWrapperProps>) {
    if (this.reactRoot) {
      this.reactRoot.render(React.createElement(component, attributes))
    } else {
      this.reactRoot = ReactDomClient.hydrateRoot(this.rootRef, React.createElement(component, attributes))
    }
  }

  terminate() {
    if (this.reactRoot) {
      this.reactRoot.unmount()
      this.reactRoot = null
    }
  }

  render() {
    return <div ref={this.rootRef} />
  }

}

export default ReactClientWrapper
