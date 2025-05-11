"use client";

import { ICompanyInfoData, IManagementInfoData } from "@/types/auth/legal";
import CompanyInfo from "./CompanyInfo";
import { useState, useEffect } from "react";
import ManagementInfo from "./ManagementInfo";
import { createLegalUser } from "@/lib/signup";

export default function Legal() {
  const [next, setNext] = useState<number>(1);
  const [companyInfoData, setCompanyInfoData] = useState<
    ICompanyInfoData | undefined
  >(undefined);
  const [managementInfoData, setManagementInfoData] = useState<
    IManagementInfoData | undefined
  >(undefined);
  const [isRegistered, setIsRegistered] = useState(false); // check if the user has submiited the form for signup

  useEffect(() => {
    const createNewUser = async () => {
      const result = await createLegalUser(companyInfoData, managementInfoData);
      console.log(result);
    };
    if (isRegistered) {
      createNewUser();
    }
  }, [isRegistered]);

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
              setIsRegistered={setIsRegistered}
            />
          )}
        </div>
      </div>
    </>
  );
}
