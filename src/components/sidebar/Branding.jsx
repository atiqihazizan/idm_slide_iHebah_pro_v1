
const Branding = () => {
  return (
    <div className="flex flex-row justify-between items-center pt-2 px-2 text-[17px] leading-7 min-h-[77px]">
      <img src="./thlogo.png" className="w-[100px] animate-globe" />
      <div className="flex flex-col items-center">
        <span className="uppercase font-extrabold text-thp">
          TH PLANTATIONS BERHAD
        </span>
        <span className=" font-extrabold">
          Indoor <i className="text-thp">Digital</i> Media
        </span>
      </div>
    </div>
  )
}

export default Branding