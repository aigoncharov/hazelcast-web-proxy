import React, { Component } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import * as io from 'socket.io-client'
//import SockJsClient from 'react-stomp'
import { useTable } from 'react-table'
import styled from 'styled-components'
import update from 'immutability-helper'

const baseUrl = 'http://localhost:3000'

//Styled-components. Could move to CSS
const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    border: 1px solid gray;
    width: 100%;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th {
      color: indigo;
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid gray;
      border-right: 1px solid gray;
      :last-child {
        border-right: 0;
      }
    }
    td {
      color: var(--hazelcast-blue-light);
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid gray;
      border-right: 1px solid gray;
      :last-child {
        border-right: 0;
      }
    }
  }
`

// Table columns
const columns = [
  {
    Header: 'Messages',
    columns: [
      {
        Header: 'When',
        accessor: 'when',
      },
      {
        Header: 'Who',
        accessor: 'who',
      },
      {
        Header: 'What',
        accessor: 'what',
      },
    ],
  },
]

// The '<Table/>' HTML element
function Table({ columns, data }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  })

  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

const alphabetLOWERpart1 = 'abcdefghijklm'
const alphabetLOWERpart2 = 'nopqrstuvwxyz'
const alphabetUPPERpart1 = alphabetLOWERpart1.toUpperCase()
const alphabetUPPERpart2 = alphabetLOWERpart2.toUpperCase()

function rot13(encoded) {
  console.log('rot13', 'in', encoded)
  var decodedArr = []

  for (var i = 0; i < encoded.length; i++) {
    var c = encoded.charAt(i)
    var n1 = alphabetLOWERpart1.indexOf(c)
    var n2 = alphabetLOWERpart2.indexOf(c)
    var n3 = alphabetUPPERpart1.indexOf(c)
    var n4 = alphabetUPPERpart2.indexOf(c)

    if (n1 != -1) {
      c = alphabetLOWERpart2.charAt(n1)
    } else {
      if (n2 != -1) {
        c = alphabetLOWERpart1.charAt(n2)
      } else {
        if (n3 != -1) {
          c = alphabetUPPERpart2.charAt(n3)
        } else {
          if (n4 != -1) {
            c = alphabetUPPERpart1.charAt(n4)
          }
        }
      }
    }
    decodedArr.push(c)
  }
  var decoded = decodedArr.join('')

  console.log('rot13', 'out', decoded)
  return decoded
}

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chat: [],
    }
    const socket = io(baseUrl)
    socket.on('mapItem', (data) => this.handleData(data))
    this.handleData = this.handleData.bind(this)
  }

  handleData(message) {
    console.log('receive', "'", typeof message, "'")
    console.log('receive', "'", message.toString(), "'")
  }

  componentDidMount() {}

  render() {
    return (
      <div class="chatBox">
        <Styles>
          <Table columns={columns} data={this.state.chat} />
        </Styles>
      </div>
    )
  }
}

export default Chat
