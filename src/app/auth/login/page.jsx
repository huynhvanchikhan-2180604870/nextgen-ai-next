"use client";

import { Suspense } from "react";
import LoginForm from "../../../components/ui/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
