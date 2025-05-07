// Main information about the company
export interface ICompanyInfoData {
  companyName: string;
  address: string;
  ownershipForm: string;
}

// text input fields for main company information
type CompanyInfoDataText = {
  [name: string]: string; // input name -> label name
};

export const COMPANY_INFO: CompanyInfoDataText[] = [
  {
    companyName: "Наименование компании",
  },
  {
    address: "Адрес",
  },
];

export const COMPANY_OWNERSHIP: string[] = [
  "Государственная",
  "Частная",
  "Смешанная",
  "Иностранная",
];
