export interface Enterprise {
    name: string, by: string, byId: string, createdOn: string, id: string, address: String, telephone: string, location: string,
    sector: string, services: [service], participants: [ParticipantData], bus_email: string, updatedStatus: boolean ,
    champion: ParticipantData, taxDocument: any, HnSDocument: string, IndustrialSectorDocument: string,
    targetMonthlyIncome: string, actualMonthlyIncome: string, balanceSheet: string, actualAnnualIncome: string,
    targetAnnualIncome: string,
}

// export interface income {}

export interface Subsidiary extends Enterprise { Holding_companyName: string, companyId: string }

// tslint:disable-next-line: class-name
export interface compProfile extends Enterprise { updated: boolean }

// tslint:disable-next-line: class-name
export interface service { display: string, value: string }

export interface Department { name: string, by: string, byId: string, companyName: string, companyId: string, createdOn: string,
    id: string, hod: ParticipantData }

// tslint:disable-next-line: class-name
export interface companyStaff { name: string, phoneNumber: string, by: string, byId: string, createdOn: string, email: string,
    bus_email: string, id: string, photoURL: string, departmentId: string, department: string, address: String, nationalId: string,
    nationality: string, hierarchy: string  }

export interface ParticipantData { name: string, id: string, email: string, bus_email: string, phoneNumber: string, photoURL: string,
    address: String, nationalId: string, nationality: string }
// tslint:disable-next-line: class-name
export interface employeeData extends ParticipantData { department: string, departmentId: string, hierarchy: string }

export interface Labour extends ParticipantData { cost: string, activeTime: string[] }

// tslint:disable-next-line: class-name
export interface stuffSalary extends companyStaff { monthlyPay: string, activeTime: string[] }

// tslint:disable-next-line: class-name
export interface companyChampion { companyName, id, contactPerson: ParticipantData }

// tslint:disable-next-line: class-name
export interface asset { name: string, assetNumber: string, by: string, byId: string, companyName: string, companyId: string,
    createdOn: string, cost: string }

// tslint:disable-next-line: class-name
export interface assetInProject { name: string, assetNumber: string, by: string, byId: string, companyName: string, companyId: string,
    createdOn: string, rate: string, unit: string }

// tslint:disable-next-line: class-name
export interface projectRole extends Enterprise { roles: [service] }

// tslint:disable-next-line: class-name
export interface client { name: string, id: string, contactPerson: any, champion: ParticipantData, by: string, byId: string,
    createdOn: string, address: String, telephone: string, location: string, sector: string, services: [service], taxDocument: any,
    HnSDocument: string, IndustrialSectorDocument: string, joinedOn: string}

// tslint:disable-next-line: class-name
export interface scheduleRate { name: string, id: string, by: string, byId: string, companyName: string, companyId: string,
    projectId: string, createdOn: string, rate: number, unit: string, projectName: string }

// tslint:disable-next-line: class-name
export interface hierarchy { name: string }
