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

// complete test case execution

export async function callCompleteTestExecution(
  data : any
) {
  console.log("callCompleteTestExecution", { data });
  return axios.post<IBackendRes<any>>(
    `/api/v1/test-execution`, data
  );
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
export const uploadRecording = (file: any, folderType: string, uploader: string) => {
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

//update tester campaign to mark uploaded
export async function callMarkUploadedTesterCampaign(data: any) {
  console.log("callMarkUploadedTesterCampaign", data);
  return axios.put<IBackendRes<any>>(
    `/api/v1/campaign/tester-campaign/upload`,
    data
  );
}