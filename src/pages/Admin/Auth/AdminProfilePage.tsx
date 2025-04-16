import { LazyLoad } from "@/components/LazyLoad";
import { UserProfile } from "@/components/UserProfile";

const AdminProfilePage = () => {
  return (
    <LazyLoad>
      <UserProfile />
    </LazyLoad>
  );
};

export default AdminProfilePage;
