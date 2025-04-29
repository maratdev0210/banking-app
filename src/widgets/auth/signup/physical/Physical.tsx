// Signup form for physical users

"use client";

import { useState } from "react";
import MainInfo from "./MainInfo";

export default function Physical() {
  const [next, setNext] = useState(1); // shows the current step of a registration

  return (
    <>
      <div className="relative">
        <div className="absolute top-100 left-1/2 -translate-y-1/2 -translate-x-1/2">
          <MainInfo setNext={setNext} />
        </div>
      </div>
    </>
  );
}
