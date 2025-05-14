type IClientType = {
  [type: string]: string;
};

export const CLIENT_TYPE: IClientType[] = [
  { PHYSICAL: "Физическое" },
  { LEGAL: "Юридическое" },
];
