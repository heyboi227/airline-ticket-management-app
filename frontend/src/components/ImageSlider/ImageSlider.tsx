import { Carousel } from "react-bootstrap";
import "./ImageSlider.scss";
import { useState } from "react";

interface SliderProps {
  items: {
    image: string;
    altText: string;
    text: string;
    textPosition: {
      top?: string;
      left?: string;
      right?: string;
      bottom?: string;
      transform?: string;
    };
  }[];
}

export default function ImageSlider(props: SliderProps) {
  const [index, setIndex] = useState<number>(0);

  const handleSelect = (selectedIndex: number) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel fade activeIndex={index} onSelect={handleSelect} interval={7000}>
      {props.items.map((item, index) => (
        <Carousel.Item key={index}>
          <div className="slider-item">
            <img className="slider-image" src={item.image} alt={item.altText} />
            <div
              className="slider-text"
              style={{
                top: item.textPosition.top,
                left: item.textPosition.left,
                right: item.textPosition.right,
                bottom: item.textPosition.bottom,
                transform: item.textPosition.transform,
              }}
            >
              {item.text}
            </div>
          </div>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
