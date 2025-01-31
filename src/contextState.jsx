import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import PropTypes from "prop-types";

// Initial state
const initialState = {
  dataSlide: null,
  dataScroll: null,
  // dataTakwim: null,
  dataTakwim: { zone: "WLY01", use24Hour: false, azanfile: "./video/azan.mp4" },
  dataMain: {
    place: "",
    milldata: "",
    message: "",
    commonfile: "",
    localfile: "",
    azanfile: "",
    speedmsg: 100,
    schedule: [],
  },
  loading: false,
  error: null,
  isPopup: null, // Variabel global tambahan
  srcPath: null,
};

// Create context
const ContextState = createContext();

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SLIDESHOW":
      return { ...state, loading: false, dataSlide: action.payload };
    case "FETCH_MESSAGE":
      return { ...state, loading: false, dataScroll: action.payload };
    case "FETCH_MAIN":
      return { ...state, loading: false, dataMain: action.payload };
    case "FETCH_TAKWIM":
      return { ...state, loading: false, dataTakwim: action.payload };
    case "FETCH_FAILURE":
      return { ...state, loading: false, error: action.payload };
    case "SET_SCREEN_POPUP":
      return { ...state, isPopup: action.payload };
    case "SET_PATH_VIDEO":
      return { ...state, srcPath: action.payload };
    default:
      return state;
  }
};

// Context provider
const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(true);

  // Set global variable
  const setPopup = useCallback((value) => {
    dispatch({ type: "SET_SCREEN_POPUP", payload: value });
  }, []);

  const setPath = useCallback((value) => {
    dispatch({ type: "SET_PATH_VIDEO", payload: value });
  }, []);

  // Automatically fetch JSON on provider initialization
  useEffect(() => {
    const yr = new Date().getFullYear();
    dispatch({
      type: "FETCH_MESSAGE",
      payload: "Selamat datang ke TH Plantations Berhad " + yr,
    });
    const fetchData = async () => {
      try {
        setLoading(true);

        // Dapatkan data dari Electron API, pastikan tidak null/undefined
        const data = (await window.electronAPI.getInitialData()) ?? {
          generalData: {},
          localData: {},
        };

        const {
          generalData: {
            slideshow: gslide = [],
            schedule: gsche = [],
            message: gmsg = "",
            milldata = "",
            azanfile = "",
            use24Hour = false,
            ...gData
          } = {},

          localData: {
            slideshow: lslide = [],
            schedule: lsche = [],
            message: lmsg = "",
            topic = "",
            zone = "",
            ...lData
          } = {},
        } = data;

        // Pastikan data tidak menyebabkan error jika ada nilai undefined
        const main = { ...gData, ...lData, milldata: `${milldata}${topic}` };
        const message = `${gmsg} ${lmsg}`;
        const takwim = {
          zone,
          azanfile,
          use24Hour,
          schedule: [
            ...(Array.isArray(gsche) ? gsche : []),
            ...(Array.isArray(lsche) ? lsche : []),
          ],
        };
        const slider = [
          ...(Array.isArray(gslide) ? gslide : []),
          ...(Array.isArray(lslide) ? lslide : []),
        ];

        // Hantar data ke reducer
        dispatch({ type: "FETCH_MAIN", payload: main });
        dispatch({ type: "FETCH_MESSAGE", payload: message });
        dispatch({ type: "FETCH_TAKWIM", payload: takwim });
        dispatch({ type: "FETCH_SLIDESHOW", payload: slider });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (window.electronAPI) {
      fetchData();
      window.electronAPI.onDataUpdated(() => fetchData());
    } else {
      setLoading(false);
      // Pastikan data tidak menyebabkan error jika ada nilai undefined
      const message = "SELAMAT DATANG KE TH PLANTATIONS BERHAD";
      const main = {
        place: "THP HQ KL",
        milldata: "https://www.thplantations.my/",
        topic: "",
        speedmsg: 300,
      };

      const takwim = {
        zone: "WLY01",
        azanfile: "./video/azan.mp4",
        use24Hour: true,
        schedule: [
          {
            time: "08:00",
            file: "./video/doa_sebelum_kerja.mp4",
          },
        ],
      };
      const slider = [
        {
          type: "image",
          time: 1,
          src: "./images/bg0.png",
          title: "Welcome Indoor Digital Media",
        },
      ];

      // Hantar data ke reducer
      dispatch({ type: "FETCH_MAIN", payload: main });
      dispatch({ type: "FETCH_MESSAGE", payload: message });
      dispatch({ type: "FETCH_TAKWIM", payload: takwim });
      dispatch({ type: "FETCH_SLIDESHOW", payload: slider });
    }
  }, []);

  return (
    <ContextState.Provider value={{ ...state, setPopup, setPath, loading }}>
      {children}
    </ContextState.Provider>
  );
};

// Custom hook to use the context
const useContextState = () => {
  const context = useContext(ContextState);
  if (context === undefined) {
    throw new Error("useContextState must be used within a ContextProvider");
  }
  return context;
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { useContextState, ContextProvider };

export default ContextState;
