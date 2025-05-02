import { about } from '@/constants/site.data';
import Image from 'next/image';
import ComponentHeader from '../ui/component-header';
import DescCard from '../desc-card';

export default function Story() {
  return (
    <div className="container section flex flex-col gap-12">
      <Image
        src={about.bigLogo}
        className="w-full h-full"
        alt="todo tip big logo"
        width={100}
        height={100}
      />
      <div className="flex flex-col gap-4 lg:flex-row pb-10 border-b border-[#E4E4E4]">
        <div className="flex-1">
          <ComponentHeader {...about.details.mission} />
        </div>
        <div className="flex-1">
          <ComponentHeader {...about.details.vision} />
        </div>
      </div>
      <ComponentHeader {...about.details.story} />
      <div className="flex flex-col gap-6">
        <ComponentHeader title={about.details.coreValues.title} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {about.details.coreValues.list.map((item, index) => (
            <DescCard key={`${index} cejncenkc@`} details={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
