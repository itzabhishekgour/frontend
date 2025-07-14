import UserAddressCard from "../components/userPofile/UserAddressCard";
import UserInfoCard from "../components/userPofile/UserInfoCard";
import UserPaymentDetailCard from "../components/userPofile/UserPaymentDetailCard";

export default function UserProfiles() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 overflow-y-auto scrollbar-hide">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        Profile
      </h3>
      <div className="space-y-6">
        <UserInfoCard />
        <UserPaymentDetailCard />
        <UserAddressCard />
      </div>
    </div>
  );
}
