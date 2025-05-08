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

// Management's personal information
export interface IManagementInfoData {
  firstNameCeo: string;
  lastNameCeo: string;
  middleNameCeo: string;
  firstNameAccountant: string;
  lastNameAccountant: string;
  middleNameAccountant: string;
  phone: string;
}

// text input fields for management info fields
type ManagementInfoText = {
  [name: string]: string; // input name -> label name
};

export const MANAGEMENT_INFO: ManagementInfoText[] = [
  {
    firstNameCeo: "Имя генерального директора",
  },
  {
    lastNameCeo: "Фамилия генерального директора",
  },
  {
    middleNameCeo: "Отчество генерального директора",
  },
  {
    firstNameAccountant: "Имя главного бухгалтера",
  },
  {
    lastNameAccountant: "Фамилия главного бухгалтера",
  },
  {
    middleNameAccountant: "Отчество главного бухгалтера",
  },
  {
    phone: "Контактный номер телефона",
  },
];
