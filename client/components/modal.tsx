'use client';

import {
  Content,
  DialogOverlay,
  Portal,
  Root,
  Trigger,
} from '@radix-ui/react-dialog';
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';

import { cn } from '@/lib/utils';

interface IModalProps {
  trigger: ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  hideCloseButton?: boolean;
  onClose?: () => void;
  disableEscapeDown?: boolean;
  disableOutsideClick?: boolean;
  alignTop?: boolean;
  customClassName?: string;
  rounded?: string;
}

export type ModalRefActions = {
  open: () => void;
  close: () => void;
};

const Modal = forwardRef<unknown, IModalProps>(
  (
    {
      trigger,
      children,
      onClose,
      disableEscapeDown,
      disableOutsideClick,
      alignTop,
      customClassName,
      rounded,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);

    const closeModal = () => {
      onClose?.();

      setIsOpen(false);
    };

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
      },
      close: closeModal,
    }));
    return (
      <Root open={isOpen} onOpenChange={setIsOpen}>
        <Trigger asChild>{trigger}</Trigger>
        <Portal>
          <DialogOverlay
            className={cn(
              `bg-black-t-24 data-[state=open]:animate-overlayShow backdrop-blur fixed  inset-0 ${
                !alignTop && 'grid place-items-center'
              } z-30`,
              customClassName
            )}
          >
            <Content
              ref={ref as ForwardedRef<HTMLDivElement>}
              onPointerDownOutside={(e) =>
                disableOutsideClick && e.preventDefault()
              }
              onEscapeKeyDown={(e) => disableEscapeDown && e.preventDefault()}
              className={`data-[state=open]:animate-contentShow h-screen w-full flex justify-end overflow-hidden  mx-auto focus:outline-none ${
                rounded && rounded
              } `}
            >
              {typeof children === 'function' ? children(closeModal) : children}
            </Content>
          </DialogOverlay>
        </Portal>
      </Root>
    );
  }
);

Modal.displayName = 'Modal';
export default Modal;
