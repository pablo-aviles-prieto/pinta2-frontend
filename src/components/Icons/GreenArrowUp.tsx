import { SVGProps } from 'react';

export const GreenArrowUp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='none'
    stroke='#00bd03'
    strokeWidth={1.08}
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      fill='#00db04'
      d='M5.089 11.294c.18.428.606.706 1.078.706H9v7a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-7h2.833c.472 0 .898-.278 1.078-.706.18-.427.08-.918-.253-1.245l-5.833-5.714a1.184 1.184 0 0 0-1.65 0l-5.833 5.714a1.126 1.126 0 0 0-.253 1.245Z'
    />
  </svg>
);
