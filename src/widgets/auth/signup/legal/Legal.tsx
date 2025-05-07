"use client";

import { ICompanyInfoData } from "@/types/auth/legal";
import CompanyInfo from "./CompanyInfo";
import { useState } from "react";

export default function Legal() {
  const [next, setNext] = useState<number>(1);
  const [companyInfoData, setCompanyInfoData] = useState<
    ICompanyInfoData | undefined
  >(undefined);
  return (
    <>
      <CompanyInfo setNext={setNext} setCompanyInfoData={setCompanyInfoData} />
    </>
  );
}
