import React from 'react'

import { createPlugin } from './createPlugin'
import ReactServerWrapper from './ReactServerWrapper'

const transform = createPlugin({
  renderWrapper(component, attributes) {
    return <ReactServerWrapper component={component} attributes={attributes} />
  },
})

export default { transform, client: false, server: true }
