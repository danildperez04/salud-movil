import { Link } from 'react-router';
import { Logo } from '../ui/Logo';
import {
  footerProductLinks,
  footerExploreLinks,
  socialLinks,
} from '../../data/content';

export function Footer() {
  return (
    <footer className='border-t border-line bg-[#f7fafb] py-12'>
      <div className='container-x'>
        <div className='grid grid-cols-1 gap-[50px] landing-sm:grid-cols-[1.4fr_1fr_1fr_1.2fr]'>
          <div>
            <Logo />
            <p className='mt-4 max-w-[380px] text-xs leading-[1.7] text-muted'>
              Una experiencia móvil para organizar y consultar información de
              salud de manera más simple.
            </p>
            <a
              href='#sobre-nosotros'
              className='mt-2 inline-flex items-center justify-center rounded-xl bg-mint px-[14px] py-[11px] text-[11px] font-[850] text-white transition duration-200 hover:bg-mint-dark'
            >
              Sobre nosotros →
            </a>
          </div>

          <div>
            <h4 className='text-xs font-bold text-navy'>Producto</h4>
            {footerProductLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className='my-[9px] block text-[11px] text-muted transition duration-200 hover:text-mint-dark'
              >
                {link.label}
              </a>
            ))}
          </div>

          <div>
            <h4 className='text-xs font-bold text-navy'>Explorar</h4>
            {footerExploreLinks.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className='my-[9px] block text-[11px] text-muted transition duration-200 hover:text-mint-dark'
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className='my-[9px] block text-[11px] text-muted transition duration-200 hover:text-mint-dark'
                >
                  {link.label}
                </a>
              ),
            )}
          </div>

          <div>
            <h4 className='text-xs font-bold text-navy'>Contacto</h4>
            <p className='text-xs leading-[1.7] text-muted'>
              Seguinos y comunicate con el equipo de Salud Móvil.
            </p>
            <div className='mt-[14px] flex flex-wrap gap-2'>
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className='inline-flex items-center justify-center gap-[7px] rounded-xl border border-line bg-white px-[11px] py-[9px] text-[10px] font-bold text-navy transition duration-200 hover:border-mint-line hover:bg-mint-soft-2'
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className='mt-[10px] text-[10px] leading-[1.6] text-muted'>
              Instagram: <strong>agregar usuario</strong>
              <br />
              Facebook: <strong>agregar página</strong>
              <br />
              WhatsApp: <strong>+505 XXXX-XXXX</strong>
            </div>
          </div>
        </div>

        <div className='mt-[30px] flex flex-wrap justify-between gap-[18px] border-t border-line pt-5 text-[10px] text-muted'>
          <span>© 2026 Salud Móvil. Prototipo de demostración.</span>
          <span>Tu salud, en tus manos.</span>
        </div>
      </div>
    </footer>
  );
}