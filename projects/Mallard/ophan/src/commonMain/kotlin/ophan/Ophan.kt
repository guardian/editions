package ophan

import com.gu.ophan.Logger
import com.gu.ophan.OphanDispatcher
import com.gu.ophan.RecordStore
import ophan.thrift.componentEvent.Action
import ophan.thrift.componentEvent.ComponentEvent
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.componentEvent.ComponentV2
import ophan.thrift.nativeapp.*

fun hello(): String = "Hello from MAX AND JAMES!"

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
            logger: Logger,
            recordStore: RecordStore
    ) : this(OphanDispatcher(
            App(appVersion, "TestEditions", appOs, Edition.UK),
            Device(deviceName, deviceManufacturer),
            deviceId,
            userId,
            logger,
            recordStore
    ))

    fun sendTestAppScreenEvent(screenName: String, eventId: String) {
        val event = Event.Builder()
                .eventId(eventId)
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