import moment from 'moment';

const PrivacyContent = () => {
  return (
    <div className="bg-white pb-20">
      <div className="container flex flex-col gap-8 text-[#4A4E5B]">
        <h4 className="text-[42px] md:text-[32px] text-[#191919]">
          Effective Date: {moment(new Date()).format('DD MMMM, YYYY')},
        </h4>
      </div>
    </div>
  );
};

export default PrivacyContent;
