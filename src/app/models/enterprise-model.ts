export interface Enterprise {
    name: string,
    by: string,
    byId: string,
    createdOn: string,
    id: string,
    location: string,
    sector: string,
    participants: [ParticipantData]
}

export interface Subsidiary extends Enterprise {
    Holding_companyName: string,
    companyId: string 
}

export interface Department {
    name: string,
    by: string,
    byId: string,
    companyName: string,
    companyId: string,
    createdOn: string,
    id: string,
    head: ParticipantData
}

export interface companyStaff { name: string; phoneNumber: string; by: string; byId: string; createdOn: string; email: string; id: string; };


export interface ParticipantData {
    name: string,
    id: string,
    email: string,
    phoneNumber: string
}

export interface companyChampion {
    companyName,
    id,
    contactPerson: ParticipantData
}