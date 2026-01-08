import React from 'react'
import { User } from './single-user-data-type'

const TransferHistoryPage = ({data}:{data:User}) => {
    console.log("view data", data)
  return (
    <div>TransferHistoryPage</div>
  )
}

export default TransferHistoryPage