import { getToken } from "next-auth/jwt"
import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import toast from "react-hot-toast"
import { AutoComplete } from "../../components/AutoComplete"
import ButtonIntegration from "../../components/Buttons/ButtonIntegration"
import useEditProfile from "../../components/Profile/EditProfile/useEditProfile"
import { getCitiesAutoComplete } from "../../lib/AutoCompleteUtils"
import { get } from "../../lib/postman"
import { getFullPlaceName } from "../../lib/consts/place"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import { updateSessionData } from "../../lib/scripts/session"

function SetUpAccount() {
  const router = useRouter()
  const toggleOnFinishCallback = () => {
    // update session only if update is successful
    const updateCityInSession = async () => {
      const ans = await updateSessionData({ placeId })
      console.log("ans", ans)
      if (ans?.place.placeId === placeId) {
        console.log("TOKEN HAS BEEN UPDATED")
        router.push("/")
        toast.success(`Welcome, ${ans.user.name}`)
      } else {
        console.log("THERE WAS AN ERROR")
        toast.error("Could not update token.")
      }
    }
    updateCityInSession()
  }
  const { handleSelect, submitForm, placeId } = useEditProfile({
    profile: null,
    toggleOnFinishCallback,
  })

  return (
    <>
      <Head>
        <title>Welcome to Hangouts</title>
      </Head>
      <div className="flex h-[80vh]">
        <div className="mx-auto my-auto w-[500px] rounded-md border p-4 shadow-md">
          <h1 className="text-3xl font-semibold">Welcome to Hangouts</h1>
          <p className="mt-5">Please enter the city you live to proceed.</p>

          <AutoComplete
            label="City"
            className="my-10"
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelect}
            getOptionLabel={getFullPlaceName}
          />

          <ButtonIntegration
            externalClass="btn mx-auto mt-10 w-fit"
            buttonClassName="block"
            onClick={submitForm}
          >
            OK
          </ButtonIntegration>
        </div>
      </div>
    </>
  )
}

export default SetUpAccount

export async function getServerSideProps(context) {
  const user = await getToken(context)
  if (user.place.placeId > 0) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    }
  }
  return {
    props: {},
  }
}
