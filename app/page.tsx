import AboutUs from "./components/home/AboutUs";
import ForTeens from "./components/home/ForTeens";
import TopBanner from "./components/home/TopBanner";
import Trainers from "./components/home/Trainers";
import Trainings from "./components/home/Trainings";
import WhyStudyWithUs from "./components/home/WhyStudyWithUs";


export default function Home() {
  return (
    <div className="Home">
        <TopBanner />
        <Trainings />
        <ForTeens />
        <WhyStudyWithUs />
        <Trainers />
        <AboutUs />

    </div>
  );
}
