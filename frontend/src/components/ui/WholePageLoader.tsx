import { SyncLoader } from 'react-spinners';

export default function WholePageLoader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <SyncLoader color="#36d7b7" size={24} />
        </div>
    );
}

