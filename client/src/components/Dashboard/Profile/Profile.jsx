import React from "react";
import { useCookies } from "react-cookie";
import ProfileEmail from "./ProfileEmail";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import Password from "../../LoginPage/Password";
import ConfirmPassword from "../../ChangePassword/ConfirmPassword";
import { Alert, Button, Snackbar, Stack } from "@mui/material";
import { useState } from "react";

export default function Profile() {
  const [cookies] = useCookies();
  const schema = yup.object().shape({
    password: yup
      .string()
      .required("This Field cannont be empty")
      .min(8)
      .max(24),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Password Must Match")
      .required("You Must enter same Password"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState({ show: false, status: "success" });
  const submitHandler = async (e) => {
    try {
      let res = await axios.put("http://localhost:4000/login/changePassword", {
        method: "PUT",
        data: { email: cookies.user, password: e.password },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "*/*",
        },
      });
      console.log(res);
      setShow({ show: true, status: "success" });
    } catch (e) {
      console.log(e);
      setShow({ show: true, status: "error" });
    }
  };
  const handleClick = () => {
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Stack width={450} spacing={2} margin="auto">
        <ProfileEmail email={cookies.user} />
        <Password register={register} errors={errors} />
        <ConfirmPassword register={register} errors={errors} />
        <Button
          variant="contained"
          sx={{
            "&:focus": { color: "rgb(16, 185, 129)" },
            color: "white",
            bgcolor: "#101827",
            "&:hover": { bgcolor: "#283857" },
          }}
          type="submit"
          onClick={handleClick}
        >
          Save Changes
        </Button>
      </Stack>
      {show.show && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={show.status}
            sx={{ width: "100%" }}
          >
            {show.status === "success"
              ? "Password Changed Successfully!"
              : "Password Does NOT Change!"}
          </Alert>
        </Snackbar>
      )}
    </form>
  );
}
