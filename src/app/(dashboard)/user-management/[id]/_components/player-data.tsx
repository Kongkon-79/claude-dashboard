import React from 'react'
import { User } from './single-user-data-type'

const PlayerData = ({data}:{data:User}) => {
    console.log("view data", data)
  return (
    <div>PlayerData</div>
  )
}

export default PlayerData