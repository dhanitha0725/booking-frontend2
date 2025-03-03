import HeroBanner from "../features/home/components/HeroBanner";
import FeaturedFacilities from "../features/home/components/FeaturedFacilities";
import HowItWorks from "../features/home/components/HowItWorks";
import Testimonials from "../features/home/components/Testimonials";
import CallToAction from "../features/home/components/CallToAction";

const Home = () => {
  return (
    <>
      <HeroBanner />
      <FeaturedFacilities />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </>
  );
};

export default Home;
