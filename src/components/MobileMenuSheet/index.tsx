import dynamic from "next/dynamic";
import { Button } from "~/components/UI/Button";

const MobileMenuSheet = dynamic(
  () => import("~/components/MobileMenuSheet/MobileMenuSheet"),
  {
    loading: () => <Loading />,
    ssr: false,
  }
);

const Loading = () => (
  <Button variant="outline" disabled>
    Menu
  </Button>
);

export default MobileMenuSheet;
