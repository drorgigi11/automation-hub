import Image from 'next/image'

export default function Header() {
  return (
    <header className="w-full py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <Image
          src="/renovision-logo.png"
          alt="Renovision Design and Build"
          width={200}
          height={80}
          className="h-16 md:h-20 w-auto"
          priority
        />
      </div>
    </header>
  )
}
