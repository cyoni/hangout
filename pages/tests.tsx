import React from 'react'
import { queryPlace } from '../lib/place'

function tests({aa}) {
    
  return (
    <div>
        
                {JSON.stringify(aa)}
    </div>
  )
}

export default tests

export async function getServerSideProps(context) {
    const aa = await queryPlace(32)
    console.log("place", aa)
    return {
        props: { aa },
      }
    }