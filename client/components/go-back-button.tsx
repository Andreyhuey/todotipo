"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";

interface IGoBackBtnProps {
  children: ReactNode;
  className: string;
}

const GoBackBtn = ({ children, className }: IGoBackBtnProps) => {
  const router = useRouter();
  return (
    <button className={className} onClick={() => router.back()}>
      {children}
    </button>
  );
};

export default GoBackBtn;
