import Image from "next/image";
import Siderbar from "../../components/Siderbar";
import MobileNav from "../../components/MobileNav";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstName: 'Shreyas', lastName: 'Patil' }

  return (
    <main className="flex h-screen w-full font-inter">
        <Siderbar user={loggedIn} />

        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image src='/icons/logo.svg' width={30} height={30} alt="logo" />
            <div>
              <MobileNav user={ loggedIn } />
            </div>
          </div>
          {children}
        </div>
    </main>
  );
}
