import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import {
  Button
} from 'antd';

const SlickArrowLeft = ({ className, style, onClick }) => (
  <Button
    disabled={className.includes('slick-disabled')}
    className={className}
    style={style}
    onClick={onClick}
    icon={<LeftOutlined />} />
);

const SlickArrowRight = ({ className, style, onClick }) => (
  <Button
    disabled={className.includes('slick-disabled')}
    className={className}
    style={style}
    onClick={onClick}
    icon={<RightOutlined />} />
);

export const carouselSettings = {
  infinite: false,
  arrows: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  prevArrow: <SlickArrowLeft />,
  nextArrow: <SlickArrowRight />,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        dots: true
      }
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        dots: true
      }
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        dots: true
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: false,
        dots: true
      }
    },
    {
      breakpoint: 450,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        dots: true
      }
    }
  ]
};
