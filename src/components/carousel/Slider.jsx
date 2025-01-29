import { Fragment, useEffect, useRef, useState } from 'react';
import { imageSlider } from '../../assets/js-image-slider/js-image-slider';
import { useContextState } from '../../contextState';
import '../../assets/js-image-slider/js-image-slider.css';

const Slider = () => {
  const slideRef = useRef();
  const videoRef = useRef();
  const { dataSlide, loading, error } = useContextState()
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pause, setPause] = useState(true);
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [sliderData, setSliderData] = useState([
    {
      "type": "image",
      "time": "2",
      "src": "./images/bg0.png",
      "title": "Welcome Indoor Digital Media",
      "path": ""
    }
  ])
  const minSlideTime = 2500;

  const nextSlide = () => {
    const nextIndex = (currentIndex + 1) % sliderData.length;
    setCurrentIndex(nextIndex);
    imageSlider.displaySlide(nextIndex);
  };

  const playCurrentVideo = () => {
    const video = videoRef.current;
    const src = sliderData[currentIndex].video
    if (video) {
      setPause(true)
      video.currentTime = 0;
      video.src = src;
      video.muted = true;
      video.play().catch((error) => console.warn(error));
      video.muted = false;
      // video.volume = 0.25;
      videoRef.current.onended = () => {
        setPause(false)
        nextSlide();
      }
    }
  };

  useEffect(() => {
    if (!pause) {
      const currentImage = sliderData?.[currentIndex];
      if (currentImage?.type === 'video') {
        playCurrentVideo();
      } else if (currentImage) {
        const slideTime = isFirstTime
          ? 1000
          : Math.max((currentImage?.time || 1) * 1000, minSlideTime);
        const timer = setTimeout(() => {
          nextSlide();
          setIsFirstTime(false);
        }, slideTime);
        return () => clearTimeout(timer);
      }
    }
  }, [currentIndex, pause]);

  useEffect(() => {
    setPause(true)
    if (dataSlide) setSliderData(dataSlide);
    const checkSlider = setInterval(() => {
      if (slideRef.current) {
        imageSlider.reload();
        setPause(false);
        clearInterval(checkSlider);
      }
    }, 100);
    return () => clearInterval(checkSlider);
  }, [dataSlide]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div ref={slideRef} id="slider" className='flex-shrink'>
      {sliderData?.map((img, idx) => (
        <Fragment key={idx}>
          {/* <a key={idx} className={img.type !== 'image' ? 'video' : 'lazyImage'} href={img.src}> */}
          {img.type === 'image' && (
            <img src={img.src} />
          )}
          {img.type === 'iframe' && (
            <a href='#'>
              <img src={img.src} />
              <iframe
                src={img.url}
                style={{ display: 'block', position: 'absolute', width: '100%', height: '100%', border: 0, zIndex: 1 }}
                allowFullScreen
              ></iframe>
            </a>
          )}
          {img.type === 'video' && (
            <a className='video' >
              <video
                preload="none" data-image={img.src}
                ref={currentIndex === idx ? videoRef : null} // Referensi hanya pada video aktif
                style={{ display: 'block', position: 'absolute', width: '100%', height: '100%', border: 0, zIndex: 1 }}
                type="video/mp4"
              ></video>
            </a>
          )}
          {/* </a> */}
        </Fragment>
      ))}
    </div>
  );
};

export default Slider;
