import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Stack,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useAppSelector } from "../../redux/hooks";
import {
  callCompleteTestExecution,
  callGetTestExecutionsByCampaignAndUser,
} from "../../config/api";

interface TestCase {
  id: number;
  title: string;
  description: string;
  preCondition?: string;
  dataTest?: string;
  expectedResult?: string;
}

interface TestScenario {
  id: number;
  description: string;
  precondition?: string;
  testCases?: TestCase[];
}

interface UseCase {
  id: number;
  name: string;
  description?: string;
  testScenarios?: TestScenario[];
}

interface UseCaseSectionProps {
  useCases: UseCase[];
  campaignId?: number;
}

const TestCaseExecution: React.FC<UseCaseSectionProps> = ({
  useCases,
  campaignId,
}) => {
  const user = useAppSelector((state) => state.account.user);
  const [executions, setExecutions] = useState<
    { testCaseId: number; status: boolean | null; note: string }[]
  >([]);

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    const fetchExistingExecutions = async () => {
      if (!campaignId || !user?.id) return;
      try {
        const res = await callGetTestExecutionsByCampaignAndUser(
          campaignId,
          user.id
        );
        if (res?.data) {
          // Gán dữ liệu từ API vào state
          const mapped = res.data.map((item: any) => ({
            testCaseId: item.testCaseId,
            status: item.status,
            note: item.note,
            id: item.id, // lưu lại id để biết là bản ghi đã tồn tại
          }));
          setExecutions(mapped);
        }
      } catch (error) {
        console.error("Fetch existing test executions failed:", error);
      }
    };

    fetchExistingExecutions();
  }, [campaignId, user?.id]);

  const handleChangeStatus = (testCaseId: number, newStatus: boolean) => {
    setExecutions((prev) => {
      const exist = prev.find((e) => e.testCaseId === testCaseId);
      if (exist) {
        return prev.map((e) =>
          e.testCaseId === testCaseId ? { ...e, status: newStatus } : e
        );
      }
      return [...prev, { testCaseId, status: newStatus, note: "" }];
    });
  };

  const handleNoteChange = (testCaseId: number, note: string) => {
    setExecutions((prev) =>
      prev.map((e) => (e.testCaseId === testCaseId ? { ...e, note } : e))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);

    const totalTestCases = useCases.reduce((sum, uc) => {
      const scenarios = uc.testScenarios || [];
      return (
        sum +
        scenarios.reduce(
          (s, ts) => s + (ts.testCases ? ts.testCases.length : 0),
          0
        )
      );
    }, 0);

    const completedCount = executions.filter((e) => e.status !== null).length;

    if (completedCount < totalTestCases) {
      setWarning(
        `You have completed only ${completedCount}/${totalTestCases} test cases. Please finish all before saving.`
      );
      setSaving(false);
      return;
    }
    try {
      const requests = executions.map((e) =>
        callCompleteTestExecution({
          note: e.note,
          status: e.status,
          campaign: { id: campaignId },
          user: { id: user?.id },
          testCase: { id: e.testCaseId },
        })
      );

      const results = await Promise.all(requests);
      console.log("All responses:", results);

      setSuccess(true);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!useCases?.length) return null;

  return (
    <Box
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light" ? "#f9f9fb" : "#1e1e1e",
        borderRadius: 3,
        p: 3,
        mb: 4,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: 2, color: "primary.main" }}
      >
        🧪 Bug Report & Test Execution
      </Typography>

      {useCases.map((uc, index) => (
        <Accordion
          key={uc.id || index}
          defaultExpanded={index === 0}
          sx={{ mb: 1.5, borderRadius: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle1" fontWeight="bold">
              {index + 1}. {uc.name}
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            {uc.testScenarios?.map((ts, idx) => (
              <Accordion
                key={ts.id || idx}
                sx={{ ml: 2, mt: 2, borderRadius: 2 }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    🧭 Scenario {idx + 1}: {ts.description}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  {ts.testCases?.map((tc, j) => {
                    const exec = executions.find((e) => e.testCaseId === tc.id);
                    return (
                      <Box
                        key={tc.id || j}
                        sx={{
                          ml: 3,
                          mt: 1.5,
                          p: 2,
                          borderRadius: 2,
                          backgroundColor: (theme) =>
                            theme.palette.mode === "light" ? "#fff" : "#2a2a2a",
                          boxShadow: 1,
                        }}
                      >
                        <Typography variant="body1" fontWeight="bold">
                          🧩 Test Case {j + 1}: {tc.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {tc.description}
                        </Typography>

                        {/* ✅ Trạng thái Pass / Fail */}
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <ToggleButtonGroup
                            exclusive
                            value={exec?.status ?? null}
                            onChange={(_, val) =>
                              val !== null && handleChangeStatus(tc.id, val)
                            }
                          >
                            <ToggleButton value={true} color="success">
                              <CheckCircleIcon sx={{ mr: 1 }} /> Pass
                            </ToggleButton>
                            <ToggleButton value={false} color="error">
                              <CancelIcon sx={{ mr: 1 }} /> Fail
                            </ToggleButton>
                          </ToggleButtonGroup>
                        </Stack>

                        {/* 📝 Ghi chú */}
                        <TextField
                          label="Notes"
                          variant="outlined"
                          fullWidth
                          multiline
                          minRows={2}
                          sx={{ mt: 2 }}
                          value={exec?.note || ""}
                          onChange={(e) =>
                            handleNoteChange(tc.id, e.target.value)
                          }
                        />
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}

      {success ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          Saved test results successfully!
        </Alert>
      ) : warning ? (
        <Alert severity="warning" sx={{ mt: 2 }}>
          {warning}
        </Alert>
      ) : null}
      <Box textAlign="right" mt={3}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Results"}
        </Button>
      </Box>
    </Box>
  );
};

export default TestCaseExecution;
