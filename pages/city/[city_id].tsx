import React from "react"

function City({ cityId }) {
  return <div>city: {cityId}</div>
}

export default City

export async function getServerSideProps(context) {
    console.log("context", context)
  const { city_id } = context.params
  return { props: { cityId: city_id } }
}
