export function Logo() {
  return (
    <a
      className='flex items-center gap-[9px] text-[23px] font-black tracking-[-0.6px] text-navy'
      href='#inicio'
      aria-label='Salud Móvil'
    >
      <svg viewBox='0 0 92 42' aria-hidden='true' className='h-[28px] w-[45px] stroke-mint fill-mint'>
        <path
          d='M2 22h18l6-10 7 22L43 4l9 19h15'
          fill='none'
          strokeWidth='3.5'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
        <circle cx='74' cy='22' r='2.1' />
        <circle cx='82' cy='22' r='2.1' />
        <circle cx='90' cy='22' r='2.1' />
      </svg>
      Salud <span className='text-mint'>Móvil</span>
    </a>
  );
}