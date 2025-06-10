import Image from 'next/image';
import ContactForm from './contact-form';

const ContactComponent = () => {
  return (
    <div className="container flex flex-col lg:flex-row gap-10 items-center lg:items-start justify-between w-full pt-40">
      <div className="flex-1 flex flex-col gap-8 body-4-regular text-[#6B7280] justify-between w-full">
        <Image
          alt="contact-image"
          width={100}
          height={100}
          className="w-full h-full"
          src="/assets/contact-form-image.svg"
        />
        <p>
          We specialize in eco-friendly WPC and SPC solutions, offering a
          diverse range of building materials and innovative products. Our core
          offerings include composite decking, fluted wall panels,
          high-definition wall panels, wood-grain panels, fences and doors .
          Each product is designed with sustainability in mind, blending natural
          aesthetics with durable, recyclable materials to elevate any space.
        </p>
        <p>
          Guided by our philosophy of “building green, shaping spaces that
          endure,” we lead in sustainable design, serving contractors,
          architects, homeowners, and businesses. Our collaborative approach
          ensures tailored solutions, fostering partnerships that transform
          spaces with style, quality, and environmental responsibility.
        </p>
      </div>
      <div className="flex-1 w-full">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactComponent;
