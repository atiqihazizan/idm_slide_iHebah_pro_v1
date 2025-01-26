import { useContextState } from "../../contextState"

const Showdata = () => {
  const { dataMain: { place, milldata }, loading, error } = useContextState()

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (<>
    <div className="flex justify-center items-center min-h-[55px] bg-thp">
      <p className=" uppercase text-center font-bold text-2xl text-black">
        {place}
      </p>
    </div>

    {milldata && (<iframe src={milldata} className="w-full h-full border-0"></iframe>)}
  </>)
}

export default Showdata