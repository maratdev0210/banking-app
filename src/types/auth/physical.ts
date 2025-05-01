// Input labels for physical users

type IMainInfo = {
  [name: string]: string; // input name -> label name
};

export const MAIN_INFO: IMainInfo[] = [
  {
    firstName: "Имя",
  },
  {
    lastName: "Фамилия",
  },
  {
    middleName: "Отчество",
  },
  {
    phone: "Номер телефона",
  },
];

type IAdditionalInfo = {
  [name: string]: string;
};

export const ADDITIONAL_INFO: IAdditionalInfo[] = [
  {
    birthDate: "Дата рождения",
  },
  {
    address: "Адрес проживания",
  },
  {
    gender: "Пол",
  },
];

// Interfaces for storing the form data on user submit
// The data is later used for adding the user record
// to a database

export interface IMainInfoData {
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
}

export interface IAdditionalInfoData {
  birthDate: Date;
  address: string;
  gender: string;
  isDebtor: boolean;
  isEmployee: boolean;
}
