import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { navLinks } from '../../data/content';

export function Navbar() {
  return (
    <nav className='fixed left-0 right-0 top-0 z-[100] border-b border-[rgba(227,234,237,0.85)] bg-[rgba(255,255,255,0.88)] backdrop-blur-[16px]'>
      <div className='container-x flex h-[66px] items-center justify-between gap-[22px] landing-sm:h-[74px]'>
        <Logo />
        <div className='hidden items-center gap-[26px] text-[13px] font-[750] text-[#4c6574] landing-md:flex'>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='transition duration-200 hover:text-mint-dark'
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button href='#descubre' className='!px-[15px] !py-[10px] !text-xs'>
          Conoce la app
        </Button>
      </div>
    </nav>
  );
}