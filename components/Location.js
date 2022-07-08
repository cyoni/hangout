export const Location = ({hello}) => {
    console.log("hello?", hello)
    return <div>loca</div>
}

// get trips from #address

export async function getServerSideProps(context) {
return {
    props: { hello: "hello" },
  }
}