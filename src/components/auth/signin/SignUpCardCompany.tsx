import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { callRegisterCompany } from "../../../config/api";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  [theme.breakpoints.up("sm")]: {
    width: "480px",
  },
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

export default function SignUpCardCompany() {
  const navigate = useNavigate();
  const [errors, setErrors] = React.useState({
    companyName: "",
    companyEmail: "",
    companyMST: "",
    companyAddress: "",
    companyPhoneNumber: "",
    password: "",
  });

  const validateInputs = () => {
    const newErrors: any = {};
    const emailRegex = /\S+@\S+\.\S+/;
    const phoneRegex = /^[0-9]{9,11}$/;

    const companyName = (
      document.getElementById("companyName") as HTMLInputElement
    ).value;
    const companyEmail = (
      document.getElementById("companyEmail") as HTMLInputElement
    ).value;
    const companyMST = (
      document.getElementById("companyMST") as HTMLInputElement
    ).value;
    const companyAddress = (
      document.getElementById("companyAddress") as HTMLInputElement
    ).value;
    const companyPhoneNumber = (
      document.getElementById("companyPhoneNumber") as HTMLInputElement
    ).value;
    // const password = (document.getElementById("password") as HTMLInputElement)
    //   .value;

    if (!companyName || companyName.length < 3)
      newErrors.companyName = "Tên công ty phải có ít nhất 3 ký tự.";

    if (!emailRegex.test(companyEmail))
      newErrors.companyEmail = "Vui lòng nhập email hợp lệ.";

    if (!companyMST || companyMST.length < 8)
      newErrors.companyMST = "Mã số thuế không hợp lệ.";

    if (!companyAddress)
      newErrors.companyAddress = "Vui lòng nhập địa chỉ công ty.";

    if (!phoneRegex.test(companyPhoneNumber))
      newErrors.companyPhoneNumber = "Số điện thoại không hợp lệ.";

    // if (!password || password.length < 6)
    //   newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateInputs()) return;

    const data = new FormData(event.currentTarget);
    const companyData = {
      companyName: data.get("companyName"),
      companyEmail: data.get("companyEmail"),
      companyMST: data.get("companyMST"),
      companyAddress: data.get("companyAddress"),
      companyPhoneNumber: data.get("companyPhoneNumber"),
      // password: data.get("password"),
    };
    console.log("Submitted Data:", companyData);
    const res = await callRegisterCompany(companyData);
    console.log("Register Company Response:", res); 
    if (res.status === 201) {
      navigate("/signup-success", {
        state: { email: companyData.companyEmail },
      });
    }
    // Gọi API đăng ký tại đây
  };

  return (
    <Card variant="outlined">
      <Typography
        component="h1"
        variant="h4"
        sx={{ textAlign: "center", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
      >
        Đăng ký công ty
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Company Name */}
        <FormControl>
          <FormLabel htmlFor="companyName">Tên công ty</FormLabel>
          <TextField
            id="companyName"
            name="companyName"
            placeholder="Nhập tên công ty"
            error={!!errors.companyName}
            helperText={errors.companyName}
            required
            fullWidth
          />
        </FormControl>

        {/* Email */}
        <FormControl>
          <FormLabel htmlFor="companyEmail">Email công ty</FormLabel>
          <TextField
            id="companyEmail"
            name="companyEmail"
            type="email"
            placeholder="example@company.com"
            error={!!errors.companyEmail}
            helperText={errors.companyEmail}
            required
            fullWidth
          />
        </FormControl>

        {/* Mã số thuế */}
        <FormControl>
          <FormLabel htmlFor="companyMST">Mã số thuế</FormLabel>
          <TextField
            id="companyMST"
            name="companyMST"
            placeholder="Nhập mã số thuế"
            error={!!errors.companyMST}
            helperText={errors.companyMST}
            required
            fullWidth
          />
        </FormControl>

        {/* Địa chỉ */}
        <FormControl>
          <FormLabel htmlFor="companyAddress">Địa chỉ</FormLabel>
          <TextField
            id="companyAddress"
            name="companyAddress"
            placeholder="Nhập địa chỉ công ty"
            error={!!errors.companyAddress}
            helperText={errors.companyAddress}
            required
            fullWidth
          />
        </FormControl>

        {/* Số điện thoại */}
        <FormControl>
          <FormLabel htmlFor="companyPhoneNumber">Số điện thoại</FormLabel>
          <TextField
            id="companyPhoneNumber"
            name="companyPhoneNumber"
            placeholder="Nhập số điện thoại công ty"
            error={!!errors.companyPhoneNumber}
            helperText={errors.companyPhoneNumber}
            required
            fullWidth
          />
        </FormControl>

        {/* Mật khẩu
          <FormControl>
            <FormLabel htmlFor="password">Mật khẩu</FormLabel>
            <TextField
              id="password"
              name="password"
              type="password"
              placeholder="••••••"
              error={!!errors.password}
              helperText={errors.password}
              required
              fullWidth
            />
          </FormControl> */}

        <Button type="submit" variant="contained" fullWidth>
          Đăng ký
        </Button>
      </Box>
    </Card>
  );
}
