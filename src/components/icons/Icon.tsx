import React from 'react';
import { icons } from '@/components';

export interface IconComponentProps {
  name: string
  className?: string
  onClick?: React.MouseEventHandler<SVGElement>
}

function IconComponent(props: IconComponentProps) {
  const Icon = icons[props.name];

  return Icon ? <Icon onClick={props?.onClick} className={`richtext-w-4 richtext-h-4 ${props?.className || ''}`} /> : null;
}

export { IconComponent };
