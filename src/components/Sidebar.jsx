import Takwim from './sidebar/Takwim';
import Branding from './sidebar/Branding';
import Showdata from './sidebar/Showdata';

const Sidebar = () => {
  return <div className={`bg-sidebar min-w-[370px] max-w-[370px] text-white flex flex-col`}>
    <Branding />
    <Takwim />
    <Showdata />
  </div>
}

export default Sidebar;