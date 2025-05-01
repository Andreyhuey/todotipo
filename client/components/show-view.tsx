import { ReactNode } from 'react';

interface IShowViewProps {
  when: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

const ShowView = ({ when, children, fallback = null }: IShowViewProps) => {
  return when ? children : fallback;
};

export default ShowView;
