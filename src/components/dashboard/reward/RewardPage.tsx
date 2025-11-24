import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Chip,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PaidIcon from "@mui/icons-material/Paid";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

import { callGetMyTesterRewards } from "../../../config/api";
import { formatChatTimeEmail } from "../../../util/timeFormatter";

const RewardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<any[]>([]);

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "PAID" | "FAILED"
  >("ALL");

  const fetchRewards = async () => {
    setLoading(true);
    try {
      const res = await callGetMyTesterRewards();
      // Giả định BE trả về data: TesterReward[]
      const list = (res.data || []).map((r: any) => ({
        id: r.id,
        rewardBatchId: r.rewardBatchId,
        amount: r.amount,
        bonusAmount: r.bonusAmount ?? 0,
        status: r.status,
        failureReason: r.failureReason,
        evidenceUrl: r.evidenceUrl,
        bankAccountName: r.bankAccountName,
        bankAccountNumber: r.bankAccountNumber,
        bankName: r.bankName,
        paidAt: r.paidAt,
        createdAt: r.createdAt,
      }));
      setRewards(list);
    } catch (err) {
      console.error(err);
      setRewards([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  const filteredRewards = useMemo(() => {
    if (statusFilter === "ALL") return rewards;
    return rewards.filter((r) => r.status === statusFilter);
  }, [rewards, statusFilter]);

  const summary = useMemo(() => {
    const total = rewards.reduce(
      (s, r) => s + (r.amount || 0) + (r.bonusAmount || 0),
      0
    );
    const paid = rewards
      .filter((r) => r.status === "PAID")
      .reduce((s, r) => s + (r.amount || 0) + (r.bonusAmount || 0), 0);
    const failedCount = rewards.filter((r) => r.status === "FAILED").length;
    const pendingCount = rewards.filter((r) => r.status === "PENDING").length;
    return { total, paid, failedCount, pendingCount };
  }, [rewards]);

  const columns: GridColDef[] = [
    {
      field: "rewardBatchId",
      headerName: "Batch",
      width: 90,
    },
    {
      field: "amount",
      headerName: "Reward",
      width: 110,
      renderCell: (p) => `$${p.value ?? 0}`,
    },
    {
      field: "bonusAmount",
      headerName: "Bonus",
      width: 100,
      renderCell: (p) => `$${p.value ?? 0}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => {
        const status = params.value;
        let color: "default" | "warning" | "success" | "error" = "default";
        if (status === "PENDING") color = "warning";
        if (status === "PAID") color = "success";
        if (status === "FAILED") color = "error";
        return <Chip label={status} color={color} size="small" />;
      },
    },
    {
      field: "paidAt",
      headerName: "Paid At",
      width: 180,
      renderCell: (p) => (p.value ? formatChatTimeEmail(p.value) : "—"),
    },
    {
      field: "bankInfo",
      headerName: "Bank Info",
      flex: 1.1,
      sortable: false,
      renderCell: (params) => {
        const r = params.row;
        if (!r.bankName) return "—";
        return `${r.bankName} • ${r.bankAccountNumber} • ${r.bankAccountName}`;
      },
    },

    {
      field: "evidenceUrl",
      headerName: "Evidence",
      width: 130,
      renderCell: (p) =>
        p.value ? (
          <a
            href={`http://localhost:8081/storage/reward-evidences/${p.value}`}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 12, textDecoration: "underline" }}
          >
            View proof
          </a>
        ) : (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        ),
    },
    {
      field: "failureReason",
      headerName: "Reason (if failed)",
      flex: 1,
      renderCell: (p) =>
        p.row.status === "FAILED" ? (
          <Typography variant="body2" color="error">
            {p.value || "Unknown reason"}
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            —
          </Typography>
        ),
    },
  ];

  // ==============================
  // RENDER
  // ==============================
  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        My Reward History
      </Typography>

      {/* SUMMARY + FILTER */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="center"
        >
          {/* Summary chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip
              icon={<PaidIcon />}
              label={`Total: $${summary.total}`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<PaidIcon />}
              label={`Paid: $${summary.paid}`}
              color="success"
              variant="outlined"
            />
            <Chip
              icon={<PendingActionsIcon />}
              label={`Pending: ${summary.pendingCount}`}
              color="warning"
              variant="outlined"
            />
            <Chip
              icon={<ErrorOutlineIcon />}
              label={`Failed: ${summary.failedCount}`}
              color="error"
              variant="outlined"
            />
          </Stack>

          <Box flexGrow={1} />

          {/* Status filter */}
          <TextField
            size="small"
            select
            label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="PAID">Paid</MenuItem>
            <MenuItem value="FAILED">Failed</MenuItem>
          </TextField>
        </Stack>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ p: 1 }}>
        {loading ? (
          <Box p={4} textAlign="center">
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            rows={filteredRewards}
            columns={columns}
            pageSizeOptions={[5, 10, 20]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10, page: 0 } },
              sorting: {
                sortModel: [{ field: "createdAt", sort: "desc" }],
              },
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default RewardPage;
