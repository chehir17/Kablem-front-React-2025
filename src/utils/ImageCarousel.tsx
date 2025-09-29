import { useState } from "react";
import Slider from "react-slick";
import { CloseIcon } from "../icons";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageCarouselProps {
  images: { src: string; alt: string; caption: string }[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const CustomPrevArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-[-3rem] top-1/2 transform -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 transition"
      >
        <ChevronLeft className="text-white w-6 h-6" />
      </button>
    );
  };

  const CustomNextArrow = (props: any) => {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-[-3rem] top-1/2 transform -translate-y-1/2 z-50 bg-white/20 hover:bg-white/40 rounded-full p-2 transition"
      >
        <ChevronRight className="text-white w-6 h-6" />
      </button>
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    initialSlide: startIndex,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };

  return (
    <>
      {/* Mini carousel dans le tableau */}
      <div className="w-20">
        <Slider {...settings}>
          {images.map((img, idx) => (
            <div
              key={idx}
              className="flex justify-center cursor-pointer"
              onClick={() => {
                setStartIndex(idx);
                setIsOpen(true);
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-20 h-20 object-cover rounded-lg border"
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Modal fullscreen */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-9999999">
          <div className="relative w-full max-w-4xl flex justify-center">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-0 z-50 text-white bg-blue-500 px-1 py-1 rounded-full hover:bg-blue-600 transition"
            >
              <CloseIcon />
            </button>

            <div className="w-full px-12">
              <Slider {...settings}>
                {images.map((img, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center h-[80vh]"
                  >
                    <p className="text-white text-lg text-center font-medium mb-4 bg-black/50 px-10 py-1 rounded-lg">
                      {img.caption}
                    </p>

                    <img
                      src={img.src}
                      alt={img.alt}
                      className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-lg mx-auto"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
