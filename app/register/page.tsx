import type { Metadata } from "next";
import { AuthCard, AuthLayout } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a REAORI account to unlock member fares.",
};

export default function RegisterPage() {
  return (
    <AuthLayout background="/images/reg.jpg">
      <AuthCard mode="register" />
    </AuthLayout>
  );
}