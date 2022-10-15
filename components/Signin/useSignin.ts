import { useRouter } from "next/router"
import { toast } from "react-hot-toast"
import { useMutation } from "@tanstack/react-query"
import { post } from "../../lib/postman"
import { isNullOrEmpty } from "../../lib/scripts/strings"
import { signIn } from "next-auth/react"
import { ACCOUNT_EXISTS_CODE } from "../../lib/consts/consts"

function useSignIn() {
  const router = useRouter()
  const isValid = ({ name, email, password, placeId }) => {
    if (isNullOrEmpty(name)) {
      toast.error("Please enter a name.")
      return false
    }

    if (isNullOrEmpty(email)) {
      toast.error("Please enter a valid email.")
      return false
    }

    if (isNullOrEmpty(password)) {
      toast.error("Please enter a password.")
      return false
    }

    if (isNullOrEmpty(placeId)) {
      toast.error("Please enter a city.")
      return false
    }
    return true
  }
  const handleSignIn = (body) => {
    return post({
      url: "api/signupApi",
      body: { ...body },
    })
  }
  const signInMutation = useMutation(handleSignIn)

  const SignInUser = async (body) => {
    const { name, email, password } = body
    if (isValid(body)) {
      await signInMutation.mutateAsync(
        { ...body },
        {
          onSuccess: (response) => {
            if (response.isSuccess) {
              const logIn = async () => {
                await signIn("credentials", {
                  email,
                  password,
                  redirect: false,
                })
                router.push("/")
                toast.success(`Welcome ${name}`)
              }
              logIn()
            }
          },
          onError: (response) => {
            console.log("ddddddddddresponse",response)
            if (response.codeId === ACCOUNT_EXISTS_CODE) {
              toast.error("There is already an account with this email.")
            } else toast.error("There was an error. Please try again later.")
          },
          
        }
      )
    }
  }

  return { SignInUser, signInMutation }
}

export default useSignIn
