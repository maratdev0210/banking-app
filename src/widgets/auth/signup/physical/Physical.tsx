// Signup form for physical users

"use client";

import { useState } from "react";
import MainInfo from "./MainInfo";
import AdditionalInfo from "./AdditionalInfo";
import PhotoUpload from "./PhotoUpload";

export default function Physical() {
  const [next, setNext] = useState(1); // shows the current step of a registration

  return (
    <>
      <div className="relative flex justify-center items-center h-lvh">
        <div className="w-110">
          {next == 1 && <MainInfo setNext={setNext} />}
          {next == 2 && <AdditionalInfo setNext={setNext} />}
          {next == 3 && <PhotoUpload />}
        </div>
      </div>
    </>
  );
}
