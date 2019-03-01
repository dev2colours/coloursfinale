import { Project } from "./project-model";
import { Enterprise, Department, ParticipantData } from "./enterprise-model";

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
    companyName: string,
    companyId: string,
    createdOn: string,
    id: string,
    aboutMe: String,
    profession: [profession];
    qualifications:[string],
    bodyWeight: number,
    bodyHeight:number,
    bodyMassIndex: number,
    industrySector: string,
    personalAssets: [personalAsset],
    personalLiabilities: [personalLiability],
    reference: [string],
    focusFactor: number,
    referee: [ParticipantData],
    userImg:string,
    LastTimeLogin: string
    // User's FOcus Factor  = (Total assets value - Total cost of liability)/ (No of companies + projects user is Involved in)
}

export interface profession {
    name: string;
}

export interface personalAsset { 
    name: string,
    assetNumber: string,
    by: string,
    byId: string,
    addeddOn: string,
    value: string,
    id: string
};

export interface personalLiability {
    name: string,
    by: string,
    byId: string,
    addeddOn: string,
    amount: string,
    id: string
};

export interface classification {
    name?: string; createdOn: string; plannedTime?: string; actualTime: string; Varience: string; id: string
}

export interface classification {
    name?: string; createdOn: string; plannedTime?: string; actualTime: string; Varience: string; id: string
}

export interface personalStandards {
    classificationName: string;
    classificationId: string
    name: string;
    period: string; //  must be valid email format
    createdOn: string;
    id: string
}   

export interface selectedPeriod {
    name: string;
    id: string; //  must be valid email format
}

export interface Applicant {
    company: Enterprise,
    department: Department,
    email: string,
    bus_email: string,
    id: string,
    name: string,
    phoneNumber: string,
    project:Project,
    photoURL: string,
    dataId: string
}

export interface emailLogin {
    password?: string; email?: string;
}

export interface mail {
    Subject: string,
    createdOn: string,
    From: string,
    To: string,
    HTMLBody: any,
}

// export interface myAsset {
//     name: string,
//     value: string,
//     id: string
// }

// export interface myLiability {
//     name: string,
//     amount: string,
//     id: string
// }