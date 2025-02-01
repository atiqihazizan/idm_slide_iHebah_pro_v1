import { useEffect, useState } from "react";
import { ReadWaktu, ShowTime } from "../../assets/ipray";
import { useContextState } from "../../contextState";

const Takwim = () => {
  const { dataTakwim, loading, error, setPopup, setPath } = useContextState();
  const [timeData, setTimeData] = useState({
    jam: "",
    min: "",
    dayn: "",
    mdate: "",
    hdate: "",
    wnxt: { waktu: "", masa: "" },
    period: "",
    wmasuk: false,
    allowAzan: false,
    blinkSolat: false,
    dot: ":",
  });
  const [playedItems, setPlayedItems] = useState({
    videos: {},
    solatTimes: {},
  });

  const initializeWaktu = async () => {
    try {
      if (!dataTakwim?.zone) throw new Error("Unknown zone");
      updateTime(await ReadWaktu(dataTakwim.zone));
    } catch (error) {
      console.error("Error initializing waktu:", error.message);
    }
  };

  const setBlinking = (currTimeMin, solatTimes) => {
    if (solatTimes === false) return false;
    const [hour, min] = solatTimes.split(":").map(Number); // Ambil waktu solat
    const solatTimeMin = hour * 60 + min; // Tukar waktu solat ke minit

    const leftMin = solatTimeMin - currTimeMin; // Baki masa sebelum solat
    const passedMin = currTimeMin - solatTimeMin; // Masa sudah berlalu selepas solat

    // Fungsi untuk menukarkan minit ke format jam, minit, dan saat
    const convertToHoursMinutesSeconds = (minutes) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      // const secs = Math.floor((minutes - Math.floor(minutes)) * 60);
      return `${hours} jam ${mins} minit`;
    };

    console.log(convertToHoursMinutesSeconds(leftMin), solatTimes);

    const rangeBefore = 10,
      rangeAfter = 5;

    return (
      (leftMin <= rangeBefore && leftMin > 0) ||
      (passedMin <= rangeAfter && passedMin > 0)
    );
  };

  const updateTime = (currentData) => {
    const use24Hour = dataTakwim?.use24Hour;
    const jam = use24Hour ? currentData.jam24 : currentData.jam;
    const wnxt = use24Hour
      ? {
          waktu: currentData.wnxt24?.waktu || "",
          masa: currentData.wnxt24?.masa || "--:--",
        }
      : {
          waktu: currentData.wnxt?.waktu || "",
          masa: currentData.wnxt?.masa || "--:--",
        };

    // Tukar currentSec kepada minit
    const currTimeMin =
      parseInt(currentData.jam24) * 60 + parseInt(currentData.min);
    const solatTimes = currentData.wnxt24?.masa || false;

    setTimeData({
      jam,
      min: currentData.min || "--",
      dayn: currentData.dayn || "--",
      mdate: currentData.mdate || "--",
      hdate: currentData.hdate || "--",
      wnxt,
      dot: currentData.dot,
      period: use24Hour ? "" : currentData.period,
      wmasuk: currentData.wmasuk,
      allowAzan: currentData.allowAzan,
      blinkSolat: setBlinking(currTimeMin, solatTimes),
    });

    handleItems(currentData);
  };

  const handleItems = (currentData) => {
    const currentTime = `${currentData.jam24}:${currentData.min}`;
    const schedule = dataTakwim?.schedule || [];
    const solatTimes = currentData.wsolat24 || [];

    schedule.forEach((item) => {
      if (
        item.time === currentTime &&
        item.file &&
        !playedItems.videos[item.time]
      ) {
        setPopup(true);
        setPath(item.file);
        setPlayedItems((prev) => ({
          ...prev,
          videos: { ...prev.videos, [item.time]: true },
        }));
      }
    });

    solatTimes.forEach((solat) => {
      if (solat.masa === currentTime && !playedItems.solatTimes[solat.masa]) {
        if (currentData.allowAzan) {
          setPopup(true);
          setPath(dataTakwim?.azanfile);
        }
        setPlayedItems((prev) => ({
          ...prev,
          solatTimes: { ...prev.solatTimes, [solat.masa]: true },
        }));
      }
    });
  };

  useEffect(() => {
    if (!loading) {
      initializeWaktu();
      const interval = setInterval(() => updateTime(ShowTime()), 1000);
      return () => clearInterval(interval);
    }
  }, [loading, dataTakwim, playedItems]);
  // }, [loading]);

  useEffect(() => {
    const resetPlayedData = () =>
      setPlayedItems({ videos: {}, solatTimes: {} });
    const millisUntilMidnight =
      new Date(new Date().setHours(24, 0, 0, 0)) - new Date();
    const timer = setTimeout(resetPlayedData, millisUntilMidnight);
    return () => clearTimeout(timer);
  }, [dataTakwim]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-[110px] px-4 pt-3 flex flex-col justify-between">
      <div className="flex justify-between h-[50px]">
        {timeData.jam && timeData.min && timeData.mdate && timeData.hdate && (
          <>
            <div className={`flex flex-row font-semibold text-5xl text-center`}>
              <span className="w-auto text-right">{timeData.jam}</span>
              <span className="w-[20px] leading-10 ">{timeData.dot}</span>
              <span className="w-auto text-left">{timeData.min}</span>
              {timeData.period && (
                <span className="w-auto text-left ml-2 text-sm font-normal self-end">
                  {timeData.period}
                </span>
              )}
            </div>
            <div className="flex flex-col items-end text-[15px]">
              <span className="font-bold text-[17px]">
                {timeData.dayn}, {timeData.mdate}
              </span>
              <span className="">{timeData.hdate}</span>
            </div>
          </>
        )}
      </div>
      <div
        className={`flex justify-between py-2 h-[50px] ${
          timeData.blinkSolat ? "animate-blinking text-red-600" : ""
        }`}
      >
        {timeData.wnxt && (
          <>
            <span className="font-semibold text-2xl uppercase">
              {timeData.wnxt.waktu}
            </span>
            <div className="text-end font-semibold text-2xl uppercase">
              {timeData.wnxt.masa}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Takwim;
