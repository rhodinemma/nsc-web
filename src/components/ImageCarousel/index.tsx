import Slider from "react-slick";
import { Box, IconButton, Tooltip } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

interface CarouselProps {
  images: { src: string; alt: string }[];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomPrevArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        left: 0,
        transform: "translateY(-50%)",
        color: "#ffff",
        zIndex: 2,
      }}
    >
      <ArrowBackIos />
    </IconButton>
  );
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const CustomNextArrow = (props: any) => {
  const { onClick } = props;
  return (
    <IconButton
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "50%",
        right: 0,
        transform: "translateY(-50%)",
        color: "#ffff",
        zIndex: 2,
      }}
    >
      <ArrowForwardIos />
    </IconButton>
  );
};

const ImageCarousel: React.FC<CarouselProps> = ({ images }) => {
  const settings = {
    dots: true, // Enable pagination dots
    infinite: true, // Loop slides
    speed: 1000, // Transition speed
    slidesToShow: 1, // Number of visible slides
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Auto-scroll
    autoplaySpeed: 3000, // Auto-scroll speed in ms
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 800, margin: "auto" }}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <Box key={index} sx={{ position: "relative" }}>
            <Tooltip
              key={index}
              title="Click to view entire image"
              arrow
              placement="top"
            >
              <Box
                component="img"
                src={image.src}
                alt={image.alt}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: 3,
                  cursor: "pointer",
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
                onClick={() => window.open(image.src, "_blank")}
              />
            </Tooltip>
            {/* <Typography
              variant="caption"
              textAlign="center"
              sx={{
                position: "absolute",
                bottom: 10,
                width: "100%",
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "5px 0",
              }}
            >
              {image.alt}
            </Typography> */}
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default ImageCarousel;
