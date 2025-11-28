import { Outlet } from "react-router-dom";
import Sidebar from "../../component/common/Sidebar";

export default function Admin() {
    return (
        <div className="flex h-screen">
            {/* Sidebar cố định chiều cao, không bị co */}
            <div className="flex-none h-screen">
                <Sidebar />
            </div>

            {/* Main scroll được nếu nội dung dài */}
            <main className="flex-1 h-screen overflow-y-auto p-2">
                <Outlet />
            </main>
        </div>
    );
}
