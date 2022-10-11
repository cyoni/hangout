import { TextField } from "@mui/material"
import React from "react"
import { getCitiesAutoComplete } from "../../../lib/AutoCompleteUtils"
import { getFullPlaceName } from "../../../lib/consts/place"
import AlertDialog from "../../Dialog/AlertDialog"
import { AutoComplete } from "../../AutoComplete"
import ButtonIntegration from "../../Buttons/ButtonIntegration"
import ModalWrapper from "../../Modal/ModalWrapper"

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
      height="h-[800px]"
      className="w-[700px]"
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

      <form
        className="mx-auto flex flex-col items-center justify-center space-y-5 px-10"
        onSubmit={submitForm}
      >
        <div className="mt-5 border-b-4 border-b-sky-400 pb-1 text-2xl font-bold">
          Edit Profile
        </div>

        <div className="mt-4 w-full p-2">
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
          className="mt-5 rounded-md border p-2 outline-none"
          fullWidth
          id="outlined-basic"
          onChange={(e) => setName(e.target.value)}
          value={name}
          label="Name"
          variant="outlined"
        />

        <TextField
          className="h-[300px] rounded-md p-2 outline-none"
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
          buttonClassName="btn px-10 mt-5"
          onClick={submitForm}
        >
          Save
        </ButtonIntegration>

        <div className="mt-5 w-full border-b "></div>
        <button className="btn-outline mt-5 py-2" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </form>
    </ModalWrapper>
  )
}

export default EditProfile
