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
    dot: ':',
  });
  const [playedItems, setPlayedItems] = useState({ videos: {}, solatTimes: {} });

  const setBlinking = (currentSec, solatTimes) => {
    const range = { before: 10 * 60, after: 15 * 60 };
    return solatTimes.some((solat) => {
      const [hour, min] = solat.masa.split(":").map(Number);
      const solatSec = hour * 3600 + min * 60;
      return currentSec >= solatSec - range.before && currentSec <= solatSec + range.after;
    });
  };

  const initializeWaktu = async () => {
    try {
      if (!dataTakwim?.zone) throw new Error("Unknown zone");
      updateTime(await ReadWaktu(dataTakwim.zone));
    } catch (error) {
      console.error("Error initializing waktu:", error.message);
    }
  };

  const updateTime = (currentData) => {
    const use24Hour = dataTakwim?.use24Hour;
    const jam = use24Hour ? currentData.jam24 : currentData.jam;
    const wnxt = use24Hour
      ? { waktu: currentData.wnxt24?.waktu || "", masa: currentData.wnxt24?.masa || "--:--" }
      : { waktu: currentData.wnxt?.waktu || "", masa: currentData.wnxt?.masa || "--:--" };
    const currentSec = parseInt(currentData.jam24) * 3600 + parseInt(currentData.min) * 60;
    const solatTimes = currentData.wsolat24 || [];

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
      blinkSolat: setBlinking(currentSec, solatTimes),
    });

    handleItems(currentData);
  };

  const handleItems = (currentData) => {
    const currentTime = `${currentData.jam24}:${currentData.min}`;
    const schedule = dataTakwim?.vidsch?.sch || [];
    const solatTimes = currentData.wsolat24 || [];

    schedule.forEach((item) => {
      if (item.time === currentTime && item.file && !playedItems.videos[item.time]) {
        setPopup(true);
        setPath(item.file);
        setPlayedItems((prev) => ({ ...prev, videos: { ...prev.videos, [item.time]: true } }));
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

  useEffect(() => {
    const resetPlayedData = () => setPlayedItems({ videos: {}, solatTimes: {} });
    const millisUntilMidnight =
      new Date(new Date().setHours(24, 0, 0, 0)) - new Date();
    const timer = setTimeout(resetPlayedData, millisUntilMidnight);
    return () => clearTimeout(timer);
  }, [dataTakwim]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-[124px] px-4">
      <div className="flex justify-between pt-2 h-[66px]">
        {timeData.jam && timeData.min && timeData.mdate && timeData.hdate && (
          <>
            <div
              className={`flex flex-row font-semibold text-5xl text-center`}
            >
              <span className="w-auto text-right">{timeData.jam}</span>
              <span className="w-[20px] leading-10 ">{timeData.dot}</span>
              <span className="w-auto text-left">{timeData.min}</span>
              {timeData.period && (
                <span className="w-auto text-left ml-2 text-xl font-medium">
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
      <div className={`flex justify-between py-2 h-[58px] ${timeData.blinkSolat ? "animate-blinking text-red-600" : ""}`}>
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
