import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import PropTypes from 'prop-types';

// Initial state
const initialState = {
  dataSlide: null,
  dataScroll: null,
  // dataTakwim: null,
  dataTakwim: { zone: 'WLY01', use24Hour: false, azanfile: "./video/azan.mp4" },
  dataMain: { place: "", milldata: "", message: '', commonfile: '', localfile: '', azanfile: '', speedmsg: 100, vidsch: {} },
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

  // Fetch data from JSON
  const fetchDataFromJSON = useCallback(async (type, url) => {
    dispatch({ type: "FETCH_START" });
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (type === 'slide') dispatch({ type: "FETCH_SLIDESHOW", payload: data });
      if (type === 'main') {
        const { message, zone, azanfile, vidsch, use24Hour, ...main } = data
        dispatch({ type: "FETCH_MAIN", payload: main });
        dispatch({ type: "FETCH_MESSAGE", payload: message });
        dispatch({ type: "FETCH_TAKWIM", payload: { zone, azanfile, vidsch, use24Hour } });
      }
    } catch (error) {
      dispatch({ type: "FETCH_FAILURE", payload: error.message });
    }
  }, []);

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
    // fetchDataFromJSON('zone', "./json/zones.json");
    // fetchDataFromJSON('main', "./json/main.json");
    // fetchDataFromJSON('slide', "./json/slideshow.json");

    dispatch({ type: "FETCH_MESSAGE", payload: "Selamat datang ke TH Plantations Berhad " + yr });

  }, [fetchDataFromJSON]);

  return (
    <ContextState.Provider value={{ ...state, setPopup, setPath }}>
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
  children: PropTypes.node.isRequired
};

export { useContextState, ContextProvider }

export default ContextState;