// types related to cashier auth

export interface ICashierData {
  firstName: string;
  lastName: string;
  middleName: string;
  username: string;
  password: string;
}

type ICashierForm = {
  [name: string]: string; // input name -> label name
};

export const CASHIER_INFO: ICashierForm[] = [
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
    username: "Логин",
  },
];
