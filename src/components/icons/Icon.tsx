import { icons } from '@/components'

export interface IconComponentProps {
  name: string
  className?: string
  onClick?: (e?: any) => void
}

function IconComponent(props: IconComponentProps) {
  const Icon = icons[props.name]

  return Icon ? <Icon onClick={props?.onClick} className={`w-4 h-4 ${props?.className || ''}`} /> : null
}

export { IconComponent }
