import Navbar from "./components/Navbar/Navbar";
import LoginModal from "./components/modals/LoginModal";
import Modal from "./components/modals/Modal";
import RegisterModal from "./components/modals/RegisterModal";
import "./globals.css";
import { Nunito } from "next/font/google";
import ToasterProvider from "./providers/ToasterProvider";
import getCurrentUser from "./actions/getCurrentUser";
import RentModal from "./components/modals/RentModal";
import SearchModal from "./components/modals/SearchModal";

export const metadata = {
  title: "Landnb",
  description: "Airbnb Clone",
  icons: {
    icon: "/icon.png",
  },
};
const font = Nunito({
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <LoginModal />
        <RegisterModal />
        <SearchModal />
        <RentModal />
        <Navbar currentUser={currentUser} />
        <div className="pb-20 pt-28">{children}</div>
      </body>
    </html>
  );
}