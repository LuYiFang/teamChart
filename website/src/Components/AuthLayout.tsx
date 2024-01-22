import { useOutlet } from "react-router-dom";
import { AuthProvider } from "../hook/useAuth";
import { UserOpenInfoProvider } from "../hook/useUserOpenInfo";

const AuthLayout = () => {
  const outlet = useOutlet();

  return (
    <AuthProvider>
      <UserOpenInfoProvider>{outlet}</UserOpenInfoProvider>
    </AuthProvider>
  );
};

export default AuthLayout;
