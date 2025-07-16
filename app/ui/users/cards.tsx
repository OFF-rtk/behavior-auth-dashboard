import { lusitana } from "../fonts";
import { fetchDeviceProfileServer, fetchModelMeta } from "@/app/lib/data";
import { formatDistanceToNow } from "date-fns";
import { z } from 'zod'

//try to move schema into lib/schema later
const ModelDetailsSchema = z.object({
    model_exists: z.boolean(),
    last_trained: z.coerce.date(),
    model_type: z.string(),
    model_version: z.number()
})

type ModelDetails = z.infer<typeof ModelDetailsSchema>

const SnapshotDataSchema = z.object({
    snapshot_count: z.number(),
    num_sessions: z.number(),
    num_quarantined_sessions: z.number()
})

type SnapshotData = z.infer<typeof SnapshotDataSchema>


const osDataSchema = z.object({
    os: z.string(),
    os_version: z.string()
})

type osData = z.infer<typeof osDataSchema>

const deviceModelSchema = z.object({
    device_model: z.string()
})

type deviceModel = z.infer<typeof deviceModelSchema>

export default async function CardWrapper({user_id} : {user_id: string}) {
    const DeviceProfile = await fetchDeviceProfileServer(user_id)
    const ModelMeta = await fetchModelMeta(user_id)

    const ModelDetails: ModelDetails = {
        model_exists: ModelMeta.model_exists,
        last_trained: ModelMeta.last_trained,
        model_type: ModelMeta.model_type,
        model_version: ModelMeta.model_version
    }

    const SnapshotData: SnapshotData = {
        snapshot_count: ModelMeta.snapshot_count,
        num_sessions: ModelMeta.num_sessions,
        num_quarantined_sessions: ModelMeta.num_quarantined_sessions
    }

    if (!DeviceProfile) {
        return (
            <>
            <Card title="OS Data" value={{ os: "Unknown", os_version: "N/A" }} type="os_data" />
            <Card title="Device Model" value={{ device_model: "Unavailable" }} type="device_model" />
            <Card title="Model Details" value={ModelDetails} type="model_details" />
            <Card title="Snapshot Details" value={SnapshotData} type="snapshot_data" />
            </>
        );
    }

    const osData: osData = {
        os: DeviceProfile.device_profile.os,
        os_version: DeviceProfile.device_profile.os_version
    }

    const deviceModel: deviceModel = {
        device_model: DeviceProfile.device_profile.device_model
    }

    return (
        <>
            <Card title="OS Data" value={osData} type="os_data" />
            <Card title="Device Model" value={deviceModel} type="device_model" />
            <Card title="Model Details" value={ModelDetails} type="model_details" />
            <Card title="Snapshot Details" value={SnapshotData} type="snapshot_data" />
        </>
    )
}

export function Card({
    title,
    value,
    type,
} : {
    title: string;
    value: osData | deviceModel | ModelDetails | SnapshotData,
    type: "os_data" | "device_model" | "model_details" | "snapshot_data"
}) {

    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                <h3 className="ml-2 text-sm font-medium">{title}</h3>
            </div>
            <div
                className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
            >
                <Value value={value} />
            </div>
        </div>
    )
}


function isOSData(value: any): value is osData {
    return "os" in value && "os_version" in value;
}

function isDeviceModel(value: any): value is deviceModel {
    return "device_model" in value;
}

function isModelDetails(value: any): value is ModelDetails {
    return "model_exists" in value && "model_type" in value && "model_version" in value;
}

function isSnapshotData(value: any): value is SnapshotData {
    return "num_sessions" in value && "num_quarantined_sessions" in value;
}

export function Value({ value } : { value: osData | deviceModel | ModelDetails | SnapshotData}) {
    if(isOSData(value)) {
        return (
            <span>
                {value.os} v{value.os_version}
            </span>
        )
    }

    if(isDeviceModel(value)) {
        return <span>{value.device_model}</span>
    }

    if(isModelDetails(value)) {
        if(!value.model_exists) {
            return <span className="text-gray-400 text-sm">Model has not been trained yet</span>
        }

        return (
            <div className="space-y-1">
                <p>v{value.model_version} ({value.model_type})</p>
                <p className = "text-xs text-gray-500">
                    Trained {formatDistanceToNow(new Date(value.last_trained), { addSuffix: true })}
                </p>
            </div>
        )
    }

    if(isSnapshotData(value)) {
        return (
            <div className="space-y-1 text-sm">
                <p>Sessions: {value.num_sessions}</p>
                <p>Quarantined: {value.num_quarantined_sessions}</p>
            </div>
        )
    }

    return <span className = "text-gray-400">No data</span>
}