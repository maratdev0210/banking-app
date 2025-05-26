// Navigation links

// show those links when the user is not authenticated
interface INavigationPublic {
  [key: string]: string;
}

// show those links when the user is already authenticated
interface INavigationPrivate {
  [key: string]: string;
}

export const NAVIGATION_PUBLIC: INavigationPublic = {
  Войти: "/auth/login",
  "Физическим лицам": "/auth/signup/physical",
  "Юридическим лицам": "/auth/signup/legal",
  Сотрудникам: "employee/signup",
  Главная: "/",
};

export const NAVIGATION_PRIVATE: INavigationPrivate = {
  Главная: "/",
};
