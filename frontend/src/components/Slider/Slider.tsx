import Carousel from "nuka-carousel";
import partizan1 from "../../static/1.jpg";
import partizan2 from "../../static/2.jpg";
import partizan3 from "../../static/3.jpg";
import "./Slider.scss";

export default function Slider() {
  return (
    <Carousel
      className="carousel"
      autoplay={true}
      wrapAround={true}
      autoplayInterval={7000}
      withoutControls={true}
      pauseOnHover={false}
    >
      <img src={partizan1} />
      <img src={partizan2} />
      <img src={partizan3} />
    </Carousel>
  );
}
