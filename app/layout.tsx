import type {Metadata, Viewport} from 'next';
import { Inter, Noto_Sans_TC } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const notoSans = Noto_Sans_TC({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-noto' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'UniPoints - 點數整合平台',
  description: '全方位點數整合平台，支援點數到期提醒、活動拖曳管理及 LINE Bot 通知整合。',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${notoSans.variable}`}>
      <body className="font-sans antialiased text-gray-900 bg-gray-50 flex justify-center h-[100dvh]" suppressHydrationWarning>
        <div className="w-full h-full relative flex">
          {children}
        </div>
      </body>
    </html>
  );
}
