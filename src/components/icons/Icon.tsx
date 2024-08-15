import React from 'react'
import icons from '@/components/icons/icons'

interface IPropsIcon {
  name: string
  className?: string
  onClick?: (e?: any) => void
}

function Icon(props: IPropsIcon) {
  const Icon = icons[props.name]

  return (
    <>{Icon && <Icon onClick={props?.onClick} className={`w-4 h-4 ${props?.className || ''}`} />}</>
  )
}

export default Icon
