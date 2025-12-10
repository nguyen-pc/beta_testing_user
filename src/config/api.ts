import {
  type IBackendRes,
  type IAccount,
  type IUser,
  type IPermission,
  type IRole,
  type IModelPaginate,
  type IProject,
  type IUseCase,
  type IScenario,
  type ITestcase,
  type ISurvey,
  type IQuestion,
  type IUserProfile,
  type ITesterCampaign,
  type ITesterCampaignStatus,
} from "./../types/backend.d";

import axios from "../config/axios-customize";

/**
 * 
Module Auth
 */
export const callRegister = (name: string, email: string, password: string) => {
  console.log("callRegister", {
    name,
    email,
    password,
  });
  return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
    name,
    email,
    password,
  });
};

export const callRegisterRecruiter = (
  name: string,
  email: string,
  password: string,
  phoneNumber?: string,
  taxNumber?: string,
  companyName?: string
) => {
  console.log("callRegister", {
    name,
    email,
    password,
    phoneNumber,
    taxNumber,
    companyName,
  });
  return axios.post<IBackendRes<IUser>>("/api/v1/auth/register", {
    name,
    email,
    password,
    phoneNumber,
    taxNumber,
    companyName,
  });
};

export const callLogin = (username: string, password: string) => {
  console.log("callLogin", { username, password });
  return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login", {
    username,
    password,
  });
};
export const callLoginGoogle = (token: string) => {
  return axios.post<IBackendRes<IAccount>>("/api/v1/auth/login-google", {
    token,
  });
};

export const callFetchAccount = () => {
  return axios.get<IBackendRes<IGetAccount>>("/api/v1/auth/account");
};

export const callRefreshToken = () => {
  return axios.get<IBackendRes<IAccount>>("/api/v1/auth/refresh");
};

export const callLogout = () => {
  return axios.post<IBackendRes<string>>("/api/v1/auth/logout");
};

export const callForgotPassword = (email: string) => {
  return axios.post<IBackendRes<string>>(
    `/api/v1/auth/forgot_password?email=${encodeURIComponent(email)}`
  );
};

export const callResetPassword = (token: string, newPassword: string) => {
  return axios.post<IBackendRes<string>>(
    `/api/v1/auth/reset_password?token=${token}`,
    { newPassword }
  );
};

// Module Project

export const callFetchAllProjects = (query: string) => {
  console.log("callFetchAllProjects", { query });
  return axios.get<IBackendRes<IModelPaginate<IProject>>>(
    `/api/v1/projects?${query}`
  );
};

export const callUpdateProject = (id: number, data: IProject) => {
  console.log("callUpdateProject", { id, data });
  return axios.put<IBackendRes<IProject>>(
    `/api/v1/projects/update/${id}`,
    data
  );
};

export const callGetProject = (id: number) => {
  return axios.get<IBackendRes<IProject>>(`/api/v1/projects/${id}`);
};
export const callFetchProjectByCompany = (id: string, query: string) => {
  console.log("callFetchProjectByCompany", { id, query });
  return axios.get<IBackendRes<IModelPaginate<IProject>>>(
    `/api/v1/projects/all/${id}?${query}`
  );
};

export const callDeleteProject = (id: string) => {
  console.log("callDeleteProject", { id });
  return axios.delete<IBackendRes<null>>(`/api/v1/projects/${id}`);
};

//Module Campaign

export const callFetchCampaignByProject = (id: string, query: string) => {
  console.log("callFetchCampaignByProject", { id, query });
  return axios.get<IBackendRes<IModelPaginate<ICampaign>>>(
    `/api/v1/project/${id}/campaigns?${query}`
  );
};

export const callGetCampaign = (id: number) => {
  return axios.get<IBackendRes<ICampaign>>(`/api/v1/campaign/${id}`);
};
export const callCreateCampaign = (data: ICampaign) => {
  console.log("callCreateCampaign", data);
  return axios.post<IBackendRes<ICampaign>>("/api/v1/campaign/create", data);
};

export const callGetCampaignActive = () => {
  return axios.get<IBackendRes<IModelPaginate<ICampaign>>>(
    `/api/v1/campaigns/active-approved`
  );
};

export const callGetCampaignUpcoming = () => {
  return axios.get<IBackendRes<IModelPaginate<ICampaign>>>(
    `/api/v1/campaigns/upcoming`
  );
};

// Module Campaign
export const callGetUseCasesByCampaign = (
  campaignId: string,
  query: string
) => {
  return axios.get<IBackendRes<IModelPaginate<IUseCase>>>(
    `/api/v1/usecase/campaign/${campaignId}?${query}`
  );
};

export const callCreateUseCase = (data: Partial<IUseCase>) => {
  return axios.post<IBackendRes<IUseCase>>("/api/v1/usecase/create", data);
};

export const callUpdateUseCase = (id: number, data: Partial<IUseCase>) => {
  return axios.put<IBackendRes<IUseCase>>(`/api/v1/usecase/update/${id}`, data);
};

export const callDeleteUseCase = (id: number) => {
  return axios.delete<IBackendRes<null>>(`/api/v1/usecase/delete/${id}`);
};

// Module Scenario
export const callGetScenariosByUseCase = (useCaseId: number, query: string) => {
  return axios.get<IBackendRes<IModelPaginate<IScenario>>>(
    `/api/v1/usecase/${useCaseId}/test_scenario?${query}`
  );
};

export const callCreateScenario = (data: IScenario) => {
  console.log("callCreateScenario", data);
  return axios.post<IBackendRes<IScenario>>(
    "/api/v1/usecase/test_scenario/create",
    data
  );
};

export const callUpdateScenario = (id: number, data: Partial<IScenario>) => {
  console.log(data, id);
  return axios.put<IBackendRes<IScenario>>(
    `/api/v1/usecase/test_scenario/update/${id}`,
    data
  );
};

export const callDeleteScenario = (id: number) => {
  return axios.delete<IBackendRes<null>>(
    `/api/v1/usecase/test_scenario/delete/${id}`
  );
};

// Module Testcase
export const callGetTestcasesByScenario = (
  scenarioId: string,
  query: string
) => {
  return axios.get<IBackendRes<IModelPaginate<ITestcase>>>(
    `/api/v1/usecase/test_scenario/${scenarioId}/testcase?${query}`
  );
};

export const callCreateTestcase = (data: Partial<ITestcase>) => {
  console.log("callCreateTestcase", data);
  return axios.post<IBackendRes<ITestcase>>(
    "/api/v1/usecase/test_scenario/testcase/create",
    data
  );
};

export const callUpdateTestcase = (id: number, data: Partial<ITestcase>) => {
  console.log("callUpdateTestcase", { id, data });
  return axios.put<IBackendRes<ITestcase>>(
    `/api/v1/usecase/test_scenario/testcase/update/${id}`,
    data
  );
};

export const callDeleteTestcase = (id: number) => {
  return axios.delete<IBackendRes<null>>(
    `/api/v1/usecase/test_scenario/testcase/delete/${id}`
  );
};

export async function callCreateSurvey(campaignId: string, data: ISurvey) {
  console.log("Creating survey on server:", data);
  return axios.post<IBackendRes<ISurvey>>(
    `/api/v1/campaign/${campaignId}/survey`,
    data
  );
}

// question
export async function callCreateQuestion(
  projectId: string,
  campaignId: string,
  surveyId: string,
  data: Partial<IQuestion>
) {
  console.log("Creating question on server:", data);
  return axios.post<IBackendRes<IQuestion>>(
    `/api/v1/project/${projectId}/campaign/${campaignId}/survey/${surveyId}/question`,
    data
  );
}

export async function callDeleteQuestion(
  projectId: string,
  campaignId: string,
  surveyId: string,
  questionId: string
) {
  console.log("Deleting question on server:", questionId);
  return axios.delete<IBackendRes<null>>(
    `/api/v1/project/${projectId}/campaign/${campaignId}/survey/${surveyId}/question/${questionId}`
  );
}

//recruiting campaign
export async function callCreateRecruitingCampaign(data: ICampaign) {
  console.log("callCreateRecruitingCampaign", data);
  return axios.post<IBackendRes<ICampaign>>(
    "/api/v1/recruit-profile/create",
    data
  );
}

//user profile
export async function callCreateUserProfile(
  userId: string,
  data: IUserProfile
) {
  console.log("callCreateUserProfile", data);
  return axios.post<IBackendRes<IUserProfile>>(
    `/api/v1/user/profile/${userId}`,
    data
  );
}

export async function callGetUserProfile(userId: string) {
  console.log("callGetUserProfile", userId);
  return axios.get<IBackendRes<IUserProfile>>(`/api/v1/user/profile/${userId}`);
}

// Apply campaign
export async function callApplyCampaign(data: ITesterCampaign) {
  console.log("callApplyCampaign", data);
  return axios.post<IBackendRes<ITesterCampaign>>(
    `/api/v1/campaign/tester-campaign/apply`,
    data
  );
}

export async function callGetTesterCampaignStatus(
  userId: string,
  campaignId: string
) {
  console.log("callGetTesterCampaignStatus", { userId, campaignId });
  return axios.get<IBackendRes<ITesterCampaignStatus>>(
    `/api/v1/campaign/${campaignId}/tester-campaign/status`,
    {
      params: { userId },
    }
  );
}

export async function callGetCampaignByUser(userId: string) {
  console.log("callGetCampaignByUser", userId);
  return axios.get<IBackendRes<IModelPaginate<any>>>(
    `/api/v1/campaign/tester-campaigns/user/${userId}`
  );
}

export async function callGetStatusCampaignsByUser(
  campaignId: string,
  userId: string
) {
  console.log("callGetStatusCampaignsByUser", userId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/tester-campaign/user/${userId}`
  );
}

export async function callGetRecommendedCampaigns(userId: string) {
  console.log("callGetRecommendedCampaigns", userId);
  return axios.get<IBackendRes<any>>(`/api/v1/recommend/campaigns/${userId}`);
}

// complete test case execution

export async function callCompleteTestExecution(data: any) {
  console.log("callCompleteTestExecution", { data });
  return axios.post<IBackendRes<any>>(`/api/v1/test-execution`, data);
}

export async function callGetTestExecutionsByCampaignAndUser(
  campaignId: string,
  userId: string
) {
  console.log("callGetTestExecutionsByCampaignAndUser", { campaignId, userId });
  return axios.get<IBackendRes<ITestExecution[]>>(
    `/api/v1/test-execution/campaign/${campaignId}/user/${userId}`
  );
}

// upload recording

// export async function uploadRecording(
//   file: File,
//   campaignId: number,
//   testerId?: number
// ) {
//   const form = new FormData();
//   form.append("file", file);
//   form.append("campaignId", String(campaignId));
//   if (testerId) form.append("testerId", String(testerId));

//   const res = await fetch(`/api/recordings/upload`, {
//     method: "POST",
//     body: form,
//   });
//   if (!res.ok) throw new Error("Upload failed");
//   // return URL or message
//   try {
//     const json = await res.json();
//     return json?.url || json?.message;
//   } catch {
//     return undefined;
//   }
// }

// Upload File Attachment
export const uploadRecording = (
  file: any,
  folderType: string,
  uploader: string
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.append("folder", folderType);
  bodyFormData.append("uploader", uploader);

  return axios<IBackendRes<{ fileName: string }>>({
    method: "post",
    url: "/api/v1/attachment",
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadFileSurvey = (
  file: any,
  surveyId: number,
  uploaderId: number
) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.append("folder", surveyId.toString());
  bodyFormData.append("uploader", uploaderId.toString());

  return axios.post<IBackendRes<{ fileName: string }>>(
    "/api/v1/files",
    bodyFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const uploadFileBug = (file: any, bugId: number, uploaderId: number) => {
  const bodyFormData = new FormData();
  bodyFormData.append("file", file);
  bodyFormData.append("bugId", bugId.toString());
  bodyFormData.append("uploader", uploaderId.toString());

  return axios.post<IBackendRes<{ fileName: string }>>(
    "/api/v1/attachment/bug",
    bodyFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export async function callGetAttachmentsByBugId(bugId: string) {
  console.log("callGetAttachmentsByBugId", { bugId });
  return axios.get<IBackendRes<any>>(`/api/v1/attachment/bug/${bugId}`);
}

//update tester campaign to mark uploaded
export async function callMarkUploadedTesterCampaign(data: any) {
  console.log("callMarkUploadedTesterCampaign", data);
  return axios.put<IBackendRes<any>>(
    `/api/v1/campaign/tester-campaign/upload`,
    data
  );
}

// Device
export async function callCreateBugReportDevice(data: any) {
  console.log("callCreateBugReportDevice", data);
  return axios.post<IBackendRes<any>>(`/api/v1/bugs/device`, data);
}

export async function callGetBugReportDevice(bugId: string) {
  console.log("callGetBugReportDevice", { bugId });
  return axios.get<IBackendRes<any>>(`/api/v1/bugs/device/${bugId}`);
}

// Survey
export async function callGetSurveysByCampaign(campaignId: string) {
  console.log("callGetSurveysByCampaign", { campaignId });
  return axios.get<IBackendRes<any>>(`/api/v1/campaign/${campaignId}/survey`);
}
// form

export async function callGetSurvey(campaignId: string, surveyId: string) {
  console.log("Fetching survey details for survey:", surveyId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}`
  );
}

export async function callGetForm(campaignId: string, surveyId: string) {
  console.log("Fetching survey form for survey:", surveyId);
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}/question/all`
  );
}

export async function callSubmitForm(
  campaignId: string,
  surveyId: string,
  data: any
) {
  console.log("Submitting survey form for survey:", surveyId, data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/campaign/${campaignId}/survey/${surveyId}/response`,
    data
  );
}

export async function callCreateTesterSurvey(data: any) {
  console.log("callCreateTesterSurvey", data);
  return axios.post<IBackendRes<any>>(
    `/api/v1/campaign/tester-survey/create`,
    data
  );
}

export async function callGetTesterSurveyStatus(
  userId: string,
  surveyId: string
) {
  console.log("callGetTesterSurveyStatus", { userId, surveyId });
  return axios.get<IBackendRes<any>>(
    `/api/v1/campaign/tester-survey/status?userId=${userId}&surveyId=${surveyId}`
  );
}

// Create bug report
export async function callCreateBugReport(data: any) {
  console.log("callCreateBugReport", data);
  return axios.post<IBackendRes<any>>(`/api/v1/bugs`, data);
}

export async function callGetBugTypes() {
  console.log("callGetBugTypes");
  return axios.get<IBackendRes<any>>(`/api/v1/bugs/bug-type`);
}

export async function callGetBugByUserAndCampaign(
  userId: string,
  campaignId: string
) {
  console.log("callGetBugByUserAndCampaign", { userId, campaignId });
  return axios.get<IBackendRes<any>>(
    `api/v1/bugs/filter?testerId=${userId}&campaignId=${campaignId}&page=0&size=15`
  );
}
export async function callGetBugByUser(userId: string) {
  console.log("callGetBugByUser", { userId });
  return axios.get<IBackendRes<any>>(
    `api/v1/bugs/filter?testerId=${userId}&page=0&size=15`
  );
}

export async function callGetDetailBugReport(bugId: string) {
  console.log("Fetching bug report detail:", bugId);
  return axios.get<IBackendRes<any>>(`/api/v1/bugs/${bugId}`);
}

//chat

export async function callGetBugChatMessages(bugId: string) {
  console.log("Fetching bug chat messages for bug:", bugId);
  return axios.get<IBackendRes<any>>(`/api/v1/bugs/${bugId}/chat`);
}

export async function callPostBugChatMessage(bugId: string, data: any) {
  console.log("Posting bug chat message for bug:", bugId, data);
  return axios.post<IBackendRes<any>>(`/api/v1/bugs/${bugId}/chat`, data);
}

// sign up company
export async function callRegisterCompany(companyData: any) {
  console.log("callRegisterCompany", companyData);
  return axios.post<IBackendRes<any>>("/api/v1/company/create", companyData);
}

//statistic
export async function callGetTesterDashboardStats(userId: string) {
  console.log("callGetTesterDashboardStats", { userId });
  return axios.get<IBackendRes<any>>(`/api/v1/users/${userId}/statistic`);
}

// setting user
export async function callGetUserSettings(userId: string) {
  console.log("callGetUserSettings", { userId });
  return axios.get<IBackendRes<any>>(`/api/v1/users/${userId}`);
}

export async function callUpdateUserSettings(data: any) {
  console.log("callUpdateUserSettings", { data });
  return axios.put<IBackendRes<any>>(`/api/v1/users`, data);
}

export async function callChangeUserPassword(data: any) {
  console.log("callChangeUserPassword", { data });
  return axios.put<IBackendRes<any>>(`/api/v1/users/change-password`, data);
}

//  payment info
export const callGetMyPaymentInfo = (userId: string) => {
  return axios.get<IBackendRes<any>>(`/api/v1/user/payment-info/${userId}`);
};

export const callUpdateMyPaymentInfo = (data: any) => {
  return axios.post<IBackendRes<any>>(`/api/v1/user/payment-info`, data);
};

//reward
export const callGetMyTesterRewards = () => {
  return axios.get<IBackendRes<any>>("/api/v1/tester-rewards/me");
};

//notification
export const callFetchUserNotifications = (userId: string) => {
  console.log("callFetchUserNotifications", { userId });
  return axios.get<IBackendRes<Notification[]>>(
    `/api/v1/notifications/${userId}`
  );
};

export const callMarkNotificationAsRead = (notificationId: string) => {
  console.log("callMarkNotificationAsRead", { notificationId });
  return axios.put<IBackendRes<null>>(
    `/api/v1/notifications/${notificationId}/read`
  );
};
