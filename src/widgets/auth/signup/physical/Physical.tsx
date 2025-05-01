// Signup form for physical users

"use client";

import { useState, useEffect } from "react";
import MainInfo from "./MainInfo";
import AdditionalInfo from "./AdditionalInfo";
import PhotoUpload from "./PhotoUpload";
import { IMainInfoData, IAdditionalInfoData } from "@/types/auth/physical";

export default function Physical() {
  const [next, setNext] = useState(1); // shows the current step of a registration
  const [mainInfoData, setMainInfoData] = useState<IMainInfoData | undefined>();
  const [additionalInfoData, setAdditionalInfoData] = useState<
    IAdditionalInfoData | undefined
  >();
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // when the user is registered create a new record in a database

  useEffect(() => {
    if (isRegistered) {
      // TO-DO: create the user record in a database
      console.log(mainInfoData);
      console.log(additionalInfoData);
    }
  }, [isRegistered]);

  return (
    <>
      <div className="relative flex justify-center items-center h-lvh">
        <div className="w-110">
          {next == 1 && (
            <MainInfo setNext={setNext} setMainInfoData={setMainInfoData} />
          )}
          {next == 2 && (
            <AdditionalInfo
              setNext={setNext}
              setAdditionalInfoData={setAdditionalInfoData}
            />
          )}
          {next == 3 && <PhotoUpload setIsRegistered={setIsRegistered} />}
        </div>
      </div>
    </>
  );
}
