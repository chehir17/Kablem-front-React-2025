import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Ce Connecter - Kab Admin"
        description="This is the SignIn page for Kab Admin"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
