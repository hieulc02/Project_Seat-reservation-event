import { shuffle } from 'lodash';
import Slider from 'react-slick';
import Link from 'next/link';
import styles from '../styles/carousel.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const NextArrow = (props) => {
  const { style, onClick } = props;
  return (
    <div
      className={styles.nextArrow}
      style={{
        ...style,
      }}
      onClick={onClick}
    />
  );
};
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div className={styles.prevArrow} style={{ ...style }} onClick={onClick} />
  );
};
const Carousel = ({ events }) => {
  let slider = [];
  slider = shuffle(events).slice(0, 5);
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };
  return (
    <>
      <div className={styles.container}>
        <Slider {...settings}>
          {slider.map((event, index) => (
            <div key={index}>
              <Link href={`/event/${event.slug}`}>
                <img
                  src={event.image}
                  alt={`Event ${index + 1}`}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'center',
                    width: '100%',
                    borderRadius: '10px',
                  }}
                />
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </>
  );
};

export default Carousel;
