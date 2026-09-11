import type { Metadata } from "next";
import { AuthCard, AuthLayout } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your REAORI account.",
};

export default function SignInPage() {
  return (
    <AuthLayout background="/images/sign.jpg">
      <AuthCard mode="signin" />
    </AuthLayout>
  );
}