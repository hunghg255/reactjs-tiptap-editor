import icons from '@/components/icons/icons';
import React from 'react';

interface IPropsIcon {
  name: string;
  className?: string;
  onClick?: (e?: any) => void;
}

const Icon = (props: IPropsIcon) => {
  const Icon = icons[props.name];

  return (
    <>{Icon && <Icon onClick={props?.onClick} className={`w-4 h-4 ${props?.className || ''}`} />}</>
  );
};

export default Icon;
