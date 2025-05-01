import { home } from '@/constants/site.data';
import DescCard from '../desc-card';
import TitleHeader from '../ui/title-header';

export default function WhyUs() {
  return (
    <div className="bg-[#F9F8F5]">
      <div className="container section flex flex-col w-full gap-8">
        <TitleHeader title={home.whyUs.title} desc={home.whyUs.desc} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {home.whyUs.list.map((item, index) => (
            <DescCard details={item} key={`%43${index}12@`} />
          ))}
        </div>
      </div>
    </div>
  );
}
