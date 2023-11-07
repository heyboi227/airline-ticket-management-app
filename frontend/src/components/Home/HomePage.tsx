import Search from "../Search/Search";
import ImageSlider from "../ImageSlider/ImageSlider";
import "./HomePage.scss";
import firstSliderImage from "../../static/3.jpg";
import secondSliderImage from "../../static/2.jpg";
import thirdSliderImage from "../../static/1.jpg";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import blackLogo from "../../static/png/logo-black.png";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => sessionStorage.setItem("firstTimeLoading", "false"), []);

  const items = [
    {
      image: firstSliderImage,
      altText:
        "A picture of a man with a luggage and a backpack, strolling through the airport while smiling.",
      text: "Air Soko offers unparalleled comfort in air travel. Our spacious seating, gourmet meals, and top-tier in-flight entertainment ensure a journey as enjoyable as your destination. Choose Air Soko for a lifestyle of comfort and quality.",
      textPosition: {
        right: "10vw",
      },
    },
    {
      image: secondSliderImage,
      altText: "A picture of a airplane front-facing the camera.",
      text: "Our dedicated crew sets Air Soko apart. Trained to provide top-notch service with a smile, our team ensures your needs are met promptly. Choose Air Soko for a passenger-first approach to air travel.",
      textPosition: {
        top: "0",
        left: "10vw",
      },
    },
    {
      image: thirdSliderImage,
      altText: "A girl looking at the airport timetable.",
      text: "Air Soko connects you to the world. Our extensive network, modern fleet, and commitment to punctuality ensure a smooth journey to your destination. With competitive fares and an innovative loyalty program, Air Soko is the smart choice for global travel.",
      textPosition: {
        right: "10vw",
      },
    },
  ];

  return (
    <>
      {!sessionStorage.getItem("firstTimeLoading") && (
        <LoadingScreen
          loadingTime={2500}
          loadingLogoImage={
            <img
              src={blackLogo}
              alt="Air Soko black text logo"
              className="loading-logo"
            />
          }
        />
      )}
      <div className="landing-page-header">
        <div className="w-50 d-flex flex-column justify-content-start align-items-center">
          <div className="d-flex flex-column justify-content-start align-items-center ms-5 intro-text">
            <h1 className="text-center">Fly with confidence and comfort.</h1>
            <div className="d-flex flex-column justify-content-start align-items-center mt-3">
              <h2>
                With our near-impeccable service, there will not be any lacking
                of these two qualities.
              </h2>
            </div>
          </div>
        </div>
      </div>
      <Search />
      <ImageSlider items={items} />
    </>
  );
}
