
export interface Income {
    id: string; date: string; name: string; year: string; pValue: string; value: string;
}

export interface YearDoc  {
    id: string,
    name: string,
    date: string,
    monthly: Income[]
  };
// export interface Subsidiary extends Enterprise { Holding_companyName: string, companyId: string }
// export interface compProfile extends Enterprise { updated: boolean }

export interface NoIncome extends Income {
  numMon: number
};