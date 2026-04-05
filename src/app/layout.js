import "./globals.css";
import { Inter, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${poppins.className} min-h-screen bg-gradient-to-br from-blue-500 via-white to-gray-100`}
      >
        {/* 🌈 Radial Glow + Grid + Glass Layer */}
        <div
          className="
            min-h-screen
            bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,1),_transparent_40%)]
            bg-[linear-gradient(to_right,_#e5e7eb_1px,_transparent_1px),linear-gradient(to_bottom,_#dbeafe_1px,_transparent_1px)]
            bg-[size:40px_40px]
          "
        >
          {/* 🧊 Glass Effect */}
          <div className="min-h-screen bg-white/40 backdrop-blur-sm">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}