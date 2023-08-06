import { SVGProps } from 'react';

export const Canvas = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='-9 0 64 64' {...props}>
    <g fill='none' fillRule='evenodd' stroke='#6B6C6E' strokeWidth={2}>
      <path d='M13.5 46 8.8 63H3.9l4.7-17M31.5 46l4.7 17h4.9l-4.7-17M21 46h4v11h-4zM20 1h4v9h-4zM43 38c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2' />
      <path d='M41.2 42H5c-1.1 0-2-.9-2-2V12c0-1.1.9-2 2-2h36.2c1.1 0 1.8.9 1.8 2v28c0 1.1-.7 2-1.8 2Z' />
    </g>
  </svg>
);
