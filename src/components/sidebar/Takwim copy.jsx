import { useEffect, useState } from "react";
import { HandleErrorZone, ReadWaktu, ShowTime } from "../../assets/ipray";
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
    blinkSolat: false,
  });
  const [playedItems, setPlayedItems] = useState({ videos: {}, solatTimes: {} }); // Menggabungkan video dan solat

  useEffect(() => {
    if (loading) return () => { };
    const initializeWaktu = async () => {
      try {
        if (dataTakwim?.zone) {
          const waktuData = await ReadWaktu(dataTakwim?.zone || "");
          updateTime(waktuData);
        } else {
          throw new Error("Unknown zone");
        }
      } catch (error) {
        console.error("Error initializing waktu:", error.message);
        const fallbackTimeData = HandleErrorZone();
        setTimeData({
          jam: fallbackTimeData.jam,
          min: fallbackTimeData.min,
          dayn: fallbackTimeData.dayn,
          mdate: fallbackTimeData.mdate,
          hdate: fallbackTimeData.hdate,
          wnxt: { waktu: "", masa: "" },
          period: "",
          wmasuk: false,
          blinkSolat: false,
        });
      }
    };

    const updateTime = (currentData) => {
      if (!currentData) currentData = HandleErrorZone();
      const use24Hour = dataTakwim?.use24Hour || false;
      const jam = use24Hour ? currentData.jam24 : currentData.jam;
      const wnxt = use24Hour
        ? {
          waktu: currentData.wnxt24?.waktu || "",
          masa: currentData.wnxt24?.masa || "--:--",
        }
        : {
          waktu: currentData.wnxt?.waktu || "",
          masa: currentData.wnxt.masa || "--:--",
        };
      const period = use24Hour ? "" : currentData.period;

      setTimeData({
        jam,
        min: currentData.min || "--",
        dayn: currentData.dayn || "--",
        mdate: currentData.mdate || "--",
        hdate: currentData.hdate || "--",
        wnxt,
        period,
        wmasuk: currentData.wmasuk,
        blinkSolat: currentData.blinkSolat,
      });
      console.log(currentData)
      handleItems(currentData);
    };

    const handleItems = (currentData) => {
      const currentTime = `${currentData.jam24}:${currentData.min}`;
      const schedule = dataTakwim?.vidsch?.sch || [];
      const solatTimes = currentData.wsolat24 || [];

      // Handle video schedule
      schedule.forEach((item) => {
        if (item.time === currentTime && item.file && !playedItems.videos[item.time]) {
          console.log(`Playing scheduled video: ${item.file}`);
          setPopup(true);
          setPath(item.file);
          setPlayedItems((prev) => ({ ...prev, videos: { ...prev.videos, [item.time]: true } }));
        }
      });

      // Handle solat times
      solatTimes.forEach((solat) => {
        if (solat.masa === currentTime && !playedItems.solatTimes[solat.masa]) {
          console.log(`Masuk waktu solat: ${solat.waktu}`);
          setPopup(true);
          setPath(dataTakwim?.azanfile);
          setPlayedItems((prev) => ({ ...prev, solatTimes: { ...prev.solatTimes, [solat.masa]: true } }));
        }
      });
    };

    initializeWaktu();
    const timeInterval = setInterval(() => updateTime(ShowTime()), 1000);
    return () => clearInterval(timeInterval);
  }, [dataTakwim, playedItems]);

  useEffect(() => {
    const resetPlayedData = () => {
      const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isValidTimezone = dataTakwim?.zone === deviceTimezone;

      if (!isValidTimezone) {
        console.warn(
          `Timezone mismatch! Device timezone: ${deviceTimezone}, Expected timezone: ${dataTakwim?.zone}`
        );
      }

      setPlayedItems({ videos: {}, solatTimes: {} });
    };

    const now = new Date();
    const millisUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) -
      now;

    const timer = setTimeout(resetPlayedData, millisUntilMidnight);

    return () => clearTimeout(timer);
  }, [dataTakwim]);

  if (loading) return <div>Loading...</div>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="min-h-[124px]">
      <div className="flex justify-between px-3 pt-2 h-[66px]">
        {timeData.jam && timeData.min && timeData.mdate && timeData.hdate && (
          <>
            <div className={`flex flex-row font-semibold text-5xl text-center ${timeData.blinkSolat ? "animate-blinking" : ""}`}>
              <span className="w-auto text-right">{timeData.jam}</span>
              <span className="w-[20px] leading-10">:</span>
              <span className="w-auto text-left">{timeData.min}</span>
              {timeData.period && (
                <span className="w-auto text-left ml-2 text-xl font-medium">{timeData.period}</span>
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
      <div className={`flex justify-between px-3 py-2 h-[58px] ${timeData.blinkSolat ? "animate-blinking text-red-600" : ""}`}>
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
