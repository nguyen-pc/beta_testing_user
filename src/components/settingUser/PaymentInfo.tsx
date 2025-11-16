// src/pages/settings/PaymentInfo.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  callGetMyPaymentInfo,
  callUpdateMyPaymentInfo,
} from "../../config/api";
import { useAppSelector } from "../../redux/hooks";

export default function PaymentInfo() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const user = useAppSelector((state) => state.account.user);

  const handleChange = (_: any, val: number) => setTab(val);

  const [info, setInfo] = useState({
    bankName: "",
    bankAccountNumber: "",
    accountHolder: "",
    isLocked: false,
    verifiedAt: null as string | null,
  });

  const handleChangeInfo = (e: React.ChangeEvent<HTMLInputElement>) =>
    setInfo({ ...info, [e.target.name]: e.target.value });

  // ================= LOAD DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await callGetMyPaymentInfo(user.id);
        console.log("✅ Payment info fetched:", res); 
        if (res.data) {
          setInfo({
            bankName: res.data.bankName || "",
            bankAccountNumber: res.data.bankAccountNumber || "",
            accountHolder: res.data.accountHolder || "",
            isLocked: res.data.isLocked || false,
            verifiedAt: res.data.verifiedAt || null,
          });
        }
      } catch (err) {
        console.error("Failed to load payment info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    setSaving(true);
    setMessage("");

    try {
      await callUpdateMyPaymentInfo({
        bankName: info.bankName,
        bankAccountNumber: info.bankAccountNumber,
        accountHolder: info.accountHolder,
      });

      setMessage("Cập nhật thông tin tài khoản thành công!");
    } catch (err) {
      console.error(err);
      setMessage("Không thể cập nhật! Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <Box className="flex justify-center items-center h-40">
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Tabs value={tab} onChange={handleChange} sx={{ mb: 3 }}>
        <Tab label="Bank Payment Info" />
        <Tab label="Account Balance" />
      </Tabs>

      {/* ========================== TAB PAYMENT INFO ========================== */}
      {tab === 0 && (
        <Paper variant="outlined" className="p-4 bg-gray-50">
          <Typography mb={2}>
            Điền thông tin tài khoản ngân hàng để hệ thống có thể thanh toán
            thưởng cho bạn một cách chính xác.
          </Typography>

          {info.isLocked && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Tài khoản ngân hàng đã được xác minh bởi Admin (
              {info.verifiedAt || "unknown"}).
            </Alert>
          )}

          {!info.isLocked && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              Tài khoản chưa được xác minh. Bạn vẫn có thể cập nhật thông tin.
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bank Name"
                name="bankName"
                value={info.bankName}
                onChange={handleChangeInfo}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Bank Account Number"
                name="bankAccountNumber"
                value={info.bankAccountNumber}
                onChange={handleChangeInfo}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Account Holder Name"
                name="accountHolder"
                value={info.accountHolder}
                onChange={handleChangeInfo}
              />
            </Grid>
          </Grid>

          <Box textAlign="right" mt={3}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Payment Info"}
            </Button>
          </Box>

          {message && (
            <Typography mt={2} color="primary">
              {message}
            </Typography>
          )}
        </Paper>
      )}

      {/* ========================== TAB BALANCE ========================== */}
      {tab === 1 && (
        <Paper variant="outlined" className="p-4 text-center">
          <Typography variant="h6">Account Balance</Typography>
          <Typography color="text.secondary" mt={1}>
            Coming soon: You’ll be able to track your rewards here.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}
