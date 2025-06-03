import { about } from '@/constants/site.data';
import Image from 'next/image';
import ComponentHeader from '../ui/component-header';
import CoreValuesCard from '../core-values-card';

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
      <div className="flex flex-col gap-2">
        <h3 className="text-neutral-head h5 md:h4 text-center md:text-left uppercase">
          {about.details.story.title}
        </h3>
        {about.details.story.desc.map((item, index) => (
          <p
            className="text-[#6B7280] body4 font-normal"
            key={` ${index}dcdcd `}
          >
            {' '}
            {item}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-6 section">
        <ComponentHeader title={about.details.coreValues.title} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {about.details.coreValues.list.map((item, index) => (
            <CoreValuesCard key={`${index} cejncenkc@`} details={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
