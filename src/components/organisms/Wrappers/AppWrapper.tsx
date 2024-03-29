import React from 'react';
import NavigationBar from '@/components/organisms/NavigationBar';

const AppWrapper = ({ children }: React.PropsWithChildren) => {
    return (
        <div>
            <NavigationBar />
            <main className="flex min-h-screen flex-col items-center justify-between p-24">{children}</main>
            {/* TO-DO Footer */}
        </div>
    );
};

export default AppWrapper;
