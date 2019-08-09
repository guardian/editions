package ophan

import com.gu.ophan.DefaultCoroutineContextFactory
import com.gu.ophan.Logger
import com.gu.ophan.OphanDispatcher
import com.gu.ophan.RecordStore
import ophan.thrift.componentEvent.Action
import ophan.thrift.componentEvent.ComponentEvent
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.componentEvent.ComponentV2
import ophan.thrift.nativeapp.*


expect object Platform {
    fun name(): String
}

fun hello(): String = "Hello from ${Platform.name()}!"

@UseExperimental(io.ktor.util.InternalAPI::class)
class OphanApi(
        private val dispatcher: OphanDispatcher
) {

    constructor(
            appVersion: String,
            appOs: String,
            deviceName: String,
            deviceManufacturer: String,
            deviceId: String,
            userId: String,
            recordStore: RecordStore,
            logger: Logger
    ) : this(OphanDispatcher(
            App(appVersion, "TestEditions", appOs, Edition.UK),
            Device(deviceName, deviceManufacturer),
            deviceId,
            userId,
            DefaultCoroutineContextFactory().getCoroutineContext(),
            recordStore,
            logger
    ))

    fun sendTestAppScreenEvent(screenName: String) {
        val event = Event.Builder()
                .eventId("ffdfdfdfdssfdsf")
                .eventType(EventType.COMPONENT_EVENT)
                .viewId(null) /* TODO */
                .componentEvent(ComponentEvent.Builder()
                        .component(ComponentV2.Builder()
                                .componentType(ComponentType.APP_SCREEN)
                                .id(screenName)
                                .products(emptySet())
                                .campaignCode(null)
                                .labels(emptySet())
                                .build()
                        )
                        .action(Action.VIEW)
                        .value("yes")
                        .build()
                )
                .build()
        dispatcher.dispatchEvent(event)
    }
}

fun getOphanApi(
        appVersion: String,
        appOs: String,
        deviceName: String,
        deviceManufacturer: String,
        deviceId: String,
        userId: String,
        recordStore: RecordStore,
        logger: Logger
) = getThreadSafeOphanApi(appVersion, appOs, deviceName, deviceManufacturer, deviceId, userId, recordStore, logger)

expect fun getThreadSafeOphanApi(
        appVersion: String,
        appOs: String,
        deviceName: String,
        deviceManufacturer: String,
        deviceId: String,
        userId: String,
        recordStore: RecordStore,
        logger: Logger
): OphanApi
