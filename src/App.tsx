import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, PartyPopper, CheckCircle2, ChevronRight, Menu, X, Mail, Music, Volume2, VolumeX, Instagram, Globe } from 'lucide-react';
import Particles from './components/Particles';
import CursorGlow from './components/CursorGlow';

export default function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formData, setFormData] = useState({ name: '', attendance: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isOpened) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  }, [isOpened]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(error => {
        // Only log serious errors, ignore common interruptions if necessary
        if (error.name !== 'AbortError') {
          console.error("Audio play failed:", error);
        }
      });
    } else {
      // Small delay to ensure any pending play() has started or been handled
      // to avoid "interrupted by pause" errors in some browsers
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    setIsPlaying(true);
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.attendance) return;

    setIsSubmitting(true);
    try {
      // Mengirim data ke Web3Forms dalam format JSON
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: "2fc973aa-6d84-4ec1-b925-232a076cea53", // Access key Anda
          subject: `RSVP Khitanan: ${formData.name}`, // Judul email yang akan masuk
          from_name: "Sistem RSVP Bima", 
          Nama_Tamu: formData.name,
          Status_Kehadiran: formData.attendance === 'hadir' ? 'Hadir' : 'Tidak Hadir'
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({ name: '', attendance: '' });
      } else {
        console.error('Gagal mengirim:', result);
      }
    } catch (error) {
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navLinks = [
    { name: 'Event', href: '#event' },
    { name: 'Location', href: '#location' },
    { name: 'RSVP', href: '#rsvp' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Particles />
      <CursorGlow />
      {/* Cover Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-surface"
          >
            <div className="absolute inset-0 batik-pattern opacity-10"></div>
            <div className="relative z-10 flex flex-col items-center text-center px-6">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="mb-8 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-[6px] border-surface-container shadow-2xl"
              >
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4YlMThzhR4ggMLKjzQTHcjZVGormiJ8LDNlLtqBFpJ1CpeVcp-Yif1hfcqhtmqdptyavkQvziVyR1DtuzXw8Lr3_jjFcjfgDUpTZXv48DwpL6jpD0mMl1Lo8EWqPTAsPoOfOYA12aX1l74bwC2iBvaE0914QnEwwiBw4Wp6DoSwRQ1g1SYZvkzE8snJsmp99nK48Hjh2ke1X2leWa92trw26hJzbfCyDmGZoQ3Sx16KBflkyYMw1o1Ldbya9tPH7NZVgjD09mIdNd" 
                  alt="Davian Rafa Romadhon" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h2 className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.3em] mb-4">Tasyakuran Khitanan</h2>
              <h1 className="text-4xl md:text-5xl font-bold text-primary-container mb-8">Davian Rafa Romadhon</h1>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenInvitation}
                className="bg-primary-container text-black px-10 py-4 rounded-full font-black text-[13px] tracking-[0.3em] shadow-xl flex items-center gap-3"
              >
                <Mail size={18} />
                BUKA UNDANGAN
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Music (Local) */}
      <audio 
        ref={audioRef}
        loop
        preload="auto"
        crossOrigin="anonymous"
      >
        <source src="./music/nasheed.mp3" type="audio/mpeg" />
        <source src="music/nasheed.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Control Button */}
      {isOpened && (
        <motion.button 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={toggleMusic}
          className={`fixed bottom-8 right-8 z-[60] w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-colors ${isPlaying ? 'bg-surface-container text-primary-container border border-primary-container/30' : 'bg-primary-container text-black'}`}
        >
          {isPlaying ? <Volume2 size={24} className="animate-pulse" /> : <VolumeX size={24} />}
        </motion.button>
      )}

      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-surface/90 backdrop-blur-md shadow-sm border-b border-outline-variant/30 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tighter text-primary-container uppercase">
            Khitanan
          </div>
          
          <nav className="hidden md:flex gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-sm font-semibold tracking-wide text-on-surface-variant hover:text-primary transition-colors uppercase"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="#rsvp" 
              className="hidden md:block bg-primary-container text-black text-[12px] font-bold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity tracking-widest"
            >
              RSVP
            </a>
            <button 
              className="md:hidden text-primary-container"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-surface pt-24 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.href} 
                  className="text-2xl font-bold text-primary-container uppercase"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#rsvp" 
                className="mt-4 bg-primary-container text-black text-sm font-bold px-10 py-4 rounded-full tracking-widest"
                onClick={() => setMobileMenuOpen(false)}
              >
                RSVP NOW
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent">
          <div className="absolute inset-0 batik-pattern opacity-10 pointer-events-none"></div>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center"
          >
            <div className="mb-10 w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-[6px] border-surface-container shadow-xl ring-1 ring-black/5">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4YlMThzhR4ggMLKjzQTHcjZVGormiJ8LDNlLtqBFpJ1CpeVcp-Yif1hfcqhtmqdptyavkQvziVyR1DtuzXw8Lr3_jjFcjfgDUpTZXv48DwpL6jpD0mMl1Lo8EWqPTAsPoOfOYA12aX1l74bwC2iBvaE0914QnEwwiBw4Wp6DoSwRQ1g1SYZvkzE8snJsmp99nK48Hjh2ke1X2leWa92trw26hJzbfCyDmGZoQ3Sx16KBflkyYMw1o1Ldbya9tPH7NZVgjD09mIdNd" 
                alt="Davian Rafa Romadhon" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-[12px] font-bold text-on-surface-variant uppercase tracking-[0.3em] mb-6"
            >
              Tasyakuran Khitanan
            </motion.p>
            <h1 className="text-5xl md:text-7xl font-bold text-primary-container mb-8 tracking-tight">
              Davian Rafa Romadhon
            </h1>
            <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-medium leading-relaxed opacity-80 px-4">
              Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan acara tasyakuran khitanan putra kami.
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-16 animate-bounce"
            >
              <div className="w-[1px] h-12 bg-primary-container/20 mx-auto"></div>
            </motion.div>
          </motion.div>
        </section>

        {/* Event Details */}
        <section id="event" className="py-32 bg-transparent relative overflow-hidden z-10">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent"></div>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-container mb-6">Rincian Acara</h2>
              <div className="w-16 h-[2px] bg-outline-variant/50 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              {/* Card 1: Akad */}
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-surface-container p-10 rounded-2xl border border-outline-variant/30 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.3)] flex flex-col items-center text-center relative"
              >
                <div className="absolute top-0 inset-x-0 h-1 batik-pattern rounded-t-2xl opacity-10"></div>
                <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-8">
                  <Calendar className="text-primary-container" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-primary-container mb-4">Akad Khitan</h3>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-on-surface">Rabu, 12 Mei 2026</p>
                  <p className="text-on-surface-variant">08.00 WIB - Selesai</p>
                </div>
              </motion.div>

              {/* Card 2: Resepsi */}
              <motion.div 
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-surface-container p-10 rounded-2xl border border-outline-variant/30 shadow-[0_4px_30px_-10px_rgba(0,0,0,0.3)] flex flex-col items-center text-center relative"
              >
                <div className="absolute top-0 inset-x-0 h-1 batik-pattern rounded-t-2xl opacity-10"></div>
                <div className="w-16 h-16 bg-primary-container/10 rounded-full flex items-center justify-center mb-8">
                  <PartyPopper className="text-primary-container" size={28} />
                </div>
                <h3 className="text-2xl font-bold text-primary-container mb-4">Resepsi</h3>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-on-surface">Rabu, 12 Mei 2026 </p>
                  <p className="text-on-surface-variant">11.00 - 14.00 WIB</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section id="location" className="py-32 bg-transparent relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-container mb-6">Lokasi Acara</h2>
              <div className="w-16 h-[2px] bg-outline-variant/50 mx-auto rounded-full mb-10"></div>
              <p className="text-lg md:text-xl text-on-surface-variant max-w-xl mx-auto leading-relaxed">
                <span className="font-bold text-primary-container">Lokasi Acara</span><br />
                Situwangi, Kec. Rakit, Kabupaten Banjarnegara, Jawa Tengah
              </p>
            </div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-outline-variant/20">
              <div className="h-[450px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!4v1776826508614!6m8!1m7!1sEbflqiaSTo6IGBteMBx0oA!2m2!1d-7.429233568611077!2d109.515014798724!3f277.88858927641854!4f-11.085260725846652!5f0.7820865974627469" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Street View"
                ></iframe>
              </div>
              <div className="absolute top-6 left-6 pointer-events-none">
                <div className="bg-surface/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-primary-container/20 flex items-center gap-2">
                  <MapPin size={14} className="text-primary-container" />
                  <span className="text-[10px] font-bold text-primary-container tracking-wider uppercase">Lokasi Acara</span>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-6 flex justify-center">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="https://www.google.com/maps/dir/?api=1&destination=-7.429233568611077,109.515014798724"
                  target="_blank"
                  className="bg-primary-container text-black px-8 py-4 rounded-full shadow-2xl flex items-center gap-3 font-black tracking-[0.2em] text-[12px] hover:opacity-80 transition-all pointer-events-auto"
                >
                  <MapPin size={18} />
                  PETUNJUK ARAH KE LOKASI
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        {/* RSVP Form */}
        <section id="rsvp" className="py-32 bg-transparent relative z-10">
          <div className="absolute inset-0 batik-pattern opacity-5"></div>
          <div className="relative z-10 max-w-2xl mx-auto px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-surface-container p-10 md:p-16 rounded-[2rem] border border-outline-variant/30 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-primary-container mb-4">RSVP</h2>
                <p className="text-on-surface-variant font-medium">Mohon konfirmasi kehadiran Anda sebelum tanggal 12 Mei 2026</p>
              </div>

              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-green-500" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-primary-container mb-2">Terima Kasih!</h3>
                  <p className="text-on-surface-variant font-medium mb-8">Konfirmasi kehadiran Anda telah kami terima.</p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-primary-container font-bold text-sm underline underline-offset-4"
                  >
                    Kirim konfirmasi lain
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="group">
                    <label className="block text-[11px] font-black text-on-surface-variant mb-4 tracking-[0.2em] uppercase transition-colors group-focus-within:text-primary-container">
                      Nama Lengkap
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Masukkan nama Anda"
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary-container focus:outline-none py-3 text-lg font-medium transition-all"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[11px] font-black text-on-surface-variant mb-4 tracking-[0.2em] uppercase transition-colors group-focus-within:text-primary-container">
                      Kehadiran
                    </label>
                    <select 
                      required
                      value={formData.attendance}
                      onChange={(e) => setFormData({...formData, attendance: e.target.value})}
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary-container focus:outline-none py-3 text-lg font-bold transition-all animate-fade-blue-white"
                    >
                      <option value="">Pilih status kehadiran</option>
                      <option value="hadir">Sapaan Hangat, Saya Hadir</option>
                      <option value="tidak">Maaf, Tidak Bisa Hadir</option>
                    </select>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full bg-primary-container text-black py-5 rounded-full font-black text-[13px] tracking-[0.3em] shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? (
                        "MENGIRIM..."
                      ) : (
                        <>
                          KIRIM KONFIRMASI
                          <ChevronRight size={18} />
                        </>
                      )}
                    </button>
                    
                    <div className="mt-8 text-center">
                      <p className="text-xs text-on-surface-variant mb-3 font-semibold tracking-wider uppercase opacity-60">Atau kirim rsvp via</p>
                      <a 
                        href={`mailto:jatraxstore@gmail.com?subject=RSVP Davian Rafa Romadhon&body=Halo, saya ingin mengonfirmasi kehadiran saya untuk acara Davian Rafa Romadhon.%0D%0A%0D%0ANama: ${formData.name || '...'}%0D%0AKehadiran: ${formData.attendance || '...'}`}
                        className="inline-flex items-center gap-2 text-primary-container font-bold text-sm border-b-2 border-primary-container/20 hover:border-primary-container transition-all pb-1"
                      >
                        <Mail size={16} />
                        Kirim Email Langsung
                      </a>
                    </div>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-transparent border-t border-outline-variant/20 py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="text-lg font-bold text-primary-container mb-8 uppercase tracking-widest">
            Khitanan
          </div>
          
          <p className="text-[10px] font-medium text-on-surface-variant/60 tracking-[0.15em] leading-loose max-w-sm mx-auto uppercase mb-10">
            © 2026 KHITANAN.<br />
              by Idexly Community.
          </p>

          <div className="flex flex-col items-center gap-3 mb-12">
            <p className="text-[10px] font-bold text-primary-container/40 tracking-[0.2em] uppercase">Created By</p>
            <motion.a 
              whileHover={{ scale: 1.1, color: '#E1306C' }}
              href="https://instagram.com/Khusfi_Umam" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary-container transition-colors"
            >
              <Instagram size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">Khusfi_Umam</span>
            </motion.a>
          </div>

          <motion.a 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 25px rgba(0,229,255,0.4)' }}
            whileTap={{ scale: 0.95 }}
            href="https://idexlycommunity.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-transparent border-2 border-primary-container text-primary-container font-black text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full transition-all"
          >
            <Globe size={16} />
            Idexly Community
          </motion.a>
        </div>
      </footer>
    </div>
  );
}
