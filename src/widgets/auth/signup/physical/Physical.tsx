// Signup form for physical users

"use client";

import { useState, useEffect } from "react";
import MainInfo from "./MainInfo";
import AdditionalInfo from "./AdditionalInfo";
import PhotoUpload from "./PhotoUpload";
import { IMainInfoData, IAdditionalInfoData } from "@/types/auth/physical";
import createUser from "@/lib/signup";

export default function Physical() {
  const [next, setNext] = useState(1); // shows the current step of a registration
  const [mainInfoData, setMainInfoData] = useState<IMainInfoData | undefined>();
  const [additionalInfoData, setAdditionalInfoData] = useState<
    IAdditionalInfoData | undefined
  >();
  const [imageFile, setImageFile] = useState<File | undefined>();
  const [isRegistered, setIsRegistered] = useState<boolean>(false); // when the user is registered create a new record in a database

  useEffect(() => {
    const createNewUser = async () => {
      const result = await createUser(
        mainInfoData,
        additionalInfoData,
      );
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
            <MainInfo setNext={setNext} setMainInfoData={setMainInfoData} />
          )}
          {next == 2 && (
            <AdditionalInfo
              setNext={setNext}
              setAdditionalInfoData={setAdditionalInfoData}
            />
          )}
          {next == 3 && (
            <PhotoUpload
              setImageFile={setImageFile}
              setIsRegistered={setIsRegistered}
            />
          )}
        </div>
      </div>
    </>
  );
}
