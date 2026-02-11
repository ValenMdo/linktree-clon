// Solo permitir http/https para evitar javascript: o data: (seguridad)
function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false
  const u = url.trim().toLowerCase()
  return u.startsWith('https://') || u.startsWith('http://')
}

export default function LinkButton({ text, url }) {
  const safeUrl = isSafeUrl(url) ? url.trim() : '#'
  const isPlaceholder = safeUrl === '#'

  return (
    <a
      href={safeUrl}
      target={isPlaceholder ? undefined : '_blank'}
      rel={isPlaceholder ? undefined : 'noopener noreferrer'}
      className="w-full max-w-md px-6 py-3 sm:px-8 sm:py-4 bg-[#E8E4D0] text-black rounded-full text-center hover:bg-[#DDD9C5] transition-colors duration-200 text-sm sm:text-base"
      {...(isPlaceholder && { 'aria-disabled': true, role: 'button' })}
    >
      {text}
    </a>
  )
}
  