import { MailIcon } from "@heroicons/react/outline"
import {
  Alert,
  Autocomplete,
  Backdrop,
  Badge,
  CircularProgress,
  TextField,
} from "@mui/material"
import { signOut } from "next-auth/react"
import fetch from "node-fetch"
import React, { useState } from "react"
import toast from "react-hot-toast"
import { UPDATE_PROFILE_METHOD } from "../lib/consts"
import { getCitiesAutoComplete } from "../lib/AutoCompleteUtils"
import { post } from "../lib/postman"
import { sleep } from "../lib/scripts/general"
import AlertDialog from "./AlertDialog"
import AutoComplete from "./AutoComplete"
import Avatar from "./Avatar"
import ButtonIntegration from "./ButtonIntegration"
import LocationAutoComplete from "./LocationAutoComplete"
import ModalWrapper from "./ModalWrapper"
import { getFullPlaceName } from "../lib/scripts/place"

interface Props {
  openEditProfile: boolean
  setOpenEditProfile: Function
  profile: Profile
}

function EditProfile({ openEditProfile, setOpenEditProfile, profile }: Props) {


  return (

  )
}

export default EditProfile
