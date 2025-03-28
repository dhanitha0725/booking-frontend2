import HeroBanner from "../features/client/home/components/HeroBanner";
import FeaturedFacilities from "../features/client/home/components/FeaturedFacilities";
import HowItWorks from "../features/client/home/components/HowItWorks";
import CallToAction from "../features/client/home/components/CallToAction";

const Home = () => {
  return (
    <>
      <HeroBanner />
      <FeaturedFacilities />
      <HowItWorks />
      <CallToAction />
    </>
  );
};

export default Home;
