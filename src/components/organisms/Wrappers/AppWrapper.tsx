import NavigationBar from '@/components/organisms/NavigationBar';
import { CommandSearchProvider } from '@/components/providers/command-search-provider';
import Footer from '../Footer';

const AppWrapper = ({ children }: React.PropsWithChildren) => {
    return (
        <CommandSearchProvider>
            <div>
                <NavigationBar />
                <main className="min-h-screen pt-14">{children}</main>
                <Footer />
            </div>
        </CommandSearchProvider>
    );
};

export default AppWrapper;
