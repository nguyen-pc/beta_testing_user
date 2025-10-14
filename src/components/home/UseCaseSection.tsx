import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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
}

const UseCaseSection: React.FC<UseCaseSectionProps> = ({ useCases }) => {
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
        Các Use Case
      </Typography>

      {useCases.map((uc, index) => (
        <Accordion
          key={uc.id || index}
          defaultExpanded={index === 0}
          sx={{
            mb: 1.5,
            borderRadius: 2,
            "&:before": { display: "none" },
            boxShadow: 2,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "#fff" : "#2a2a2a",
              borderRadius: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {index + 1}. {uc.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({uc.testScenarios?.length || 0} scenario
              {uc.testScenarios && uc.testScenarios.length > 1 ? "s" : ""})
            </Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: 1, mb: 1 }}
            >
              {uc.description || "Chưa có mô tả cho use case này."}
            </Typography>

            {/* Nested Scenarios */}
            {uc.testScenarios?.map((ts, idx) => (
              <Accordion
                key={ts.id || idx}
                sx={{
                  ml: 2,
                  mt: 2,
                  borderRadius: 2,
                  "&:before": { display: "none" },
                  boxShadow: 1,
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    backgroundColor: (theme) =>
                      theme.palette.mode === "light" ? "#fdfdfd" : "#2f2f2f",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="bold">
                    🧭 Scenario {idx + 1}: {ts.description}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1 }}
                  >
                    ({ts.testCases?.length || 0} test case
                    {ts.testCases && ts.testCases.length > 1 ? "s" : ""})
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 2, mb: 1 }}
                  >
                    Điều kiện tiên quyết: {ts.precondition || "Không có"}
                  </Typography>

                  {ts.testCases?.map((tc, j) => (
                    <Box
                      key={tc.id || j}
                      sx={{
                        ml: 3,
                        mt: 1.5,
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: (theme) =>
                          theme.palette.mode === "light"
                            ? "#fff"
                            : "#2a2a2a",
                        boxShadow: 1,
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        🧩 Test Case {j + 1}: {tc.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {tc.description}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        <strong>Pre-condition:</strong> {tc.preCondition}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        <strong>Data Test:</strong> {tc.dataTest}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        <strong>Expected Result:</strong>{" "}
                        {tc.expectedResult || "Chưa có"}
                      </Typography>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default UseCaseSection;
