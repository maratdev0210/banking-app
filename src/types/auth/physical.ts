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
