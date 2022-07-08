import { USERS_TABLE } from "./consts"
import dbFind from "./dbFind"

const formatDate = (date) => {
  let d = new Date(date)
  let ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d)
  let mo = new Intl.DateTimeFormat("en", { month: "2-digit" }).format(d)
  let da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d)
  return `${da}/${mo}/${ye}`
}

export async function getAllTravelling() {
  const travelling = await dbFind("future_travelling", {})
  const userIds = travelling.map((x, i) => {
    return x.userId
  })

  console.log("userIds", userIds)
  const profiles = await dbFind("users", { userId: { $in: userIds } })
  console.log("profiles", profiles)
  const result = travelling.map((item) => {
    const picture =
      profiles.filter((curr) => curr.userId === item.userId)[0]?.picture ||
      "https://www.innovaxn.eu/wp-content/uploads/blank-profile-picture-973460_1280.png"
    return { ...item, picture }
  })
  return result
}

export async function getAllTravellingFromLocation(country, state, city) {
  const travelling = await dbFind("future_travelling", {
    country,
    state,
    city,
  })
  const userIds = travelling.map((usr) => {
    return usr.userId
  })
  console.log("userIds", userIds)
  const profiles = await dbFind("users", { userId: { $in: userIds } })

  console.log("profiles", profiles)
  const result = travelling.map((item) => {
    const filteredUsr = profiles.filter((curr) => curr.userId === item.userId)
    if (filteredUsr && filteredUsr[0]) {
      const usr = filteredUsr[0]
      const picture =
        usr.picture ||
        "https://www.innovaxn.eu/wp-content/uploads/blank-profile-picture-973460_1280.png"
      const name = usr.name
      const location = usr.location

      item.startDate = formatDate(item.startDate)
      item.endDate = item.endDate ? formatDate(item.endDate) : null

      return { ...item, picture, name, location }
    }
  })
  return result
}

export async function getAllHangouts() {
  const travelling = await dbFind("hangout", {})
  const userIds = travelling.map((x, i) => {
    return x.userId
  })
  console.log("userIds", userIds)
  const profiles = await dbFind("users", { userId: { $in: userIds } })
  console.log("profiles", profiles)
  const result = travelling.map((item) => {
    const picture =
      profiles.filter((curr) => curr.userId === item.userId)[0]?.picture ||
      "https://www.innovaxn.eu/wp-content/uploads/blank-profile-picture-973460_1280.png"
    return { ...item, picture }
  })
  return result
}

export async function getTravelContent(userId) {
  if (!userId || userId === undefined) {
    return false
  }
  const profileRaw = (await dbFind(USERS_TABLE, { userId }))[0]
  const travelsRaw = await dbFind("future_travelling", { userId })

  const travels = travelsRaw.map((travel) => {
    return {
      ...travel,
      startDate: formatDate(travel.startDate),
      endDate: formatDate(travel.endDate),
    }
  })
  if (profileRaw != null) {
    const profile = {
      name: profileRaw.name != null ? profileRaw.name : "",
      userId: profileRaw.userId != null ? profileRaw.userId : "",
      intro: profileRaw.intro != null ? profileRaw.intro : "",
      picture: profileRaw.picture != null ? profileRaw.picture : "",
      location: profileRaw.location != null ? profileRaw.location : ""
    }
    return { travels, profile }
  } else {
    return null
  }
}
