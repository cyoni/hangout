import Head from "next/head"
import { useRouter } from "next/router"
import React from "react"
import toast from "react-hot-toast"
import { AutoComplete } from "../../components/AutoComplete"
import ButtonIntegration from "../../components/ButtonIntegration"
import useEditProfile from "../../components/Profile/EditProfile/useEditProfile"
import { getCitiesAutoComplete } from "../../lib/AutoCompleteUtils"
import { newGet } from "../../lib/postman"
import { getFullPlaceName } from "../../lib/scripts/place"

function SetUpAccount() {
  const router = useRouter()
  const toggleOnFinishCallback = () => {
    // update session only if update is successful
    const updateCityInSession = async () => {
      const ans = await newGet("/api/auth/session", { q: "update", cityId })
      console.log("ans", ans)
      if (ans?.place?.cityId === cityId) {
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
  const { handleSelect, submitForm, cityId } = useEditProfile({
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
            className="my-10 "
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