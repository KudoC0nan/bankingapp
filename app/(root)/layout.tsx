import Siderbar from "../../components/Siderbar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = { firstName: 'Shreyas', lastName: 'Patil' }

  return (
    <main className="flex h-screen w-full font-inter">
        <Siderbar user={loggedIn} />
        {children}
    </main>
  );
}
