import { TextField } from "@mui/material"
import React from "react"
import { getCitiesAutoComplete } from "../../../lib/AutoCompleteUtils"
import { getFullPlaceName } from "../../../lib/scripts/place"
import AlertDialog from "../../AlertDialog"
import AutoComplete from "../../AutoComplete"
import Avatar from "../../Avatar"
import ButtonIntegration from "../../ButtonIntegration"
import HeaderImage from "../../HeaderImage"
import ModalWrapper from "../../ModalWrapper"

function EditProfile({ editProfileParams, place }) {
  const {
    name,
    setName,
    cityId,
    setCityId,
    aboutMe,
    setAboutMe,
    showDeleteAccountDialog,
    setShowDeleteAccountDialog,
    submitForm,
    handleSelect,
    getOptionLabel,
    isOptionEqualToValue,
    handleDeleteAccount,
    handleDelete,
    openEditProfile,
    setOpenEditProfile,
  } = editProfileParams
  console.log("getFullPlaceName(place)", place)
  console.log("real", getFullPlaceName(place))
  return (
    <ModalWrapper
      height="h-[95%]"
      className="w-[60%]"
      isOpen={openEditProfile}
      onRequestClose={() => setOpenEditProfile(false)}
    >
      {showDeleteAccountDialog && (
        <AlertDialog
          open={showDeleteAccountDialog}
          setOpen={setShowDeleteAccountDialog}
          dialogTitle={"Delete Account"}
          dialogText={"Are you sure you want to delete this account?"}
          cancelText={"Cancel"}
          okText={"Delete Account"}
          okFunction={handleDelete}
        />
      )}

      <HeaderImage title="test test" />

      <form
        className="w-[40%] mx-auto flex justify-center items-center flex-col space-y-5"
        onSubmit={submitForm}
      >
        <div className="font-bold mt-5 text-xl">Edit Profile</div>
        <Avatar className="h-28 w-28 mt-5" />

        <div className="w-full mt-4 p-2">
          <AutoComplete
            label="City"
            defaultValue={place}
            fetchFunction={getCitiesAutoComplete}
            handleSelect={handleSelect}
            getOptionLabel={getOptionLabel}
            isOptionEqualToValue={isOptionEqualToValue}
          />
        </div>

        <TextField
          className="mt-5 border outline-none rounded-md p-2"
          fullWidth
          id="outlined-basic"
          onChange={(e) => setName(e.target.value)}
          value={name}
          label="Name"
          variant="outlined"
        />

        <TextField
          className="rounded-md h-[300px] outline-none p-2"
          id="outlined-multiline-static"
          label="About Me"
          multiline
          rows={12}
          value={aboutMe}
          fullWidth
          onChange={(e) => setAboutMe(e.target.value)}
        />

        <ButtonIntegration
          externalClass="mt-24"
          buttonClassName="px-10"
          onClick={submitForm}
        >
          Save
        </ButtonIntegration>

        <div className="border-b w-full mt-5 "></div>
        <button className="btn-outline py-2 mt-5" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </form>
    </ModalWrapper>
  )
}

export default EditProfile