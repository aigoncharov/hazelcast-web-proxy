import React, { Component } from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import SockJsClient from 'react-stomp'
import { useTable } from 'react-table'
import styled from 'styled-components'
import update from 'immutability-helper'

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

class Chat extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chat: [],
    }
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
