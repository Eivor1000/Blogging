import { Auth } from "../components/Auth";
import { Quote } from "../components/quote";

export const Signin = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 h-screen">
      <div className="p-4">
        <Auth type="signin"/>
      </div>
      <div className="hidden lg:block">
        <Quote />
      </div>
    </div>
  );
};