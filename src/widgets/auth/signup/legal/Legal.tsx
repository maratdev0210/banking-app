"use client";

import { ICompanyInfoData, IManagementInfoData } from "@/types/auth/legal";
import CompanyInfo from "./CompanyInfo";
import { useState } from "react";
import ManagementInfo from "./ManagementInfo";

export default function Legal() {
  const [next, setNext] = useState<number>(1);
  const [companyInfoData, setCompanyInfoData] = useState<
    ICompanyInfoData | undefined
  >(undefined);
  const [managementInfoData, setManagementInfoData] = useState<
    IManagementInfoData | undefined
  >(undefined);
  return (
    <>
      <div className="relative flex justify-center items-center h-lvh">
        <div className="w-110">
          {next == 1 && (
            <CompanyInfo
              setNext={setNext}
              setCompanyInfoData={setCompanyInfoData}
            />
          )}
          {next == 2 && (
            <ManagementInfo
              setNext={setNext}
              setManagementInfoData={setManagementInfoData}
            />
          )}
        </div>
      </div>
    </>
  );
}
