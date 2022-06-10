import dbFind from "./dbFind";

export async function getAllTravelling() {
  const travelling = await dbFind("future_travelling", {});
  const userIds = travelling.map((x, i) => {
    return x.userId;
  });
  console.log("userIds", userIds);
  const profiles = await dbFind("users", { userId: { $in: userIds } });
  console.log("profiles", profiles);
  const result = travelling.map((item) => {
    const picture =
      profiles.filter((curr) => curr.userId === item.userId)[0]?.picture ||
      "https://www.innovaxn.eu/wp-content/uploads/blank-profile-picture-973460_1280.png";
    return { ...item, picture };
  });
  return result;
}

export async function getAllHangouts(){
  const travelling = await dbFind("hangout", {});
  const userIds = travelling.map((x, i) => {
    return x.userId;
  });
  console.log("userIds", userIds);
  const profiles = await dbFind("users", { userId: { $in: userIds } });
  console.log("profiles", profiles);
  const result = travelling.map((item) => {
    const picture =
      profiles.filter((curr) => curr.userId === item.userId)[0]?.picture ||
      "https://www.innovaxn.eu/wp-content/uploads/blank-profile-picture-973460_1280.png";
    return { ...item, picture };
  });
  return result;
}

export async function getTravelContent(userId) {
  if (!userId || userId === undefined) {
    return false;
  }
  console.log("calling to " + userId)
  return await dbFind("future_travelling", { userId });
}
