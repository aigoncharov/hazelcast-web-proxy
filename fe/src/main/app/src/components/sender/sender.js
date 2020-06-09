import React, { Component } from 'react'

var rest = require('rest')
var mime = require('rest/interceptor/mime')

class Sender extends Component {
  constructor(props) {
    super(props)
    this.state = {
      message: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    if (e.target.name == 'message') {
      this.setState({ message: event.target.value })
    }
  }

  handleSubmit(e) {
    e.preventDefault()
    console.log("submit '", this.state.message, "'")
    setTimeout(() => {
      var client = rest.wrap(mime)
      var self = this

      var restURL = '/send/?message=' + this.state.message

      client({ path: restURL }).then(function(response) {
        console.log('response.entity', response.entity)
      })
    }, 250)
    window.location = '#'
  }

  componentDidMount() {}

  render() {
    return (
      <div class="senderBox">
        <form>
          <label for="message">Message:</label>
          <input type="text" id="message" name="message" value={this.state.message} onChange={this.handleChange} />
          <button onClick={this.handleSubmit}>Submit</button>
        </form>
      </div>
    )
  }
}

export default Sender
