import { Auth } from "../components/Auth";
import { Quote } from "../components/quote";

export const Signup = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      {/* Left side: Form or content */}
      <div className="p-4">
        {/* You can add your signup form here */}
        <Auth type="signup"/>
      </div>

      {/* Right side: Quote component, only visible on large screens */}
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};
