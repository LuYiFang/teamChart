import { Navigate, useNavigate, useOutlet } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import { home } from "../Utility/routePath";

const PublicLayout = () => {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (user) {
    return <Navigate to={home} />;
  }
  return <>{outlet}</>;
};
export default PublicLayout;
