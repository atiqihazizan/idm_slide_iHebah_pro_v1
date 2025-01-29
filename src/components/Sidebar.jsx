import Takwim from './sidebar/Takwim';
import Branding from './sidebar/Branding';
import Showdata from './sidebar/Showdata';
import { useContextState } from '../contextState';

const Sidebar = () => {
  const { loading } = useContextState()
  return !loading && (<div className={`bg-sidebar min-w-[380px] max-w-[370px] text-white flex flex-col`}>
    <Branding />
    <Takwim />
    <Showdata />
  </div>)
}

export default Sidebar;