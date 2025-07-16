import DeviceProfilePanel from "@/app/ui/ApiTestPanel/DeviceProfilePanel";
import HealthCheckPanel from "@/app/ui/ApiTestPanel/HealthCheckPanel";
import PredictPanel from "@/app/ui/ApiTestPanel/PredictPanel";
import EndSessionPanel from "@/app/ui/ApiTestPanel/EndSessionPanel";


export default function Page() {
    return (
        <main className="p-6 space-y-8 bg-gray-50 min-h-screen">
            <h1 className="mb-8 text-3xl font-extrabold text-gray-800">
                TEST BEHAVIOR‑AUTH API
            </h1>      
            <HealthCheckPanel />
            <DeviceProfilePanel/>
            <EndSessionPanel />
            <PredictPanel />
        </main>
    )
}