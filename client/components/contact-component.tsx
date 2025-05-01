import React from 'react';
import { Mail, MapPin, MessagesSquare } from 'lucide-react';
import { siteInfo } from '@/constants/site.data';

const ContactComponent = () => {
  const contact = [
    {
      title: 'Email Us',
      value: siteInfo.email,
      icon: <Mail className="h-8 w-8" />,
      placeholder:
        'Ask us a question by email and we will respond within a few days.',
      end: 'Leave a Message',
    },
    {
      title: 'Office Address',
      value: siteInfo.address,
      icon: <MapPin className="h-8 w-8" />,
      placeholder:
        'You can meet us at our office and discuss the details of your question.',
      end: 'Get Directions',
    },
    {
      title: 'Customer Support',
      value: siteInfo.phone,
      icon: <MessagesSquare className="h-8 w-8" />,
      placeholder: 'Call us if your question requires an immediate response.',
      end: 'Reach Out',
    },
  ];

  console.log(contact);

  return (
    <div className="container flex flex-col gap-20 items-center justify-center w-full">
      <p>contact us</p>
    </div>
  );
};

export default ContactComponent;
