// Signup form for physical users

"use client";

import { useState } from "react";
import MainInfo from "./MainInfo";
import AdditionalInfo from "./AdditionalInfo";

export default function Physical() {
  const [next, setNext] = useState(1); // shows the current step of a registration

  return (
    <>
      <div className="relative">
        <div className="absolute top-100 left-1/2 -translate-y-1/2 -translate-x-1/2">
          {next == 1 && <MainInfo setNext={setNext} />}
          {next == 2 && <AdditionalInfo setNext={setNext} />}
        </div>
      </div>
    </>
  );
}
