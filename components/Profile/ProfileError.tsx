import { useRouter } from "next/router"

const ProfileError = () => {
  const router = useRouter()
  return (
    <div className="mx-auto flex w-[500px] flex-col items-center">
      <div className="mt-10 text-3xl">This profile was not found</div>
      <button className="btn mt-10" onClick={() => router.push("/")}>
        Home
      </button>
    </div>
  )
}
export default ProfileError
