import { Suspense } from 'react';
import NavigationBar from '@/components/organisms/NavigationBar';
import Footer from '../Footer';
import LoginMessageDialog from './LoginMessageDialog';

const AppWrapper = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            <NavigationBar />
            <main className="flex min-h-screen flex-col items-center justify-between pt-16 sm:pt-20 md:pt-24">
                {children}
            </main>
            <Footer />
            <Suspense>
                <LoginMessageDialog />
            </Suspense>
         </div>
    );
};

export default AppWrapper;
