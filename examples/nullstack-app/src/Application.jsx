import Nullstack from 'nullstack'

import './Application.css'
import { ReactComponent } from './react/ReactComponent'

class Application extends Nullstack {

  counter = 0
  mounted = true

  prepare({ page }) {
    page.locale = 'en-US'
  }

  onClick() {
    this.counter++
  }

  toggleMounted() {
    this.mounted = !this.mounted
  }

  render() {
    return (
      <div>
        Outside Component
        <button onclick={this.toggleMounted}>Toggle Mounted</button>
        <button onclick={this.onClick}>Nullstack Counter {this.counter}</button>
        {this.mounted && (
          <ReactComponent title={`NullStack counter going to React: ${this.counter}`} onClick={this.onClick}>
            Component children
          </ReactComponent>
        )}
      </div>
    )
  }

}

export default Application
