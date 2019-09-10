package ophan

import com.gu.ophan.FileRecordStore
import com.gu.ophan.Logger
import com.gu.ophan.OphanDispatcher
import ophan.thrift.componentEvent.Action
import ophan.thrift.componentEvent.ComponentEvent
import ophan.thrift.componentEvent.ComponentType
import ophan.thrift.componentEvent.ComponentV2
import ophan.thrift.event.Url
import ophan.thrift.nativeapp.*

fun hello(): String = "Hello from MAX AND JAMES!"

class OphanApi(
        private val dispatcher: OphanDispatcher,
        private val logger: Logger
) {

    constructor(
            appFamily: String,
            appVersion: String,
            appOsVersion: String,
            deviceName: String,
            deviceManufacturer: String,
            deviceId: String,
            userId: String?,
            logger: Logger,
            recordStorePath: String
    ) : this(OphanDispatcher(
            App(
                    version = appVersion,
                    family = appFamily,
                    os = appOsVersion,
                    edition = Edition.UK
            ),
            Device(
                    name = deviceName,
                    manufacturer = deviceManufacturer
            ),
            deviceId,
            userId,
            logger,
            FileRecordStore(recordStorePath),
            true
    ), logger)

    fun componentEventBuilder(componentType: String, action: String, eventId: String, value: String?, componentId: String?): Event {
        val event = Event.Builder()
                .eventId(eventId)
                .eventType(EventType.COMPONENT_EVENT)
                .viewId(null) /* TODO */
                .componentEvent(ComponentEvent.Builder()
                        .component(ComponentV2.Builder()
                                .componentType(ComponentType.valueOf(componentType))
                                .id(componentId) 
                                .products(emptySet())
                                .campaignCode(null)
                                .labels(emptySet())
                                .build()
                        )
                        .action(Action.valueOf(action))
                        .value(value)
                        .build()
                )
                .build()
        return event;
    }

    fun sendAppScreenEvent(screenName: String, value: String?, eventId: String) {
        val event = this.componentEventBuilder("APP_SCREEN", "VIEW", eventId, value, screenName)
        dispatcher.dispatchEvent(event)
    }

    fun sendComponentEvent(componentType: String, action: String, eventId: String, value: String?, componentId: String?) {
        val event = this.componentEventBuilder(componentType, action, eventId, value, componentId)
        dispatcher.dispatchEvent(event)
    }

    fun sendPageViewEvent(path: String, eventId: String) {
        val domain = "theguardian.com"
        val host = "www." + domain
        val validPath = "/" + path.removePrefix("/")
        val raw = "https://" + host + validPath


        val event = Event.Builder()
        .eventId(eventId)
        .eventType(EventType.VIEW)
        .viewId(eventId)
        .path(validPath)
        .url(Url.Builder()
                .raw(raw)
                .host(host)
                .path(validPath)
                .domain(domain)
                .build()
        )
        .build()
        logger.debug("OphanKt", event.toString())
        dispatcher.dispatchEvent(event)
    }
}