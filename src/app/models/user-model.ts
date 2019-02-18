import { Project } from "./project-model";
import { Enterprise, Department } from "./enterprise-model";

export interface coloursUser {
    name: string, username: string, email: string, phoneNumber: string, nationalId: string, nationality: string, telephone: number, address: string, zipCode: number, country: string, city: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string, id: string, aboutMe: string, 
}

export interface classification {
    name?: string; createdOn: string; plannedTime?: string; actualTime: string; Varience: string; id: string
}

export interface classification {
    name?: string; createdOn: string; plannedTime?: string; actualTime: string; Varience: string; id: string
}

export interface Applicant {
    company: Enterprise,
    department: Department,
    email: string,
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