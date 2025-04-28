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
