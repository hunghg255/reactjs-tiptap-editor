import { NodeViewWrapper } from '@tiptap/react';
import clsx from 'clsx';
import { AlertCircle, Info, Lightbulb, OctagonAlert, TriangleAlert } from 'lucide-react';

const CALLOUT_TYPES = [
  {
    value: 'note',
    label: 'Note',
    icon: Info,
    color: '#1f6feb',
    background: '#1f6feb1f',
  },
  {
    value: 'tip',
    label: 'Tip',
    icon: Lightbulb,
    color: '#238636',
    background: '#2386361f',
  },
  {
    value: 'important',
    label: 'Important',
    icon: AlertCircle,
    color: '#ab7df8',
    background: '#ab7df81f',
  },
  {
    value: 'warning',
    label: 'Warning',
    icon: TriangleAlert,
    color: '#d29922',
    background: '#d299221f',
  },
  {
    value: 'caution',
    label: 'Caution',
    icon: OctagonAlert,
    color: '#f85149',
    background: '#f851491f',
  },
] as const;

export function NodeViewCallout({ node }: any) {
  const { type = 'note', title = '', body = '' } = node.attrs;

  const currentType = CALLOUT_TYPES.find((t) => t.value === type) || CALLOUT_TYPES[0];
  const IconComponent = currentType.icon;

  return (
    <NodeViewWrapper>
      <div
        className={clsx(
          'richtext-relative richtext-my-4 richtext-rounded-lg richtext-border richtext-p-4',
          {
            'richtext-bg-[#1f6feb1f] richtext-border-[#1f6feb]': type === 'note',
            'richtext-bg-[#2386361f] richtext-border-[#238636]': type === 'tip',
            'richtext-bg-[#ab7df81f] richtext-border-[#ab7df8]': type === 'important',
            'richtext-bg-[#d299221f] richtext-border-[#d29922]': type === 'warning',
            'richtext-bg-[#f851491f] richtext-border-[#f85149]': type === 'caution',
          }
        )}
      >
        <div
          className={clsx('richtext-mb-2 richtext-flex richtext-items-center richtext-gap-2', {
            'richtext-text-[#1f6feb]': type === 'note',
            'richtext-text-[#238636]': type === 'tip',
            'richtext-text-[#ab7df8]': type === 'important',
            'richtext-text-[#d29922]': type === 'warning',
            'richtext-text-[#f85149]': type === 'caution',
          })}
        >
          <IconComponent className='richtext-size-5' />

          <span className='richtext-font-semibold'>{title}</span>
        </div>

        {body && <p className='richtext-pl-[28px]'>{body}</p>}
      </div>
    </NodeViewWrapper>
  );
}
