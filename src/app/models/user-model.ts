import { Project, workItem } from './project-model';
import { Enterprise, Department, ParticipantData, projectRole, service } from './enterprise-model';

// tslint:disable-next-line: class-name
export interface coloursUser {
    name: string,
    username: string,
    email: string,
    bus_email: string,
    gender: string,
    dob: string,
    age: number,
    phoneNumber: string,
    nationalId: string,
    nationality: string,
    telephone: number,
    address: string,
    zipCode: number,
    country: string,
    city: string,
    by: string,
    byId: string,
    totalIncome: string,
    estimatedMonthlyIncome: string,
    networth: string,
    companyName: string,
    companyId: string,
    createdOn: string,
    id: string,
    aboutMe: String,
    profession: profession[];
    qualifications: string[],
    bodyWeight: number,
    bodyHeight: number,
    bodyMassIndex: number,
    industrySector: string,
    personalAssets: personalAsset[],
    personalLiabilities: personalLiability[],
    reference: [string],
    focusFactor: number,
    referee: [ParticipantData],
    userImg:string,
    LastTimeLogin: string,
    hierarchy: string,
    updated: boolean
    // User's FOcus Factor  = (Total assets value - Total cost of liability)/ (No of companies + projects user is Involved in)
}
// tslint:disable-next-line: class-name
export interface profession {
    name: string;
}
// tslint:disable-next-line: class-name
export interface personalAsset {
    name: string,
    assetNumber: string,
    by: string,
    byId: string,
    addeddOn: string,
    value: string,
    id: string
};
// tslint:disable-next-line: class-name
export interface personalLiability {
    name: string,
    by: string,
    byId: string,
    addeddOn: string,
    amount: string,
    id: string
};
// tslint:disable-next-line: class-name
export interface classification {
    name?: string; createdOn: string; plannedTime?: string; actualTime: string; Varience: string; id: string
}
// tslint:disable-next-line: class-name
export interface personalStandards {
    classificationName: string;
    classificationId: string;
    name: string;
    period: string; //  must be valid email format
    createdOn: string;
    id: string,
    unit: string,
}
// tslint:disable-next-line: class-name
export interface selectedPeriod {
    name: string;
    id: string; //  must be valid email format
}
// tslint:disable-next-line: class-name
export interface Applicant {
    company: projectRole,
    department: Department,
    email: string,
    bus_email: string,
    id: string,
    name: string,
    phoneNumber: string,
    project:Project,
    photoURL: string,
    dataId: string,
    address: string,
    nationality: string,
    nationalId: string,
    // roles: [service]
}
// tslint:disable-next-line: class-name
export interface emailLogin {
    password?: string; email?: string;
}
// tslint:disable-next-line: class-name
export interface mail {
    Subject: string,
    createdOn: string,
    From: string,
    To: string,
    HTMLBody: any,
}
// tslint:disable-next-line: class-name
export interface timeSheetDate {
    name: string,
    id: string
    // value: string,
    // id: string
}
// tslint:disable-next-line: class-name
export interface classWork extends classification  {
    Hours: [work],
    totalHours: number
}
// tslint:disable-next-line: class-name
export interface work {
    WorkingTime: string,
    name: string,
    id: string,
}

// export interface myLiability {
//     name: string,
//     amount: string,
//     id: string
// }

// tslint:disable-next-line: class-name
export interface workReport  {
    name: string,
    id: string,
    action: string,
    actionId: string,
    time: string,
    tHours: string,
    tMinutes: string,
    reason: string,
    hours: number
}
// tslint:disable-next-line: class-name
export interface unRespondedWorkReport {
    name: string,
    id: string,
    time: string,
    reason: string,
    tHours: string,
    tMinutes: string,
    hours: number
}
// tslint:disable-next-line: class-name
export interface rpt extends workItem {
    wrkHours: string,
    startTime: string,
    endTime: string
}
// tslint:disable-next-line: class-name
export interface report { name: string, description: String, type: string, id: string, byId: string, byPhotoUrl: string,
    by: string, createdOn: string, photoUrl: string, companyName: string, companyId: string, projectName: string, projectId: string, }
// tslint:disable-next-line: class-name
export interface comment { name: string, id: string, byId: string, by: string, createdOn: string, photoUrl: string }
export interface TaskComment { coment: String, by: ParticipantData, createdOn: string}
