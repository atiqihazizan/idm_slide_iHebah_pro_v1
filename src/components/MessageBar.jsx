import PropTypes from 'prop-types';
import Marquee from 'react-fast-marquee';
import { useContextState } from '../contextState';

const MessageBar = () => {
  const { dataScroll, loading, error } = useContextState();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div className="bg-thp py-1 text-black">
    <Marquee className='text-4xl h-12' speed={200} gradient={false}>
      <span className="w-auto mr-4 block whitespace-nowrap font-semibold">
        {dataScroll}
      </span>
    </Marquee>
  </div>
}

MessageBar.propTypes = {
  classScroll: PropTypes.string
};

export default MessageBar